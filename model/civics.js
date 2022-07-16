class Civic extends Item {
  constructor(rules) {
    super(rules)
    this.empireName += 's'
  }

  normalClash = () => (Object.values(civicsNormal).includes(this) && some(
      ethics.Gestalt,
      authority.Corporate,
      authority.HiveMind,
      authority.MachineIntelligence))

  corporateClash = () => (Object.values(civicsCorporate).includes(this)
      && none(authority.Corporate))

  hiveClash = () => (Object.values(civicsHive).includes(this)
      && none(authority.HiveMind))

  machineClash = () => (Object.values(civicsMachine).includes(this)
      && none(authority.MachineIntelligence))

  clashes = () => this.normalClash() || this.corporateClash()
      || this.hiveClash() || this.machineClash()

  hidden = () => !this.checked() && this.clashes()

  invalid = () => !(this.rules()) || this.clashes()

  genericConstraint = () => (this.empireList.length < 2)
}

const civicsNormal = {
  CutthroatPolitics:      new Civic(),
  EfficientBureaucracy:   new Civic(),
  Environmentalist:       new Civic(),
  FunctionalArchitecture: new Civic(),
  MiningGuilds:           new Civic(),
  AgrarianIdyll:          new Civic(),
  AristocraticElite:      new Civic(),
  BeaconOfLiberty:        new Civic(),
  CitizenService:         new Civic(),
  CorporateDominion:      new Civic(),
  CorvéeSystem:           new Civic(),
  DistinguishedAdmiralty: new Civic(),
  ExaltedPriesthood:      new Civic(),
  FeudalSociety:          new Civic(),
  FreeHaven:              new Civic(),
  IdealisticFoundation:   new Civic(),
  ImperialCult:           new Civic(),
  InwardPerfection:       new Civic(),
  Meritocracy:            new Civic(),
  NationalisticZeal:      new Civic(),
  ParliamentarySystem:    new Civic(),
  PhilosopherKing:        new Civic(),
  PoliceState:            new Civic(),
  ShadowCouncil:          new Civic(),
  SlaverGuilds:           new Civic(),
  Technocracy:            new Civic(),
  WarriorCulture:         new Civic(),
  CatalyticProcessing:    new Civic(),
  IdyllicBloom:           new Civic(),
  FanaticPurifiers:       new Civic(),
  MasterfulCrafters:      new Civic(),
  PleasureSeekers:        new Civic(),
  PompousPurists:         new Civic(),
  BarbaricDespoilers:     new Civic(),
  ByzantineBureaucracy:   new Civic(),
  MerchantGuilds:         new Civic(),
  DiplomaticCorps:        new Civic(),
  Memorialists:           new Civic(),
  Reanimators:            new Civic(),
  DeathCult:              new Civic(),
  Anglers:                new Civic(),
}

const civicsCorporate = {
  CriminalHeritage:           new Civic(),
  Franchising:                new Civic(),
  FreeTraders:                new Civic(),
  PrivateProspectors:         new Civic(),
  TradingPosts:               new Civic(),
  BrandLoyalty:               new Civic(),
  GospelOfTheMasses:          new Civic(),
  IndenturedAssets:           new Civic(),
  MediaConglomerate:          new Civic(),
  NavalContractors:           new Civic(),
  PrivateMilitaryCompanies:   new Civic(),
  RuthlessCompetition:        new Civic(),
  CatalyticRecyclers:         new Civic(),
  MastercraftInc:             new Civic(),
  CorporateHedonism:          new Civic(),
  PublicRelationsSpecialists: new Civic(),
  CorporateDeathCult:         new Civic(),
  PermanentEmployment:        new Civic(),
  CorporateAnglers:           new Civic(),
}

const civicsHive = {
  Ascetic:                 new Civic(),
  DividedAttention:        new Civic(),
  NaturalNeuralNetwork:    new Civic(),
  OneMind:                 new Civic(),
  PooledKnowledge:         new Civic(),
  StrengthOfLegions:       new Civic(),
  SubspaceEphapse:         new Civic(),
  SubsumedWill:            new Civic(),
  DevouringSwarm:          new Civic(),
  HiveOrganicReprocessing: new Civic(),
  HiveIdyllicBloom:        new Civic(),
  Terravore:               new Civic(),
  Empath:                  new Civic(),
  HiveMemorialist:         new Civic(),
}

const civicsMachine = {
  Constructobot:              new Civic(),
  DelegatedFunctions:         new Civic(),
  FactoryOverclocking:        new Civic(),
  Introspective:              new Civic(),
  MaintenanceProtocols:       new Civic(),
  OTAUpdates:                 new Civic(),
  RapidReplicator:            new Civic(),
  Rockbreakers:               new Civic(),
  StaticResearchAnalysis:     new Civic(),
  UnitaryCohesion:            new Civic(),
  Warbots:                    new Civic(),
  ZeroWasteProtocols:         new Civic(),
  DeterminedExterminator:     new Civic(),
  DrivenAssimilator:          new Civic(),
  RogueServitor:              new Civic(),
  MachineOrganicReprocessing: new Civic(),
  MachineMemorialist:         new Civic(),
}

const civics = nameItems({
  ...civicsNormal,
  ...civicsCorporate,
  ...civicsHive,
  ...civicsMachine,
})
