# PsycScope — psychological disorder screening (32 disorders). Part of 6x7.gr.

Live: https://psyc.6x7.gr

## What it does

Screens 32 well-known psychological disorders using self-report questions inspired by PHQ-9, GAD-7, MDQ, ASRS, and similar instruments. Optional AI refinement via OpenRouter/OpenAI/Groq. Page Assistant for voice guidance.

**This is screening only — not diagnosis.**

## Run locally

```bash
npm install
cp .env.local.example .env.local  # fill from 6x7 Supabase + LLM keys
npm run dev
```

Open http://localhost:3000

## Deploy

Vercel project linked to `philipposk/psycscope`, domain `psyc.6x7.gr`, Supabase integration for shared 6x7 auth.

## Stack

Next.js 16 · Tailwind 4 · Supabase (optional auth) · page-assistant · Upstash rate limits
