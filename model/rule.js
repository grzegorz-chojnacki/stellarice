class Rule {
  text = 'No special rules'

  constructor(items = []) {
    this.items = items
  }

  // Remove elements from rules recursively
  without = x => {
      this.items.forEach((item, i) => {
        if (item === x) this.items.splice(i, 1)
        if (x instanceof Rule) i.without(x)
      })
      return this
    }

  // Checks if rule is passing, should call match for every item
  test = () => true

  // Checks if a given item from items is passing
  match = x => {
    if (x instanceof Item) return x.checked()
    if (x instanceof Rule) return x.test()
  }
}

// Every subitem is true
class Every extends Rule {
  text = 'Must have'
  test = () => this.items.every(this.match)
}

// At least one subitem is true
class Some extends Rule {
  text = 'At least one of'
  test = () => this.items.some(this.match)
}

// None of the subitems are true
class None extends Rule {
  text = 'Cannot have'
  test = () => !this.items.some(this.match)
}

// Syntax sugar for creating rule objects
const some = (...items) => new Some(items)
const none = (...items) => new None(items)
const every = (...items) => new Every(items)
const oneof = (...items) => () => none(...items)
