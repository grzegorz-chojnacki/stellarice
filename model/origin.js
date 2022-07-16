class Origin extends Item {
  constructor(name, rules) {
    super(name, rules)
  }

  genericConstraint = () => (empire.origin.length === 0)
}

const origin = {
  ProsperousUnification: new Origin('Prosperous Unification'),
  GalacticDoorstep: new Origin('Galactic Doorstep'),
  LostColony: new Origin('Lost Colony', () => none(ethics.Gestalt)),
  Mechanist: new Origin('Mechanist', () => every(
      some(ethics.Materialist, ethics.FanaticMaterialist),
      none(ethics.Gestalt, civics.PermanentEmployment)
  )),
  SyncreticEvolution: new Origin('Syncretic Evolution', () => none(
      ethics.Gestalt,
      civics.FanaticPurifiers
    )),
  TreeOfLife: new Origin('Tree of Life', () => every(
      every(authority.HiveMind),
      none(civics.DevouringSwarm, civics.Terravore)
    )),
  ResourceConsolidation: new Origin('Resource Consolidation', () => every(
      every(authority.MachineIntelligence),
      none(civics.RogueServitor, civics.OrganicReprocessing),
    )),
  CloneArmy: new Origin('Clone Army', () => none(
      ethics.Gestalt,
      civics.PermanentEmployment
    )),
  LifeSeeded: new Origin('Life-Seeded', () => none(
      authority.MachineIntelligence
    )),
  PostApocalyptic: new Origin('Post-Apocalyptic', () => none(
      authority.MachineIntelligence,
      civics.Agrarian,
      civics.Anglers, civics.CorporateAnglers,
    )),
  Remnants: new Origin('Remnants', () => none(
      civics.AgrarianIdyll
    )),
  CalamitousBirth: new Origin('Calamitous Birth', () => every(
      every(pop.Lithoid),
      none(
        civics.CatalyticProcessing,
        civics.CorporateCatalyticProcessing,
        civics.HiveCatalyticProcessing,
      )
    )),
  CommonGround: new Origin('Common Ground', () => none(
      ethics.Xenophile, ethics.FanaticXenophile,
      ethics.Xenophobe, ethics.FanaticXenophobe,
      ethics.Gestalt,
      civics.InwardsPerfection,
      civics.FanaticPurifiers,
      civics.BarbaricDespoilers,
    )),
  Hegemon: new Origin('Hegemon', () => none(
      ethics.Xenophobe, ethics.FanaticXenophobe,
      ethics.Egalitarian, ethics.FanaticEgalitarian,
      ethics.Gestalt,
      civics.InwardsPerfection,
      civics.FanaticPurifiers,
    )),
  Doomsday: new Origin('Doomsday'),
  OnTheShouldersOfGiants: new Origin('On the Shoulders of Giants', () => none(
      ethics.Gestalt
    )),
  Scion: new Origin('Scion', () => none(
      ethics.Gestalt,
      ethics.FanaticXenophobe,
      civics.PompousPurists,
    )),
  ShatteredRing: new Origin('Shattered Ring', () => none(
      civics.Agrarian,
      civics.Anglers, civics.CorporateAnglers,
    )),
  VoidDwellers: new Origin('Void Dwellers', () => none(
      ethics.Gestalt,
      civics.Agrarian,
      civics.Anglers, civics.CorporateAnglers,
      civics.IdyllicBloom, civics.HiveIdyllicBloom
    )),
  Necrophage: new Origin('Necrophage', () => none(
      authority.MachineIntelligence,
      ethics.Xenophile, ethics.FanaticXenophile,
      ethics.FanaticEgalitarian,
      civics.DeathCult, civics.CorporateDeathCult,
      civics.Empath,
      civics.PermanentEmployment,
    )),
  HereBeDragons: new Origin('Here Be Dragons', () => none(
      civics.FanaticPurifiers,
      civics.DevouringSwarm,
      civics.MachineTerminator,
    )),
  OceanParadise: new Origin('Ocean Paradise', () => none(
      authority.MachineIntelligence
    )),
  SlingshotToTheStars: new Origin('Slingshot to the Stars'),
  ImperialFiefdom: new Origin('Imperial Fiefdom', () => none(
      civics.InwardsPerfection,
      civics.DrivenAssimilator,
      civics.FanaticPurifiers,
      civics.DevouringSwarm,
      civics.MachineTerminator,
    )),
  Subterranean: new Origin('Subterranean', () => none(
      authority.MachineIntelligence
    )),
  TeachersOfTheShroud: new Origin('Teachers of the Shroud', () => every(
      every(ethics.Spiritualist, ethics.FanaticSpiritualist),
      none(civics.FanaticPurifiers)
    )),
  ProgenitorHive: new Origin('Progenitor Hive', () => none(
      authority.HiveMind
    )),
}
