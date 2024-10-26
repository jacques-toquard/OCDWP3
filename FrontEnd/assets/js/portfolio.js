import { getCategories, getWorks } from "./api.js";

/**
 * Creates a category lookup object from category data
 * @param {Array<{id: number, name: string}>} categories
 * @returns {{
 *   getNameById: (id: number) => string,
 *   getAllCategories: () => Array<{id: number, name: string}>
 * }}
 */
function createCategoryLookup(categories) {
    const categoriesMap = new Map(categories.map((cat) => [cat.id, cat.name]));
    return {
        getNameById: (id) => categoriesMap.get(id) ?? "Sans catégorie",
        getAllCategories: () => [...categories],
    };
}

let storedCategories = window.localStorage.getItem("categories");
let categoryLookup;
if (!storedCategories) {
    categoryLookup = await getCategories();
    window.localStorage.setItem(
        "categories",
        JSON.stringify(categoryLookup.getAllCategories())
    );
} else {
    categoryLookup = createCategoryLookup(JSON.parse(storedCategories));
}

/**
 * Creates an HTML figure element with an image and a caption
 * @param {string} imageSource - the URL of the image
 * @param {string} caption - the alt text and the caption of the image
 * @returns {HTMLElement} the created figure
 */
function createFigure(imageSource, caption) {
    const figure = document.createElement('figure')
    const image = document.createElement('img')
    const figCaption = document.createElement('figcaption')
    image.src = imageSource
    image.alt = caption
    figCaption.innerText = caption
    figure.appendChild(image)
    figure.appendChild(figCaption)
    return figure
}

/**
 * Represents a work
 * @typedef {Object} Work
 * @property {number} id - The id of the work
 * @property {string} imageUrl - The URL of the image of the work
 * @property {string} title - The title of the work
 * @property {number} categoryId - The id of the category of the work
 * @property {string} category - The name of the category of the work
 * @property {HTMLElement} figure - The HTML figure element of the work
 */
class Work {
    constructor(id, imageUrl, title, categoryId) {
        this.id = id
        this.imageUrl = imageUrl
        this.title = title
        this.categoryId = categoryId
        this.category = categoryLookup.getNameById(categoryId)
        this.figure = createFigure(imageUrl, title)
    }
}

var allWorks = (await getWorks()).map(work => new Work(work.id, work.imageUrl, work.title, work.categoryId))

/**
 * Displays all the works in the #gallery element
 * @param {Array<Work>} [works=allWorks] The array of works to display
 */
function displayWorks(works = allWorks) {
    const gallery = document.getElementById('gallery')
    gallery.innerHTML = '' // reset the gallery
    works.forEach(work => {
        if (work) {
            gallery.appendChild(work.figure)
        } else {
            console.error('Failed to create figure for work:', work.title)
        }
    })
}

/**
 * Affiche les travaux avec le filtre "Tous"
 */
if (allWorks) {
    displayWorks()
} else {
    console.error('There are no works !') //TODO: test si ca s'affiche bien avec une db vide
}

const filtersDiv = document.querySelector('#filters')

/**
 * Retourne tous les boutons de filtre
 * @returns {NodeListOf<HTMLButtonElement>}
 */
function getFilterButtons() {
    return document.querySelectorAll('#filters button');
}

// Bouton "Tous"
const boutonTous = document.createElement('button')
boutonTous.innerText = 'Tous'
boutonTous.classList.add('active')
boutonTous.addEventListener('click', (event) => {
    getFilterButtons().forEach(btn => btn.classList.remove('active'))
    boutonTous.classList.add('active')
    displayWorks()
})
filtersDiv.appendChild(boutonTous)

// Boutons pour chaque catégorie
const categoriesSet = new Set(categoryLookup.getAllCategories().map(cat => cat.name))
if (categoriesSet.size !== categoryLookup.getAllCategories().length) {
    console.error('Il y a des doublons dans les catégories')
} 
//* Je trouve que l'utilisation de Set pour éviter les doublons n'est pas utile si les titres sont `unique` dans la base de données.
const categories = categoryLookup.getAllCategories()
for (const category of categories) {
    const button = document.createElement('button')
    button.innerText = category.name
    button.addEventListener('click', (event) => {
        getFilterButtons().forEach(btn => btn.classList.remove('active'))
        button.classList.add('active')
        const filteredWorks = allWorks.filter(work => 
            work.categoryId === category.id
        )
        displayWorks(filteredWorks)
    })
    filtersDiv.appendChild(button)
}
