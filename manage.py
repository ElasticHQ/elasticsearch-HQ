#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'royrusso'

import os
import sys

from flask_migrate import MigrateCommand
from flask_script import Command, Manager, Option, Server as _Server

from elastichq import create_app
from elastichq.globals import db, socketio

manager = Manager(create_app)


class Server(_Server):
    """
    From https://github.com/miguelgrinberg/flack/blob/master/manage.py
    This is the only way to call ./manage.py runserver, as flask-socketio blocks the call otherwise.
    """

    help = description = 'Runs the Socket.IO web server'
    host = '0.0.0.0'
    port = 5000
    use_debugger = False
    use_reloader = False
    default_url = 'http://localhost:9200'

    def get_options(self):
        options = (
            Option('-H', '--host',
                   dest='host',
                   default=self.host),

            Option('-P', '--port',
                   dest='port',
                   type=int,
                   default=self.port),

            Option('-d', '--debug',
                   action='store_true',
                   dest='use_debugger',
                   help=('enable the Werkzeug debugger (DO NOT use in '
                         'production code)'),
                   default=self.use_debugger),

            Option('-r', '--reload',
                   action='store_true',
                   dest='use_reloader',
                   help=('monitor Python files for changes (not 100%% safe '
                         'for production use)'),
                   default=self.use_reloader),
            Option('-R', '--no-reload',
                   action='store_false',
                   dest='use_reloader',
                   help='do not monitor Python files for changes',
                   default=self.use_reloader),
            Option('-u', '--url',
                   action='store_false',
                   dest='url',
                   help='Default url for initial display screen',
                   default=self.default_url)
        )
        return options

    def __call__(self, app, host, port, use_debugger, use_reloader, url):
        # override the default runserver command to start a Socket.IO server
        if use_debugger is None:
            use_debugger = app.debug
            if use_debugger is None:
                use_debugger = True
        if use_reloader is None:
            use_reloader = app.debug
        socketio.run(app,
                     host=host,
                     port=port,
                     debug=use_debugger,
                     use_reloader=use_reloader,
                     **self.server_options)


class CleanDB(Command):
    """
    Drops the database. A new database will be populated with tables, on the next application start.
    """

    def run(self):
        app = create_app()
        db.drop_all(app=app)


class PyTest(Command):
    """
    Runs all unittests. You MUST make sure that all clusters configured are running for the tests to pass!
    """
    version = None

    def get_options(self):
        options = (
            Option('-E', '--esv',
                   dest='version',
                   default=self.version),

        )
        return options

    def run(self, version):
        import pytest

        tests_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'tests')
        sys.path.append(os.path.abspath(tests_path))

        default_test_args = [
            tests_path,
            '--ignore=node_modules',
            '--verbose',
            '--color=yes',
            '-c=' + tests_path + '/pytest.ini',
            '--docker-compose-remove-volumes',
            # '-s',  # WARNING: Turning this on, breaks the tests on a Mac.
            '--cov=' + tests_path,
            '--cov-report=html:' + tests_path + '/htmlcov',
            '--self-contained-html'
        ]

        sig = None
        if version is None:
            hq_args = [
                '--docker-compose=' + tests_path + '/hq_docker-compose.yml',
                '--html=' + tests_path + '/htmlout/hq_ops.html',
                '-m=hq_ops'
            ]
            sig = pytest.main(default_test_args + hq_args)

        if version is not None:
            if "2" in version:
                v2_args = ['--docker-compose=' + tests_path + '/v2_docker-compose.yml', '-m=es_versions',
                           '--html=' + tests_path + '/htmlout/es_2.html']
                sig = pytest.main(default_test_args + v2_args)

            if "5" in version:
                v5_args = ['--docker-compose=' + tests_path + '/v5_docker-compose.yml', '-m=es_versions',
                           '--html=' + tests_path + '/htmlout/es_5.html']
                sig = pytest.main(default_test_args + v5_args)

            if "6" in version:
                v6_args = ['--docker-compose=' + tests_path + '/v6_docker-compose.yml', '-m=es_versions',
                           '--html=' + tests_path + '/htmlout/es_6.html']
                sig = pytest.main(default_test_args + v6_args)

            if "7" in version:
                v7_args = ['--docker-compose=' + tests_path + '/v7_docker-compose.yml', '-m=es_versions',
                           '--html=' + tests_path + '/htmlout/es_7.html']
                sig = pytest.main(default_test_args + v7_args)

        return sig


manager.add_command("runserver", Server())
manager.add_command('clean-db', CleanDB)
manager.add_command('run-tests', PyTest)

"""
This draws on https://github.com/miguelgrinberg/Flask-Migrate

 To upgrade DB:
 1. python manage.py db migrate (GENERATE the migration scripts)
 2. python manage.py db upgrade (PERFORMS the update ddl)
"""
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
