FROM node:10.12.0-alpine
# Create app directory
WORKDIR /api
# Install app dependencies
COPY package*.json . /api/
RUN npm install
# Copy app source code
COPY . /api/
#Expose port and start application
EXPOSE 3001
CMD [ "npm", "start" ]