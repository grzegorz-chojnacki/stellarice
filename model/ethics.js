// @ts-check
/// <reference path="../paths.js" />

class Ethic extends Item {
  /** @type {(acc: number, o: { cost: number }) => number} */
  static costSum = (acc, { cost }) => acc - cost

  empireList = empire.ethics

  isAvailable = () => this.empireList.reduce(Ethic.costSum, 3) - this.cost >= 0
}
