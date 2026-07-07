# AI-Powered Meeting Minutes (MoM) Generator
**[Fathom] PEC MoM Generator**

> Every client meeting is automatically transcribed, summarized, and distributed — no one has to take notes.

**Status:** Active | **Systems:** AI/LLM, Gmail, AI Agent, Slack, Airtable, Supabase

---

## Before (Manual Process)

1. A process engineer joins a client meeting (PEC call).
1. Someone is responsible for taking notes during the call — splitting their attention.
1. After the call, they spend 15-30 minutes writing up formal minutes of the meeting.
1. They identify action items, decisions, and next steps manually.
1. They email the MoM to the client and post it internally on Slack.
1. If the notetaker is absent or forgets, the MoM simply doesn't happen.
1. Inconsistent formats — every person writes MoM differently.

---

## After (Automated)

When a PEC meeting is recorded on Fathom, an AI agent automatically generates structured minutes — including action items, decisions, and attendee summaries — then emails them to the client and posts to Slack.

**Step 1: A meeting is recorded on Fathom**
Each process engineer (Jesy, Fiona, Alex, JK, Ken, Aja, Chi, Ella, Marc) has a dedicated intake channel.

**Step 2: The transcript is cleaned and prepared**
Raw transcript text is normalized — removing filler, fixing formatting, and structuring the content.

**Step 3: The system determines the meeting type**
Internal PEC (IPEC) and external/full PEC (FPEC) meetings get different treatment.

**Step 4: An AI agent generates the MoM**
The AI reads the full transcript and produces structured minutes: attendees, agenda, discussion points, action items, and decisions.

**Step 5: The output is formatted**
The raw AI output is parsed into a clean, professional email-ready format.

**Step 6: Client emails are looked up**
The system finds the correct client contacts from the project records.

**Step 7: The MoM is emailed to the client**
A formatted email with the meeting minutes is sent directly to the client's POC.

**Step 8: The MoM is posted to Slack**
The internal team gets a copy in their Slack channel.

**Step 9: A record is saved to the database**
The MoM is stored in Supabase for audit and reference.

*Uses Google Gemini and Mistral AI to analyze transcripts and generate structured meeting minutes.*

---

## Impact

- **15-30 minutes saved per meeting** — no manual note-taking or write-up.
- **100% coverage** — every recorded meeting gets minutes, no exceptions.
- **Consistent format** — AI produces structured, professional MoM every time.
- **Faster turnaround** — clients receive MoM within minutes of the call ending.
- **Better meetings** — process engineers can focus fully on the conversation.
- **Full audit trail** — every MoM is stored in the database.
