class Pop {
  constructor(name) { this.name = name }

  checked = () => empire.pop.includes(this)

  valid = () => {
    if (this.checked()) return true
    return (empire.pop.length == 0)
  }
}

const pop = {
  Biological: new Pop('Biological'),
  Mechanical: new Pop('Mechanical'),
  Lithoid:    new Pop('Lithoid'),
}