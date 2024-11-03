# generative rabbit hole

## backend

this system requires that you generate a `GEMINI_API_KEY`

- [Get API key | Google AI Studio](https://aistudio.google.com/app/apikey)
- [Gemini - Google AI Studio | liteLLM](https://docs.litellm.ai/docs/providers/gemini)

```bash
# from repo root
uv venv --python 3.12
source .venv/bin/activate
PYTHONPATH=$PYTHONPATH:backend uvicorn app.main:app --reload
```

open `http://127.0.0.1:8000/docs` to test endpoints with swagger docs

## frontend

```bash
cd frontend
npm install
npm run dev
```

open `locahost:3000` to view frontend ui

## references

- [aotakeda/learn-thing: Create mind maps to learn new things using AI.](https://github.com/aotakeda/learn-thing)
