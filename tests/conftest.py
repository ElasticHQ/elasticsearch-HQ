#!/usr/bin/env python3

import pytest

from tests.test_fixture import TestFixture
from elastichq.config import test_settings


def pytest_sessionstart(session):
    pass


def pytest_sessionfinish(session, exitstatus):
    pass


@pytest.yield_fixture(scope='session')
def fixture(request):
    with TestFixture(test_settings) as fix:
        yield fix
