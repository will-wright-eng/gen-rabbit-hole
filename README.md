# Learning Tree

An AI-powered interactive learning platform that creates personalized, explorable knowledge trees.

## Overview

Learning Tree transforms traditional linear learning into an interactive, tree-structured experience. It uses AI to:
- Generate personalized learning paths
- Adapt content based on user interactions
- Enable flexible topic exploration
- Track learning progress

## How It Works

1. **Initial Conversation**
   ```
   🌳 What would you like to learn?
   > I want to learn Python web development
   
   What's your current experience?
   > I know basic Python syntax
   
   What's your learning goal?
   > Build a web application
   ```

2. **Assessment & Tree Generation**
   ```
   📊 Assessment:
   - Level: Beginner Python
   - Goal: Web Development
   - Style: Practical, Project-based
   
   🌳 Learning Path:
   ├── Web Development Basics
   │   ├── HTTP Fundamentals
   │   ├── HTML/CSS Essentials
   │   └── Client-Server Model
   └── Python Web Frameworks
       ├── Flask Introduction
       ├── Routes & Views
       └── Database Integration
   ```

3. **Interactive Learning**
   - Navigate through topics
   - Mark completed sections
   - Expand interesting areas
   - Track progress

## Project Structure

```
learning-tree/
├── backend/                # FastAPI Backend
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── models/        # Data models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helpers
│   ├── api_docs.md        # API Documentation
│   └── requirements.txt   # Python dependencies
│
└── frontend/              # React Frontend (coming soon)
    ├── src/
    │   ├── components/    # UI components
    │   ├── pages/         # App views
    │   └── services/      # API integration
    └── package.json
```

## Getting Started

### Backend Setup

1. Create virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. Run the server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

### Try the CLI Demo

Run the interactive command-line demo:
```bash
python cli_demo.py
```

## Development

### Backend API
- Documentation: [api_docs.md](backend/api_docs.md)
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

### Environment Variables
```bash
GOOGLE_API_KEY=your_api_key    # Required for LLM
API_HOST=localhost             # API host
API_PORT=8000                 # API port
DEBUG=true                    # Enable debug mode
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE)