class Civic extends Item {
  constructor(item) {
    super(item)
    this.makeEmpireNamePlural()
  }

  generalRule = () => this.empireList.length < 2
}

const civicsNormal = Item.create(Civic, [
  { id: 'CutthroatPolitics' },
  { id: 'EfficientBureaucracy' },
  { id: 'Environmentalist' },
  { id: 'FunctionalArchitecture' },
  { id: 'MiningGuilds' },
  {
    id: 'AgrarianIdyll',
    rule: every(
      some('Pacifist', 'FanaticPacifist'),
      none('Anglers', 'PostApocalyptic', 'Remnants')
    ),
  },
  {
    id: 'AristocraticElite',
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
    id: 'BeaconOfLiberty',
    rule: every(
      some('Oligarchic', 'Imperial'),
      some('Egalitarian', 'FanaticEgalitarian'),
      none('Xenophobe', 'FanaticXenophobe')
    ),
  },
  {
    id: 'CitizenService',
    rule: every(
      some('Democratic', 'Oligarchic'),
      some('Militarist', 'FanaticMilitarist'),
      none('FanaticXenophile', 'Reanimators')
    ),
  },
  {
    id: 'CorveeSystem',
    rule: none('Egalitarian', 'FanaticEgalitarian', 'FreeHaven'),
  },
  {
    id: 'DistinguishedAdmiralty',
    rule: some('Militarist', 'FanaticMilitarist'),
  },
  {
    id: 'ExaltedPriesthood',
    rule: every(
      some('Oligarchic', 'Dictatorial'),
      some('Spiritualist', 'FanaticSpiritualist'),
      none('MerchantGuilds', 'AristocraticElite', 'Technocracy')
    ),
  },
  {
    id: 'FeudalSociety',
    rule: every('Imperial'),
  },
  {
    id: 'FreeHaven',
    rule: every(some('Xenophile', 'FanaticXenophile'), none('CorveeSystem')),
  },
  {
    id: 'IdealisticFoundation',
    rule: every(some('Egalitarian', 'FanaticEgalitarian')),
  },
  {
    id: 'ImperialCult',
    rule: every(
      'Imperial',
      some('Spiritualist', 'FanaticSpiritualist'),
      some('Authoritarian', 'FanaticAuthoritarian')
    ),
  },
  {
    id: 'InwardPerfection',
    rule: every(
      some('Pacifist', 'FanaticPacifist'),
      some('Xenophobe', 'FanaticXenophobe'),
      none('PompousPurists')
    ),
  },
  {
    id: 'Meritocracy',
    rule: some('Democratic', 'Oligarchic'),
  },
  {
    id: 'NationalisticZeal',
    rule: some('Militarist', 'FanaticMilitarist'),
  },
  {
    id: 'ParliamentarySystem',
    rule: every('Democratic'),
  },
  {
    id: 'PhilosopherKing',
    rule: some('Dictatorial', 'Imperial'),
  },
  {
    id: 'PoliceState',
    rule: none('FanaticEgalitarian'),
  },
  {
    id: 'ShadowCouncil',
    rule: none('Imperial'),
  },
  {
    id: 'SlaverGuilds',
    rule: every(
      some('Authoritarian', 'FanaticAuthoritarian'),
      none('PleasureSeekers')
    ),
  },
  {
    id: 'Technocracy',
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
    id: 'WarriorCulture',
    rule: every(some('Militarist', 'FanaticMilitarist')),
  },
  {
    id: 'CatalyticProcessing',
    rule: none('CalamitousBirth'),
  },
  {
    id: 'IdyllicBloom',
    rule: every('Botanic', none('VoidDwellers')),
  },
  {
    id: 'FanaticPurifiers',
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
  { id: 'MasterfulCrafters' },
  {
    id: 'PleasureSeekers',
    rule: none('SlaverGuilds', 'WarriorCulture', 'SharedBurdens'),
  },
  {
    id: 'PompousPurists',
    rule: every(
      some('Xenophobe', 'FanaticXenophobe'),
      none('InwardPerfection', 'FanaticPurifiers', 'CommonGround')
    ),
  },
  {
    id: 'BarbaricDespoilers',
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
    id: 'ByzantineBureaucracy',
    rule: none('Spiritualist', 'FanaticSpiritualist'),
  },
  {
    id: 'MerchantGuilds',
    rule: none('ExaltedPriesthood', 'AristocraticElite', 'Technocracy'),
  },
  {
    id: 'SharedBurdens',
    rule: every(
      'FanaticEgalitarian',
      none('Xenophobe', 'FanaticXenophobe', 'Technocracy', 'PleasureSeekers')
    ),
  },
  {
    id: 'DiplomaticCorps',
    rule: none('InwardPerfection', 'FanaticPurifiers'),
  },
  {
    id: 'Memorialists',
    rule: none('FanaticPurifiers'),
  },
  {
    id: 'Reanimators',
    rule: none('Pacifist', 'FanaticPacifist', 'CitizenService'),
  },
  {
    id: 'DeathCult',
    rule: every(
      some('Spiritualist', 'FanaticSpiritualist'),
      none('InwardPerfection', 'FanaticPurifiers', 'Necrophage')
    ),
  },
  {
    id: 'Anglers',
    rule: none(
      'AgrarianIdyll',
      'PostApocalyptic',
      'ShatteredRing',
      'VoidDwellers',
      'Subterranean'
    ),
  },
]).map(
  Item.withRule(none('Corporate', 'HiveMind', 'MachineIntelligence'))
)

const civicsCorporate = Item.create(Civic, [
  { id: 'CriminalHeritage' },
  { id: 'Franchising' },
  { id: 'FreeTraders' },
  { id: 'PrivateProspectors' },
  { id: 'TradingPosts' },
  {
    id: 'BrandLoyalty',
    rule: none('BeaconOfLiberty'),
  },
  {
    id: 'GospelOfTheMasses',
    rule: every(some('Spiritualist', 'FanaticSpiritualist')),
  },
  {
    id: 'IndenturedAssets',
    rule: every(
      some('Authoritarian', 'FanaticAuthoritarian'),
      none('CorporateHedonism', 'PleasureSeekers', 'SlaverGuilds')
    ),
  },
  {
    id: 'MediaConglomerate',
    rule: none('IdealisticFoundation'),
  },
  {
    id: 'NavalContractors',
    rule: every(
      some('Militarist', 'FanaticMilitarist'),
      none('CitizenService')
    ),
  },
  {
    id: 'PrivateMilitaryCompanies',
    rule: every(
      some('Militarist', 'FanaticMilitarist'),
      none('WarriorCulture')
    ),
  },
  {
    id: 'RuthlessCompetition',
    rule: none('Meritocracy'),
  },
  {
    id: 'CatalyticRecyclers',
    rule: none('CatalyticProcessing', 'CalamitousBirth'),
  },
  {
    id: 'MastercraftInc',
    rule: none('MasterfulCrafters'),
  },
  {
    id: 'CorporateHedonism',
    rule: none('IndenturedAssets', 'PleasureSeekers', 'SlaverGuilds'),
  },
  {
    id: 'PublicRelationsSpecialists',
    rule: none('DiplomaticCorps'),
  },
  {
    id: 'CorporateDeathCult',
    rule: every(
      some('Spiritualist', 'FanaticSpiritualist'),
      none('Necrophage', 'InwardPerfection', 'FanaticPurifiers')
    ),
  },
  {
    id: 'PermanentEmployment',
    rule: none(
      'Egalitarian',
      'FanaticEgalitarian',
      'Mechanist',
      'CloneArmy',
      'Necrophage'
    ),
  },
  {
    id: 'CorporateAnglers',
    rule: none(
      'AgrarianIdyll',
      'PostApocalyptic',
      'ShatteredRing',
      'VoidDwellers',
      'Subterranean'
    ),
  },
]).map(Item.withRule(some('Corporate')))

const civicsHive = Item.create(Civic, [
  { id: 'Ascetic' },
  { id: 'DividedAttention' },
  { id: 'NaturalNeuralNetwork' },
  { id: 'OneMind' },
  { id: 'PooledKnowledge' },
  { id: 'StrengthOfLegions' },
  { id: 'SubspaceEphapse' },
  { id: 'SubsumedWill' },
  {
    id: 'DevouringSwarm',
    rule: none('Lithoid'),
  },
  {
    id: 'HiveOrganicReprocessing',
    rule: none('CalamitousBirth'),
  },
  {
    id: 'HiveIdyllicBloom',
    rule: every('Botanic'),
  },
  {
    id: 'Terravore',
    rule: every('Lithoid'),
  },
  {
    id: 'Empath',
    rule: none('DevouringSwarm', 'Terravore', 'Necrophage'),
  },
  {
    id: 'HiveMemorialist',
    rule: none('DevouringSwarm', 'Terravore'),
  },
]).map(Item.withRule(some('HiveMind')))

const civicsMachine = Item.create(Civic, [
  { id: 'Constructobot' },
  { id: 'DelegatedFunctions' },
  { id: 'FactoryOverclocking' },
  { id: 'Introspective' },
  { id: 'MaintenanceProtocols' },
  { id: 'OTAUpdates' },
  { id: 'RapidReplicator' },
  { id: 'Rockbreakers' },
  { id: 'StaticResearchAnalysis' },
  { id: 'UnitaryCohesion' },
  { id: 'Warbots' },
  { id: 'ZeroWasteProtocols' },
  {
    id: 'DeterminedExterminator',
    rule: none('DrivenAssimilator', 'RogueServitor'),
  },
  {
    id: 'DrivenAssimilator',
    rule: none('DeterminedExterminator', 'RogueServitor'),
  },
  {
    id: 'RogueServitor',
    rule: none(
      'DeterminedExterminator',
      'DrivenAssimilator',
      'ResourceConsolidation'
    ),
  },
  {
    id: 'MachineOrganicReprocessing',
    rule: none('ResourceConsolidation'),
  },
  {
    id: 'MachineMemorialist',
    rule: none('DeterminedExterminator', 'DrivenAssimilator'),
  },
]).map(Item.withRule(some('MachineIntelligence')))

const civics = [
  ...civicsNormal,
  ...civicsCorporate,
  ...civicsHive,
  ...civicsMachine,
]
