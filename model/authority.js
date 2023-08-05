// @ts-check
/// <reference path="../paths.js" />

class Authority extends Item {
  empireList = empire.authority

  isAvailable = () => this.empireList.length === 0
}
