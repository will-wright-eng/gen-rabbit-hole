import asyncio
import os
from typing import List, Dict
from rich.console import Console
from rich.tree import Tree as RichTree
from rich.prompt import Prompt
from dotenv import load_dotenv
from services.llm_service import LLMService
from services.tree_service import TreeService
from models.tree import Tree, Node, NodeType, NodeStatus
from models.context import LearningContext
from uuid import UUID

class LearningTreeCLI:
    def __init__(self):
        load_dotenv()
        self.console = Console()
        self.llm_service = LLMService()
        
        # Initialize the model with API key from environment
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        self.llm_service.initialize_model(api_key)
        
        self.tree_service = TreeService(self.llm_service)
        self.current_node = None
        self.learning_context = LearningContext()
        self.tree = None

    async def start(self):
        self.console.print("🌳 Welcome to Learning Tree! What would you like to learn today?", style="bold green")
        
        # Initial conversation
        while True:
            response = Prompt.ask("> ")
            self.learning_context.add_message("user", response)
            
            if response.lower() == "go":
                # Check if we have enough context
                if len(self.learning_context.chat_history) < 4:
                    self.console.print("\n⚠️  I need a bit more information before we proceed. Let me ask a few more questions.", style="bold yellow")
                    continue
                break
                
            # Generate follow-up question
            next_question = await self.llm_service.generate_next_question(self.learning_context)
            self.learning_context.add_message("assistant", next_question)
            self.console.print(f"\n{next_question}")
        
        # Generate assessment and tree
        await self.generate_learning_path()
        
        # Start interactive learning
        await self.interactive_learning()

    async def generate_learning_path(self):
        self.console.print("\n📊 Generating assessment...", style="bold yellow")
        assessment = await self.llm_service.generate_initial_assessment(self.learning_context)
        
        # Display assessment
        self.console.print("\nAssessment Summary:", style="bold blue")
        for key, value in assessment.items():
            self.console.print(f"- {key.replace('_', ' ').title()}: {value}")
        
        # Generate and display tree
        self.tree = await self.tree_service.create_tree(self.learning_context)
        self.display_tree()

    def display_tree(self, current_node_id=None):
        """Display tree structure using rich.tree"""
        rich_tree = RichTree("🌳 Learning Tree")
        
        def build_tree(node_id: UUID, tree_node):
            node = self.tree.get_node(node_id)
            if not node:
                return
                
            status_emoji = "✅" if node.status == NodeStatus.COMPLETED else "🔵"
            is_current = node_id == current_node_id
            style = "bold green" if is_current else ""
            
            branch = tree_node.add(f"{status_emoji} {node.title}", style=style)
            for child_id in node.children:
                build_tree(child_id, branch)
        
        build_tree(self.tree.root_id, rich_tree)
        self.console.print(rich_tree)

    async def interactive_learning(self):
        """Handle interactive learning session"""
        current_node_id = self.tree.root_id
        
        while True:
            # Clear screen and show current state
            self.console.clear()
            self.display_tree(current_node_id)
            
            # Get current node and expansion status
            try:
                node, is_expanded = await self.tree_service.navigate_to_node(
                    self.tree, 
                    current_node_id, 
                    self.learning_context
                )
            except Exception as e:
                self.console.print(f"⚠️  Error navigating to node: {e}", style="bold red")
                continue
            
            # Display current node content
            self.console.print(f"\n📚 Current Topic: {node.title}", style="bold blue")
            self.console.print(node.content)
            
            # Get children
            children = [self.tree.get_node(child_id) for child_id in node.children]
            
            # Show expansion status if ongoing
            if not is_expanded and not children:
                self.console.print("\n🔄 Preparing next topics...", style="bold yellow")
                # Wait a moment to allow for expansion
                await asyncio.sleep(1)
                # Try to get expanded nodes
                children = [self.tree.get_node(child_id) for child_id in node.children]
            
            # Show navigation options
            self.console.print("\nOptions:", style="bold yellow")
            for i, child in enumerate(children, 1):
                status = "✅" if child.status == NodeStatus.COMPLETED else "🔵"
                self.console.print(f"{i}. {status} {child.title}")
            
            # Show additional options
            choices = [str(i) for i in range(len(children) + 1)]
            if node.parent_id:
                choices.append("b")
                self.console.print("b. Go back")
            self.console.print("0. Exit")
            
            # Get user choice
            choice = Prompt.ask("Choose an option", choices=choices)
            
            # Handle navigation
            if choice == "0":
                break
            elif choice == "b" and node.parent_id:
                current_node_id = node.parent_id
            elif choice.isdigit() and 1 <= int(choice) <= len(children):
                current_node_id = children[int(choice) - 1].id
                self.tree.update_node_status(node.id, NodeStatus.COMPLETED)

async def main():
    cli = LearningTreeCLI()
    await cli.start()

if __name__ == "__main__":
    asyncio.run(main()) 