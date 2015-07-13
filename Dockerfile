# Base system on DURAARK's 'bootstrap' system for microservices, which works well for our purpose, too
FROM duraark/microservice-base

# Install system dependencies
RUN DEBIAN_FRONTEND=noninteractive
RUN apt-get update --fix-missing
RUN apt-get install -y git build-essential python

RUN npm install -g ember ember-cli
RUN npm install -g bower

# Pull in source code:
COPY ./ /duraark/workbench-ui
WORKDIR /duraark/workbench-ui

RUN npm install
RUN bower install --allow-root

EXPOSE 4200

ENV DURAARK_API_ENDPOINT=http://juliet.cgv.tugraz.at/api/v0.1/ 

ENTRYPOINT ["ember", "serve", "--prod", "--proxy", "http://api-gatekeeper"]

