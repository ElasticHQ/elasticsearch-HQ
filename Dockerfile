FROM ubuntu:17.10

# get a nice python
RUN apt-get update
RUN apt-get -y install build-essential libssl-dev libcurl4-gnutls-dev libexpat1-dev gettext unzip python3.6-dev python2.7-dev

RUN curl https://bootstrap.pypa.io/get-pip.py | python3.6
RUN curl https://bootstrap.pypa.io/get-pip.py | python2.7

# add some extra packages
RUN pip3 install gunicorn
RUN pip2 install supervisor supervisor_stdout

# reqs layer
ADD requirements.txt .
RUN pip3 install -U -r requirements.txt

# Bundle app source
ADD . /src

# Expose
EXPOSE  5000

COPY ./deployment/logging.conf /src/logging.conf
COPY ./deployment/gunicorn.conf /src/gunicorn.conf

# Setup supervisord
RUN mkdir -p /var/log/supervisor
COPY ./deployment/supervisord.conf /etc/supervisor/supervisord.conf
COPY ./deployment/gunicorn.conf /etc/supervisor/conf.d/gunicorn.conf

# Start processes
CMD ["/usr/local/bin/supervisord"]