// @ts-check
/// <reference path="../paths.js" />

class Civic extends Item {
  empireList = empire.civics

  isAvailable = () => this.empireList.length < 2
}
