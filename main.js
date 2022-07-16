const template = {
  ethics: [],
  traits: [],
  civics: [],
  authority: [],
  origin: [],
  pop: []
}

const all = { pop, traits, origin, ethics, authority, civics }

const empire = deepCopy(template)

const sections = [
  {
    name: 'pop',
    template: item => `
      <div>
        <input
          type="radio"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>
      </div>`
  },
  {
    name: 'traits',
    template: item => `
      <div>
        <input
          type="checkbox"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>
      </div>`
  },
  {
    name: 'origin',
    template: item => `
      <div>
        <input
          type="radio"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>
      </div>`
  },
  {
    name: 'ethics',
    template: item => `
      <div>
        <input
          type="checkbox"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>
      </div>`
  },
  {
    name: 'authority',
    template: item => `
      <div>
        <input
          type="radio"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>
      </div>`
  },
  {
    name: 'civics',
    template: item => `
      <div>
        <input
          type="checkbox"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>
      </div>`
  },
]

const main = document.getElementsByTagName('main')[0]

const render = () => {
  main.innerHTML = ''
  sections.forEach(({ name, template }) => {
    const section = htmlToElement('<section></section>')
    section.appendChild(htmlToElement(`<h2>${capitalize(name)}</h2>`))

    Object.values(all[name]).forEach(item => {
      const element = htmlToElement(template(item))
      const input = element.getElementsByTagName('input')[0]
      input.onclick = () => {
        toggleIncluded(empire[name], item)
        render()
      }
      section.appendChild(element)
    })

    main.appendChild(section)
  })
}

bruteForceDependencies(all)

render()
