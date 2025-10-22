"use strict"
// В переменную добавляем css селектор по атрибуту "data-js-filter"
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
        this.state = this.getProxyState({
            // Для применения класического метода массивов "findIndex"
            // оборачиваем в массив DOM элементов с применением спред-оператора "..."
            // Находим индекс кнопки "is-active"
            activeTabIndex: [...this.buttonElements]
                .findIndex((buttonElement) => buttonElement.classList.contains(this.stateClasses.isActive)),
        })
        // Получаем лимит индексов для навигации с помощью клавиатуры
        this.limitTabsIndex = this.buttonElements.length - 1
        this.bindEvents()
    }

    // Метод ожидает объект начального состояния "initialState"
    getProxyState(initialState) {
        return new Proxy(initialState, {
            // При работе с проксируемым объектом "this.state" для чтения будет выполняться функция "get",
            // а если устанавливать значение какому либо свойству в объекте "this.state" выполняется "set"
            get: (target, prop) => {
                return target[prop]
            },
            set: (target, prop, value) => {
                target[prop] = value
                // При изменении любого значения "this.state" обновляется UI пользователя
                this.updateUI()

                return true
            },
        })
    }

    // Метод для обновления UI пользователя
    updateUI() {
        const { activeTabIndex } = this.state

        this.buttonElements.forEach((buttonElement, index) => {
            const isActive = index === activeTabIndex

            // Меняем значения атрибутов и Добовляем/Убираем class is-active
            buttonElement.classList.toggle(this.stateClasses.isActive, isActive)
            buttonElement.setAttribute(this.stateAtributes.ariaSelected, isActive.toString())
            buttonElement.setAttribute(this.stateAtributes.tabIndex, isActive ? '0': '-1')
        })

        this.contentElements.forEach((contentElement, index) => {
            const isActive = index === activeTabIndex

            contentElement.classList.toggle(this.stateClasses.isActive, isActive)
        })
    }

    // Определяем новый индекс активного таба
    activeTab(newTabIndex) {
        this.state.activeTabIndex = newTabIndex
        this.buttonElements[newTabIndex].focus()
    }

    previousTab = () => {
        const newTabIndex = this.state.activeTabIndex === 0
            ? this.limitTabsIndex
            : this.state.activeTabIndex - 1
        
        this.activeTab(newTabIndex)
    }

    nextTab = () => {
        const newTabIndex = this.state.activeTabIndex === this.limitTabsIndex
        ? 0
        : this.state.activeTabIndex + 1

        this.activeTab(newTabIndex)
    }

    firstTab = () => {
        this.activeTab(0)
    }

    lastTab = () => {
        this.activeTab(this.limitTabsIndex)
    }

    // Меняет значение свойства "activeTabIndex" в объекте "this.state" на "buttonIndex"
    onButtonClick(buttonIndex) {
        this.state.activeTabIndex = buttonIndex
    }

    // Метод onKeyDown ожидает объект события "event"
    onKeyDown = (event) => {
        // В рамках тела метода диструктурируем из "event" две сущности "code" и "metaKey"
        const { code, metaKey } = event

        const action = {
            ArrowLeft: this.previousTab,
            ArrowRight: this.nextTab,
            Home: this.firstTab,
            End: this.lastTab,
        }[code]

        // Проверка на MacOS раскладку
        const isMacHomeKey = metaKey && code === 'ArrowLeft'
        const isMacEndKey = metaKey && code === 'ArrowRight'

        if (isMacHomeKey) {
            this.firstTab()
            return
        }

        if (isMacEndKey) {
            this.lastTab()
            return
        }

        // Оператор опциональной последовательности ?. поможет избежать undefiend, сделав проверку
        action?.()
    } 

    // Слушатель событий
    bindEvents() {
        // Слушатель события "click"
        this.buttonElements.forEach((buttonElement, index) => {
            buttonElement.addEventListener('click', () => this.onButtonClick(index))
        })
        // Слушатель события "keydown" вызывающий метод "onKeyDown"
        this.rootElement.addEventListener('keydown', this.onKeyDown)
    }
}

class FilterCollection {
    constructor() {
        this.init()
    }

    init() {
        // Находим все элементы по селектору "data-js-filter", который объявлен в начале
        // Проходимся по списку DOM элементов через метод "forEach"
        document.querySelectorAll(rootSelector).forEach((element) => {
            new Filter(element)
        })
    }
}

export default FilterCollection