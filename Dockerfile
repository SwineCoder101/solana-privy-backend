# Stage 1: Build the application
FROM node:20-alpine AS Build
RUN apk add --no-cache openssl git
WORKDIR /usr/src/app
COPY package*.json ./

# Install dependencies and build the project
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build

# Stage 2: Create the final production image
FROM node:20-alpine AS production
RUN apk add --no-cache openssl
WORKDIR /usr/src/app

# Copy the built project from the build stage
COPY --from=Build /usr/src/app/dist ./dist
COPY --from=Build /usr/src/app/package.json ./package.json
COPY --from=Build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

# Install only production dependencies
RUN npm install --production --legacy-peer-deps --ignore-scripts

EXPOSE 3000
CMD ["npm", "run", "start:prod"]