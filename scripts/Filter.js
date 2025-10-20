"use strict"
const rootSelector = '[data-js-filter]'

class Filter {
    selectors = {
        root: rootSelector,
        button: '[data-js-filter-button]',
        content: '[data-js-filter-content]',
    }

    stateClasses = {
        isActive: 'is-active',
    }

    stateAtributes = {
        ariaSelected: 'aria-selected',
        tabIndex: 'tabindex',
    }

    constructor(rootElement) {
        this.rootElement = rootElement
        this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button)
        this.contentElements = this.rootElement.querySelectorAll(this.selectors.content)
        this.state = {
            activeTabIndex: [...this.buttonElements]
                .findIndex((buttonElement) => buttonElement.classList.contains(this.stateClasses.isActive)),
        }
        this.limitTabsIndex = this.buttonElements.length - 1
        this.bindEvents()
    }

    updateUI() {
        const { activeTabIndex } = this.state

        this.buttonElements.forEach((buttonElement, index) => {
            const isActive = index === activeTabIndex

            buttonElement.classList.toggle(this.stateClasses.isActive, isActive)
        })

        this.contentElements.forEach((contentElement, index) => {
            const isActive = index === activeTabIndex

            contentElement.classList.toggle(this.stateClasses.isActive, isActive)
        })
    }

    onButtonClick(buttonIndex) {
        this.state.activeTabIndex = buttonIndex
        this.updateUI()
    }

    bindEvents() {
        this.buttonElements.forEach((buttonElement, index) => {
            buttonElement.addEventListener('click', () => this.onButtonClick(index))
        })
    }
}

class FilterCollection {
    constructor() {
        this.init()
    }

    init() {
        document.querySelectorAll(rootSelector).forEach((element) => {
            new Filter(element)
        })
    }
}

export default FilterCollection