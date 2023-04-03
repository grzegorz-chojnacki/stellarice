#!/usr/bin/env python3

import re
import sys
import json
from typing import List, Dict, Tuple

SCRIPT_NAME = sys.argv[0]
DEFAULT_ROOT = '$HOME/.steam/steam/steamapps/common/Stellaris'
ARGS = sys.argv[1:]

RULES = {
    'NOT',
    'OR',
    'NOR',
    'AND',
    'NAND',
}

SUPPORTED_PROPS = {
    *RULES,
    'cost',
    'allowed_archetypes',
    'species_class',
    'opposites',
    'value',
    'always',
    'possible',
    'playable',
    'potential',
    'authority',
    'civics',
    'ethics',
}

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


def flatten(arr):
    if not isinstance(arr, List):
        return arr

    result = []
    for a in arr:
        if isinstance(a, List):
            result += a
        else:
            result.append(a)
    return result


def find(arr, name, default=[]):
    return next((v for k, v in arr if k == name), default)


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


def create_rule(type, entries):
    entries = flatten([entry for entry in entries if entry is not None])
    if len(entries) == 0:
        return {'type': 'AND', 'entries': []}  # Default rule
    else:
        return {
            'type': type,
            'entries': entries
        }


def traits_mapper(id, data):
    return {
        'id': id,
        'cost': find(data, 'cost', 0),
        'rule': create_rule('AND', [
            create_rule('OR', find(data, 'allowed_archetypes')),
            create_rule('NOR', find(data, 'opposites'))
        ])
    }


def origins_mapper(id, data):
    playable = find(find(data, 'playable'), 'always', True)
    if not playable:
        return None
    return {
        'id': id,
        'rule': create_rule('AND', rule_mapper(find(data, 'possible')))
    }


def civics_mapper(id, data):
    playable = find(find(data, 'playable'), 'always', True)
    if not playable:
        return None

    entries = rule_mapper(find(data, 'potential')) + \
        rule_mapper(find(data, 'possible'))

    return {
        'id': id,
        'rule': create_rule('AND', entries)
    }


MAPPERS = {
    'traits': traits_mapper,
    'origins': origins_mapper,
    'civics': civics_mapper,
}


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


def filter_supported(data):
    '''Remove unsupported tokens'''
    if isinstance(data, Tuple):
        k, v = data
        if k in SUPPORTED_PROPS:
            return (k, filter_supported(v))
        else:
            return None
    elif isinstance(data, List):
        result = []
        for v in data:
            v = filter_supported(v)
            if v:
                result.append(v)
        return result
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
    print(list(tokens))
    sys.exit(1)
    data = pairup(data)
    data = [(k, filter_supported(v)) for k, v in data]
    data = infer_types(data)
    return data


if __name__ == '__main__':
    if len(ARGS) != 1:
        print(f'usage: {SCRIPT_NAME} <STELLARIS_ROOT_PATH>')
        print(f'       e.g. {SCRIPT_NAME} "{DEFAULT_ROOT}"')
        sys.exit(1)

    root_path = ARGS[0]
    localisation_path = root_path+'/localisation/english/l_english.yml'

    data = {}
    for (item_domain, item_kinds) in PATHS.items():
        data[item_domain] = {}
        for (item_kind, path) in item_kinds.items():
            data[item_domain][item_kind] = {}
            with open(root_path+path) as f:
                parsed = parse(f.read())
                for item, value in parsed:
                    value = MAPPERS[item_domain](item, value)
                    if value:
                        data[item_domain][item_kind][item] = value
    print(json.dumps(data, indent=4))
