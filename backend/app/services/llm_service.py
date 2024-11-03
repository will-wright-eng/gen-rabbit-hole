from typing import Dict, List, Any
import json
import time
import logging
import asyncio
import google.generativeai as genai
from utils.prompts import PromptTemplates
from models.tree import Node
from datetime import datetime
from models.context import LearningContext

class LLMService:
    def __init__(self):
        self.prompts = PromptTemplates()
        self.logger = logging.getLogger(__name__)
        self.last_call_time = 0
        self.total_calls = 0
        self.min_delay = 1.0  # Minimum seconds between calls
        self.model = None
        
    def initialize_model(self, api_key: str):
        """Initialize the model with API key"""
        genai.configure(api_key=api_key)
        
        # Configure the model
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]
        
        self.model = genai.GenerativeModel(
            model_name="gemini-pro",
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        self.logger.info("Model initialized successfully")

    async def _get_completion(self, prompt: str) -> str:
        """Helper method to get completion with strict rate limiting"""
        # Strict rate limiting - always wait for minimum delay
        current_time = time.time()
        time_since_last = current_time - self.last_call_time
        if time_since_last < self.min_delay:
            wait_time = self.min_delay - time_since_last
            self.logger.info(f"Rate limiting: waiting {wait_time:.2f}s")
            await asyncio.sleep(wait_time)
        
        try:
            self.total_calls += 1
            self.last_call_time = time.time()
            
            self.logger.info(f"Making API call #{self.total_calls}")
            response = self.model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            self.logger.error(f"Error getting completion from Vertex AI: {e}")
            raise

    async def _parse_json_response(self, response: str) -> Dict:
        """Helper method to parse JSON response with better cleaning"""
        try:
            # If response indicates insufficient context, raise specific error
            if "not have enough context" in response.lower():
                raise ValueError("Insufficient context to generate response")
                
            # Clean the response string
            cleaned_response = response.strip()
            
            # Extract JSON content if wrapped in markdown
            if "```json" in cleaned_response:
                start = cleaned_response.find("```json") + 7
                end = cleaned_response.rfind("```")
                if end == -1:
                    cleaned_response = cleaned_response[start:]
                else:
                    cleaned_response = cleaned_response[start:end]
            
            # Remove duplicate lines that might appear in content fields
            lines = cleaned_response.split("\n")
            processed_lines = []
            skip_next = False
            
            for i, line in enumerate(lines):
                if skip_next:
                    skip_next = False
                    continue
                    
                line = line.strip()
                if not line:
                    continue
                    
                # Check if next line is a duplicate content
                if i < len(lines) - 1 and '"content":' in line:
                    next_line = lines[i + 1].strip()
                    if next_line.startswith('"content":'):
                        skip_next = True
                        # Take the longer content line
                        if len(next_line) > len(line):
                            line = next_line
                
                processed_lines.append(line)
            
            cleaned_response = "\n".join(processed_lines)
            
            try:
                return json.loads(cleaned_response)
            except json.JSONDecodeError as e:
                print("First parsing attempt failed, trying to fix common issues...")
                
                # Fix common JSON formatting issues
                cleaned_response = cleaned_response.replace('",\n"', '",')  # Fix line breaks between fields
                cleaned_response = cleaned_response.replace('}\n{', '},{')  # Fix line breaks between objects
                
                # Ensure arrays are properly formatted
                if cleaned_response.strip().startswith('[') and not cleaned_response.strip().endswith(']'):
                    cleaned_response = cleaned_response.strip() + ']'
                
                return json.loads(cleaned_response)
                
        except ValueError as e:
            # Re-raise ValueError for specific handling
            raise
        except Exception as e:
            self.logger.error(f"Error parsing JSON response: {e}")
            self.logger.debug(f"Raw response: {response}")
            raise
    
    async def generate_initial_assessment(self, context: LearningContext) -> Dict:
        """Generate initial assessment based on conversation"""
        formatted_history = "\n".join([
            f"{msg['role']}: {msg['content']}" 
            for msg in context.chat_history
        ])
        
        prompt = self.prompts.initial_assessment()
        prompt += f"\nFull Conversation History:\n{formatted_history}"
        
        response = await self._get_completion(prompt)
        return await self._parse_json_response(response)

    async def generate_initial_tree(self, context: LearningContext) -> List[Dict]:
        """Generate initial learning tree based on conversation"""
        try:
            formatted_history = "\n".join([
                f"{msg['role']}: {msg['content']}" 
                for msg in context.chat_history
            ])
            
            prompt = self.prompts.generate_curriculum()
            prompt += f"\nFull Conversation History:\n{formatted_history}"
            
            response = await self._get_completion(prompt)
            return await self._parse_json_response(response)
        except ValueError as e:
            # Return a basic tree structure when context is insufficient
            return [{
                "title": "Getting Started",
                "content": "Let's begin with the basics of your chosen topic.",
                "type": "lesson"
            }]

    async def expand_node(self, node: Node, context: LearningContext) -> List[Dict]:
        """Generate child nodes with full learning context"""
        try:
            # Include full context in node expansion
            context_dict = context.to_dict()
            context_dict.update({
                "current_node_title": node.title,
                "current_node_content": node.content,
                "current_node_type": node.type,
                "node_depth": node.depth
            })
            
            prompt = self.prompts.expand_node(
                node_title=node.title,
                node_content=node.content,
                context=context_dict
            )
            
            response = await self._get_completion(prompt)
            return await self._parse_json_response(response)
            
        except Exception as e:
            self.logger.error(f"Error expanding node: {e}")
            raise

    async def generate_next_question(self, context: LearningContext) -> str:
        """Generate a follow-up question based on chat history"""
        formatted_history = "\n".join([
            f"{msg['role']}: {msg['content']}" 
            for msg in context.chat_history
        ])
        
        prompt = self.prompts.generate_next_question().format(formatted_history)
        response = await self._get_completion(prompt)
        return response
