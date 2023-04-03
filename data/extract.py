#!/usr/bin/env python3

import re
import sys
import json
from typing import List, Dict, Tuple

SCRIPT_NAME = sys.argv[0]
ARGS = sys.argv[1:]

RULES = ['OR', 'AND', 'NOT', 'NOR']

PATHS = {
    'traits': {
        'special':   '/common/traits/02_species_traits_basic_characteristics.txt',
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


def trait_mapper(attribute, data):
    return data


def origin_mapper(attribute, data):
    return data


def civic_mapper(attribute, data):
    return data

MAPPERS = {
    'traits':  trait_mapper,
    'origins': origin_mapper,
    'civics':  civic_mapper,
}


def isfloat(x):
    try:
        float(x)
        return True
    except:
        return False


def tokenize(text):
    """Extract tokens by splitting and transforming the input text"""
    # Remove comment
    text = re.sub(r'#.*', '', text)
    # Ensure proper spacing around special characters
    text = text.replace('=', ' = ')
    text = text.replace('{', ' { ').replace('}', ' } ')
    # Fold whitespace
    text = text.replace('\s+', ' ')
    return text.split()


def blockify(tokens):
    """Extract nested blocks"""
    data = []
    for token in tokens:
        if token == '{':
            # Tokens from the nested block will be consumed
            data.append(blockify(tokens))
        elif token == '}':
            # End of the current block, return collected data
            return data
        else:
            data.append(token)
    return data


def pairify(tokens):
    """Convert tokens to key-value pairs"""
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
                data.append((key, pairify(token)))
            else:
                data.append((key, token))
            state = 'key'

        prev = token

    return data


def dictify(data):
    """Transform list of tuples into dicts and lists"""
    if isinstance(data, List):
        if all(isinstance(t, Tuple) for t in data):
            result = {}
            for k, v in data:
                if k in result:
                    if not isinstance(result[k], List):
                        result[k] = [result[k]]
                    result[k].append(dictify(v))
                else:
                    result[k] = dictify(v)
            return result
        else:
            return [dictify(x) for x in data]
    return data


def typify(data):
    """Infer and cast to types based on data contents"""
    if isinstance(data, List):
        return [typify(v) for v in data]
    elif isinstance(data, Tuple):
        k, v = data
        return (k, typify(v))
    elif isinstance(data, Dict):
        return {k: typify(v) for k, v in data.items()}
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
    """Parse Clausewitz format"""
    tokens = iter(tokenize(text))
    data = blockify(tokens)
    data = pairify(data)
    data = dictify(data)
    data = typify(data)
    return data


if __name__ == '__main__':
    if len(ARGS) != 1:
        print(f'usage: {SCRIPT_NAME} <STELLARIS_ROOT_PATH>')
        print(
            f'       e.g. {SCRIPT_NAME} "/home/{{USER_NAME}}/Games/Steam/Stellaris"')
        sys.exit(1)

    root_path = ARGS[0]
    localisation_path = root_path+'/localisation/english/l_english.yml'

    data = {}
    for (attribute_domain, attribute_kinds) in PATHS.items():
        data[attribute_domain] = {}
        for (attribute_kind, path) in attribute_kinds.items():
            data[attribute_domain][attribute_kind] = {}
            with open(root_path+path) as f:
                parsed = parse(f.read())
                data[attribute_domain][attribute_kind] = parsed

    print(json.dumps(data, indent=4))
