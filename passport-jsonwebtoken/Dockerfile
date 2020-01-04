FROM node:12.11.1

WORKDIR /srv

ADD . .
RUN npm install

EXPOSE 8000
CMD ["node", "app.js"]