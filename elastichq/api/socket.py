import time
from threading import Lock

from flask import request
from flask_socketio import emit, join_room, rooms
#### This is what fixed the issue...see discussion thread below ######
#from gevent import monkey

from ..globals import LOG, socketio

#monkey.patch_all()
#######################################################


""""
To test using Chrome dev tools:

var socket = io('http://localhost:5000/ws');
  socket.on('connect', function(){});
  socket.on('event', function(data){ console.log("DATA! : ", data)});
  socket.on('disconnect', function(){});
  
To send/receive message:

socket.send('FOOFOOFOO');

Join a room:

socket.emit('join', {"cluster_name": "FOO", "metrics" : "nodes"});

"""

thread = None
thread_lock = Lock()


def ping_nodes():
    LOG.info("here")
    socketio.emit('event', {'data': 'MESSAGE ECHO: FOO ROOM'})
    emit('event',
         {'data': {"msg": "AAAAAA"}},
         room="FOO")
    time.sleep(0)
    return


def background_thread():
    """
    Based on Flask-SocketIO exapmle app at:
    https://github.com/miguelgrinberg/Flask-SocketIO/blob/master/example/app.py

    https://github.com/miguelgrinberg/Flask-SocketIO/issues/117
    """
    # Do a periodic background emit from the server
    while True:
        socketio.sleep(5)

        LOG.info(u'-----------------------------------------')
        LOG.info(u'[ ] Doing background task')
        LOG.info(u'    SocketIO: {}'.format(hex(id(socketio))))
        #LOG.info(u'    SocketIO rooms: {}'.format(rooms()))

        LOG.info(u'-----------------------------------------')
        #emit('event', {'data': 'MESSAGE ECHO: ROOM FOO'}, room="FOO")
        socketio.emit('event', {'data': 'MESSAGE ECHO: ROOM FOO'}, room="FOO", namespace="/ws")


@socketio.on('join', namespace='/ws')
def joined(json):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    LOG.info('Received room join: ' + str(json))
    # username = data['username']
    # room = data['room']
    # join_room(room)
    join_room("FOO")  # json.get('cluster_name'))
    sid = request.sid
    print(rooms())
    # thread = Thread(target=background_thread)
    thread = socketio.start_background_task(target=background_thread)
    #thread.start()

    emit(' has entered the room.', room='FOO')


@socketio.on('leave')
def on_leave(json):
    pass


#    leave_room(room)
#    emit(username + ' has left the room.', room=room)


@socketio.on('connect', namespace='/ws')
def connect():
    emit('event', {'data': 'Connected'})


@socketio.on('message', namespace='/ws')
def do_msg(message):
    """
    This will echo out a message sent here:

    socket.send('SOME MESSAGE');

    :param message:
    :return:
    """
    print(rooms())
    emit('event', {'data': 'MESSAGE ECHO: ' + message})


@socketio.on('disconnect', namespace='/ws')
def disconnect():
    print('Client disconnected')
