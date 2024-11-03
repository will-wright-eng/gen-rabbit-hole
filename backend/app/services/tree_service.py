from typing import TYPE_CHECKING


if TYPE_CHECKING:
    from app.services.ai_service import AIService


class TreeService:
    def __init__(self, ai_service: "AIService") -> None:
        self.ai = ai_service
        self._expanding_nodes = set()

    async def create_tree(self, topic: str, context: dict) -> dict:
        """Generate initial tree structure."""
        initial_prompt = """Create an adaptive learning tree for the topic. Return JSON:
        {
            "root": {
                "id": "root",
                "title": "Learning Path",
                "content": "Overview of the learning journey",
                "children": []
            },
            "nodes": {
                "node_id": {
                    "id": "unique_id",
                    "title": "Concept Title",
                    "content": "Detailed explanation",
                    "type": "lesson|task|quiz",
                    "children": [],
                    "status": "pending|in_progress|completed",
                    "prerequisites": [],
                    "depth": 0
                }
            }
        }"""

        tree = await self.ai.generate(initial_prompt, {"topic": topic, "context": context})

        # Start expanding first level nodes
        root_node = tree["nodes"].get(tree["root"]["id"])
        if root_node and root_node["children"]:
            for child_id in root_node["children"][:2]:  # Limit initial expansion
                await self.expand_node(tree, child_id, context)

        return tree

    async def expand_node(self, tree: dict, node_id: str, context: dict) -> list[str]:
        """Dynamically expand a node with new children."""
        if node_id in self._expanding_nodes:
            return []

        self._expanding_nodes.add(node_id)
        node = tree["nodes"].get(node_id)

        if not node:
            self._expanding_nodes.remove(node_id)
            return []

        expansion_prompt = f"""Generate 2-3 follow-up learning nodes for: {node['title']}
        Return JSON array:
        [
            {{
                "id": "unique_id",
                "title": "Specific concept or skill",
                "content": "Clear explanation and learning objectives",
                "type": "lesson|task|quiz",
                "prerequisites": [],
                "depth": {node['depth'] + 1}
            }}
        ]"""

        try:
            new_nodes = await self.ai.generate(expansion_prompt, {"parent_node": node, "context": context})

            # Add new nodes to tree
            child_ids = []
            for new_node in new_nodes:
                node_id = new_node["id"]
                tree["nodes"][node_id] = new_node
                child_ids.append(node_id)

            node["children"] = child_ids
            return child_ids

        finally:
            self._expanding_nodes.remove(node_id)

    async def get_node_content(self, tree: dict, node_id: str, context: dict) -> dict:
        """Get detailed content for a node."""
        node = tree["nodes"].get(node_id)
        if not node:
            return {}

        if not node.get("detailed_content"):
            content_prompt = f"""Generate detailed learning content for: {node['title']}
            Return JSON:
            {{
                "objectives": ["list of learning objectives"],
                "content": "Detailed explanation",
                "examples": ["relevant examples"],
                "practice": ["practice exercises"],
                "next_steps": ["suggested next topics"]
            }}"""

            detailed_content = await self.ai.generate(content_prompt, {"node": node, "context": context})

            node["detailed_content"] = detailed_content

        return node
