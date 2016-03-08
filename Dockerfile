FROM duraark/microservice-base

MAINTAINER Martin Hecher <martin.hecher@fraunhofer.at>

WORKDIR /opt/workbench-ui

COPY ./package.json /opt/workbench-ui
RUN npm install ember-cli -g && npm install

COPY ./bower.json /opt/workbench-ui
RUN mv .git .git-tmp && bower install --allow-root; mv .git-tmp .git

COPY ./ /opt/workbench-ui

CMD ["ember", "serve", "--prod"]

EXPOSE 4200
