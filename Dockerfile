FROM node:alpine as builder

WORKDIR /app

COPY . ./
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH
RUN npm run build

CMD [ "npm", "run", "start" ]