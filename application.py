# import argparse
import logging.config
import optparse
import os

from elastichq import create_app
from elastichq.globals import socketio
from elastichq.utils import find_config

default_host = '0.0.0.0'
default_port = 5000
default_debug = False
default_enable_ssl = False
default_ca_certs = None
default_verify_certs = True
default_client_key = None
default_client_cert = None
default_url = 'http://localhost:9200'
is_gunicorn = "gunicorn" in os.environ.get("SERVER_SOFTWARE", "")

application = create_app()

# set default url, override with env for docker
application.config['DEFAULT_URL'] = os.environ.get('HQ_DEFAULT_URL', default_url)
application.config['ENABLE_SSL'] = os.environ.get('HQ_ENABLE_SSL', default_enable_ssl)
application.config['CA_CERTS'] = os.environ.get('HQ_CA_CERTS', default_ca_certs)
application.config['VERIFY_CERTS'] = os.environ.get('HQ_VERIFY_CERTS', default_verify_certs)
application.config['DEBUG'] = os.environ.get('HQ_DEBUG', default_debug)
application.config['CLIENT_KEY'] = os.environ.get('CLIENT_KEY', default_client_key)
application.config['CLIENT_CERT'] = os.environ.get('CLIENT_CERT', default_client_cert)

if os.environ.get('HQ_DEBUG') == 'True':
    config = find_config('logger_debug.json')
    logging.config.dictConfig(config)

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
    parser.add_option("-v", "--verify_certs", default=default_verify_certs,
                      help='Set to False when using self-signed certs.')
    parser.add_option("-x", "--client_cert", default=default_client_cert,
                      help='Set to path of the client cert file.')
    parser.add_option("-X", "--client_key", default=default_client_key,
                      help='Set to path of the client key file.')

    options, _ = parser.parse_args()

    application.config['DEFAULT_URL'] = os.environ.get('HQ_DEFAULT_URL', options.url)
    application.config['ENABLE_SSL'] = os.environ.get('HQ_ENABLE_SSL', options.enable_ssl)
    application.config['CA_CERTS'] = os.environ.get('HQ_CA_CERTS', options.ca_certs)
    application.config['VERIFY_CERTS'] = os.environ.get('HQ_VERIFY_CERTS', options.verify_certs)
    application.config['CLIENT_KEY'] = os.environ.get('CLIENT_KEY', options.client_key)
    application.config['CLIENT_CERT'] = os.environ.get('CLIENT_CERT', options.client_cert)

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
