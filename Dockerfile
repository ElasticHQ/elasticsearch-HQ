FROM python:3.6-alpine3.7

# Upgrade and install basic Python dependencies
# This block added because of the trouble installing gevent on many systems
# https://hub.docker.com/r/openwhisk/dockerskeleton/~/dockerfile/
RUN apk update && \
    apk add supervisor && \
    apk add --update py2-pip && \
    apk add --no-cache bash && \
    apk add --no-cache --virtual .build-deps bzip2-dev gcc libc-dev libffi-dev openssl-dev python3-dev make

# Copy project sources
COPY . /src

# Set working directory
WORKDIR /src

# Install app dependencies and create supervisord dirs
RUN pip3 install --upgrade pip==21.3.1 && \
    pip3 install -U -r requirements.txt && \
    pip3 install gunicorn==19.7.1 && \
    mkdir -p /etc/supervisor/conf.d /var/log/supervisor /var/run/supervisor

# Copy configuration files
RUN cp /src/deployment/logging.conf /src/logging.conf && \
    cp /src/deployment/gunicorn.conf /src/gunicorn.conf && \
    cp /src/deployment/supervisord.conf /etc/supervisor/supervisord.conf && \
    cp /src/deployment/gunicorn.conf /etc/supervisor/conf.d/gunicorn.conf

# Fix permissions
RUN chgrp -R 0 /src /var/log/supervisor /var/run/supervisor && \
    chmod -R g=u  /src /var/log/supervisor /var/run/supervisor

# Expose service port
EXPOSE 5000

# Start processes
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
