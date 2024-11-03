# app/services/tree_service.py
import uuid
from typing import Any


class TreeService:
    def __init__(self, ai_service: "AIService") -> None:
        self.ai = ai_service
        self._trees: dict[str, dict[str, Any]] = {}
        self._expanding_nodes = set()

    async def get_tree(self, user_id: str) -> dict[str, Any]:
        """Get or create a learning tree for the user."""
        if user_id not in self._trees:
            # Initialize new tree
            root_node = {
                "id": "root",
                "title": "Learning Path",
                "content": "Your personalized learning journey",
                "children": [],
                "type": "root",
                "status": "in_progress",
                "prerequisites": [],
                "depth": 0,
            }

            self._trees[user_id] = {"root": root_node, "nodes": {}}

            # Generate initial nodes
            await self.expand_node(user_id, "root")

        return self._trees[user_id]


    async def expand_node(self, user_id: str, node_id: str) -> list[str]:
        """Dynamically expand a node with new children."""
        if node_id in self._expanding_nodes:
            return []

        # Get or create the tree
        if user_id not in self._trees:
            await self.get_tree(user_id)  # This will initialize the tree

        tree = self._trees[user_id]
        self._expanding_nodes.add(node_id)

        try:
            # Get the node to expand (either from nodes or root)
            node = tree["nodes"].get(node_id) or tree["root"]
            if not node:
                msg = f"Node {node_id} not found"
                raise ValueError(msg)

            # Generate child nodes
            child_nodes = [
                {
                    "id": str(uuid.uuid4()),
                    "title": f"Topic {i+1}",
                    "content": f"Content for topic {i+1}",
                    "type": "lesson",
                    "children": [],
                    "status": "pending",
                    "prerequisites": [],
                    "depth": node["depth"] + 1,
                }
                for i in range(3)  # Generate 3 sample nodes
            ]

            # Add nodes to tree
            new_node_ids = []
            for child in child_nodes:
                node_id = child["id"]
                tree["nodes"][node_id] = child
                new_node_ids.append(node_id)

            # Update parent's children
            node["children"].extend(new_node_ids)
            return new_node_ids

        finally:
            self._expanding_nodes.remove(node_id)

    async def get_node_content(self, user_id: str, node_id: str) -> dict[str, Any]:
        """Get detailed content for a specific node."""
        tree = self._trees.get(user_id)
        if not tree:
            msg = "Tree not found"
            raise ValueError(msg)

        node = tree["nodes"].get(node_id)
        if not node:
            if node_id == "root":
                return tree["root"]
            msg = "Node not found"
            raise ValueError(msg)

        return node

    async def update_node_status(self, user_id: str, node_id: str, status: str) -> dict[str, Any]:
        """Update the status of a node."""
        valid_statuses = {"pending", "in_progress", "completed"}
        if status not in valid_statuses:
            msg = f"Invalid status. Must be one of: {valid_statuses}"
            raise ValueError(msg)

        tree = self._trees.get(user_id)
        if not tree:
            msg = "Tree not found"
            raise ValueError(msg)

        node = tree["nodes"].get(node_id)
        if not node:
            if node_id == "root":
                node = tree["root"]
            else:
                msg = "Node not found"
                raise ValueError(msg)

        node["status"] = status
        return node
