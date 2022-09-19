FROM node:16
WORKDIR /index
COPY package.json ./

RUN npm install

COPY . ./index
EXPOSE 3002
CMD [ "node", "index" ]

# FROM node:16
# COPY . /index
# WORKDIR /index
# CMD node /app/index.js