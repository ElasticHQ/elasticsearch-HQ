"""
.. module:: DiagnosticsService

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""

import ast
import operator as op

import jmespath

from elastichq.common.utils import get_key_from_dict, string_to_bool
from elastichq.globals import LOG, REQUEST_TIMEOUT
from .ConnectionService import ConnectionService
from .DiagnosticsRules import action_rules, cache_rules, fs_rules, memory_rules, network_rules
from .NodeService import NodeService


class DiagnosticsService:
    """

    """

    def get_diagnostics_summary(self, cluster_name):
        """
        Returns diagnostics information after running over diag-rules.

        :param cluster_name:
        :return:
        """
        connection = ConnectionService().get_connection(cluster_name)
        node_stats = connection.nodes.stats(metric="fs,jvm,os,process,indices,http", request_timeout=REQUEST_TIMEOUT)
        node_ids = list(node_stats['nodes'].keys())

        nodes = []
        for node_id in node_ids:
            node_dict = node_stats['nodes'][node_id]
            node = {"node_id": node_id,
                    "name": jmespath.search("name", node_dict),
                    "host": jmespath.search("host", node_dict)
                    }
            if connection.version.startswith("2"):
                node.update({"is_master_node": string_to_bool(jmespath.search("attributes.master", node_dict))})

                node_info = NodeService().get_node_info(cluster_name, node_id)
                if node_info:
                    node_settings = jmespath.search("nodes.*.settings", node_info)[0].get("node", None)
                    if node_settings is not None:
                        node.update({"is_data_node": bool(node_settings.get("data", False))})

            else:
                node_roles = jmespath.search("roles", node_dict)
                if "master" in node_roles:
                    node.update({"is_master_node": True})
                else:
                    node.update({"is_master_node": False})

                if "data" in node_roles:
                    node.update({"is_data_node": True})
                else:
                    node.update({"is_data_node": False})

            # apply rules
            node['cache_rules'] = self.generate_rules(cache_rules(), node_dict)
            node['fs_rules'] = self.generate_rules(fs_rules(), node_dict)
            node['action_rules'] = self.generate_rules(action_rules(), node_dict)
            node['memory_rules'] = self.generate_rules(memory_rules(), node_dict)
            node['network_rules'] = self.generate_rules(network_rules(), node_dict)

            nodes.append(node)

        return nodes

    def generate_rules(self, rules, node_dict):
        results = []
        for rule in rules:
            try:
                formula = rule.get('formula', None)
                formula_keys = rule.get('formula_keys', None)
                upper_limit = rule.get('upper_limit', None)
                lower_limit = rule.get('lower_limit', None)
                rule_label = rule.get('label', None)
                formula_repl = formula
                value = 0

                if formula is None:  # this is likely just a single value
                    value = get_key_from_dict(formula_keys, node_dict)
                else:  # have to compute value
                    if formula_keys is not None:
                        keys = formula_keys.split('@@')
                        for key in keys:
                            part_value = get_key_from_dict(key, node_dict)
                            if part_value is None:
                                part_value = 0
                            else:
                                formula_repl = formula_repl.replace(key, str(part_value))
                        value = self.calculate_rule(formula_repl)

                status = None
                if upper_limit is not None or lower_limit is not None:
                    status = self.calculate_threshold(value, upper_limit, lower_limit)

                one_rule = {"rule_label": rule_label, "rule_comment": rule.get("comment", None),
                            "rule_formula": formula, "formula_repl": formula_repl,
                            "rule_value": value, "status": status, "format": rule.get('format', None),
                            "unit": rule.get("unit", None), "upper_limit": upper_limit, "lower_limit": lower_limit}
                results.append(one_rule)
            except Exception as ex:
                LOG.error(ex, exc_info=True)

        return results

    def calculate_rule(self, formula_repl):
        """
        Parses the formula string and returns a value.

        :param formula_repl:
        :return:
        """
        return eval_(ast.parse(formula_repl, mode='eval').body)

    def calculate_threshold(self, value, upper_limit, lower_limit):
        if upper_limit is not None:
            if value <= upper_limit[0]:
                return "PASS"
            else:
                if value <= upper_limit[1]:
                    return "WARN"
                else:
                    return "DANGER"
        if lower_limit is not None:
            if len(lower_limit) == 3 and value == 0:
                return "PASS"
            if value >= lower_limit[0]:
                return "PASS"
            else:
                if value >= lower_limit[1]:
                    return "WARN"
                else:
                    return "DANGER"


# supported operators
operators = {ast.Add: op.add, ast.Sub: op.sub, ast.Mult: op.mul,
             ast.Div: op.truediv, ast.Pow: op.pow, ast.BitXor: op.xor,
             ast.USub: op.neg}


def eval_expr(expr):
    """
    >>> eval_expr('2^6')
    4
    >>> eval_expr('2**6')
    64
    >>> eval_expr('1 + 2*3**(4^5) / (6 + -7)')
    -5.0
    """
    return eval_(ast.parse(expr, mode='eval').body)


def eval_(node):
    try:
        if isinstance(node, ast.Num):  # <number>
            return node.n
        elif isinstance(node, ast.BinOp):  # <left> <operator> <right>
            return operators[type(node.op)](eval_(node.left), eval_(node.right))
        elif isinstance(node, ast.UnaryOp):  # <operator> <operand> e.g., -1
            return operators[type(node.op)](eval_(node.operand))
        else:
            raise TypeError(node)
    except ZeroDivisionError:
        return 0
