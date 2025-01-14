FROM node:20-alpine as BUILD
RUN apk add --no-cache openssl
WORKDIR /usr/src/app
COPY . .
COPY package*.json ./

RUN apk --no-cache add git
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

RUN apk --no-cache add curl
RUN curl --create-dirs -o $HOME/.postgresql/root.crt 'https://cockroachlabs.cloud/clusters/7dbf13d1-8168-46e8-8cb0-791aef720986/cert'

RUN apk --no-cache add git
RUN npm install --production --legacy-peer-deps --ignore-scripts

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
