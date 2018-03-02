class TaskPool(object):
    """
    Websocket Task pool.
    """
    tasks = []
    socketio = None

    def init_app(self, socketio):
        self.socketio = socketio
        return self

    def add(self, task):
        self.tasks.append(task)

    def get_task_by_room_name(self, room_name):
        for task in self.tasks:
            if task.room_name == room_name:
                return task

    def get_tasks_by_cluster_name(self, cluster_name):
        for task in self.tasks:
            if task.cluster_name == cluster_name:
                return task

    def remove(self, room_name):
        task = self.get_task_by_room_name(room_name)
        task.stop()
        self.tasks.remove(task)

    def create_task(self, task, sid):
        """
        Will create the task if one does not exist by that name. Once created, it is added to the global pool.
        :param task:
        :return:
        """
        if self.get_task_by_room_name(room_name=task.room_name) is None:
            task.add_session(sid)
            self.socketio.start_background_task(target=task.run)
            self.add(task)
        else:
            task.add_session(sid)
