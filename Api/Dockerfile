# Use an official Node runtime as the base image
FROM node:18.16-alpine3.18
WORKDIR /app
COPY package*.json ./

RUN npm i
COPY . .

EXPOSE 5000

# Run the app when the container launches
CMD [ "npm", "run", "start" ]
