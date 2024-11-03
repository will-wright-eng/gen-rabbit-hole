# Learning Tree API Documentation

## API Endpoints Reference

### Session Management
```typescript
POST /api/sessions
// Create a new learning session
Request:
{
    user_id: string;
    chat_history: Array<{
        role: "user" | "assistant";
        content: string;
    }>;
}
Response:
{
    session_id: string;
    tree: Tree;
    assessment: {
        primary_goal: string;
        knowledge_level: string;
        learning_style: string;
        session_length: string;
        engagement_style: string;
    };
}

GET /api/sessions/{session_id}
// Get session details
Response:
{
    id: string;
    user_id: string;
    tree_id: string;
    progress: {
        completed_nodes: string[];
        current_node_id: string | null;
        last_interaction: string;
    };
}
```

### Tree Operations
```typescript
POST /api/trees/{tree_id}/nodes/{node_id}/expand
// Expand a node to get its children
Response:
{
    nodes: Array<{
        id: string;
        title: string;
        content: string;
        type: "chat" | "lesson" | "task" | "quiz";
        status: "pending" | "in_progress" | "completed";
    }>;
}

PUT /api/trees/{tree_id}/nodes/{node_id}
// Update node status
Request:
{
    status: "pending" | "in_progress" | "completed";
}
```

### Chat Operations
```typescript
POST /api/chat/questions
// Generate next question
Request:
{
    messages: Array<{
        role: "user" | "assistant";
        content: string;
    }>;
}
Response:
{
    question: string;
}
```

## Data Models

#### Tree
```typescript
interface Tree {
    root_id: string;
    nodes: {
        [key: string]: Node;
    };
}

interface Node {
    id: string;
    title: string;
    content: string;
    type: "chat" | "lesson" | "task" | "quiz";
    status: "pending" | "in_progress" | "completed";
    children: string[];
    parent_id?: string;
    depth: number;
}
```

#### Session
```typescript
interface Session {
    id: string;
    user_id: string;
    tree_id: string;
    progress: {
        completed_nodes: string[];
        current_node_id: string | null;
        last_interaction: string;
    };
    created_at: string;
    updated_at: string;
}
```

## Error Handling

All endpoints may return the following error responses:

```typescript
interface ErrorResponse {
    detail: string;
    code: string;
}

// Common HTTP Status Codes
422 - Validation Error
404 - Resource Not Found
500 - Internal Server Error
```

## Development Setup

### Running the Server
```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn app.main:app --reload
```

### API Documentation
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc
```

2. **OpenAPI Specification**
The frontend developer can access the full OpenAPI spec at `/api/openapi.json` which provides detailed schema information.

3. **Example Responses**
It might be helpful to provide a file with example responses:

```json:backend/app/docs/example_responses.json
{
    "create_session": {
        "session_id": "123e4567-e89b-12d3-a456-426614174000",
        "tree": {
            "root_id": "000e4567-e89b-12d3-a456-426614174000",
            "nodes": {
                "000e4567-e89b-12d3-a456-426614174000": {
                    "id": "000e4567-e89b-12d3-a456-426614174000",
                    "title": "Learning Path",
                    "content": "Personalized learning path",
                    "type": "lesson",
                    "status": "pending",
                    "children": ["111e4567-e89b-12d3-a456-426614174000"]
                }
            }
        },
        "assessment": {
            "primary_goal": "Learn Python Programming",
            "knowledge_level": "Beginner",
            "learning_style": "Interactive",
            "session_length": "30 minutes",
            "engagement_style": "Hands-on coding"
        }
    }
}
```

4. **Postman Collection**
You might want to provide a Postman collection for testing:

```json:backend/app/docs/learning_tree_api.postman_collection.json
{
    "info": {
        "name": "Learning Tree API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Create Session",
            "request": {
                "method": "POST",
                "url": "{{base_url}}/api/sessions",
                "body": {
                    "mode": "raw",
                    "raw": "{\"user_id\": \"test\", \"chat_history\": []}"
                }
            }
        }
        // ... other endpoints
    ]
}
```

This documentation provides the frontend developer with:
1. Clear API specifications
2. Type definitions
3. Example requests/responses
4. Error handling information
5. Development setup instructions

