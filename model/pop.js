class Pop {
  constructor(name) { this.name = name }

  checked = () => empire.pop.includes(this)

  valid = () => {
    if (this.checked()) return true
    return (empire.pop.length == 0)
  }
}

const pBiological = new Pop('Biological')
const pMechanical = new Pop('Mechanical')
const pLithoid    = new Pop('Lithoid')

const pop = [
  pBiological,
  pMechanical,
  pLithoid,
]