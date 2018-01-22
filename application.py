from elastichq import factory

application = factory.create_app()
  
if __name__ == '__main__':
    application.run(debug=False, threaded=True, use_reloader=True)
    #application.run(debug=False, threaded=True, use_reloader=False)
    #application.run(debug=True, threaded=True, use_reloader=True)
