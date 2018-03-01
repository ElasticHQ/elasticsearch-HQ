# make sure to use eventlet and call eventlet.monkey_patch()
import eventlet

from ..globals import LOG, socketio

eventlet.monkey_patch()

taskObject = None


class Task(object):
    """

    """

    room_name = None
    cluster_name = None
    metric = None

    sessions = []

    switch = False

    def __init__(self, room_name, cluster_name, metric):
        self.switch = True

        self.room_name = room_name
        self.cluster_name = cluster_name
        self.metric = metric

    def run(self, **kwargs):
        """
        Based on Flask-SocketIO exapmle app at:
        https://github.com/miguelgrinberg/Flask-SocketIO/blob/master/example/app.py

        https://github.com/miguelgrinberg/Flask-SocketIO/issues/117

        :param kwargs:
        :return:
        """

        while self.switch:
            eventlet.sleep(10)
            # self.socketio.sleep(5)

            LOG.debug('-----------------------------------------')
            LOG.debug('[ ] Doing background task')
            LOG.debug('    SocketIO: {}'.format(hex(id(socketio))))
            LOG.debug('    SocketIO rooms: {}'.format(socketio.server.manager.rooms))
            LOG.debug('-----------------------------------------')
            socketio.emit('event', {'data': 'MESSAGE ECHO ROOM ' + self.room_name}, room=self.room_name,
                          namespace="/ws")

    def stop(self):
        self.switch = False
