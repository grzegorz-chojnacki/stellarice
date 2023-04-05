#!/usr/bin/env python3

import re
import sys
import json
from typing import List, Dict, Tuple, Iterable
import pprint
pp = pprint.PrettyPrinter().pprint

SCRIPT_NAME = sys.argv[0]
DEFAULT_ROOT = '$HOME/.steam/steam/steamapps/common/Stellaris'
ARGS = sys.argv[1:]

PATHS = {
    'traits': {
        # 'special':   '/common/traits/02_species_traits_basic_characteristics.txt',
        'normal':    '/common/traits/04_species_traits.txt',
        'mechanic':  '/common/traits/05_species_traits_robotic.txt',
        'toxoid':    '/common/traits/09_tox_traits.txt',
    },
    'origins': {
        'normal':    '/common/governments/civics/00_origins.txt',
    },
    'civics': {
        'normal':    '/common/governments/civics/00_civics.txt',
        'gestalt':   '/common/governments/civics/02_gestalt_civics.txt',
        'corporate': '/common/governments/civics/03_corporate_civics.txt',
    }
    # 'pops'
    # 'ethics'
    # 'authority'
}

STRING_LIST_SCHEMA = {
    'type': list,
    'items': {'type': str},
    'default': [],
}

RULE_SCHEMA = {
    'type': dict,
    'properties': {}
}

RULE_LIST_SCHEMA = {
    'type': list,
    'items': RULE_SCHEMA,
    'default': []
}

# Recursive rule nesting
RULE_KEYS = ['NOT', 'OR', 'NOR', 'AND', 'NAND',
             'authority', 'ethics', 'civics']
for key in RULE_KEYS:
    RULE_SCHEMA['properties'][key] = RULE_LIST_SCHEMA

RULE_LIST_SCHEMA['items'] = RULE_SCHEMA

PLAYABLE_SCHEMA = {
    'type': dict,
    'properties': {
        'always': {
            'type': bool,
            'default': True,
        }
    },
}

TRAIT_SCHEMA = {
    'type': dict,
    'properties': {
        'cost': {
            'type': float,
            'default': 0,
        },
        'allowed_archetypes': STRING_LIST_SCHEMA,
        'opposite': STRING_LIST_SCHEMA,
    }
}

ORIGIN_SCHEMA = {
    'type': dict,
    'properties': {
        'playable': PLAYABLE_SCHEMA,
        'possible': RULE_LIST_SCHEMA,
    }
}

CIVIC_SCHEMA = {
    'type': dict,
    'properties': {
        'playable': PLAYABLE_SCHEMA,
        'potential': RULE_LIST_SCHEMA,
        'possible': RULE_LIST_SCHEMA,
    }
}


def select(arr, name, default=[]):
    for a in arr:
        if isinstance(a, Tuple):
            k, v = a
            if k == name:
                return v
    return default


def apply_schema(schema, data):
    data_type = schema['type']
    result = data

    if isinstance(data, Tuple):
        k, v = data
        result = {k: apply_schema(schema, v)}
    elif isinstance(data, List):
        if data_type == dict:
            result = {}
            for prop, prop_schema in schema['properties'].items():
                value = select(data, prop, None)
                default = prop_schema.get('default')
                if value is not None:
                    result[prop] = apply_schema(prop_schema, value)
                elif default:
                    result[prop] = default
        elif data_type == list:
            result = []
            item_schema = schema['items']
            for item in data:
                result.append(apply_schema(item_schema, item))
    return result


def remove_empty_keys(d):
    return {k: v for k, v in d.items() if v is not None}


def flatten(x):
    if not isinstance(x, List):
        return x

    result = []
    for a in x:
        if isinstance(a, List):
            result += a
        else:
            result.append(a)
    return result


def rule_mapper(data):
    if isinstance(data, List):
        return flatten([rule_mapper(v) for v in data])

    if isinstance(data, Tuple):
        k, v = data
        if k in RULES:
            return {
                'type': k,
                'entries': flatten(rule_mapper(v))
            }
        if k == 'value':
            return v
        return flatten(rule_mapper(v))
    return flatten(data)


def isfloat(x):
    try:
        float(x)
        return True
    except:
        return False


def tokenize(text):
    '''Extract tokens by splitting and transforming the input text'''
    # Remove comment
    text = re.sub(r'#.*', '', text)
    # Ensure proper spacing around special characters
    text = text.replace('=', ' = ')
    text = text.replace('{', ' { ').replace('}', ' } ')
    # Fold whitespace
    text = text.replace('\s+', ' ')
    return text.split()


def extract_blocks(tokens):
    '''Extract nested blocks from a token stream'''
    data = []
    for token in tokens:
        if token == '{':
            # Tokens from the nested block will be consumed as they are streamed
            data.append(extract_blocks(tokens))
        elif token == '}':
            # End of the current block, return collected data
            return data
        else:
            data.append(token)
    return data


def pairup(tokens):
    '''Convert tokens to key-value pairs'''
    data = []
    state = 'key'
    prev = None
    key = None

    # There is no 'key=value' pair so it must be an array
    if not '=' in tokens:
        return tokens

    for token in tokens:
        # Encountered '=', the previous token must be a key
        if token == '=' and state == 'key':
            key = prev
            state = 'value'
        elif state == 'value':
            if isinstance(token, List):
                data.append((key, pairup(token)))
            else:
                data.append((key, token))
            state = 'key'

        prev = token

    return data


def infer_types(data):
    '''Infer and cast to types based on data contents'''
    if isinstance(data, List):
        return [infer_types(v) for v in data]
    elif isinstance(data, Tuple):
        k, v = data
        return (k, infer_types(v))
    elif isinstance(data, Dict):
        return {k: infer_types(v) for k, v in data.items()}
    elif isinstance(data, str):
        if data[0] == '"':
            return data[1:-1]  # Remove quotes
        elif data == 'yes':
            return True
        elif data == 'no':
            return False
        elif isfloat(data):
            return float(data)
    return data


def parse(text):
    '''Parse Clausewitz format'''
    tokens = iter(tokenize(text))
    data = extract_blocks(tokens)
    data = pairup(data)
    data = infer_types(data)
    return data


if __name__ == '__main__':
    if len(ARGS) != 1:
        print(f'usage: {SCRIPT_NAME} <STELLARIS_ROOT_PATH>')
        print(f'       e.g. {SCRIPT_NAME} "{DEFAULT_ROOT}"')
        sys.exit(1)

    root_path = ARGS[0]
    localisation_path = root_path+'/localisation/english/l_english.yml'

    SCHEMAS = {
        'traits': TRAIT_SCHEMA,
        'origins': ORIGIN_SCHEMA,
        'civics': CIVIC_SCHEMA,
    }

    data = {}
    for (item_domain, item_kinds) in PATHS.items():
        data[item_domain] = {}
        for (item_kind, path) in item_kinds.items():
            data[item_domain][item_kind] = {}
            with open(root_path+path) as f:
                parsed = parse(f.read())
                schema = SCHEMAS[item_domain]
                for item, value in parsed:
                    value = apply_schema(schema, value)
                    if value:
                        data[item_domain][item_kind][item] = value
    print(json.dumps(data, indent=4))
