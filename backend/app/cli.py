import asyncio
import os
import json

import httpx
from rich.console import Console
from rich.prompt import Prompt
from rich.tree import Tree as RichTree


class LearningCLI:
    def __init__(self) -> None:
        self.console = Console()
        self.client = httpx.AsyncClient(base_url="http://localhost:8000")
        self.context = {}

    async def chat(self):
        self.console.print("🌳 Welcome to Learning Tree! What would you like to learn today?", style="bold green")
        topic = Prompt.ask(">")
        goal = Prompt.ask("What's your end goal?")

        # Get questions from API
        try:
            response = await self.client.post("/api/onboarding/start",
                json={"learning_topic": topic, "end_goal": goal})
            response.raise_for_status()
            questions = response.json()
        except Exception as e:
            self.console.print(f"Error getting questions: {e}", style="bold red")
            return None

        answers = []
        for q in questions:
            try:
                if q["type"] == "select" and q.get("options"):
                    self.console.print(f"\n{q['question']}", style="bold blue")
                    for i, opt in enumerate(q["options"], 1):
                        self.console.print(f"{i}. {opt['label']}")
                    choice = Prompt.ask("Choose an option", choices=[str(i) for i in range(1, len(q["options"]) + 1)])
                    selected_option = q["options"][int(choice) - 1]
                    answers.append({
                        "question_id": q["id"],
                        "question": q["question"],  # Make sure we include the question
                        "answer": selected_option["value"]  # Use the value, not the label
                    })
                else:
                    answer = Prompt.ask(f"\n{q['question']}")
                    answers.append({
                        "question_id": q["id"],
                        "question": q["question"],
                        "answer": answer
                    })
            except Exception as e:
                self.console.print(f"Error processing question: {e}", style="bold red")
                continue

        # Generate roadmap using API
        try:
            request_data = {
                "learning_topic": topic,
                "end_goal": goal,
                "answers": answers
            }
            # Debug print to see what we're sending
            self.console.print("\nSending request:", style="dim")
            self.console.print(request_data, style="dim")

            response = await self.client.post(
                "/api/onboarding/generate-roadmap",
                json=request_data
            )
            response.raise_for_status()
            self.context["roadmap"] = response.json()
            return self.context["roadmap"]
        except Exception as e:
            self.console.print(f"Error generating roadmap: {e}", style="bold red")
            if hasattr(e, 'response') and e.response:
                self.console.print(f"Response content: {e.response.text}", style="bold red")
            return None

    def display_roadmap(self, roadmap):
        tree = RichTree("🗺 Your Learning Roadmap")
        for step in roadmap.split("\n"):
            tree.add(step)
        self.console.print(tree)


async def ensure_server(retries=5, delay=2):
    client = httpx.AsyncClient(base_url="http://localhost:8000")
    for attempt in range(retries):
        try:
            response = await client.get("/api/onboarding/start")
            if response.status_code == 200:
                await client.aclose()
                return
        except httpx.HTTPError:
            pass
        await asyncio.sleep(delay)
    client.aclose()
    raise ConnectionError("API server is not running.")


async def main():
    try:
        await ensure_server()
    except ConnectionError as e:
        console = Console()
        console.print(f"❌ {e}", style="bold red")
        return

    cli = LearningCLI()
    try:
        while True:
            roadmap = await cli.chat()
            if roadmap:
                cli.console.clear()
                cli.console.print("\n🎯 Your Personalized Learning Path\n", style="bold green")
                cli.display_roadmap(roadmap)
            else:
                cli.console.print("\n❌ Failed to generate roadmap. Please try again.", style="bold red")

            cli.console.print("\nOptions:", style="bold yellow")
            cli.console.print("1. Generate new roadmap")
            cli.console.print("2. Exit")

            choice = Prompt.ask("Choose an option", choices=["1", "2"])
            if choice == "2":
                break
    except Exception as e:
        cli.console.print(f"\n❌ Unexpected error: {e}", style="bold red")
    finally:
        cli.console.print("\n👋 Goodbye!", style="bold blue")


if __name__ == "__main__":
    asyncio.run(main())
