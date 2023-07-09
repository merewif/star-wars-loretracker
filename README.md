# Star Wars Loretracker

[Star Wars Loretracker](https://star-wars-loretracker.vercel.app/) is a tool for Star Wars fans to track which books and comics they've read, and which movies and series they've watched.

I began my journey into the Star Wars expanded universe in the beginning of 2022. Reading book after book and realizing just how vast the entire Star Wars publication list is, I felt I need a way to visually see which books I finished and which ones remain.

Fortunately the amazing [Youtini Team](https://youtini.com) has already assembled a gigantic database of all the Star Wars books and comics ever published, so all I had to do was to develop an interface to browse and filter the gargantuan collection.

---

### Technical details

- Language:
  - JavaScript / TypeScript
- Framework:
  - React (Next.js)
- Database:
  - Supabase (Postgres)
- UI Libraries:

  - Material UI
  - Lodash
  - Waypoint
  - Dayjs

### How to start the project

1. Clone the repository to your local computer:

   ```bash
   git clone https://github.com/merewif/star-wars-loretracker.git
   ```

2. Navigate to the project directory:

   ```bash
   cd star-wars-loretracker
   ```

3. Create a `.env` file in the root directory of the project. You can use the `.env.example` file as a template:

   ```bash
   cp .env.example .env
   ```

4. Retrieve your `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_URL` environmental variables from your project in [Supabase](https://supabase.com/) and paste them into the `.env` file.

5. Install `pnpm` by following the instructions [here](https://pnpm.io/installation).

6. Install the project dependencies:

   ```bash
   pnpm install
   ```

7. Start the development server:

   ```bash
   pnpm run dev
   ```
