#!/usr/bin/env python3

import re
import sys
import json
import yaml
import pickle
from typing import List, Dict, Tuple, Iterable

import pprint
pp = pprint.PrettyPrinter().pprint


def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


SCRIPT_NAME = sys.argv[0]
DEFAULT_ROOT = '$HOME/.steam/steam/steamapps/common/Stellaris'
DICTIONARY_PATHS = {
    'pickle': './.dictionary.bin',
    # Only English for now
    'game': [
        '/localisation/english/l_english.yml',
        '/localisation/english/toxoids_l_english.yml',
        '/localisation/english/plantoids_l_english.yml',
        '/localisation/english/federations_l_english.yml',
        '/localisation/english/necroids_l_english.yml',
        '/localisation/english/clone_army_l_english.yml',
        '/localisation/english/aquatics_l_english.yml',
        '/localisation/english/overlord_l_english.yml',
    ]
}
ARGS = sys.argv[1:]

RULES = {'NOT', 'OR', 'NOR', 'AND', 'NAND'}
RULE_LISTS = {'possible', 'potential'}
RULE_DOMAINS = {'authority', 'civics', 'ethics', 'origin', 'country_type',
                'allowed_archetypes',  'species_class', 'species_archetype',
                'opposites'}

ALWAYS_LISTS = {*RULES, *RULE_DOMAINS, *RULE_LISTS}


def make_rule(type, entries):
    return {'type': type, 'entries': entries}


def make_ethic(cost, rule):
    return {'cost': cost, 'rule': rule}


# We don't care that ethics exclude themselves as frontend handles it
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
    'pop': {
        'normal': {
            'pop_biologic': {'name': 'Biologic'},
            'pop_botanic':  {'name': 'Botanic'},
            'pop_lithoid':  {'name': 'Lithoid'},
            'pop_mechanic': {'name': 'Mechanic'},
        }
    },
    'traits': {
        'normal':    '/common/traits/04_species_traits.txt',
        'mechanic':  '/common/traits/05_species_traits_robotic.txt',
        'toxoid':    '/common/traits/09_tox_traits.txt',
    },
    'origins': {
        'normal':    '/common/governments/civics/00_origins.txt',
    },
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
    'authority': {
        'normal':    '/common/governments/authorities/00_authorities.txt',
    },
    'civics': {
        'normal':    '/common/governments/civics/00_civics.txt',
        'gestalt':   '/common/governments/civics/02_gestalt_civics.txt',
        'corporate': '/common/governments/civics/03_corporate_civics.txt',
    },
}

# These items will be removed from rule entries as they are not used during
# the empire creation
NOT_SUPPORTED = {
    # Ascension traits
    'trait_advanced_radiotrophic',
    'trait_advanced_phototrophic',
    'trait_advanced_scintillating',
    'trait_advanced_gaseous_byproducts',
    'trait_advanced_budding',
    'trait_advanced_volatile_excretions',
    'trait_voidling',
    'trait_erudite',
    'trait_robust',
    'trait_rapid_breeders_lithoid',
    'trait_vat_grown',
    'trait_nerve_stapled',
    'trait_tiyanki',
    'trait_fertile',
    'trait_adaptive_lithoid',
    # Not initial traits
    'trait_enigmatic_intelligence',
    'trait_cave_dweller',
    'trait_drake_scaled',
    'trait_clone_soldier_infertile',
    'trait_clone_soldier_infertile_full_potential',
    'trait_enigmatic_intelligence_poor',
    # No idea traits
    'trait_harvested_radiotrophic',
    # Only for enclaves
    'civic_ancient_preservers',
    # AI authority
    'auth_ancient_machine_intelligence',
    # Given from an event
    'civic_galactic_sovereign_megacorp',
}

##################
# Output mappers #
##################

# Functions below map third-level (e.g. civics > normal > *) items to their
# output form. They are responsible for the removal of properties which are not
# needed and skipping whole items from being exported.


def trait_mapper(data):
    if data.get('initial', True):
        return {
            'cost': data.get('cost', 0),
            'rule': data.get('rule', {}),
        }
    else:
        return None


def origin_mapper(data):
    if data.get('playable', {}).get('always', True):
        return {
            'rule': data.get('rule', {}),
        }
    else:
        return None


def civic_mapper(data):
    return {
        'rule': data.get('rule', {}),
    }


def authority_mapper(data):
    potential = data.get('potential', {}).get('entries', [{}])
    if 'ai_empire' not in potential[0].get('country_type', [{}]):
        return {
            'rule': data.get('rule', {}),
        }
    else:
        return None


MAPPERS = {
    'pop': lambda x: x,
    'traits':  trait_mapper,
    'origins': origin_mapper,
    'ethics': lambda x: x,
    'authority':  authority_mapper,
    'civics':  civic_mapper,
}

##################
# Transformators #
##################

# The functions below are meant to be used with the recmap function.
# They will be applied to each value, dict's key-value pairs, and list element
# of the DATA (or other nested structure).
# The DATA cannot contain Tuples as they are reserved for key-value operations.
# Each should return either a transformed value or None for its removal.


def normalize_rule_names(x):
    if isinstance(x, Tuple):
        key, value = x
        # We don't care for rule domains, but we must ensure proper nesting
        if key in {'authority', 'civics', 'ethics', 'origin'}:
            return ('AND', value)
    return x


def remove_text_entries(x):
    # Some rules contain {'text': ...} entries which we don't use
    if isinstance(x, Dict) and 'text' in x:
        return None
    return x


def assign_rule_types(x):
    # Transform rules to a more structured format:
    # {'AND': [...]} => {'type': 'AND', 'entries': [...]}
    if isinstance(x, Tuple):
        k, v = x
        if k in RULE_LISTS:
            return (k, assign_rule_types({'AND': v}))
    elif isinstance(x, Dict):
        k, v = next(iter(x.items()))
        if k in RULES:
            return {'type': k, 'entries': v}
    return x


def flatten_rule_values(x):
    # Map {'value': str} entries to their contents
    if isinstance(x, Dict):
        if 'value' in x:
            return x['value']
    return x


def extract_singular_rule(x):
    # Convert multiple different rule-props to a single one which handles all
    archetypes = x.get('allowed_archetypes', [])
    species = x.get('species_class', [])
    opposites = x.get('opposites', [])

    possible = x.get('possible', {}).get('entries', [])
    potential = x.get('potential', {}).get('entries', [])

    # PLANT and FUN seem to always be together
    if len(archetypes) > 0 and species == ['PLANT', 'FUN']:
        archetypes = ['BOTANICAL' if x == 'BIOLOGICAL' else x
                      for x in archetypes]

    return make_rule('AND', [
        *possible, *potential,
        # Janky workaround for unnecessary empty rules
        *[make_rule('OR',  xs) for xs in [archetypes] if len(xs) > 0],
        *[make_rule('NOR', xs) for xs in [opposites] if len(xs) > 0],
    ])


ENTRY_MAP = {
    'BIOLOGICAL':         'pop_biologic',
    'PLANT':              'pop_botanic',
    'BOTANICAL':          'pop_botanic',
    'MACHINE':            'pop_mechanic',
    'LITHOID':            'pop_lithoid',
    # We don't care about ROBOT as it is not used during empire creation
    'ROBOT':               None,
    # FUN is always paired with PLANT, so it is unnecessary
    'FUN':                 None,
    'trait_hive_mind':    'auth_hive_mind',
    'trait_machine_unit': 'pop_mechanic',
    'trait_necrophage':   'origin_necrophage',
}


def clean_entries(x):
    if isinstance(x, str):
        if x in NOT_SUPPORTED:
            return None
        # Pop types are defined in capital letters without prefix
        return ENTRY_MAP.get(x, x)
    return x


def map_not_none(fn, xs):
    '''Applies fn to xs, if the result is None it won't be included'''
    return filter(lambda x: x is not None, map(fn, xs))


def recmap(data, fn):
    '''Recursively map dict key-value pairs, list items and others'''
    if isinstance(data, Dict):
        return {k: recmap(v, fn) for k, v in map_not_none(fn, data.items())}
    elif isinstance(data, List):
        return [recmap(v, fn) for v in map_not_none(fn, data)]
    else:
        return fn(data)


def dictify(data, assuming='dict'):
    '''Transform token tree into dicts and lists'''
    def prop_kind(prop):
        return 'list' if prop in ALWAYS_LISTS else 'dict'

    # Singular tuples are always interpreted as one-key dicts
    if isinstance(data, Tuple):
        k, v = data
        return {k: dictify(v, assuming=prop_kind(k))}
    # Lists could either contain key-value pairs for a dict or just be a lists
    elif isinstance(data, List):
        if assuming == 'dict' and all(isinstance(t, Tuple) for t in data):
            return {k: dictify(v, prop_kind(k)) for k, v in data}
        else:
            return [dictify(v) for v in data]
    return data


def tokenize(text):
    '''Extract tokens by splitting and transforming the input text'''
    # Remove comment
    text = re.sub(r'#.*', '', text)
    # Ensure proper spacing around special characters
    text = text.replace('=', ' = ')
    text = text.replace('{', ' { ').replace('}', ' } ')
    # Fold whitespace
    text = text.replace('\s+', '')
    return text.split()


def make_tree(tokens):
    '''Convert token stream to a token tree'''
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
        if token == '=' and state == 'key':
            # The previous token must be a key, we begin looking for its value
            key = prev
            state = 'value'
        elif state == 'value':
            # We've found a key-value pair
            if isinstance(token, List):
                data.append((key, pairup(token)))
            else:
                data.append((key, token))
            # Now we begin looking for the next key
            state = 'key'
        # Remember token for key assignment
        prev = token

    return data


def isfloat(x):
    try:
        float(x)
        return True
    except:
        return False


def infer_types(data):
    '''Infer and cast to types based on str contents'''
    if isinstance(data, str):
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
    '''Parse Clausewitz format to JSON'''
    # The output of tokenize needs to be streamed as each token must be consumed
    # only once in the recursive make_tree calls
    data = iter(tokenize(text))
    data = make_tree(data)

    # Transform into dict
    data = pairup(data)
    data = dictify(data)

    # Apply some intermediate mappings
    data = recmap(data, infer_types)
    data = recmap(data, remove_text_entries)
    data = recmap(data, normalize_rule_names)
    data = recmap(data, assign_rule_types)
    data = recmap(data, flatten_rule_values)

    for v in data.values():
        v['rule'] = extract_singular_rule(v)

    data = recmap(data, clean_entries)
    return data


def load_data(path):
    with open(path) as f:
        return parse(f.read())


def load_dictionary(root_path):
    try:
        with open(DICTIONARY_PATHS['pickle'], 'rb') as f:
            eprint('[INFO] Loading cached dictionary')
            return pickle.load(f)
    except Exception as e:
        eprint(f'[WARN]: {e}')
        eprint('[INFO] Failed to load cached dictionary')

    dictionary = {}
    for path in DICTIONARY_PATHS['game']:
        with open(root_path + path) as f:
            eprint(f'[INFO] Loading dictionary from {path}')
            text = ''
            # Although localization files are allegedly YAML, their format
            # is slightly cursed so we need to remove some of its "quirks"
            for line in f.readlines():
                # Lines can contain multiple double quotes
                sp = line.split('"')
                if len(sp) > 1:
                    # Keep only the first and loast double quote
                    line = sp[0] + '"' + ' '.join(sp[1:-1]) + '"' + sp[-1]
                # For some reason each key has a number after its colon symbol
                text += re.sub(r':.*? ', ': ', line, count=1)
            new_dictionary = next(iter(yaml.safe_load(text).values()))
            dictionary.update(new_dictionary)

        with open(DICTIONARY_PATHS['pickle'], 'wb') as p:
            pickle.dump(dictionary, p)
            eprint(f'[INFO] Saved dictionary to {DICTIONARY_PATHS["pickle"]}')
    return dictionary


def check_missing(visited):
    def internal(x):
        if isinstance(x, Tuple):
            k, v = x
            if k == 'entries':
                for y in v:
                    if isinstance(y, str):
                        visited.add(y)
        return x
    return internal


def translate(dictionary, id, item):
    '''Add id to item and translate to name using dictionary'''
    translated = item.setdefault('name', dictionary.get(id))

    while re.match(r'\$.+\$', translated or ''):
        translated = dictionary.get(translated[1:-1])

    if translated:
        item['name'] = translated
        return

    replace_map = {'origin_': ['origin_', 'civic_', 'civic_machine_']}

    for pattern in replace_map.keys():
        if re.search(pattern, id):
            for repl in replace_map[pattern]:
                item['name'] = dictionary.get(re.sub(pattern, repl, id))
                if item['name']:
                    return

    item['name'] = id
    eprint(f'[WARN] Failed to translate: "{id}"!')


if __name__ == '__main__':
    if len(ARGS) != 1:
        eprint(f'usage: {SCRIPT_NAME} <STELLARIS_ROOT_PATH>')
        eprint(f'       e.g. {SCRIPT_NAME} "{DEFAULT_ROOT}"')
        sys.exit(1)

    root_path = ARGS[0]
    dictionary = load_dictionary(root_path)

    for domain, kinds in DATA.items():
        mapper = MAPPERS[domain]
        for kind, items in kinds.items():
            # Some items lists are actually paths to files we'll need to parse
            if isinstance(items, str):
                DATA[domain][kind] = {}
                eprint(f'[INFO] Loading items from {items}')
                parsed = load_data(root_path + items)
                for id, item in parsed.items():
                    mapped = mapper(item)
                    if mapped:
                        DATA[domain][kind][id] = mapped

            for id, item in DATA[domain][kind].items():
                item['id'] = id
                translate(dictionary, id, item)

    # Ensure that every entry is referencing a defined item
    visited_entries = set()
    recmap(DATA, check_missing(visited_entries))
    defined = {id for domain, kinds in DATA.items()
               for kind, items in kinds.items()
               for id, item in items.items()}
    undefined = visited_entries - defined
    if len(undefined) > 0:
        eprint(f'[ERROR] Found {len(undefined)} undefined entries:')
        eprint(undefined)
        sys.exit(1)
    else:
        print(json.dumps(DATA, indent=4))
