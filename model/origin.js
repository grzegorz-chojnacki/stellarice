class Origin extends Item {
  constructor(name, rules) {
    super(name, rules)
  }

  genericConstraint = () => (empire.origin.length === 0)
}

const origin = {
  ProsperousUnification:  () => new Origin('Prosperous Unification'),
  GalacticDoorstep:       () => new Origin('Galactic Doorstep'),
  LostColony:             () => new Origin('Lost Colony'),
  Mechanist:              () => new Origin('Mechanist'),
  SyncreticEvolution:     () => new Origin('Syncretic Evolution'),
  TreeOfLife:             () => new Origin('Tree of Life'),
  ResourceConsolidation:  () => new Origin('Resource Consolidation'),
  CloneArmy:              () => new Origin('Clone Army'),
  LifeSeeded:             () => new Origin('Life-Seeded'),
  PostApocalyptic:        () => new Origin('Post-Apocalyptic'),
  Remnants:               () => new Origin('Remnants'),
  CalamitousBirth:        () => new Origin('Calamitous Birth'),
  CommonGround:           () => new Origin('Common Ground'),
  Hegemon:                () => new Origin('Hegemon'),
  Doomsday:               () => new Origin('Doomsday'),
  OnTheShouldersOfGiants: () => new Origin('On the Shoulders of Giants'),
  Scion:                  () => new Origin('Scion'),
  ShatteredRing:          () => new Origin('Shattered Ring'),
  VoidDwellers:           () => new Origin('Void Dwellers'),
  Necrophage:             () => new Origin('Necrophage'),
  HereBeDragons:          () => new Origin('Here Be Dragons'),
  OceanParadise:          () => new Origin('Ocean Paradise'),
  SlingshotToTheStars:    () => new Origin('Slingshot to the Stars'),
  ImperialFiefdom:        () => new Origin('Imperial Fiefdom'),
  Subterranean:           () => new Origin('Subterranean'),
  TeachersOfTheShroud:    () => new Origin('Teachers of the Shroud'),
  ProgenitorHive:         () => new Origin('Progenitor Hive'),
}
