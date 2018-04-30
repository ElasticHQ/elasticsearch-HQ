import os
import sys
import json


def find_config(name, paths=None, etc=True, user=True, cwd=True, module=True, config=True, default=None):
    """
    search for a file in multiple places returning first match
    paths:  directories to search
    etc: add /etc/elastich in search path
    user: add users home directory in search path
    cwd: add current working directory in search path
    module: add elastichq module directory in search path
    config: add elastichq.config directory in search path
    """
    def ifadd(test, prefix):
        if test:
            paths.append(os.path.join(prefix, name))

    if paths is None:
        paths = []
    ifadd(etc, '/etc/elastic-hq')
    ifadd(user, '~')
    ifadd(cwd, os.getcwd())
    base = os.path.dirname(os.path.abspath(__file__))
    ifadd(module, base)
    ifadd(config, os.path.join(base, 'config'))
    for filename in paths:
        try:
            with open(filename, 'r') as f:
                result = json.load(f)
                print('loading config %s' % filename)
                return result
        except (FileNotFoundError, NotADirectoryError):
            continue
    print('config %s not found, searched %s' % (name, ','.join(paths)),
          file=sys.stderr)
    if default is None:
        sys.exit(1)
    else:
        return default
