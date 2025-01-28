FROM node:20-alpine as BUILD
RUN apk add --no-cache openssl curl git
WORKDIR /usr/src/app
COPY . .

ENV NPM_CONFIG_IGNORE_SCRIPTS=true
RUN npm install
RUN npx prisma generate
RUN npm run build
COPY prisma ./prisma
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
