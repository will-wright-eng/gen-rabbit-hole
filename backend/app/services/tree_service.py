from typing import Dict, List, Optional, Tuple
from uuid import UUID
import asyncio
from models.tree import Tree, Node, NodeType, NodeStatus
from models.context import LearningContext
from services.llm_service import LLMService

class TreeService:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service
        self._expansion_tasks = {}

    async def create_tree(self, context: LearningContext) -> Tree:
        # Generate initial tree structure from conversation
        initial_nodes = await self.llm_service.generate_initial_tree(context)
        
        # Create tree with root node
        tree = Tree(root_id=UUID(int=0))
        root_node = Node(
            id=tree.root_id,
            title="Learning Path",
            content="Personalized learning path",
            type=NodeType.LESSON
        )
        tree.add_node(root_node)
        
        # Create initial nodes and automatically expand the first level
        for node_data in initial_nodes[:3]:
            node = Node(
                title=node_data["title"],
                content=node_data["content"],
                type=NodeType(node_data["type"])
            )
            tree.add_node(node, tree.root_id)
            
            # Start async expansion of this node
            await self.prepare_next_nodes(tree, node.id, context)
        
        return tree

    async def prepare_next_nodes(self, tree: Tree, node_id: UUID, context: LearningContext):
        """Start async expansion of a node without waiting for result"""
        if node_id not in self._expansion_tasks:
            task = asyncio.create_task(self._expand_node(tree, node_id, context))
            self._expansion_tasks[node_id] = task

    async def get_expanded_nodes(self, tree: Tree, node_id: UUID) -> List[Node]:
        """Get expanded nodes if ready, otherwise return empty list"""
        if node_id in self._expansion_tasks:
            try:
                task = self._expansion_tasks[node_id]
                if task.done():
                    expanded_nodes = await task
                    del self._expansion_tasks[node_id]
                    return expanded_nodes
            except Exception as e:
                print(f"Error in get_expanded_nodes: {str(e)}")
                del self._expansion_tasks[node_id]
        return []

    async def _expand_node(self, tree: Tree, node_id: UUID, context: LearningContext) -> List[Node]:
        """Internal method to handle node expansion"""
        try:
            node = tree.get_node(node_id)
            if not node:
                raise ValueError("Node not found")
                
            expansions = await self.llm_service.expand_node(node, context)
            new_nodes = []
            
            # Limit to 3 nodes and add them to tree
            for expansion in expansions[:3]:
                new_node = Node(
                    title=expansion["title"],
                    content=expansion["content"],
                    type=NodeType(expansion["type"])
                )
                tree.add_node(new_node, node_id)
                new_nodes.append(new_node)
                
            return new_nodes
        except Exception as e:
            print(f"Error in _expand_node: {str(e)}")
            return []

    async def navigate_to_node(self, tree: Tree, node_id: UUID, context: LearningContext) -> Tuple[Node, bool]:
        """Navigate to a node and return it along with expansion status"""
        node = tree.get_node(node_id)
        if not node:
            raise ValueError("Node not found")

        # Check if we have any expanded nodes
        expanded_nodes = await self.get_expanded_nodes(tree, node_id)
        
        # If no children and no expanded nodes, start expansion
        if not node.children and not expanded_nodes:
            await self.prepare_next_nodes(tree, node_id, context)
            return node, False
        
        # If we have expanded nodes, they're already added to the tree
        return node, bool(node.children or expanded_nodes)

    def update_progress(self, tree: Tree, node_id: UUID, status: NodeStatus) -> bool:
        """Update node status and return success"""
        return tree.update_node_status(node_id, status)
