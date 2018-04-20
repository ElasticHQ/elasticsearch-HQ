#!/usr/bin/python3

from setuptools import setup, find_packages

requirements = open('requirements.txt').read()

setup(
        name='elastichq',
        version='1',
        description='elasticsearch headquater management webinterface',
        author='royrusso',
        author_email='',
        packages=find_packages(),
        include_package_data=True,
        scripts=[
            'scripts/elastichq',
            ],
        install_requires=requirements,
        )

