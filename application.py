# import argparse
import optparse

from elastichq import factory

default_host = '0.0.0.0'
default_port = 5000
default_debug = False

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

options, _ = parser.parse_args()

# if __name__ == '__main__':
# parser = argparse.ArgumentParser()
# parser.add_argument("--port", help="The port to listen to", type=int, default=5000)
# parser.add_argument("--host", help="local IP address to bind to", default="localhost")
# args = parser.parse_args()
application = factory.create_app(host=options.host, port=options.port, debug=options.debug)
# application.run(debug=False, threaded=True, use_reloader=True, host=args.host, port=args.port)
