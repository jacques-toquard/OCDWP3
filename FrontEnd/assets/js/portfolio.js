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
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const figCaption = document.createElement("figcaption");
    image.src = imageSource;
    image.alt = caption;
    figCaption.innerText = caption;
    figure.appendChild(image);
    figure.appendChild(figCaption);
    return figure;
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
        this.id = id;
        this.imageUrl = imageUrl;
        this.title = title;
        this.categoryId = categoryId;
        this.category = categoryLookup.getNameById(categoryId);
        this.figure = createFigure(imageUrl, title);
    }
}

/**
 * Displays works in the gallery
 * @param {Array<Work>} works The array of works to display
 */
function displayWorks(works) {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    works.forEach((work) => {
        if (work) {
            gallery.appendChild(work.figure);
        } else {
            console.error("Failed to create figure for work:", work);
        }
    });
}

// Initialize works
const initialWorks = await getWorks();
export const gallery = {
    works: initialWorks.map(
        (work) => new Work(work.id, work.imageUrl, work.title, work.categoryId)
    ),

    /**
     * Adds a new work and updates the display
     * @param {{id: number, imageUrl: string, title: string, categoryId: number}} workData 
     */
    addWork(workData) {
        const newWork = new Work(
            workData.id,
            workData.imageUrl,
            workData.title,
            workData.categoryId
        );
        this.works.push(newWork);
        this.render();
    },

    /**
     * Removes a work by ID and updates the display
     * @param {number} workId 
     * @returns {boolean} Whether the work was found and removed
     */
    removeWork(workId) {
        const index = this.works.findIndex(work => work.id === workId);
        if (index === -1) return false;
        
        this.works.splice(index, 1);
        this.render();
        return true;
    },

    /**
     * Re-renders the current state of works based on active filter
     */
    render() {
        const activeFilter = document.querySelector("#filters button.active");
        if (!activeFilter) {
            displayWorks(this.works);
            return;
        }

        if (activeFilter.innerText === "Tous") {
            displayWorks(this.works);
        } else {
            const category = categoryLookup.getAllCategories()
                .find(cat => cat.name === activeFilter.innerText);
            if (category) {
                const filteredWorks = this.works.filter(
                    work => work.categoryId === category.id
                );
                displayWorks(filteredWorks);
            }
        }
    }
};

// Initialize filters
const filtersDiv = document.querySelector("#filters");

// Add "Tous" button
const boutonTous = document.createElement("button");
boutonTous.innerText = "Tous";
boutonTous.classList.add("active");
boutonTous.addEventListener("click", (event) => {
    document.querySelectorAll("#filters button")
        .forEach((btn) => btn.classList.remove("active"));
    boutonTous.classList.add("active");
    gallery.render();
});
filtersDiv.appendChild(boutonTous);

// Add category buttons
const categories = categoryLookup.getAllCategories();
for (const category of categories) {
    const button = document.createElement("button");
    button.innerText = category.name;
    button.addEventListener("click", (event) => {
        document.querySelectorAll("#filters button")
            .forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        gallery.render();
    });
    filtersDiv.appendChild(button);
}

// Initial render
gallery.render();