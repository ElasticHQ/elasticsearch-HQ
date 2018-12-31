# import argparse
import optparse
import os
import logging
import logging.config
from elastichq import create_app
from elastichq.globals import socketio
from elastichq.utils import find_config

default_host = '0.0.0.0'
default_port = 5000
default_debug = False
default_enable_ssl = False
default_ca_certs = None
default_url = 'http://localhost:9200'
is_gunicorn = "gunicorn" in os.environ.get("SERVER_SOFTWARE", "")

application = create_app()

if __name__ == '__main__':
    # Set up the command-line options
    parser = optparse.OptionParser()
    parser.add_option("-H", "--host",
                      help="Hostname of the Flask app " + \
                           "[default %s]" % default_host,
                      default=default_host)
    parser.add_option("-P", "--port",
                      help="Port for the Flask app " + \
                           "[default %s]" % default_port,
                      default=default_port)
    parser.add_option("-d", "--debug",
                      action="store_true", dest="debug", default=default_debug,
                      help=optparse.SUPPRESS_HELP)
    parser.add_option("-u", "--url", default=default_url)
    parser.add_option("-s", "--enable-ssl",
                      action="store_true", default=default_enable_ssl)
    parser.add_option("-c", "--ca-certs", default=default_ca_certs,
                      help='Required when --use-ssl is set. ' + \
                           'Path to CA file or directory [default %s]' % default_ca_certs)


    options, _ = parser.parse_args()

    # set default url, override with env for docker
    application.config['DEFAULT_URL'] = os.environ.get('HQ_DEFAULT_URL', options.url)
    application.config['ENABLE_SSL'] = os.environ.get('HQ_ENABLE_SSL', options.enable_ssl)
    application.config['CA_CERTS'] = os.environ.get('HQ_CA_CERTS', options.ca_certs)

    if is_gunicorn:
        if options.debug:
            config = find_config('logger_debug.json')
            logging.config.dictConfig(config)

        # we set reloader False so gunicorn doesn't call two instances of all the Flask init functions.
        socketio.run(application, host=options.host, port=options.port, debug=options.debug, use_reloader=False)
    else:
        if options.debug:
            config = find_config('logger_debug.json')
            logging.config.dictConfig(config)
        socketio.run(application, host=options.host, port=options.port, debug=options.debug)
