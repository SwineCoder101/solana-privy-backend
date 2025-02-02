#!/usr/bin/env bash

# 1. Stop and remove any existing container named "talentgram_postgres" (optional cleanup step)
docker rm -f talentgram_postgres 2>/dev/null || true

# 2. Run a new Postgres container on port 26257
docker run -d \
  --name talentgram_postgres \
  -p 26257:5432 \
  -e POSTGRES_USER=talentgramdbuser \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=talentgram \
  postgres:14

# 3. Export the DATABASE_URL environment variable for your app
# Note: We add sslmode=disable for local dev
export DATABASE_URL="postgresql://talentgramdbuser:secret@localhost:26257/talentgram?sslmode=disable"

# 4. Wait a bit for Postgres to initialize (optional, but helps if the app starts very quickly)
echo "Waiting 5 seconds for Postgres to initialize..."
sleep 5

# 5. Optionally run Prisma migrations or db push
npx prisma migrate dev

# 6. Start your NestJS server
npm run start:dev
