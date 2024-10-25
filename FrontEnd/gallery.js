const apiUrl = 'http://localhost:5678/api'
const galleryDiv = document.querySelector('.gallery')
// galleryDiv.innerHTML = ''

/**
 * Creates a category lookup object from category data
 * @param {Array<{id: number, name: string}>} categories 
 * @returns {{
*   getNameById: (id: number) => string,
*   getAllCategories: () => Array<{id: number, name: string}>
* }}
*/
function createCategoryLookup(categories) {
   const categoriesMap = new Map(
       categories.map(cat => [cat.id, cat.name])
   );
   return {
       getNameById: (id) => categoriesMap.get(id) ?? "Sans catégorie",
       getAllCategories: () => [...categories]
   };
}

/**
* Fetches categories from API and creates a lookup object
* @returns {Promise<{
*   getNameById: (id: number) => string,
*   getAllCategories: () => Array<{id: number, name: string}>
* }>}
*/
async function queryCategories() {
   try {
       const response = await fetch(`${apiUrl}/categories`)
       const data = await response.json()
       return createCategoryLookup(data)
   } catch (error) {
       console.error('Failed to fetch categories:', error)
   }
}

// les categories ne sont pas susceptibles de changer dans le temps
const CATEGORIES_STORAGE_KEY = 'categories'
let storedCategories = window.localStorage.getItem(CATEGORIES_STORAGE_KEY)
let categoryLookup
if (storedCategories === null) {
    categoryLookup = await queryCategories()
    window.localStorage.setItem(CATEGORIES_STORAGE_KEY, 
        JSON.stringify(categoryLookup.getAllCategories()))
} else {
    categoryLookup = createCategoryLookup(JSON.parse(storedCategories))
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

class Work {
    id
    imageUrl
    title
    categoryId
    category
    figure
    constructor(id, imageUrl, title, categoryId) {
        this.id = id
        this.imageUrl = imageUrl
        this.title = title
        this.categoryId = categoryId
        this.category = categoryLookup.getNameById(categoryId)
        this.figure = createFigure(imageUrl, title)
    }
}

/**
 * Fetches the works from the API and returns an array of Work objects
 * @returns {Promise<Array<Work>>} the array of Work objects
 */
async function queryWorks() {
    try {
        const response = await fetch(`${apiUrl}/works`)
        const data = await response.json()
        return data.map(work => new Work(work.id, work.imageUrl, work.title, work.categoryId))
    } catch (error) {
        console.error('Failed to fetch works:', error)
    }
}

const allWorks = await queryWorks()

/**
 * Renders all the works in the gallery
 * @param {Array<Work>} works - the works to render
 */
function renderWorks(works) {
    galleryDiv.innerHTML = ''
    for (const work of works) {
        galleryDiv.appendChild(work.figure)
    }
}

if (allWorks !== null) {
    renderWorks(allWorks)
} else {
    console.error('allWorks is null')
}