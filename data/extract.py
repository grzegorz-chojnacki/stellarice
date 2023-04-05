#!/usr/bin/env python3

import re
import sys
import json
import yaml
from typing import List, Dict, Tuple, Iterable
import pprint
pp = pprint.PrettyPrinter().pprint

SCRIPT_NAME = sys.argv[0]
DEFAULT_ROOT = '$HOME/.steam/steam/steamapps/common/Stellaris'
ARGS = sys.argv[1:]

RULES = {'NOT', 'OR', 'NOR', 'AND', 'NAND'}
RULE_LISTS = {'possible', 'potential'}
RULE_DOMAINS = {'authority', 'civics', 'ethics', 'country_type',
                'origin', 'species_class', 'species_archetype'}

ALWAYS_LISTS = {*RULES, *RULE_DOMAINS, *RULE_LISTS}

POP_ID_MAP = {
    'BIOLOGICAL': 'pop_biological',
    'BOTANICAL':  'pop_botanical',
    'ROBOT':      'pop_mechanical',
    'LITHOID':    'pop_lithoid',
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
    },
    'authority': {
        'normal': '/common/governments/authorities/00_authorities.txt',
    }
}


def make_rule(type, entries):
    return {'type': type, 'entries': entries}


def make_ethic(cost, rule):
    return {'cost': cost, 'rule': rule}


COL_ALIGNMENT = ['ethic_fanatic_authoritarian', 'ethic_authoritarian',
                 'ethic_fanatic_egalitarian',   'ethic_egalitarian']
XEN_ALIGNMENT = ['ethic_fanatic_xenophobe',     'ethic_xenophobe',
                 'ethic_fanatic_xenophile',     'ethic_xenophile']
MIL_ALIGNMENT = ['ethic_fanatic_militarist',    'ethic_militarist',
                 'ethic_fanatic_pacifist',      'ethic_pacifist']
SPI_ALIGNMENT = ['ethic_fanatic_spiritualist',  'ethic_spiritualist',
                 'ethic_fanatic_materialist',   'ethic_materialist']
COL_RULE = make_rule('NOR', COL_ALIGNMENT)
XEN_RULE = make_rule('NOR', XEN_ALIGNMENT)
MIL_RULE = make_rule('NOR', MIL_ALIGNMENT)
SPI_RULE = make_rule('NOR', SPI_ALIGNMENT)

DATA = {
    'ethics': {
        'normal': {
            'ethic_fanatic_authoritarian': make_ethic(2, COL_RULE),
            'ethic_authoritarian':         make_ethic(1, COL_RULE),
            'ethic_fanatic_egalitarian':   make_ethic(2, COL_RULE),
            'ethic_egalitarian':           make_ethic(1, COL_RULE),
            'ethic_fanatic_xenophobe':     make_ethic(2, XEN_RULE),
            'ethic_xenophobe':             make_ethic(1, XEN_RULE),
            'ethic_fanatic_xenophile':     make_ethic(2, XEN_RULE),
            'ethic_xenophile':             make_ethic(1, XEN_RULE),
            'ethic_fanatic_militarist':    make_ethic(2, MIL_RULE),
            'ethic_militarist':            make_ethic(1, MIL_RULE),
            'ethic_fanatic_pacifist':      make_ethic(2, MIL_RULE),
            'ethic_pacifist':              make_ethic(1, MIL_RULE),
            'ethic_fanatic_spiritualist':  make_ethic(3, SPI_RULE),
            'ethic_spiritualist':          make_ethic(1, SPI_RULE),
            'ethic_fanatic_materialist':   make_ethic(2, SPI_RULE),
            'ethic_materialist':           make_ethic(1, SPI_RULE),
            'ethic_gestalt_consciousness': make_ethic(3, make_rule('NOR', [])),
        }
    },
    'pops': {
        'normal': {
            'pop_biological': {},
            'pop_botanic':    {},
            'pop_lithoid':    {},
            'pop_mechanic':   {},
        }
    },
}


def trait_mapper(attribute, data):
    if data.get('initial', True):
        entries = data.get('allowed_archetypes', [])
        if data.get('species_class') == ['PLANT', 'FUN']:
            entries = ['BOTANICAL' if x ==
                       'BIOLOGICAL' else x for x in entries]
        return {
            'id': attribute,
            'cost': data.get('cost', 0),
            'rule': make_rule('AND', entries),
            'opposites': data.get('opposites', []),
        }
    else:
        return None


def origin_mapper(attribute, data):
    if data.get('playable', {}).get('always', True):
        return {
            'id': attribute,
            'rule': data.get('possible', {}),
        }
    else:
        return None


def civic_mapper(attribute, data):
    possible = data.get('possible', {}).get('entries', [])
    potential = data.get('potential', {}).get('entries', [])
    return {
        'id': attribute,
        'rule': make_rule('AND', possible + potential),
    }


def authority_mapper(attribute, data):
    potential = data.get('potential', {}).get('entries', [{}])
    if potential[0].get('country_type', [{}])[0].get('value') != 'ai_empire':
        return {
            'id': attribute,
            'rule': data.get('possible', []),
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
            return (k, assign_rule_types({'AND': v}))
    elif isinstance(x, Dict):
        k, v = next(iter(x.items()))
        if k in RULES:
            return {'type': k, 'entries': v}
    return x


def load_dictionary(path):
    text = ''
    with open(path) as f:
        for n, line in enumerate(f.readlines()):
            sp = line.split('"')
            if len(sp) > 1:
                line = sp[0] + '"' + ' '.join(sp[1:-1]) + '"' + sp[-1]
            text += re.sub(r':.*? ', ': ', line, count=1)
    return yaml.safe_load(text)['l_english']


def translate(dictionary, data):
    if 'id' in data:
        data['name'] = dictionary.get(data['id'], data['id'])


def normalize_pop(x):
    if isinstance(x, str):
        return POP_ID_MAP.get(x, x)
    return x


def map_not_none(fn, xs):
    return filter(lambda x: x is not None, map(fn, xs))


def collection_mapper(data, fn):
    if isinstance(data, Dict):
        return {k: collection_mapper(v, fn) for k, v in map_not_none(fn, data.items())}
    elif isinstance(data, List):
        return [collection_mapper(v, fn) for v in map_not_none(fn, data)]
    else:
        return fn(data)


MAPPERS = {
    'traits':  trait_mapper,
    'origins': origin_mapper,
    'civics':  civic_mapper,
    'authority':  authority_mapper,
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
    data = collection_mapper(data, normalize_pop)
    return data


if __name__ == '__main__':
    if len(ARGS) != 1:
        print(f'usage: {SCRIPT_NAME} <STELLARIS_ROOT_PATH>')
        print(f'       e.g. {SCRIPT_NAME} "{DEFAULT_ROOT}"')
        sys.exit(1)

    root_path = ARGS[0]
    localisation_path = root_path+'/localisation/english/l_english.yml'

    for item_domain, item_kinds in PATHS.items():
        DATA[item_domain] = {}
        mapper = MAPPERS[item_domain]
        for item_kind, path in item_kinds.items():
            DATA[item_domain][item_kind] = {}
            with open(root_path+path) as f:
                parsed = parse(f.read())
                for k, v in parsed.items():
                    mapped = mapper(k, v)
                    if mapped:
                        DATA[item_domain][item_kind][k] = mapped

    dictionary = load_dictionary(localisation_path)

    for item_domain, item_kinds in DATA.items():
        for item_kind, items in item_kinds.items():
            handle = DATA[item_domain][item_kind]
            for item, value in items.items():
                handle[item]['id'] = item
                translate(dictionary, value)
    print(json.dumps(DATA, indent=4))
