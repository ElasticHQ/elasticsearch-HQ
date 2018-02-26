from elastichq import factory
import argparse

application = factory.create_app()
  
if __name__ == '__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument("--port", help="The port to listen to", type=int,default=5000)
	parser.add_argument("--host", help="local IP address to bind to",default="localhost")
	args = parser.parse_args()
	
	application.run(debug=False, threaded=True, use_reloader=True,host=args.host,port=args.port)
    #application.run(debug=False, threaded=True, use_reloader=False)
    #application.run(debug=True, threaded=True, use_reloader=True)
