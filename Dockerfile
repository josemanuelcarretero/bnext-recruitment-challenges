FROM node:12
RUN apt-get update
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build
CMD ["node", "dist/main"]