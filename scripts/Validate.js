"use strict"

const rootSelector = '[data-js-form]'

class FormsValidation {
  selectors = {
    form: '[data-js-form]',
    button: '[data-js-form-button]',
    errors: '[data-js-form-errors]',
  }

  errorMessages = {
    valueMissing: () => 'Пожалуйста, заполните это поле',
    patternMismatch: ({ title }) => title || 'Данные не соответствуют формату',
    tooLong: () => 'Слишком длинное значение, ограничение символов',
  }

  constructor() {
    this.bindEvents()
  }

  validateContact(contactControlElement) {
    const errors = contactControlElement.validity
    const errorMessages = []

    Object.entries(this.errorMessages).forEach(([errorType, getErrorMessage]) => {
      if (errors[errorType]) {
        errorMessages.push(getErrorMessage(contactControlElement))
      }
    })

    console.log(errorMessages)
  }

  onBlur(event) {
    const { target } = event
    const isForm = target.closest(this.selectors.form)
    const isRequired = target.required

    if (isForm && isRequired) {
      this.validateContact(target)
    }
  }

  bindEvents() {
    document.addEventListener('blur', (event) => {
      this.onBlur(event)
    }, { capture: true })
    
    document.addEventListener('submit', (event) => {
      event.preventDefault()

      const formData = new FormData(document.querySelector('form'))

      console.log(Object.fromEntries(formData))
    })
  }
}

class FormsColection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new FormsValidation(element)
    })
  }
}

export default FormsColection