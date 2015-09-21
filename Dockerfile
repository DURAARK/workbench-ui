FROM ubuntu:14.04

RUN DEBIAN_FRONTEND=noninteractive

RUN apt-get install curl git python -y
RUN apt-get -f install
#RUN apt-get install build-essential -y
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get -y install nodejs -y

RUN npm install -g ember-cli bower nodemon

# Pull in source code:
COPY ./ /duraark/workbench-ui
WORKDIR /duraark/workbench-ui

RUN npm install
RUN mv .git .git-tmp && bower install --allow-root; mv .git-tmp .git

EXPOSE 4200
CMD ["ember", "serve"]
