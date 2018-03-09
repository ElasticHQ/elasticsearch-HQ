from threading import Lock

import eventlet
from flask import request
from flask_socketio import emit, join_room, leave_room, rooms

from elastichq.model import Task
from elastichq.service import ConnectionService
from ..globals import LOG, taskPool, socketio

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
eventlet.monkey_patch()


def task_procesor(room_name, cluster_name, metric):
    """
    This will dispatch to the appropriate task/room

    """

    # DO NOT REMOVE:
    # This is necessary to initialize SQLAlchemy in case the very first request is made directly to this socket endpoint.
    ConnectionService().get_connection(cluster_name)

    task = Task(room_name=room_name, cluster_name=cluster_name, metric=metric)
    taskPool.create_task(task=task, sid=request.sid)


@socketio.on('join', namespace='/ws')
def joined(json):
    """
    Sent by clients when they enter a room.
    """
    LOG.debug('Received room join: ' + str(json))
    room_name = json.get('room_name')
    parts = room_name.split('::')
    cluster_name = parts[0]
    metric = parts[1]
    join_room(room_name)
    # sid = request.sid
    print(rooms())
    task_procesor(room_name, cluster_name=cluster_name, metric=metric)


@socketio.on('leave', namespace='/ws')
def on_leave(json):
    """
    Sent by client to leave a room
    :param json:
    :return:
    """
    LOG.debug('Received room leave: ' + str(json))
    room_name = json.get('room_name')
    parts = room_name.split('::')
    cluster_name = parts[0]
    metrics = parts[1]
    leave_room(room_name)
    print(rooms())


@socketio.on('connect', namespace='/ws')
def connect():
    emit('event', {'connected': True})


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
    LOG.debug('Client disconnected')

    # client disconnected
    sid = request.sid
    taskPool.diconnect_client(sid)

