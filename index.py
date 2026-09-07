"""Vercel entrypoint for the SkillBridge FastAPI application.

The actual application remains in the project-root main.py so the existing
CSV paths (jobs.csv and skills.csv) continue to work without moving data.
Vercel exposes this file under /api/*.
"""

from main import app  # noqa: F401
