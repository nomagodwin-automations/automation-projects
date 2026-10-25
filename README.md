# Automation Projects Repository

This repository contains a set of n8n automation workflows and one finance web app. Each workflow is designed for a specific business process, and the files in this repo are intended to be imported into n8n or used as reference for related automations.

## Project index

- [Banking Services Workflow](./Banking_Services_Workflow_README.md) — customer service intake for banking needs.
- [Client Lead Workflow](./Client_Lead_Workflow_README.md) — receives client inquiries and logs them to Sheets.
- [FahrenTemp Weather AI Agent](./FahrenTemp_Weather_AI_Agent_README.md) — Telegram weather assistant with AI and scheduled updates.
- [Lead Capture Workflow](./Lead_Capture_Workflow_README.md) — captures incoming leads from Tally and records valid submissions.
- [Mama Tee AI Concierge](./Mama_Tee_AI_Concierge_README.md) — AI-powered restaurant call concierge for orders, reservations, and enquiries.
- [Real-Time Web Search Agent](./Real-Time%20Web%20Search%20Agent%20(2)_README.md) — Telegram assistant that answers questions using live web search tools.
- [Transaction Intelligence System - TIP](./Transaction%20Intelligence%20System-%20TIP/README.md) — PDF-based personal finance intelligence app with AI-powered insights.

## Typical setup

Most of the workflow files in this repo rely on the following integrations:

- n8n workflow import
- Gmail or other email services
- Google Sheets
- Telegram or webhooks
- OpenAI/Gemini/OpenRouter/Tavily/SerpAPI APIs
- Supabase for the TIP project

## Notes

- These workflows contain live credentials and webhook IDs in their JSON metadata; they are best used as reference templates or imported into a matching n8n instance with the appropriate account access restored.
- The folder named `Transaction Intelligence System- TIP` is the only project that includes front-end code and needs a browser or static host to run.

