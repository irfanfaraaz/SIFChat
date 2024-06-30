#SIFChat

## Features

- Next.js 14 App Directory
- NextAuth 4
  -Real time chat
- Radix UI Primitives
- Tailwind CSS
- Google fonts
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Tailwind CSS class sorting, merging and linting.

### Adding login functionality

1. Copy `sample.env.local` and create `env.local`. Fill up the postgres database credentials.

2. ```
   UPSTASH_REDIS_REST_URL=
   UPSTASH_REDIS_REST_TOKEN=

   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   ```

3. You need to connect to a redis instance

4. Copy `sample.env.local` and create `env.local`. Fill up the database credentials.

5. ```
   MONGODB_URI=
   ```

6. Run `pnpm install` to install all the dependencies

7. Run `pnpm run dev` and you can use login
