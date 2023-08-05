// @ts-check
/// <reference path="../paths.js" />

class Trait extends Item {
  /** @type {(acc: number, o: { cost: number }) => number } */
  static costSum = (acc, { cost }) => acc - cost

  empireList = empire.traits

  get label() {
    return `[${this.cost.toString().padStart(2)}] ${this.id}`
  }

  isAvailable = () => this.empireList.length < 5
}
