import logging
import os

import litellm
from dotenv import load_dotenv

import wandb


logging.basicConfig(level=logging.INFO)
load_dotenv()


class AIService:
    def __init__(self, silent_mode: bool = False) -> None:
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            msg = "GEMINI_API_KEY is not set"
            logging.error(msg)
            raise ValueError(msg)

        if silent_mode:
            logging.getLogger().setLevel(logging.ERROR)
            os.environ["WANDB_SILENT"] = "true"
            os.environ["WANDB_CONSOLE"] = "off"
            litellm.set_verbose = False

        litellm.success_callback = ["wandb"]
        wandb_key = os.getenv("WANDB_KEY")
        if not wandb_key:
            msg = "WANDB_KEY is not set"
            logging.error(msg)
            raise ValueError(msg)
        wandb.login(key=wandb_key)
        wandb.init(project="learning-roadmap-ai")

    async def generate(self, prompt: str) -> str:
        """Generate text using the AI model."""
        try:
            response = await litellm.acompletion(
                model="gemini/gemini-1.5-pro",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful AI assistant that creates detailed learning roadmaps.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=1000,
            )
            return response.choices[0].message.content
        except Exception as e:
            logging.exception(f"AI Generation error: {e}")
            raise

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if wandb.run is not None:
            wandb.finish()
