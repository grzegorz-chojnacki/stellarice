// @ts-check
/// <reference path="../paths.js" />

class Civic extends Item {
  empireList = empire.civics

  isAvailable = () => this.empireList.length < 2
}

// Source: https://stellaris.paradoxwikis.com/Civics

const civicsNormal = [
  { id: 'Cutthroat Politics' },
  { id: 'Efficient Bureaucracy' },
  { id: 'Environmentalist', rule: none('Relentless Industrialists') },
  { id: 'Functional Architecture' },
  { id: 'Mining Guilds' },
  {
    id: 'Agrarian Idyll',
    rule: every(
      some('Pacifist', 'Fanatic Pacifist'),
      none(
        'Relentless Industrialists',
        'Post-Apocalyptic',
        'Remnants',
        'Shattered Ring',
        'Void Dwellers'
      )
    ),
  },
  {
    id: 'Aristocratic Elite',
    rule: every(
      some('Oligarchic', 'Imperial'),
      none(
        'Egalitarian',
        'Fanatic Egalitarian',
        'Exalted Priesthood',
        'Merchant Guilds',
        'Technocracy'
      )
    ),
  },
  {
    id: 'Beacon of Liberty',
    rule: every(
      'Democratic',
      some('Egalitarian', 'Fanatic Egalitarian'),
      none('Xenophobe', 'Fanatic Xenophobe')
    ),
  },
  {
    id: 'Citizen Service',
    rule: every(
      some('Democratic', 'Oligarchic'),
      some('Militarist', 'Fanatic Militarist'),
      none('Fanatic Xenophile', 'Reanimators')
    ),
  },
  // Disabled in MegaCorp DLC
  // {
  //   id: 'Corporate Dominion',
  //   rule: every(
  //     'Democratic',
  //     none('Xenophobe', 'Fanatic Xenophobe')
  //   ),
  // },
  {
    id: 'Corvee System',
    rule: none('Egalitarian', 'Fanatic Egalitarian', 'Free Haven'),
  },
  {
    id: 'Distinguished Admiralty',
    rule: some('Militarist', 'Fanatic Militarist'),
  },
  {
    id: 'Exalted Priesthood',
    rule: every(
      some('Oligarchic', 'Dictatorial'),
      some('Spiritualist', 'Fanatic Spiritualist'),
      none('Merchant Guilds', 'Aristocratic Elite', 'Technocracy')
    ),
  },
  {
    id: 'Feudal Society',
    rule: every('Imperial'),
  },
  {
    id: 'Free Haven',
    rule: every(some('Xenophile', 'Fanatic Xenophile'), none('Corvee System')),
  },
  {
    id: 'Idealistic Foundation',
    rule: every(some('Egalitarian', 'Fanatic Egalitarian')),
  },
  {
    id: 'Imperial Cult',
    rule: every(
      'Imperial',
      some('Authoritarian', 'Fanatic Authoritarian'),
      some('Spiritualist', 'Fanatic Spiritualist')
    ),
  },
  {
    id: 'Inward Perfection',
    rule: every(
      some('Pacifist', 'Fanatic Pacifist'),
      some('Xenophobe', 'Fanatic Xenophobe'),
      none('Pompous Purists', 'Eager Explorers', 'Fear of the Dark')
    ),
  },
  {
    id: 'Meritocracy',
    rule: some('Democratic', 'Oligarchic'),
  },
  {
    id: 'Nationalistic Zeal',
    rule: some('Militarist', 'Fanatic Militarist'),
  },
  {
    id: 'Parliamentary System',
    rule: every('Democratic'),
  },
  {
    id: 'Philosopher King',
    rule: some('Dictatorial', 'Imperial'),
  },
  {
    id: 'Police State',
    rule: none('Fanatic Egalitarian'),
  },
  {
    id: 'Shadow Council',
    rule: none('Imperial'),
  },
  {
    id: 'Slaver Guilds',
    rule: every(
      some('Authoritarian', 'Fanatic Authoritarian'),
      none('Pleasure Seekers', 'Payback')
    ),
  },
  {
    id: 'Technocracy',
    rule: every(
      some('Materialist', 'Fanatic Materialist'),
      none(
        'Aristocratic Elite',
        'Exalted Priesthood',
        'Merchant Guilds',
        'Shared Burdens'
      )
    ),
  },
  {
    id: 'Warrior Culture',
    rule: some('Militarist', 'Fanatic Militarist'),
  },
  {
    id: 'Catalytic Processing',
    rule: none('Calamitous Birth'),
  },
  {
    id: 'Idyllic Bloom',
    rule: every('Botanic', none('Relentless Industrialists', 'Void Dwellers')),
  },
  {
    id: 'Fanatic Purifiers',
    rule: every(
      'Fanatic Xenophobe',
      some('Militarist', 'Spiritualist'),
      none(
        'Barbaric Despoilers',
        'Pompous Purists',
        'Syncretic Evolution',
        'Common Ground',
        'Hegemon',
        'Teachers of the Shroud',
        'Knights of the Toxic God',
        'Broken Shackles',
        'Fear of the Dark',
        'Payback'
      )
    ),
  },
  { id: 'Masterful Crafters' },
  {
    id: 'Pleasure Seekers',
    rule: none('Slaver Guilds', 'Warrior Culture', 'Shared Burdens'),
  },
  {
    id: 'Pompous Purists',
    rule: every(
      some('Xenophobe', 'Fanatic Xenophobe'),
      none('Inward Perfection', 'Fanatic Purifiers', 'Scion', 'Payback')
    ),
  },
  {
    id: 'Barbaric Despoilers',
    rule: every(
      some('Militarist', 'Spiritualist'),
      some(
        'Authoritarian',
        'Fanatic Authoritarian',
        'Xenophobe',
        'Fanatic Xenophobe'
      ),
      none(
        'Xenophile',
        'Fanatic Xenophile',
        'Fanatic Purifiers',
        'Common Ground'
      )
    ),
  },
  {
    id: 'Byzantine Bureaucracy',
    rule: none('Spiritualist', 'Fanatic Spiritualist'),
  },
  {
    id: 'Merchant Guilds',
    rule: none('Exalted Priesthood', 'Aristocratic Elite', 'Technocracy'),
  },
  {
    id: 'Shared Burdens',
    rule: every(
      'Fanatic Egalitarian',
      none('Xenophobe', 'Fanatic Xenophobe', 'Technocracy', 'Pleasure Seekers')
    ),
  },
  {
    id: 'Diplomatic Corps',
    rule: none('Inward Perfection', 'Fanatic Purifiers'),
  },
  {
    id: 'Death Cult',
    rule: every(
      some('Spiritualist', 'Fanatic Spiritualist'),
      none('Inward Perfection', 'Fanatic Purifiers', 'Necrophage')
    ),
  },
  {
    id: 'Memorialists',
    rule: none('Fanatic Purifiers'),
  },
  {
    id: 'Reanimators',
    rule: none('Pacifist', 'Fanatic Pacifist', 'Citizen Service'),
  },
  {
    id: 'Anglers',
    rule: none(
      'Post-Apocalyptic',
      'Shattered Ring',
      'Void Dwellers',
      'Subterranean'
    ),
  },
  {
    id: 'Mutagenic Spas',
    rule: none('Life-Seeded'),
  },
  {
    id: 'Relentless Industrialists',
    rule: every(
      some('Materialist', 'Fanatic Materialist'),
      none(
        'Agrarian Idyll',
        'Environmentalist',
        'Idyllic Bloom',
        'Memorialists',
        'Life-Seeded'
      )
    ),
  },
  { id: 'Scavengers' },
  {
    id: 'Eager Explorers',
    rule: none(
      'Inward Perfection',
      'Broken Shackles',
      'Fear of the Dark',
      'Payback'
    ),
  },
]
  .map(item => new Civic(item))
  .map(Item.withRule(none('Corporate', 'Hive Mind', 'Machine Intelligence')))

const civicsCorporate = [
  { id: 'Criminal Heritage' },
  { id: 'Franchising' },
  { id: 'Free Traders' },
  { id: 'Private Prospectors' },
  { id: 'Trading Posts' },
  {
    id: 'Brand Loyalty',
    rule: none('Beacon of Liberty'),
  },
  {
    id: 'Gospel of the Masses',
    rule: some('Spiritualist', 'Fanatic Spiritualist'),
  },
  {
    id: 'Indentured Assets',
    rule: every(
      some('Authoritarian', 'Fanatic Authoritarian'),
      none('Corporate Hedonism', 'Pleasure Seekers', 'Slaver Guilds', 'Payback')
    ),
  },
  {
    id: 'Media Conglomerate',
    rule: none('Idealistic Foundation'),
  },
  {
    id: 'Naval Contractors',
    rule: every(
      some('Militarist', 'Fanatic Militarist'),
      none('Citizen Service')
    ),
  },
  {
    id: 'Private Military Companies',
    rule: every(
      some('Militarist', 'Fanatic Militarist'),
      none('Warrior Culture')
    ),
  },
  {
    id: 'Ruthless Competition',
    rule: none('Meritocracy'),
  },
  {
    id: 'Catalytic Recyclers',
    rule: none('Catalytic Processing', 'Calamitous Birth'),
  },
  {
    id: 'Ascensionists',
    rule: none('Spiritualist', 'Fanatic Spiritualist'),
  },
  {
    id: 'Corporate Hedonism',
    rule: none('Indentured Assets', 'Pleasure Seekers', 'Slaver Guilds'),
  },
  {
    id: 'Mastercraft Inc.',
    rule: none('Masterful Crafters'),
  },
  {
    id: 'Public Relations Specialists',
    rule: none('Diplomatic Corps'),
  },
  {
    id: 'Corporate Death Cult',
    rule: every(
      some('Spiritualist', 'Fanatic Spiritualist'),
      none('Necrophage', 'Inward Perfection', 'Fanatic Purifiers')
    ),
  },
  {
    id: 'Permanent Employment',
    rule: none(
      'Egalitarian',
      'Fanatic Egalitarian',
      'Mechanist',
      'Clone Army',
      'Necrophage'
    ),
  },
  {
    id: 'Corporate Anglers',
    rule: none(
      'Post-Apocalyptic',
      'Shattered Ring',
      'Void Dwellers',
      'Subterranean'
    ),
  },
  {
    id: 'Corporate Mutagenic Spas',
    rule: none('Mutagenic Spas', 'Life-Seeded'),
  },
  {
    id: 'Corporate Relentless Industrialists',
    rule: every(
      some('Materialist', 'Fanatic Materialist'),
      none(
        'Agrarian Idyll',
        'Environmentalist',
        'Idyllic Bloom',
        'Memorialists',
        'Relentless Industrialists',
        'Life-Seeded'
      )
    ),
  },
  { id: 'Corporate Scavengers' },
  {
    id: 'Privatized Exploration',
    rule: none('Broken Shackles', 'Fear of the Dark', 'Payback'),
  },
]
  .map(item => new Civic(item))
  .map(Item.withRule(every('Corporate')))

const civicsHive = [
  { id: 'Ascetic' },
  { id: 'Divided Attention' },
  { id: 'Elevational Conemplations' },
  { id: 'Natural Neural Network' },
  { id: 'One Mind' },
  { id: 'Pooled Knowledge' },
  { id: 'Strength Of Legions' },
  { id: 'Subspace Ephapse' },
  { id: 'Subsumed Will' },
  {
    id: 'Devouring Swarm',
    rule: none('Lithoid'),
  },
  {
    id: 'Hive Idyllic Bloom',
    rule: every('Botanic'),
  },
  {
    id: 'Hive Organic Reprocessing',
    rule: none('Calamitous Birth'),
  },
  {
    id: 'Terravore',
    rule: every('Lithoid'),
  },
  {
    id: 'Empath',
    rule: none('Devouring Swarm', 'Terravore', 'Necrophage'),
  },
  { id: 'Cordyceptic Drones' },
  {
    id: 'Hive Memorialist',
    rule: none('Devouring Swarm', 'Terravore'),
  },
  {
    id: 'Permutation Pools',
    rule: none('Life-Seeded'),
  },
  {
    id: 'Stargazers',
    rule: none('Broken Shackles', 'Fear of the Dark', 'Payback'),
  },
]
  .map(item => new Civic(item))
  .map(Item.withRule(every('Hive Mind')))

const civicsMachine = [
  { id: 'Constructobot' },
  { id: 'Delegated Functions' },
  { id: 'Factory Overclocking' },
  { id: 'Introspective' },
  { id: 'Maintenance Protocols' },
  { id: 'OTAUpdates' },
  { id: 'Rapid Replicator' },
  { id: 'Rockbreakers' },
  { id: 'Static Research Analysis' },
  { id: 'Unitary Cohesion' },
  { id: 'Warbots' },
  { id: 'Zero Waste Protocols' },
  {
    id: 'Determined Exterminator',
    rule: none('Driven Assimilator', 'Rogue Servitor', 'Exploration Protocols'),
  },
  {
    id: 'Driven Assimilator',
    rule: none(
      'Determined Exterminator',
      'Rogue Servitor',
      'Exploration Protocols'
    ),
  },
  {
    id: 'Rogue Servitor',
    rule: none(
      'Determined Exterminator',
      'Driven Assimilator',
      'Resource Consolidation'
    ),
  },
  {
    id: 'Machine Organic Reprocessing',
    rule: none('Resource Consolidation'),
  },
  { id: 'Elevational Hypotheses' },
  {
    id: 'Machine Memorialist',
    rule: none('Determined Exterminator', 'Driven Assimilator'),
  },
  { id: 'Hyper Lubrication Basin' },
  {
    id: 'Exploration Protocols',
    rule: none('Determined Exterminator', 'Driven Assimilator'),
  },
]
  .map(item => new Civic(item))
  .map(Item.withRule(some('Machine Intelligence')))

const civics = [
  ...civicsNormal,
  ...civicsCorporate,
  ...civicsHive,
  ...civicsMachine,
]
