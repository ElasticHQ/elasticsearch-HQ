import jmespath


def string_to_bool(value):
    valid = {'true': True, 't': True, '1': True,
             'false': False, 'f': False, '0': False,
             }

    if isinstance(value, bool):
        return value

    if not isinstance(value, str):
        raise ValueError('invalid literal for boolean. Not a string.')

    lower_value = value.lower()
    if lower_value in valid:
        return valid[lower_value]
    else:
        raise ValueError('invalid literal for boolean: "%s"' % value)


def get_key_from_dict(key, dict):
    return jmespath.search(key, dict)


def merge_two_dicts(x, y):
    """
    https://stackoverflow.com/a/26853961/831697
    :param x:
    :param y: y-values will replace x-values.
    :return:
    """
    z = x.copy()  # start with x's keys and values
    z.update(y)  # modifies z with y's keys and values & returns None
    return z
