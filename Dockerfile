FROM node:18-alpine
WORKDIR /
COPY package.json ./
RUN yarn install
COPY . .
CMD ["node", "./server.js"]
