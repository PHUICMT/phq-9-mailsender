FROM node:alpine as builder

WORKDIR /app

COPY . ./
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH

CMD [ "npm", "run", "start" ]