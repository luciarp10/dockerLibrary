FROM node:lts-alpine
RUN mkdir -p /usr/src/app/node_modules
WORKDIR /usr/src/app
COPY ["package*.json", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
ENV NODE_ENV=production
COPY --chown=node:node . . 
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
