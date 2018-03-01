


class Task(object):
    """

    """

    switch = False
    unit_of_work = 0

    def __init__(self, socketio):
        """
        assign socketio object to emit
        """
        self.socketio = socketio
        self.switch = True

    def do_work(self):
        """
        do work and emit message
        """

        while self.switch:
            self.unit_of_work += 1

            # must call emit from the socket io
            # must specify the namespace
            self.socketio.emit("update", {"msg": self.unit_of_work}, namespace="/ws")

            # important to use eventlet's sleep method
            eventlet.sleep(1)

    def stop(self):
        """
        stop the loop
        """
        self.switch = False