# FROM node:20-alpine as BUILD
# RUN apk --no-cache add git openssl
# WORKDIR /usr/src/app
# COPY . .
# COPY package*.json ./
#
# ENV NPM_CONFIG_IGNORE_SCRIPTS=true
# RUN npm install
# RUN npx prisma generate
# RUN npm run build
# RUN npm install --production --legacy-peer-deps --ignore-scripts
#
# FROM node:20-alpine as RUNTIME
# WORKDIR /usr/src/app
# RUN apk add --no-cache openssl
# COPY --from=BUILD /usr/src/app/dist ./dist
# COPY --from=BUILD /usr/src/app/package.json ./package.json
# COPY --from=BUILD /usr/src/app/node_modules/.prisma ./node_modules/.prisma
# COPY prisma ./prisma
# EXPOSE 3000
#
# CMD ["npm", "run", "start:prod"]

FROM node:20-alpine AS BUILD
RUN apk add --no-cache openssl git
WORKDIR /usr/src/app
COPY . .
COPY package*.json ./

ENV NPM_CONFIG_IGNORE_SCRIPTS=true
RUN npm install
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine as RUNTIME
RUN apk add --no-cache openssl
WORKDIR /usr/src/app
ENV NPM_CONFIG_IGNORE_SCRIPTS=true
COPY --from=BUILD /usr/src/app/dist ./dist
COPY --from=BUILD /usr/src/app/package.json ./package.json
COPY --from=BUILD /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma


RUN npm install --production --legacy-peer-deps --ignore-scripts
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
