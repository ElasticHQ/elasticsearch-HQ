#!/usr/bin/python3

from setuptools import setup, find_packages

requirements = open('requirements.txt').read()

setup(
        name='elastichq',
        version='3.3.0',
        description='elasticsearch headquarter management webinterface',
        author='royrusso',
        author_email='',
        packages=find_packages(),
        include_package_data=True,
        scripts=[
            'scripts/elastichq',
            ],
        install_requires=requirements,
        )

