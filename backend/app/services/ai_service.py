import json
import logging
import os
from typing import Any

import litellm
from dotenv import load_dotenv

import wandb


logging.basicConfig(level=logging.INFO)

load_dotenv()


class AIService:
    def __init__(self) -> None:
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if gemini_api_key:
            os.environ["GEMINI_API_KEY"] = gemini_api_key
        else:
            logging.warning("GEMINI_API_KEY is not set")
            msg = "GEMINI_API_KEY is not set"
            raise ValueError(msg)

        # Set up WandB callback
        litellm.success_callback = ["wandb"]

        # Initialize WandB
        wandb.login(key="d59a2a34b7d82a5bed0a75eea3b43bf89af9b6bc")  # First login with the API key
        wandb.init(
            project="learning-roadmap-ai",
            config={
                "model": "gemini/gemini-1.5-pro",
                "environment": os.getenv("ENVIRONMENT", "development"),
            },
        )

    async def _generate_completion(self, messages: list[dict[str, str]]) -> str:
        """Generate completion using the AI model."""
        response = await litellm.acompletion(
            model="gemini/gemini-1.5-pro",
            messages=messages,
            temperature=0.7,
            max_tokens=1000,
        )
        return response.choices[0].message.content

    async def generate_questions(self, context: dict[str, Any]) -> list[dict[str, Any]]:
        system_message = """You are an expert learning path advisor. Your task is to generate questions in valid JSON format.
        Each question should help understand the learner's current level and learning preferences.

        You MUST return ONLY a JSON array of question objects with no additional text or explanation.
        Example format:
        [
            {
                "id": "experience_level",
                "question": "What is your current experience level with Python?",
                "type": "select",
                "options": [
                    {"value": "beginner", "label": "Beginner"},
                    {"value": "intermediate", "label": "Intermediate"},
                    {"value": "advanced", "label": "Advanced"}
                ],
                "can_skip": false
            }
        ]"""

        user_message = f"""
        Topic: {context['topic']}
        End Goal: {context['goal']}
        Previous Answers: {json.dumps(context.get('answers', []))}

        Generate relevant questions following the exact JSON structure shown in the system message.
        """

        messages = [{"role": "system", "content": system_message}, {"role": "user", "content": user_message}]

        try:
            response_text = await self._generate_completion(messages)
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Return a default question set for error cases
            return [
                {
                    "id": "experience_level",
                    "question": "What is your current experience level with Python?",
                    "type": "select",
                    "options": [
                        {"value": "beginner", "label": "Beginner"},
                        {"value": "intermediate", "label": "Intermediate"},
                        {"value": "advanced", "label": "Advanced"},
                    ],
                    "can_skip": False,
                },
            ]

    async def generate_roadmap(self, state: dict[str, Any]) -> dict[str, Any]:
        system_message = """You are an expert learning path advisor. Create a detailed, structured learning
        roadmap based on the learner's goals and responses."""

        user_message = f"""
        Create a detailed learning roadmap for:
        Topic: {state['learning_topic']}
        End Goal: {state['end_goal']}
        Learner Responses: {json.dumps(state['answers'])}

        Generate a structured roadmap following this format:
        {{
            "milestones": [
                {{
                    "title": "milestone name",
                    "description": "detailed description",
                    "tasks": [
                        {{
                            "name": "task name",
                            "description": "task description",
                            "resources": ["resource1", "resource2"],
                            "estimated_hours": number
                        }}
                    ],
                    "expected_duration_weeks": number
                }}
            ],
            "prerequisites": ["prerequisite1", "prerequisite2"],
            "success_metrics": ["metric1", "metric2"]
        }}
        """

        messages = [{"role": "system", "content": system_message}, {"role": "user", "content": user_message}]

        try:
            response_text = await self._generate_completion(messages)
            roadmap = json.loads(response_text)
        except json.JSONDecodeError as e:
            wandb.log({"error": "JSON parsing error", "raw_response": response_text, "state": state})
            msg = "Failed to parse AI response as JSON"
            raise ValueError(msg) from e
        else:
            if isinstance(roadmap, dict):
                wandb.log({"generation_type": "roadmap", "state": state, "generated_roadmap": roadmap})
                return roadmap
            wandb.log({"error": "Invalid roadmap format", "raw_response": response_text, "state": state})
            msg = "Generated roadmap is not a dictionary"
            raise ValueError(msg)
