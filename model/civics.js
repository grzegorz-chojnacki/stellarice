class Civic extends Item {
  constructor(rules) {
    super(rules)
    this.makeEmpireNamePlural()
  }

  corporateClash = () =>
    this.testClash(civicsCorporate, none(authority.Corporate))

  hiveClash = () => this.testClash(civicsHive, none(authority.HiveMind))

  machineClash = () =>
    this.testClash(civicsMachine, none(authority.MachineIntelligence))

  normalClash = () =>
    this.testClash(
      civicsNormal,
      some(
        ethics.Gestalt,
        authority.Corporate,
        authority.HiveMind,
        authority.MachineIntelligence
      )
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

const civicsNormal = {
  CutthroatPolitics: new Civic(),
  EfficientBureaucracy: new Civic(),
  Environmentalist: new Civic(),
  FunctionalArchitecture: new Civic(),
  MiningGuilds: new Civic(),
  AgrarianIdyll: new Civic(() =>
    every(
      some(ethics.Pacifist, ethics.FanaticPacifist),
      none(civics.Anglers, origin.PostApocalyptic, origin.Remnants)
    )
  ),
  AristocraticElite: new Civic(() =>
    every(
      some(authority.Oligarchic, authority.Imperial),
      none(
        ethics.Egalitarian,
        ethics.FanaticEgalitarian,
        civics.ExaltedPriesthood,
        civics.MerchantGuilds,
        civics.Technocracy
      )
    )
  ),
  BeaconOfLiberty: new Civic(() =>
    every(
      some(authority.Oligarchic, authority.Imperial),
      some(ethics.Egalitarian, ethics.FanaticEgalitarian),
      none(ethics.Xenophobe, ethics.FanaticXenophobe)
    )
  ),
  CitizenService: new Civic(() =>
    every(
      some(authority.Democratic, authority.Oligarchic),
      some(ethics.Militarist, ethics.FanaticMilitarist),
      none(ethics.FanaticXenophile, civics.Reanimators)
    )
  ),
  CorveeSystem: new Civic(() =>
    none(ethics.Egalitarian, ethics.FanaticEgalitarian, civics.FreeHaven)
  ),
  DistinguishedAdmiralty: new Civic(() =>
    some(ethics.Militarist, ethics.FanaticMilitarist)
  ),
  ExaltedPriesthood: new Civic(() =>
    every(
      some(authority.Oligarchic, authority.Dictatorial),
      some(ethics.Spiritualist, ethics.FanaticSpiritualist),
      none(civics.MerchantGuilds, civics.AristocraticElite, civics.Technocracy)
    )
  ),
  FeudalSociety: new Civic(() => every(authority.Imperial)),
  FreeHaven: new Civic(() =>
    every(
      some(ethics.Xenophile, ethics.FanaticXenophile),
      none(civics.CorveeSystem)
    )
  ),
  IdealisticFoundation: new Civic(() =>
    every(some(ethics.Egalitarian, ethics.FanaticEgalitarian))
  ),
  ImperialCult: new Civic(() =>
    every(
      authority.Imperial,
      some(ethics.Spiritualist, ethics.FanaticSpiritualist),
      some(ethics.Authoritarian, ethics.FanaticAuthoritarian)
    )
  ),
  InwardPerfection: new Civic(() =>
    every(
      some(ethics.Pacifist, ethics.FanaticPacifist),
      some(ethics.Xenophobe, ethics.FanaticXenophobe),
      none(civics.PompousPurists)
    )
  ),
  Meritocracy: new Civic(() =>
    some(authority.Democratic, authority.Oligarchic)
  ),
  NationalisticZeal: new Civic(() =>
    some(ethics.Militarist, ethics.FanaticMilitarist)
  ),
  ParliamentarySystem: new Civic(() => every(authority.Democratic)),
  PhilosopherKing: new Civic(() =>
    some(authority.Dictatorial, authority.Imperial)
  ),
  PoliceState: new Civic(() => none(ethics.FanaticEgalitarian)),
  ShadowCouncil: new Civic(() => none(authority.Imperial)),
  SlaverGuilds: new Civic(() =>
    every(
      some(ethics.Authoritarian, ethics.FanaticAuthoritarian),
      none(civics.PleasureSeekers)
    )
  ),
  Technocracy: new Civic(() =>
    every(
      some(ethics.Materialist, ethics.FanaticMaterialist),
      none(
        civics.AristocraticElite,
        civics.ExaltedPriesthood,
        civics.MerchantGuilds,
        civics.SharedBurdens
      )
    )
  ),
  WarriorCulture: new Civic(() =>
    every(some(ethics.Militarist, ethics.FanaticMilitarist))
  ),
  CatalyticProcessing: new Civic(() => none(origin.CalamitousBirth)),
  IdyllicBloom: new Civic(() => every(pop.Botanic, none(origin.VoidDwellers))),
  FanaticPurifiers: new Civic(() =>
    every(
      ethics.FanaticXenophobe,
      some(ethics.Militarist, ethics.Spiritualist),
      none(
        civics.BarbaricDespoilers,
        civics.PompousPurists,
        origin.SyncreticEvolution,
        origin.CommonGround,
        origin.Hegemon
      )
    )
  ),
  MasterfulCrafters: new Civic(),
  PleasureSeekers: new Civic(() =>
    none(civics.SlaverGuilds, civics.WarriorCulture, civics.SharedBurdens)
  ),
  PompousPurists: new Civic(() =>
    every(
      some(ethics.Xenophobe, ethics.FanaticXenophobe),
      none(
        civics.InwardPerfection,
        civics.FanaticPurifiers,
        origin.CommonGround
      )
    )
  ),
  BarbaricDespoilers: new Civic(() =>
    every(
      some(ethics.Militarist, ethics.Spiritualist),
      some(
        ethics.Authoritarian,
        ethics.FanaticAuthoritarian,
        ethics.Xenophobe,
        ethics.FanaticXenophobe
      ),
      none(
        ethics.Xenophile,
        ethics.FanaticXenophile,
        civics.FanaticPurifiers,
        origin.CommonGround
      )
    )
  ),
  ByzantineBureaucracy: new Civic(() =>
    none(ethics.Spiritualist, ethics.FanaticSpiritualist)
  ),
  MerchantGuilds: new Civic(() =>
    none(civics.ExaltedPriesthood, civics.AristocraticElite, civics.Technocracy)
  ),
  SharedBurdens: new Civic(() =>
    every(
      ethics.FanaticEgalitarian,
      none(
        ethics.Xenophobe,
        ethics.FanaticXenophobe,
        civics.Technocracy,
        civics.PleasureSeekers
      )
    )
  ),
  DiplomaticCorps: new Civic(() =>
    none(civics.InwardPerfection, civics.FanaticPurifiers)
  ),
  Memorialists: new Civic(() => none(civics.FanaticPurifiers)),
  Reanimators: new Civic(() =>
    none(ethics.Pacifist, ethics.FanaticPacifist, civics.CitizenService)
  ),
  DeathCult: new Civic(() =>
    every(
      some(ethics.Spiritualist, ethics.FanaticSpiritualist),
      none(civics.InwardPerfection, civics.FanaticPurifiers, origin.Necrophage)
    )
  ),
  Anglers: new Civic(() =>
    none(
      civics.AgrarianIdyll,
      origin.PostApocalyptic,
      origin.ShatteredRing,
      origin.VoidDwellers,
      origin.Subterranean
    )
  ),
}

const civicsCorporate = {
  CriminalHeritage: new Civic(),
  Franchising: new Civic(),
  FreeTraders: new Civic(),
  PrivateProspectors: new Civic(),
  TradingPosts: new Civic(),
  BrandLoyalty: new Civic(() => none(civics.BeaconOfLiberty)),
  GospelOfTheMasses: new Civic(() =>
    every(some(ethics.Spiritualist, ethics.FanaticSpiritualist))
  ),
  IndenturedAssets: new Civic(() =>
    every(
      some(ethics.Authoritarian, ethics.FanaticAuthoritarian),
      none(
        civics.CorporateHedonism,
        civics.PleasureSeekers,
        civics.SlaverGuilds
      )
    )
  ),
  MediaConglomerate: new Civic(() => none(civics.IdealisticFoundation)),
  NavalContractors: new Civic(() =>
    every(
      some(ethics.Militarist, ethics.FanaticMilitarist),
      none(civics.CitizenService)
    )
  ),
  PrivateMilitaryCompanies: new Civic(() =>
    every(
      some(ethics.Militarist, ethics.FanaticMilitarist),
      none(civics.WarriorCulture)
    )
  ),
  RuthlessCompetition: new Civic(() => none(civics.Meritocracy)),
  CatalyticRecyclers: new Civic(() =>
    none(civics.CatalyticProcessing, origin.CalamitousBirth)
  ),
  MastercraftInc: new Civic(() => none(civics.MasterfulCrafters)),
  CorporateHedonism: new Civic(() =>
    none(civics.IndenturedAssets, civics.PleasureSeekers, civics.SlaverGuilds)
  ),
  PublicRelationsSpecialists: new Civic(() => none(civics.DiplomaticCorps)),
  CorporateDeathCult: new Civic(() =>
    every(
      some(ethics.Spiritualist, ethics.FanaticSpiritualist),
      none(origin.Necrophage, civics.InwardPerfection, civics.FanaticPurifiers)
    )
  ),
  PermanentEmployment: new Civic(() =>
    none(
      ethics.Egalitarian,
      ethics.FanaticEgalitarian,
      origin.Mechanist,
      origin.CloneArmy,
      origin.Necrophage
    )
  ),
  CorporateAnglers: new Civic(() =>
    none(
      civics.AgrarianIdyll,
      origin.PostApocalyptic,
      origin.ShatteredRing,
      origin.VoidDwellers,
      origin.Subterranean
    )
  ),
}

const civicsHive = {
  Ascetic: new Civic(),
  DividedAttention: new Civic(),
  NaturalNeuralNetwork: new Civic(),
  OneMind: new Civic(),
  PooledKnowledge: new Civic(),
  StrengthOfLegions: new Civic(),
  SubspaceEphapse: new Civic(),
  SubsumedWill: new Civic(),
  DevouringSwarm: new Civic(() => none(pop.Lithoid)),
  HiveOrganicReprocessing: new Civic(() => none(origin.CalamitousBirth)),
  HiveIdyllicBloom: new Civic(() => every(pop.Botanic)),
  Terravore: new Civic(() => every(pop.Lithoid)),
  Empath: new Civic(() =>
    none(civics.DevouringSwarm, civics.Terravore, origin.Necrophage)
  ),
  HiveMemorialist: new Civic(() =>
    none(civics.DevouringSwarm, civics.Terravore)
  ),
}

const civicsMachine = {
  Constructobot: new Civic(),
  DelegatedFunctions: new Civic(),
  FactoryOverclocking: new Civic(),
  Introspective: new Civic(),
  MaintenanceProtocols: new Civic(),
  OTAUpdates: new Civic(),
  RapidReplicator: new Civic(),
  Rockbreakers: new Civic(),
  StaticResearchAnalysis: new Civic(),
  UnitaryCohesion: new Civic(),
  Warbots: new Civic(),
  ZeroWasteProtocols: new Civic(),
  DeterminedExterminator: new Civic(() =>
    none(civics.DrivenAssimilator, civics.RogueServitor)
  ),
  DrivenAssimilator: new Civic(() =>
    none(civics.DeterminedExterminator, civics.RogueServitor)
  ),
  RogueServitor: new Civic(() =>
    none(
      civics.DeterminedExterminator,
      civics.DrivenAssimilator,
      origin.ResourceConsolidation
    )
  ),
  MachineOrganicReprocessing: new Civic(() =>
    none(origin.ResourceConsolidation)
  ),
  MachineMemorialist: new Civic(() =>
    none(civics.DeterminedExterminator, civics.DrivenAssimilator)
  ),
}

const civics = nameItems({
  ...civicsNormal,
  ...civicsCorporate,
  ...civicsHive,
  ...civicsMachine,
})
