// @ts-check
/// <reference path="../paths.js" />

class Origin extends Item {
  empireList = empire.origin

  generalRule = () => this.empireList.length === 1
  isAvailable = () => this.empireList.length === 0
}

const origins = Item.create(Origin, [
  {
    id: 'ProsperousUnification',
  },
  {
    id: 'GalacticDoorstep',
  },
  {
    id: 'LostColony',
    rule: none('Gestalt'),
  },
  {
    id: 'Mechanist',
    rule: every(
      some('Materialist', 'FanaticMaterialist'),
      none('Gestalt', 'PermanentEmployment')
    ),
  },
  {
    id: 'SyncreticEvolution',
    rule: none('Gestalt', 'FanaticPurifiers'),
  },
  {
    id: 'TreeOfLife',
    rule: every('HiveMind', none('DevouringSwarm', 'Terravore')),
  },
  {
    id: 'ResourceConsolidation',
    rule: every(
      'MachineIntelligence',
      none('RogueServitor', 'MachineOrganicReprocessing')
    ),
  },
  {
    id: 'CloneArmy',
    rule: none('Gestalt', 'PermanentEmployment'),
  },
  {
    id: 'LifeSeeded',
    rule: none('MachineIntelligence'),
  },
  {
    id: 'PostApocalyptic',
    rule: none(
      'MachineIntelligence',
      'AgrarianIdyll',
      'Anglers',
      'CorporateAnglers'
    ),
  },
  {
    id: 'Remnants',
    rule: none('AgrarianIdyll'),
  },
  {
    id: 'CalamitousBirth',
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
    id: 'CommonGround',
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
    id: 'Hegemon',
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
    id: 'Doomsday',
  },
  {
    id: 'OnTheShouldersOfGiants',
    rule: none('Gestalt'),
  },
  {
    id: 'Scion',
    rule: none('Gestalt', 'FanaticXenophobe', 'PompousPurists'),
  },
  {
    id: 'ShatteredRing',
    rule: none('AgrarianIdyll', 'Anglers', 'CorporateAnglers'),
  },
  {
    id: 'VoidDwellers',
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
    id: 'Necrophage',
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
    id: 'HereBeDragons',
    rule: none('FanaticPurifiers', 'DevouringSwarm', 'DeterminedExterminator'),
  },
  {
    id: 'OceanParadise',
    rule: none('MachineIntelligence'),
  },
  {
    id: 'SlingshotToTheStars',
  },
  {
    id: 'ImperialFiefdom',
    rule: none(
      'InwardPerfection',
      'DrivenAssimilator',
      'FanaticPurifiers',
      'DevouringSwarm',
      'DeterminedExterminator'
    ),
  },
  {
    id: 'Subterranean',
    rule: none('MachineIntelligence'),
  },
  {
    id: 'TeachersOfTheShroud',
    rule: every(
      some('Spiritualist', 'FanaticSpiritualist'),
      none('FanaticPurifiers')
    ),
  },
  {
    id: 'ProgenitorHive',
    rule: every('HiveMind'),
  },
])
