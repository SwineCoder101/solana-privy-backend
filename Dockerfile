FROM node:20-alpine AS build
RUN apk add --no-cache openssl git
WORKDIR /usr/src/app
COPY . .
COPY package*.json ./

ENV NPM_CONFIG_IGNORE_SCRIPTS=true
RUN npm install
RUN npx prisma generate
RUN npm run build

RUN apk add --no-cache openssl
WORKDIR /usr/src/app
ENV NPM_CONFIG_IGNORE_SCRIPTS=true
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma


RUN npm install --production --legacy-peer-deps --ignore-scripts
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
