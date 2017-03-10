FROM node:7.7.2-alpine
MAINTAINER Christopher Langton <chrislangton84@gmail.com>
WORKDIR /usr/src/app/

ENV NODE_ENV=prod

# Install core dependencies
RUN apk update \
    && apk upgrade
RUN apk add --no-cache make gcc g++ python
ADD ./ /usr/src/app/
RUN npm install supervisor -g

VOLUME ["/usr/src/app/"]
EXPOSE 8080
CMD ["supervisor", "server.js"]