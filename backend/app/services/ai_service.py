import json
import os
from typing import Any

import litellm
import wandb
from dotenv import load_dotenv


load_dotenv()


class AIService:
    def __init__(self) -> None:
        os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY")

        # Set up WandB callback
        litellm.success_callback = ["wandb"]

        # Initialize WandB
        wandb.init(
            project="learning-roadmap-ai",
            api_key="d59a2a34b7d82a5bed0a75eea3b43bf89af9b6bc",
            config={"model": "gemini/gemini-1.5-pro", "environment": os.getenv("ENVIRONMENT", "development")},
        )

    async def _generate_completion(self, messages: list[dict[str, str]]) -> str:
        try:
            response = await litellm.acompletion(
                model="gemini/gemini-1.5-pro",
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
            )
            return response.choices[0].message.content
        except Exception as e:
            wandb.log({"error": str(e), "error_type": type(e).__name__, "messages": messages})
            raise

    async def generate_questions(self, context: dict[str, Any]) -> list[dict[str, Any]]:
        system_message = """You are an expert learning path advisor. Generate relevant questions to understand
        the learner's current level and learning preferences. Return the response as a JSON array of question objects."""

        user_message = f"""
        Topic: {context['topic']}
        End Goal: {context['goal']}
        Previous Answers: {json.dumps(context.get('answers', []))}

        Generate questions following this structure:
        [
            {{
                "id": "unique_id",
                "question": "question text",
                "type": "select|text|multiselect",
                "options": ["option1", "option2"] // for select/multiselect only
                "can_skip": boolean
            }}
        ]
        """

        messages = [{"role": "system", "content": system_message}, {"role": "user", "content": user_message}]

        try:
            response_text = await self._generate_completion(messages)
            questions = json.loads(response_text)
        except json.JSONDecodeError as e:
            wandb.log({"error": "JSON parsing error", "raw_response": response_text, "context": context})
            msg = "Failed to parse AI response as JSON"
            raise ValueError(msg) from e
        else:
            wandb.log({"generation_type": "questions", "context": context, "generated_questions": questions})
            return questions

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
