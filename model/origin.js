class Origin extends Item {
  constructor(rules) {
    super(rules)
  }

  generalRule = () => empire.origin.length === 0
}

const origin = Item.create(Origin, [
  {
    name: 'ProsperousUnification',
  },
  {
    name: 'GalacticDoorstep',
  },
  {
    name: 'LostColony',
    rule: none('Gestalt'),
  },
  {
    name: 'Mechanist',
    rule: every(
      some('Materialist', 'FanaticMaterialist'),
      none('Gestalt', 'PermanentEmployment')
    ),
  },
  {
    name: 'SyncreticEvolution',
    rule: none('Gestalt', 'FanaticPurifiers'),
  },
  {
    name: 'TreeOfLife',
    rule: every('HiveMind', none('DevouringSwarm', 'Terravore')),
  },
  {
    name: 'ResourceConsolidation',
    rule: every(
      'MachineIntelligence',
      none('RogueServitor', 'MachineOrganicReprocessing')
    ),
  },
  {
    name: 'CloneArmy',
    rule: none('Gestalt', 'PermanentEmployment'),
  },
  {
    name: 'LifeSeeded',
    rule: none('MachineIntelligence'),
  },
  {
    name: 'PostApocalyptic',
    rule: none(
      'MachineIntelligence',
      'AgrarianIdyll',
      'Anglers',
      'CorporateAnglers'
    ),
  },
  {
    name: 'Remnants',
    rule: none('AgrarianIdyll'),
  },
  {
    name: 'CalamitousBirth',
    rule: every(
      'Lithoid',
      none(
        'CatalyticProcessing',
        'CatalyticRecyclers',
        'HiveOrganicReprocessing',
        'MachineOrganicReprocessing'
      )
    ),
  },
  {
    name: 'CommonGround',
    rule: none(
      'Xenophile',
      'FanaticXenophile',
      'Xenophobe',
      'FanaticXenophobe',
      'Gestalt',
      'InwardPerfection',
      'FanaticPurifiers',
      'BarbaricDespoilers'
    ),
  },
  {
    name: 'Hegemon',
    rule: none(
      'Xenophobe',
      'FanaticXenophobe',
      'Egalitarian',
      'FanaticEgalitarian',
      'Gestalt',
      'InwardPerfection',
      'FanaticPurifiers'
    ),
  },
  {
    name: 'Doomsday',
  },
  {
    name: 'OnTheShouldersOfGiants',
    rule: none('Gestalt'),
  },
  {
    name: 'Scion',
    rule: none('Gestalt', 'FanaticXenophobe', 'PompousPurists'),
  },
  {
    name: 'ShatteredRing',
    rule: none('AgrarianIdyll', 'Anglers', 'CorporateAnglers'),
  },
  {
    name: 'VoidDwellers',
    rule: none(
      'Gestalt',
      'AgrarianIdyll',
      'Anglers',
      'CorporateAnglers',
      'IdyllicBloom',
      'HiveIdyllicBloom'
    ),
  },
  {
    name: 'Necrophage',
    rule: none(
      'MachineIntelligence',
      'Xenophile',
      'FanaticXenophile',
      'FanaticEgalitarian',
      'DeathCult',
      'CorporateDeathCult',
      'Empath',
      'PermanentEmployment'
    ),
  },
  {
    name: 'HereBeDragons',
    rule: none('FanaticPurifiers', 'DevouringSwarm', 'DeterminedExterminator'),
  },
  {
    name: 'OceanParadise',
    rule: none('MachineIntelligence'),
  },
  {
    name: 'SlingshotToTheStars',
  },
  {
    name: 'ImperialFiefdom',
    rule: none(
      'InwardPerfection',
      'DrivenAssimilator',
      'FanaticPurifiers',
      'DevouringSwarm',
      'DeterminedExterminator'
    ),
  },
  {
    name: 'Subterranean',
    rule: none('MachineIntelligence'),
  },
  {
    name: 'TeachersOfTheShroud',
    rule: every(
      some('Spiritualist', 'FanaticSpiritualist'),
      none('FanaticPurifiers')
    ),
  },
  {
    name: 'ProgenitorHive',
    rule: every('HiveMind'),
  },
])
