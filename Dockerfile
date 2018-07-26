FROM python:3.6-alpine3.7

RUN apk update
RUN apk add supervisor
RUN apk add --update py2-pip

# Upgrade and install basic Python dependencies
# This block added because of the trouble installing gevent on many systems
# https://hub.docker.com/r/openwhisk/dockerskeleton/~/dockerfile/
RUN apk add --no-cache bash \
 && apk add --no-cache --virtual .build-deps \
        bzip2-dev \
        gcc \
        libc-dev
#  && pip install --no-cache-dir gevent \
#  && apk del .build-deps

# reqs layer
ADD requirements.txt .
RUN pip3 install -U -r requirements.txt
RUN pip3 install gunicorn==19.7.1

# Bundle app source
ADD . /src

COPY ./deployment/logging.conf /src/logging.conf
COPY ./deployment/gunicorn.conf /src/gunicorn.conf

EXPOSE 5000

# Setup supervisord
RUN mkdir -p /var/log/supervisor
COPY ./deployment/supervisord.conf /etc/supervisor/supervisord.conf
COPY ./deployment/gunicorn.conf /etc/supervisor/conf.d/gunicorn.conf

# Start processes
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]


#ENTRYPOINT ["python"]
#CMD ["src/application.py"]