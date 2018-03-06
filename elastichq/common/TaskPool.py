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
        # sanity check for unique tasks:
        if self.get_task_by_room_name(task.room_name) is None:
            self.tasks.append(task)

    def get_task_by_room_name(self, room_name):
        """

        :param room_name: unique ID of tasks
        :return:
        """
        for task in self.tasks:
            if task.room_name == room_name:
                return task
        return None

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
        else: # task already exists
            task.add_session(sid)

    def diconnect_client(self, sid):
        for task in self.tasks:
            for session in task.sessions:
                if session == sid:
                    task.remove_session(sid)
                    if len(task.sessions) == 0:
                        task.stop()
                        self.remove(task.room_name)
                    break

