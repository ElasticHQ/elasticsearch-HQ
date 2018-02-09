# !/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'royrusso'

import os

from flask_migrate import MigrateCommand
from flask_script import Command, Manager

from elastichq.factory import create_app
from elastichq.globals import db

app = create_app()
manager = Manager(app)


class CleanDB(Command):
    """
    Drops the database. A new database will be populated with tables, on the next application start.
    """

    def run(self):
        db.drop_all(app=app)


class PyTest(Command):
    """
    Runs all unittests. You MUST make sure that all clusters configured are running for the tests to pass!
    """

    def run(self):
        tests_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'tests')
        import pytest
        exit_code = pytest.main([tests_path, '--verbose'])
        return exit_code


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
