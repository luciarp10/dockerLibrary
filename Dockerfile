FROM node:lts-alpine
RUN mkdir -p /usr/src/app/node_modules
RUN mkdir -p /usr/src/data/books
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package*.json", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY --chown=node:node . . 
EXPOSE 3000
RUN chown -R node /usr/src/app
RUN chown -R node:node /usr/src/data/books
USER node
CMD ["npm", "start"]
