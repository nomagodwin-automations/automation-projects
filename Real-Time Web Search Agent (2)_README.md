# Real-Time Web Search Agent

This project is an AI-powered Telegram assistant that can answer questions with live web search support.

## What it does

- Receives a Telegram message from a user.
- Stores session information and memory so the discussion can continue naturally.
- Sends the question to a language model agent.
- Uses live search tools (Tavily or SerpAPI) to fetch current information.
- Returns the answer directly to the user in Telegram.
- Can support conversational follow-up questions using memory.

## Flow overview

1. Telegram Trigger receives a user message.
2. Edit Fields adds session metadata.
3. AI Agent decides how to answer and when to use search tools.
4. Search in Tavily and SerpAPI provide live web results.
5. The final answer is sent back to the user via Telegram.
6. Memory keeps recent context for multi-turn conversations.

## Main integrations

- Telegram
- OpenAI
- OpenRouter
- Tavily
- SerpAPI
- LangChain memory

## Setup requirements

- A Telegram bot configured for message handling.
- OpenAI or OpenRouter model access.
- Tavily or SerpAPI credentials for live search.
- An AI prompt system that instructs the assistant on reliable, current-answer behavior.

## Typical use case

This is useful for a productivity or news assistant that needs to answer real-world questions with fresh, source-backed information rather than static knowledge alone.

