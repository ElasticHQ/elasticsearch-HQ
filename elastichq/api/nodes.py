__author__ = 'royrusso'

from flask import session
from flask_restful import Resource
from flask_socketio import emit, join_room, leave_room

from . import api, ws_blueprint
from ..common.api_response import APIResponse
from ..common.exceptions import request_wrapper
from ..common.status_codes import HTTP_Status
from ..globals import socketio
from ..service import NodeService


class NodesSummary(Resource):
    @request_wrapper
    def get(self, cluster_name, node_ids=None):
        """
        Summary of Node(s). Returns a condensed view of all nodes in the cluster. Summary information is pulled from
        both the info and stats APIs.
        """

        response = NodeService().get_node_summary(cluster_name, node_ids)
        return APIResponse(response, HTTP_Status.OK, None)


class NodesStats(Resource):

    @request_wrapper
    def get(self, cluster_name, node_ids=None):
        """
        Wrapper for https://www.elastic.co/guide/en/elasticsearch/reference/master/cluster-nodes-stats.html
        """

        response = NodeService().get_node_stats(cluster_name, node_ids)
        return APIResponse(response, HTTP_Status.OK, None)


class NodesInfo(Resource):

    @request_wrapper
    def get(self, cluster_name, node_ids=None):
        """
        Wrapper for https://www.elastic.co/guide/en/elasticsearch/reference/master/cluster-nodes-info.html
        """
        response = NodeService().get_node_info(cluster_name, node_ids)
        return APIResponse(response, HTTP_Status.OK, None)


@socketio.on('joined', namespace='/ws/nodes')
def joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    room = session.get('room')
    join_room(room)
    emit('status', {'msg': session.get('name') + ' has entered the room.'}, room=room)


@socketio.on('text', namespace='/ws/nodes')
def text(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    room = session.get('room')
    emit('message', {'msg': session.get('name') + ':' + message['msg']}, room=room)


@socketio.on('connect', namespace='/ws/nodes')
def test_connect():
    emit('event', {'data': 'Connected'})


@socketio.on('message', namespace='/ws/nodes')
def do_msg(message):
    emit('event', {'data': 'MSG' + message})


@socketio.on('disconnect', namespace='/chat')
def test_disconnect():
    print('Client disconnected')

@socketio.on('ping', namespace='/ws/nodes')
def ping_pong():
    emit('my_pong')

@socketio.on('left', namespace='/ws/nodes')
def left(message):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    room = session.get('room')
    leave_room(room)
    emit('status', {'msg': session.get('name') + ' has left the room.'}, room=room)


@ws_blueprint.route('/ws/nodes')
def chat():
    socketio.emit('event', {'data': 'Connected'})


api.add_resource(NodesSummary, '/nodes/<string:cluster_name>/<string:node_ids>/_summary',
                 '/nodes/<string:cluster_name>/_summary', endpoint='nodes_summary', methods=['GET'])
api.add_resource(NodesStats, '/nodes/<string:cluster_name>/<string:node_ids>/_stats',
                 '/nodes/<string:cluster_name>/_stats', endpoint='nodes_stats', methods=['GET'])
api.add_resource(NodesInfo, '/nodes/<string:cluster_name>/<string:node_ids>/_info',
                 '/nodes/<string:cluster_name>/_info', endpoint='nodes_info', methods=['GET'])
