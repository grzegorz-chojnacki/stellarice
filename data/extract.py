#!/usr/bin/env python3

import re
import sys
import json
from typing import List, Dict, Any, Union
from typing_extensions import TypeAlias


SCRIPT_NAME = sys.argv[0]
ARGS = sys.argv[1:]

ALLOWED_LIST = [
    'cost',
    'allowed_archetypes',
    'species_class',
    'opposites',
    'possible',
    'NOT', 'NOR', 'OR,'
    'potential',
    'authority',
    'etchics',
    'civics',
    'value',
    'traits',
    'trait',
]

RULES = [ 'OR', 'AND', 'NOT', 'NOR' ]

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
}


def isfloat(x: str):
    try:
        float(x)
        return True
    except:
        return False

# pops
# ethics
# authority


# Extract tokens by splitting and transforming the input text
def tokenize(text: str) -> List[str]:
    # Remove comment
    text = re.sub(r'#.*', '', text)
    # Change all whitespace to spaces
    text = text.replace('\s', ' ')
    # Ensure proper spacing around special characters
    text = text.replace('=', ' = ')
    text = text.replace('{', ' { ').replace('}', ' } ')
    # Fold repeating spaces
    text = re.sub(' +', ' ', text)
    return text.split()

# Extract nested blocks
def blockify(tokens: List[str]):
    stack = [[]]

    for token in tokens:
        if token == '{':
            new_block = []
            stack[-1].append(new_block)
            stack.append(new_block)
        elif token == '}':
            stack.pop()
        else:
            stack[-1].append(token)

    assert len(stack) == 1, f'Stack has more than one element! ({len(stack)}))'
    return stack[0]

# Pair key-value tokens
def pairify(tokens: List) -> Dict:
    data = {}
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
                data[key] = pairify(token)
            else:
                data[key] = token
            state = 'key'

        prev = token

    return data

# Infer and cast type based on string contents
def cast(v: str):
    if v[0] == '"':
        return v[1:-1]  # Remove quotes
    elif v == 'yes':
        return True
    elif v == 'no':
        return False
    elif isfloat(v):
        return float(v)
    return v

# Fix types
def typify(data: Dict) -> Dict:
    for k, v in data.items():
        if isinstance(v, Dict):
            data[k] = typify(v)
        elif isinstance(v, List):
            data[k] = [cast(vv) for vv in v]
        else:
            data[k] = cast(v)

    return data

# Remove unnecessary keys from dict
def trim(data: Dict):
    result = {}
    for k, v in data.items():
        if k in ALLOWED_LIST:
            if isinstance(v, Dict):
                result[k] = trim(v)
            else:
                result[k] = v
    return result

# Parse Clausewitz format to dict
def parse(text: str) -> Dict:
    tokens = tokenize(text)
    blocks = blockify(tokens)
    data = pairify(blocks)
    return typify(data)


if __name__ == '__main__':
    if len(ARGS) != 1:
        print(f'usage: {SCRIPT_NAME} <STELLARIS_ROOT_PATH>')
        print(f'       e.g. {SCRIPT_NAME} "/home/{{USER_NAME}}/Games/Steam/Stellaris"')
        sys.exit(1)

    root_path = ARGS[0]
    localisation_path = root_path+'/localisation/english/l_english.yml'

    data = {}
    for (attribute_domain, attribute_kinds) in PATHS.items():
        data[attribute_domain] = {}
        for (attribute_kind, path) in attribute_kinds.items():
            with open(root_path+path) as f:
                parsed = parse(f.read())
                for (attribute, value) in parsed.items():
                    parsed[attribute] = trim(value)
                data[attribute_domain][attribute_kind] = parsed

    print(json.dumps(data, indent=4))
