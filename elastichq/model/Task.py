# make sure to use eventlet and call eventlet.monkey_patch()
import json

import eventlet

from elastichq.service import NodeService
from ..globals import LOG, socketio

eventlet.monkey_patch()


class Task:
    """

    """

    room_name = None
    cluster_name = None
    metric = None
    task_timeout = 5
    sessions = []

    switch = False

    def __init__(self, room_name, cluster_name, metric):
        self.switch = True

        self.room_name = room_name
        self.cluster_name = cluster_name
        self.metric = metric

    def run(self):
        """
        Based on Flask-SocketIO exapmle app at:
        https://github.com/miguelgrinberg/Flask-SocketIO/blob/master/example/app.py

        https://github.com/miguelgrinberg/Flask-SocketIO/issues/117

        :param kwargs:
        :return:
        """

        # https://stackoverflow.com/questions/44371041/python-socketio-and-flask-how-to-stop-a-loop-in-a-background-thread
        while self.switch:
            eventlet.sleep(5)

            LOG.debug('-----------------------------------------')
            LOG.debug('    Doing background task')
            LOG.debug('    SocketIO: {}'.format(hex(id(socketio))))
            LOG.debug('    SocketIO rooms: {}'.format(socketio.server.manager.rooms))
            LOG.debug('-----------------------------------------')

            if self.metric == 'nodes':
                nodes_cat = NodeService().get_node_cat(self.cluster_name, flags="id,hc,hm,rc,rm,n,l,u,fm",
                                                       request_timeout=self.task_timeout)
                nodes = []
                for node in nodes_cat:
                    node = {
                        "node_id": node.get('id', None),
                        "name": node.get('n', None),
                        "heapCurrent": node.get('hc', None),
                        "heapMax": node.get('hm', None),
                        "ramCurrent": node.get('rc', None),
                        "ramMax": node.get('rm', None),
                        "fielddataMemory": node.get('fm', None),
                        "load": node.get('l', 0),
                        "uptime": node.get('u', 0)
                    }
                    nodes.append(node)
                socketio.emit('event', {'data': json.dumps(nodes)}, room=self.room_name, namespace="/ws")
                # socketio.emit('event', {'data': 'MESSAGE ECHO ROOM ' + self.room_name}, room=self.room_name,
                #               namespace="/ws")
            else:
                pass

    def stop(self):
        self.switch = False
