---
description: How to set up your local development environment for Encuentra.ai.
---

# Environment Setup

1. **Install Bun**
   - [Official Bun installation instructions](https://bun.sh/docs/installation)
2. **Install Node.js (if needed)**
   - Bun ships with its own runtime, but Node.js LTS is recommended for some tools.
3. **Install Git**
   - [Git download](https://git-scm.com/downloads)
4. **(Optional) Install Docker**
   - Needed for running local Supabase.
5. **Clone the Repository**
   - `git clone https://github.com/cabyz-admin/encuentra.ai.git`
6. **Install Project Dependencies**
   - Run `bun install` at the root of the repo.
7. **Set Up Environment Variables**
   - Copy `.env.example` files to `.env` in each app as needed.

After completing these steps, continue with [local development](local-dev.md).
