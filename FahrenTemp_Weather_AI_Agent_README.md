# FahrenTemp Weather AI Agent

This project is a Telegram-based weather assistant that provides weather information and daily updates using AI and weather APIs.

## What it does

- Watches for incoming Telegram messages.
- Captures the user chat ID and question.
- Sends the request to an AI agent that can answer conversationally.
- Uses a WeatherAPI request to fetch current and forecast weather.
- Stores short-term memory so the chatbot can maintain context.
- Replies in Telegram with friendly, human-style weather updates.
- Runs on a schedule to send regular weather updates.

## Flow overview

1. Telegram Trigger receives the user's message.
2. Edit Fields adds session information.
3. AI Agent uses a language model and tools to answer the question.
4. HTTP Request calls the weather service for location and forecast data.
5. The output is returned to the user in Telegram.
6. A separate scheduled workflow can send a daily weather update automatically.

## Main integrations

- Telegram
- OpenAI
- OpenRouter
- Google Gemini
- WeatherAPI
- Memory buffer for conversational context

## Setup requirements

- Telegram bot credentials.
- OpenAI / Gemini / OpenRouter API keys.
- WeatherAPI key.
- A location configured for the weather report (currently set to Benin City, Nigeria).

## Typical use case

This is a personal assistant or utility bot for weather updates, local forecasts, and conversational climate information via Telegram.

