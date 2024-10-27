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

/**
 * Modal for editing the gallery
 * @typedef {Object} Modal
 * @property {HTMLElement} element - The modal element
 * @property {function} open - Opens the modal
 * @property {function} close - Closes the modal
 * @property {function} init - Initializes the modal
 */
const modal = {

    /**
     * The modal element
     * @type {HTMLElement}
     */
    element: document.querySelector("#modal"),

    /**
     * Opens the modal
     */
    open: () => {
        modal.element.style.display = "flex";
        modal.element.setAttribute("aria-hidden", "false");
    },

    /**
     * Closes the modal
     */
    close: () => {
        modal.element.style.display = "none";
        modal.element.setAttribute("aria-hidden", "true");
    },

    /**
     * Initializes the modal
     */
    init: () => {
        console.log("Modal loaded!");
        const btnModifierDiv = document.querySelector(".centered-h2");
        const btnModifier = document.createElement("button");
        btnModifier.innerHTML = `<div id="btnModifierInner"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5229 1.68576L13.8939 2.05679C14.1821 2.34503 14.1821 2.81113 13.8939 3.0963L13.0016 3.99169L11.5879 2.57808L12.4803 1.68576C12.7685 1.39751 13.2346 1.39751 13.5198 1.68576H13.5229ZM6.43332 7.73578L10.5484 3.61759L11.9621 5.03121L7.84387 9.14633C7.75494 9.23525 7.64455 9.29964 7.52496 9.33337L5.73111 9.84546L6.2432 8.05162C6.27693 7.93203 6.34133 7.82164 6.43025 7.73271L6.43332 7.73578ZM11.4408 0.646245L5.39074 6.6932C5.12397 6.95998 4.93078 7.28808 4.82959 7.64685L3.9526 10.7133C3.879 10.9708 3.94953 11.2468 4.13965 11.4369C4.32977 11.627 4.60574 11.6976 4.86332 11.624L7.92973 10.747C8.29156 10.6427 8.61967 10.4495 8.88338 10.1858L14.9334 4.13888C15.7951 3.27722 15.7951 1.87894 14.9334 1.01728L14.5624 0.646245C13.7007 -0.215415 12.3024 -0.215415 11.4408 0.646245ZM2.69844 1.84214C1.20816 1.84214 0 3.05031 0 4.54058V12.8812C0 14.3715 1.20816 15.5796 2.69844 15.5796H11.0391C12.5293 15.5796 13.7375 14.3715 13.7375 12.8812V9.44683C13.7375 9.039 13.4094 8.71089 13.0016 8.71089C12.5937 8.71089 12.2656 9.039 12.2656 9.44683V12.8812C12.2656 13.5589 11.7167 14.1078 11.0391 14.1078H2.69844C2.02076 14.1078 1.47188 13.5589 1.47188 12.8812V4.54058C1.47188 3.86291 2.02076 3.31402 2.69844 3.31402H6.13281C6.54065 3.31402 6.86875 2.98591 6.86875 2.57808C6.86875 2.17025 6.54065 1.84214 6.13281 1.84214H2.69844Z" fill="black"/></svg><span>modifier</span></div>`;
        btnModifierDiv.appendChild(btnModifier);
        // Fermer en cliquant sur la croix
        modal.element
            .querySelector("#modal-close")
            .addEventListener("click", () => modal.close());
        // Fermer en cliquant en dehors
        modal.element.addEventListener("click", (e) => {
            if (e.target === modal.element) {
                modal.close();
            }
        });
        // Ouvrir avec le bouton modifier
        btnModifier.addEventListener("click", () => modal.open());
    }
}

if (window.auth?.isLoggedIn()) {
    modal.init();
}
