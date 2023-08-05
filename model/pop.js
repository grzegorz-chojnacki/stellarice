// @ts-check
/// <reference path="../paths.js" />

class Pop extends Item {
  empireList = empire.pop

  isAvailable = () => this.empireList.length === 0
}
