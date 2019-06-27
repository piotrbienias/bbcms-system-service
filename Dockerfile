FROM node:10.16-alpine

RUN apk add git

WORKDIR /opt/system-service

COPY . .

RUN npm ci --quiet

CMD ["npm", "start"]