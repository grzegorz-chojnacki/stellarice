class Civic extends Item {
  constructor(rules) {
    super(rules)
    this.makeEmpireNamePlural()
  }

  corporateClash = () => this.testClash(civicsCorporate, none('Corporate'))

  hiveClash = () => this.testClash(civicsHive, none('HiveMind'))

  machineClash = () =>
    this.testClash(civicsMachine, none('MachineIntelligence'))

  normalClash = () =>
    this.testClash(
      civicsNormal,
      some('Gestalt', 'Corporate', 'HiveMind', 'MachineIntelligence')
    )

  clashes = () =>
    this.normalClash() ||
    this.corporateClash() ||
    this.hiveClash() ||
    this.machineClash()

  hidden = () => !this.checked() && this.clashes()
  invalid = () => this.unmetRules() || this.clashes()
  generalRule = () => this.empireList.length < 2
}

const civicsNormal = [
  { name: 'CutthroatPolitics' },
  { name: 'EfficientBureaucracy' },
  { name: 'Environmentalist' },
  { name: 'FunctionalArchitecture' },
  { name: 'MiningGuilds' },
  {
    name: 'AgrarianIdyll',
    rule: every(
      some('Pacifist', 'FanaticPacifist'),
      none('Anglers', 'PostApocalyptic', 'Remnants')
    ),
  },
  {
    name: 'AristocraticElite',
    rule: every(
      some('Oligarchic', 'Imperial'),
      none(
        'Egalitarian',
        'FanaticEgalitarian',
        'ExaltedPriesthood',
        'MerchantGuilds',
        'Technocracy'
      )
    ),
  },
  {
    name: 'BeaconOfLiberty',
    rule: every(
      some('Oligarchic', 'Imperial'),
      some('Egalitarian', 'FanaticEgalitarian'),
      none('Xenophobe', 'FanaticXenophobe')
    ),
  },
  {
    name: 'CitizenService',
    rule: every(
      some('Democratic', 'Oligarchic'),
      some('Militarist', 'FanaticMilitarist'),
      none('FanaticXenophile', 'Reanimators')
    ),
  },
  {
    name: 'CorveeSystem',
    rule: none('Egalitarian', 'FanaticEgalitarian', 'FreeHaven'),
  },
  {
    name: 'DistinguishedAdmiralty',
    rule: some('Militarist', 'FanaticMilitarist'),
  },
  {
    name: 'ExaltedPriesthood',
    rule: every(
      some('Oligarchic', 'Dictatorial'),
      some('Spiritualist', 'FanaticSpiritualist'),
      none('MerchantGuilds', 'AristocraticElite', 'Technocracy')
    ),
  },
  {
    name: 'FeudalSociety',
    rule: every('Imperial'),
  },
  {
    name: 'FreeHaven',
    rule: every(some('Xenophile', 'FanaticXenophile'), none('CorveeSystem')),
  },
  {
    name: 'IdealisticFoundation',
    rule: every(some('Egalitarian', 'FanaticEgalitarian')),
  },
  {
    name: 'ImperialCult',
    rule: every(
      'Imperial',
      some('Spiritualist', 'FanaticSpiritualist'),
      some('Authoritarian', 'FanaticAuthoritarian')
    ),
  },
  {
    name: 'InwardPerfection',
    rule: every(
      some('Pacifist', 'FanaticPacifist'),
      some('Xenophobe', 'FanaticXenophobe'),
      none('PompousPurists')
    ),
  },
  {
    name: 'Meritocracy',
    rule: some('Democratic', 'Oligarchic'),
  },
  {
    name: 'NationalisticZeal',
    rule: some('Militarist', 'FanaticMilitarist'),
  },
  {
    name: 'ParliamentarySystem',
    rule: every('Democratic'),
  },
  {
    name: 'PhilosopherKing',
    rule: some('Dictatorial', 'Imperial'),
  },
  {
    name: 'PoliceState',
    rule: none('FanaticEgalitarian'),
  },
  {
    name: 'ShadowCouncil',
    rule: none('Imperial'),
  },
  {
    name: 'SlaverGuilds',
    rule: every(
      some('Authoritarian', 'FanaticAuthoritarian'),
      none('PleasureSeekers')
    ),
  },
  {
    name: 'Technocracy',
    rule: every(
      some('Materialist', 'FanaticMaterialist'),
      none(
        'AristocraticElite',
        'ExaltedPriesthood',
        'MerchantGuilds',
        'SharedBurdens'
      )
    ),
  },
  {
    name: 'WarriorCulture',
    rule: every(some('Militarist', 'FanaticMilitarist')),
  },
  {
    name: 'CatalyticProcessing',
    rule: none('CalamitousBirth'),
  },
  {
    name: 'IdyllicBloom',
    rule: every('Botanic', none('VoidDwellers')),
  },
  {
    name: 'FanaticPurifiers',
    rule: every(
      'FanaticXenophobe',
      some('Militarist', 'Spiritualist'),
      none(
        'BarbaricDespoilers',
        'PompousPurists',
        'SyncreticEvolution',
        'CommonGround',
        'Hegemon'
      )
    ),
  },
  { name: 'MasterfulCrafters' },
  {
    name: 'PleasureSeekers',
    rule: none('SlaverGuilds', 'WarriorCulture', 'SharedBurdens'),
  },
  {
    name: 'PompousPurists',
    rule: every(
      some('Xenophobe', 'FanaticXenophobe'),
      none('InwardPerfection', 'FanaticPurifiers', 'CommonGround')
    ),
  },
  {
    name: 'BarbaricDespoilers',
    rule: every(
      some('Militarist', 'Spiritualist'),
      some(
        'Authoritarian',
        'FanaticAuthoritarian',
        'Xenophobe',
        'FanaticXenophobe'
      ),
      none('Xenophile', 'FanaticXenophile', 'FanaticPurifiers', 'CommonGround')
    ),
  },
  {
    name: 'ByzantineBureaucracy',
    rule: none('Spiritualist', 'FanaticSpiritualist'),
  },
  {
    name: 'MerchantGuilds',
    rule: none('ExaltedPriesthood', 'AristocraticElite', 'Technocracy'),
  },
  {
    name: 'SharedBurdens',
    rule: every(
      'FanaticEgalitarian',
      none('Xenophobe', 'FanaticXenophobe', 'Technocracy', 'PleasureSeekers')
    ),
  },
  {
    name: 'DiplomaticCorps',
    rule: none('InwardPerfection', 'FanaticPurifiers'),
  },
  {
    name: 'Memorialists',
    rule: none('FanaticPurifiers'),
  },
  {
    name: 'Reanimators',
    rule: none('Pacifist', 'FanaticPacifist', 'CitizenService'),
  },
  {
    name: 'DeathCult',
    rule: every(
      some('Spiritualist', 'FanaticSpiritualist'),
      none('InwardPerfection', 'FanaticPurifiers', 'Necrophage')
    ),
  },
  {
    name: 'Anglers',
    rule: none(
      'AgrarianIdyll',
      'PostApocalyptic',
      'ShatteredRing',
      'VoidDwellers',
      'Subterranean'
    ),
  },
]

const civicsCorporate = [
  { name: 'CriminalHeritage' },
  { name: 'Franchising' },
  { name: 'FreeTraders' },
  { name: 'PrivateProspectors' },
  { name: 'TradingPosts' },
  {
    name: 'BrandLoyalty',
    rule: none('BeaconOfLiberty'),
  },
  {
    name: 'GospelOfTheMasses',
    rule: every(some('Spiritualist', 'FanaticSpiritualist')),
  },
  {
    name: 'IndenturedAssets',
    rule: every(
      some('Authoritarian', 'FanaticAuthoritarian'),
      none('CorporateHedonism', 'PleasureSeekers', 'SlaverGuilds')
    ),
  },
  {
    name: 'MediaConglomerate',
    rule: none('IdealisticFoundation'),
  },
  {
    name: 'NavalContractors',
    rule: every(
      some('Militarist', 'FanaticMilitarist'),
      none('CitizenService')
    ),
  },
  {
    name: 'PrivateMilitaryCompanies',
    rule: every(
      some('Militarist', 'FanaticMilitarist'),
      none('WarriorCulture')
    ),
  },
  {
    name: 'RuthlessCompetition',
    rule: none('Meritocracy'),
  },
  {
    name: 'CatalyticRecyclers',
    rule: none('CatalyticProcessing', 'CalamitousBirth'),
  },
  {
    name: 'MastercraftInc',
    rule: none('MasterfulCrafters'),
  },
  {
    name: 'CorporateHedonism',
    rule: none('IndenturedAssets', 'PleasureSeekers', 'SlaverGuilds'),
  },
  {
    name: 'PublicRelationsSpecialists',
    rule: none('DiplomaticCorps'),
  },
  {
    name: 'CorporateDeathCult',
    rule: every(
      some('Spiritualist', 'FanaticSpiritualist'),
      none('Necrophage', 'InwardPerfection', 'FanaticPurifiers')
    ),
  },
  {
    name: 'PermanentEmployment',
    rule: none(
      'Egalitarian',
      'FanaticEgalitarian',
      'Mechanist',
      'CloneArmy',
      'Necrophage'
    ),
  },
  {
    name: 'CorporateAnglers',
    rule: none(
      'AgrarianIdyll',
      'PostApocalyptic',
      'ShatteredRing',
      'VoidDwellers',
      'Subterranean'
    ),
  },
]

const civicsHive = [
  { name: 'Ascetic' },
  { name: 'DividedAttention' },
  { name: 'NaturalNeuralNetwork' },
  { name: 'OneMind' },
  { name: 'PooledKnowledge' },
  { name: 'StrengthOfLegions' },
  { name: 'SubspaceEphapse' },
  { name: 'SubsumedWill' },
  {
    name: 'DevouringSwarm',
    rule: none('Lithoid'),
  },
  {
    name: 'HiveOrganicReprocessing',
    rule: none('CalamitousBirth'),
  },
  {
    name: 'HiveIdyllicBloom',
    rule: every('Botanic'),
  },
  {
    name: 'Terravore',
    rule: every('Lithoid'),
  },
  {
    name: 'Empath',
    rule: none('DevouringSwarm', 'Terravore', 'Necrophage'),
  },
  {
    name: 'HiveMemorialist',
    rule: none('DevouringSwarm', 'Terravore'),
  },
]

const civicsMachine = [
  { name: 'Constructobot' },
  { name: 'DelegatedFunctions' },
  { name: 'FactoryOverclocking' },
  { name: 'Introspective' },
  { name: 'MaintenanceProtocols' },
  { name: 'OTAUpdates' },
  { name: 'RapidReplicator' },
  { name: 'Rockbreakers' },
  { name: 'StaticResearchAnalysis' },
  { name: 'UnitaryCohesion' },
  { name: 'Warbots' },
  { name: 'ZeroWasteProtocols' },
  {
    name: 'DeterminedExterminator',
    rule: none('DrivenAssimilator', 'RogueServitor'),
  },
  {
    name: 'DrivenAssimilator',
    rule: none('DeterminedExterminator', 'RogueServitor'),
  },
  {
    name: 'RogueServitor',
    rule: none(
      'DeterminedExterminator',
      'DrivenAssimilator',
      'ResourceConsolidation'
    ),
  },
  {
    name: 'MachineOrganicReprocessing',
    rule: none('ResourceConsolidation'),
  },
  {
    name: 'MachineMemorialist',
    rule: none('DeterminedExterminator', 'DrivenAssimilator'),
  },
]

const civics = Item.create(Civic, [
  ...civicsNormal,
  ...civicsCorporate,
  ...civicsHive,
  ...civicsMachine,
])
