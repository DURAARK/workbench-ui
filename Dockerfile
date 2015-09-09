# Base system on DURAARK's 'bootstrap' system for microservices, which works well for our purpose, too
FROM duraark/microservice-base

# Install system dependencies
RUN DEBIAN_FRONTEND=noninteractive
RUN apt-get update --fix-missing
RUN apt-get install -y git build-essential python

RUN npm install -g ember-cli bower nodemon

# Pull in source code:
COPY ./ /duraark/workbench-ui
WORKDIR /duraark/workbench-ui

RUN npm install
RUN mv .git .git-tmp && bower install --allow-root; mv .git-tmp .git

EXPOSE 4200
CMD ["ember", "serve", "--prod"]
