// @ts-check
/// <reference path="../paths.js" />

class Origin extends Item {
  empireList = empire.origin

  isAvailable = () => this.empireList.length === 0
}

// Source: https://stellaris.paradoxwikis.com/Empire#Origin

const origins = [
  {
    id: 'Prosperous Unification',
  },
  {
    id: 'Galactic Doorstep',
  },
  {
    id: 'Lost Colony',
    rule: none('Gestalt'),
  },
  {
    id: 'Remnants',
    rule: none('Agrarian Idyll'),
  },
  {
    id: 'Mechanist',
    rule: every(
      some('Materialist', 'Fanatic Materialist'),
      none('Gestalt', 'Permanent Employment')
    ),
  },
  {
    id: 'Syncretic Evolution',
    rule: none('Gestalt', 'Fanatic Purifiers'),
  },
  {
    id: 'Tree of Life',
    rule: every('Hive Mind', none('Devouring Swarm', 'Terravore')),
  },
  {
    id: 'Resource Consolidation',
    rule: every(
      'Machine Intelligence',
      none('Rogue Servitor', 'Machine Organic Reprocessing')
    ),
  },
  {
    id: 'Clone Army',
    rule: none('Gestalt', 'Permanent Employment'),
  },
  {
    id: 'Life-Seeded',
    rule: none(
      'Machine Intelligence',
      'Mutagenic Spas',
      'Permutation Pools',
      'Relentless Industrialists'
    ),
  },
  {
    id: 'Post-Apocalyptic',
    rule: none(
      'Machine Intelligence',
      'Agrarian Idyll',
      'Anglers',
      'Corporate Anglers'
    ),
  },
  {
    id: 'Calamitous Birth',
    rule: every(
      'Lithoid',
      none(
        'Catalytic Processing',
        'Catalytic Recyclers',
        'Hive Organic Reprocessing',
        'Machine Organic Reprocessing'
      )
    ),
  },
  {
    id: 'Common Ground',
    rule: none(
      'Xenophobe',
      'Fanatic Xenophobe',
      'Gestalt',
      'Inward Perfection',
      'Fanatic Purifiers',
      'Barbaric Despoilers'
    ),
  },
  {
    id: 'Hegemon',
    rule: none(
      'Xenophobe',
      'Fanatic Xenophobe',
      'Egalitarian',
      'Fanatic Egalitarian',
      'Gestalt',
      'Inward Perfection',
      'Fanatic Purifiers'
    ),
  },
  {
    id: 'Doomsday',
  },
  {
    id: 'On the Shoulders of Giants',
    rule: none('Gestalt'),
  },
  {
    id: 'Scion',
    rule: none('Fanatic Xenophobe', 'Gestalt', 'Pompous Purists'),
  },
  {
    id: 'Shattered Ring',
    rule: none('Agrarian Idyll', 'Anglers', 'Corporate Anglers'),
  },
  {
    id: 'Void Dwellers',
    rule: none(
      'Gestalt',
      'Agrarian Idyll',
      'Anglers',
      'Corporate Anglers',
      'Idyllic Bloom'
    ),
  },
  {
    id: 'Necrophage',
    rule: none(
      'Machine Intelligence',
      'Xenophile',
      'Fanatic Xenophile',
      'Fanatic Egalitarian',
      'Death Cult',
      'Corporate Death Cult',
      'Empath',
      'Permanent Employment'
    ),
  },
  {
    id: 'Here Be Dragons',
    rule: none(
      'Fanatic Purifiers',
      'Devouring Swarm',
      'Determined Exterminator'
    ),
  },
  {
    id: 'Ocean Paradise',
    rule: none('Machine Intelligence'),
  },
  {
    id: 'Imperial Fiefdom',
    rule: none(
      'Inward Perfection',
      'Driven Assimilator',
      'Fanatic Purifiers',
      'Devouring Swarm',
      'Determined Exterminator'
    ),
  },
  {
    id: 'Progenitor Hive',
    rule: every('Hive Mind'),
  },
  {
    id: 'Slingshot to the Stars',
  },
  {
    id: 'Subterranean',
    rule: none('Machine Intelligence'),
  },
  {
    id: 'Teachers of the Shroud',
    rule: every(
      some('Spiritualist', 'Fanatic Spiritualist'),
      none('Fanatic Purifiers')
    ),
  },
  {
    id: 'Knights of the Toxic God',
    rule: none('Gestalt', 'Fanatic Purifiers'),
  },
  {
    id: 'Overturned',
    rule: none('Machine Intelligence'),
  },
  {
    id: 'Broken Shackles',
    rule: none(
      'Authoritarian',
      'Fanatic Authoritarian',
      'Xenophobe',
      'Fanatic Xenophobe',
      'Gestalt',
      'Fanatic Purifiers',
      'Eager Explorers',
      'Privatized Exploration',
    ),
  },
  {
    id: 'Payback',
    rule: none(
      'Gestalt',
      'Slaver Guilds',
      'Fanatic Purifiers',
      'Pompous Purists',
      'Eager Explorers',
      'Indentured Assets',
      'Privatized Exploration',
    ),
  },
  {
    id: 'Fear of the Dark',
    rule: none(
      'Gestalt',
      'Inward Perfection',
      'Fanatic Purifiers',
      'Eager Explorers',
      'Privatized Exploration',
    ),
  },
].map(item => new Origin(item))
