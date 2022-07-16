class Civic extends Item {
  constructor(name, rules) {
    super(name, rules)
    this.empireName += 's'
  }

  genericConstraint = () => (this.empireList.length < 2)
}

const civicsNormal = {
  CutthroatPolitics:      new Civic('Cutthroat Politics'),
  EfficientBureaucracy:   new Civic('Efficient Bureaucracy'),
  Environmentalist:       new Civic('Environmentalist'),
  FunctionalArchitecture: new Civic('Functional Architecture'),
  MiningGuilds:           new Civic('Mining Guilds'),
  AgrarianIdyll:          new Civic('Agrarian Idyll'),
  AristocraticElite:      new Civic('Aristocratic Elite'),
  BeaconOfLiberty:        new Civic('Beacon of Liberty'),
  CitizenService:         new Civic('Citizen Service'),
  CorporateDominion:      new Civic('Corporate Dominion'),
  CorvéeSystem:           new Civic('Corvée System'),
  DistinguishedAdmiralty: new Civic('Distinguished Admiralty'),
  ExaltedPriesthood:      new Civic('Exalted Priesthood'),
  FeudalSociety:          new Civic('Feudal Society'),
  FreeHaven:              new Civic('Free Haven'),
  IdealisticFoundation:   new Civic('Idealistic Foundation'),
  ImperialCult:           new Civic('Imperial Cult'),
  InwardPerfection:       new Civic('Inward Perfection'),
  Meritocracy:            new Civic('Meritocracy'),
  NationalisticZeal:      new Civic('Nationalistic Zeal'),
  ParliamentarySystem:    new Civic('Parliamentary System'),
  PhilosopherKing:        new Civic('Philosopher King'),
  PoliceState:            new Civic('Police State'),
  ShadowCouncil:          new Civic('Shadow Council'),
  SlaverGuilds:           new Civic('Slaver Guilds'),
  Technocracy:            new Civic('Technocracy'),
  WarriorCulture:         new Civic('Warrior Culture'),
  CatalyticProcessing:    new Civic('Catalytic Processing'),
  IdyllicBloom:           new Civic('Idyllic Bloom'),
  FanaticPurifiers:       new Civic('Fanatic Purifiers'),
  MasterfulCrafters:      new Civic('Masterful Crafters'),
  PleasureSeekers:        new Civic('Pleasure Seekers'),
  PompousPurists:         new Civic('Pompous Purists'),
  BarbaricDespoilers:     new Civic('Barbaric Despoilers'),
  ByzantineBureaucracy:   new Civic('Byzantine Bureaucracy'),
  MerchantGuilds:         new Civic('Merchant Guilds'),
  DiplomaticCorps:        new Civic('Diplomatic Corps'),
  Memorialists:           new Civic('Memorialists'),
  Reanimators:            new Civic('Reanimators'),
  DeathCult:              new Civic('Death Cult'),
  Anglers:                new Civic('Anglers'),
}

const civicsCorporate = {
  CriminalHeritage:           new Civic('Criminal Heritage'),
  Franchising:                new Civic('Franchising'),
  FreeTraders:                new Civic('Free Traders'),
  PrivateProspectors:         new Civic('Private Prospectors'),
  TradingPosts:               new Civic('Trading Posts'),
  BrandLoyalty:               new Civic('Brand Loyalty'),
  GospelOfTheMasses:          new Civic('Gospel of the Masses'),
  IndenturedAssets:           new Civic('Indentured Assets'),
  MediaConglomerate:          new Civic('Media Conglomerate'),
  NavalContractors:           new Civic('Naval Contractors'),
  PrivateMilitaryCompanies:   new Civic('Private Military Companies'),
  RuthlessCompetition:        new Civic('Ruthless Competition'),
  CatalyticRecyclers:         new Civic('Catalytic Recyclers'),
  MastercraftInc:             new Civic('Mastercraft Inc.'),
  CorporateHedonism:          new Civic('Corporate Hedonism'),
  PublicRelationsSpecialists: new Civic('Public Relations Specialists'),
  CorporateDeathCult:         new Civic('Corporate Death Cult'),
  PermanentEmployment:        new Civic('Permanent Employment'),
  CorporateAnglers:           new Civic('Anglers'),
}

const civicsHive = {
  Ascetic:                 new Civic('Ascetic'),
  DividedAttention:        new Civic('Divided Attention'),
  NaturalNeuralNetwork:    new Civic('Natural Neural Network'),
  OneMind:                 new Civic('One Mind'),
  PooledKnowledge:         new Civic('Pooled Knowledge'),
  StrengthOfLegions:       new Civic('Strength of Legions'),
  SubspaceEphapse:         new Civic('Subspace Ephapse'),
  SubsumedWill:            new Civic('Subsumed Will'),
  DevouringSwarm:          new Civic('Devouring Swarm'),
  HiveOrganicReprocessing: new Civic('Organic Reprocessing'),
  HiveIdyllicBloom:        new Civic('Idyllic Bloom'),
  Terravore:               new Civic('Terravore'),
  Empath:                  new Civic('Empath'),
  HiveMemorialist:         new Civic('Memorialist'),
}

const civicsMachine = {
  Constructobot:              new Civic('Constructobot'),
  DelegatedFunctions:         new Civic('Delegated Functions'),
  FactoryOverclocking:        new Civic('Factory Overclocking'),
  Introspective:              new Civic('Introspective'),
  MaintenanceProtocols:       new Civic('Maintenance Protocols'),
  OTAUpdates:                 new Civic('OTA Updates'),
  RapidReplicator:            new Civic('Rapid Replicator'),
  Rockbreakers:               new Civic('Rockbreakers'),
  StaticResearchAnalysis:     new Civic('Static Research Analysis'),
  UnitaryCohesion:            new Civic('Unitary Cohesion'),
  Warbots:                    new Civic('Warbots'),
  ZeroWasteProtocols:         new Civic('Zero-Waste Protocols'),
  DeterminedExterminator:     new Civic('Determined Exterminator'),
  DrivenAssimilator:          new Civic('Driven Assimilator'),
  RogueServitor:              new Civic('Rogue Servitor'),
  MachineOrganicReprocessing: new Civic('Organic Reprocessing'),
  MachineMemorialist:         new Civic('Memorialist'),
}

const civics = {
  ...civicsNormal,
  ...civicsCorporate,
  ...civicsHive,
  ...civicsMachine,
}
