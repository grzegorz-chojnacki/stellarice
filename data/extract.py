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

RULES = {'NOT', 'OR', 'NOR', 'AND', 'NAND'}
RULE_LISTS = {'possible', 'potential'}
RULE_DOMAINS = {'authority', 'civics', 'ethics',
                'origin', 'species_class', 'species_archetype'}

ALWAYS_LISTS = {*RULES, *RULE_DOMAINS, *RULE_LISTS}

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


def trait_mapper(attribute, data):
    if data.get('initial', True):
        return {
            'id': attribute,
            'cost': data.get('cost', 0),
            'allowed_archetypes': data.get('allowed_archetypes', []),
            'species_class': data.get('species_class', []),
            'opposites': data.get('opposites', []),
        }
    else:
        return None


def origin_mapper(attribute, data):
    if data.get('playable', {}).get('always', True):
        return {
            'id': attribute,
            'possible': data.get('possible', []),
        }
    else:
        return None


def civic_mapper(attribute, data):
    if True:
        return {
            'id': attribute,
            'possible': data.get('possible', []),
            'potential': data.get('potential', []),
        }
    else:
        return None


def normalize_rule_names(x):
    if isinstance(x, Tuple):
        key, value = x
        if key in {'authority', 'civics', 'ethics', 'origin'}:
            return ('AND', value)
    return x


def remove_text(x):
    if isinstance(x, Dict) and 'text' in x:
        return None
    return x


def assign_rule_types(x):
    if isinstance(x, Tuple):
        k, v = x
        if k in RULE_LISTS:
            return (k, assign_rule_types({'AND': v }))
    elif isinstance(x, Dict):
        k, v = next(iter(x.items()))
        if k in RULES:
            return {'type': k, 'entries': v}
    return x


def map_not_none(fn, xs):
    return filter(lambda x: x is not None, map(fn, xs))


def collection_mapper(data, fn):
    if isinstance(data, Dict):
        return {k: collection_mapper(v, fn) for k, v in map_not_none(fn, data.items())}
    elif isinstance(data, List):
        return [collection_mapper(v, fn) for v in map_not_none(fn, data)]
    else:
        return data


MAPPERS = {
    'traits':  trait_mapper,
    'origins': origin_mapper,
    'civics':  civic_mapper,
}


def prop_kind(prop):
    return 'list' if prop in ALWAYS_LISTS else 'dict'


def dictify(data, assuming='dict'):
    '''Transform tuples and list of tuples into dicts and lists'''
    # Single tuples are always interpreted as one-key dicts
    if isinstance(data, Tuple):
        k, v = data
        return {k: dictify(v, assuming=prop_kind(k))}
    # Lists could either contain key-value pairs for dict or just values
    elif isinstance(data, List):
        if assuming == 'dict' and all(isinstance(t, Tuple) for t in data):
            return {k: dictify(v, prop_kind(k)) for k, v in data}
        else:
            return [dictify(v) for v in data]
    return data


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
    text = text.replace('\s+', '')
    # text = re.sub(r'\s+', ' ', text)
    return text.split()


def make_tree(tokens):
    '''Convert the token stream to a token tree'''
    data = []
    for token in tokens:
        if token == '{':
            # Tokens from the nested trees will be consumed
            data.append(make_tree(tokens))
        elif token == '}':
            # End of the current tree, return collected data
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
    '''Parse Clausewitz format into a token tree'''
    data = iter(tokenize(text))
    data = make_tree(data)

    # Transform into dict
    data = pairup(data)
    data = dictify(data)
    data = infer_types(data)

    # Apply some intermediate mappings
    data = collection_mapper(data, remove_text)
    data = collection_mapper(data, normalize_rule_names)
    data = collection_mapper(data, assign_rule_types)
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
        mapper = MAPPERS[item_domain]
        for (item_kind, path) in item_kinds.items():
            data[item_domain][item_kind] = []
            with open(root_path+path) as f:
                parsed = parse(f.read())
                for k, v in parsed.items():
                    mapped = mapper(k, v)
                    if mapped:
                        data[item_domain][item_kind].append(mapped)
    print(json.dumps(data, indent=4))
