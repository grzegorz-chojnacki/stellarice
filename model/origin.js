// @ts-check
/// <reference path="../paths.js" />

class Origin extends Item {
  empireList = empire.origin

  isAvailable = () => this.empireList.length === 0
}
