FROM nginx:1.13-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY docker-entrypoint.sh /
COPY . /app

EXPOSE 80

CMD ["/docker-entrypoint.sh"]
