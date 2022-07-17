class Origin extends Item {
  constructor(rules) {
    super(rules)
  }

  generalRule = () => empire.origin.length === 0
}

const origin = nameItems({
  ProsperousUnification: new Origin(),
  GalacticDoorstep: new Origin(),
  LostColony: new Origin(() => none(ethics.Gestalt)),
  Mechanist: new Origin(() =>
    every(
      some(ethics.Materialist, ethics.FanaticMaterialist),
      none(ethics.Gestalt, civics.PermanentEmployment)
    )
  ),
  SyncreticEvolution: new Origin(() =>
    none(ethics.Gestalt, civics.FanaticPurifiers)
  ),
  TreeOfLife: new Origin(() =>
    every(authority.HiveMind, none(civics.DevouringSwarm, civics.Terravore))
  ),
  ResourceConsolidation: new Origin(() =>
    every(
      authority.MachineIntelligence,
      none(civics.RogueServitor, civics.MachineOrganicReprocessing)
    )
  ),
  CloneArmy: new Origin(() => none(ethics.Gestalt, civics.PermanentEmployment)),
  LifeSeeded: new Origin(() => none(authority.MachineIntelligence)),
  PostApocalyptic: new Origin(() =>
    none(
      authority.MachineIntelligence,
      civics.AgrarianIdyll,
      civics.Anglers,
      civics.CorporateAnglers
    )
  ),
  Remnants: new Origin(() => none(civics.AgrarianIdyll)),
  CalamitousBirth: new Origin(() =>
    every(
      pop.Lithoid,
      none(
        civics.CatalyticProcessing,
        civics.CatalyticRecyclers,
        civics.HiveOrganicReprocessing,
        civics.MachineOrganicReprocessing
      )
    )
  ),
  CommonGround: new Origin(() =>
    none(
      ethics.Xenophile,
      ethics.FanaticXenophile,
      ethics.Xenophobe,
      ethics.FanaticXenophobe,
      ethics.Gestalt,
      civics.InwardPerfection,
      civics.FanaticPurifiers,
      civics.BarbaricDespoilers
    )
  ),
  Hegemon: new Origin(() =>
    none(
      ethics.Xenophobe,
      ethics.FanaticXenophobe,
      ethics.Egalitarian,
      ethics.FanaticEgalitarian,
      ethics.Gestalt,
      civics.InwardPerfection,
      civics.FanaticPurifiers
    )
  ),
  Doomsday: new Origin(),
  OnTheShouldersOfGiants: new Origin(() => none(ethics.Gestalt)),
  Scion: new Origin(() =>
    none(ethics.Gestalt, ethics.FanaticXenophobe, civics.PompousPurists)
  ),
  ShatteredRing: new Origin(() =>
    none(civics.AgrarianIdyll, civics.Anglers, civics.CorporateAnglers)
  ),
  VoidDwellers: new Origin(() =>
    none(
      ethics.Gestalt,
      civics.AgrarianIdyll,
      civics.Anglers,
      civics.CorporateAnglers,
      civics.IdyllicBloom,
      civics.HiveIdyllicBloom
    )
  ),
  Necrophage: new Origin(() =>
    none(
      authority.MachineIntelligence,
      ethics.Xenophile,
      ethics.FanaticXenophile,
      ethics.FanaticEgalitarian,
      civics.DeathCult,
      civics.CorporateDeathCult,
      civics.Empath,
      civics.PermanentEmployment
    )
  ),
  HereBeDragons: new Origin(() =>
    none(
      civics.FanaticPurifiers,
      civics.DevouringSwarm,
      civics.DeterminedExterminator
    )
  ),
  OceanParadise: new Origin(() => none(authority.MachineIntelligence)),
  SlingshotToTheStars: new Origin(),
  ImperialFiefdom: new Origin(() =>
    none(
      civics.InwardPerfection,
      civics.DrivenAssimilator,
      civics.FanaticPurifiers,
      civics.DevouringSwarm,
      civics.DeterminedExterminator
    )
  ),
  Subterranean: new Origin(() => none(authority.MachineIntelligence)),
  TeachersOfTheShroud: new Origin(() =>
    every(
      some(ethics.Spiritualist, ethics.FanaticSpiritualist),
      none(civics.FanaticPurifiers)
    )
  ),
  ProgenitorHive: new Origin(() => every(authority.HiveMind)),
})
