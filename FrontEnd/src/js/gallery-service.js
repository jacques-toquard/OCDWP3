import { fetchApi } from "./api-service.js";
import { categoryLookup } from "./category-service.js";
import { auth } from "./auth-service.js";

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
    /**
     * @param {number} id The ID of the work.
     * @param {string} imageUrl The URL of the image.
     * @param {string} title The title of the work.
     * @param {number} categoryId The ID of the category.
     * @param {number} userId The ID of the user.
     */
    constructor(id, imageUrl, title, categoryId, userId) {
        this.id = id;
        this.userId = userId;
        this.imageUrl = imageUrl;
        this.title = title;
        this.categoryId = categoryId;
        this.category = categoryLookup.getNameById(categoryId);
        this.figure = Work.createFigure(imageUrl, title);
        this.modalFigure = Work.createModalFigure(imageUrl, id);
    }

    static createModalFigure(imageSource, id) {
        const figure = document.createElement("figure");
        figure.dataset.workId = id;
        figure.style.position = "relative";
    
        const image = document.createElement("img");
        image.src = imageSource;
        figure.appendChild(image);
    
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-work");
        deleteButton.style.position = "absolute";
        deleteButton.style.top = "10px";
        deleteButton.style.right = "10px";
        deleteButton.style.backgroundColor = "black";
        deleteButton.style.borderRadius = "20%";
        // deleteButton.style.padding = "5px";
        deleteButton.style.height = "20px";
        deleteButton.style.width = "20px";
        deleteButton.style.border = "none";
        deleteButton.innerHTML = `
            <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9.64286C8.35714 10.3929 7.75 11 7 11H2C1.25 11 0.642857 10.3929 0.642857 9.64286V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V9.39286C2.25 9.56964 2.39464 9.71429 2.57143 9.71429C2.74821 9.71429 2.89286 9.56964 2.89286 9.39286V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V9.39286C4.17857 9.56964 4.32321 9.71429 4.5 9.71429C4.67679 9.71429 4.82143 9.56964 4.82143 9.39286V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V9.39286C6.10714 9.56964 6.25179 9.71429 6.42857 9.71429C6.60536 9.71429 6.75 9.56964 6.75 9.39286V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
            </svg>
        `;
        figure.appendChild(deleteButton);
    
        return figure;
    }

    /**
     * Creates a <figure> element with an <img> and a <figcaption>.
     * @param {string} imageSource The src attribute of the <img>.
     * @param {string} caption The alt attribute of the <img> and the textContent of the <figcaption>.
     * @returns {HTMLFigureElement} The created <figure>.
     */
    static createFigure(imageSource, caption) {
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
}

/**
 * Singleton class that manages all works
 */
class AllWorks {
    /**
     * Private instance of AllWorks (for singleton pattern)
     * @private
     */
    static #instance = null;

    /**
     * Gets the singleton instance of AllWorks
     * @returns {AllWorks} The singleton instance
     */
    static getInstance() {
        if (this.#instance === null) {
            this.#instance = new AllWorks();
        }
        return this.#instance;
    }

    /**
     * Private constructor to prevent direct instantiation
     * @private
     */
    constructor() {
        this.works = [];
        this.filter = "all";
    }

    renderModalGallery() {
        const modalGallery = document.getElementById("modal-gallery");
        modalGallery.innerHTML = "";
        this.works.forEach((work) => {
            console.log(work);
            modalGallery.appendChild(work.modalFigure);
        });
    }

    /**
     * Renders the portfolio by filtering the works according to the current filter
     * and appends the figures of the filtered works to the element with the id "gallery".
     * If the filter is "all", all works are rendered.
     * If the filter is a category ID, only the works of that category are rendered.
     */
    renderPortfolio() {
        const portfolioElement = document.getElementById("gallery");
        portfolioElement.innerHTML = "";
        this.works
            .filter(
                (work) =>
                    this.filter === "all" ||
                    work.categoryId === parseInt(this.filter)
            )
            .forEach((work) => {
                portfolioElement.appendChild(work.figure);
            });
    }

    /**
     * Filters the works by category ID and renders the portfolio.
     * @param {number} categoryId The ID of the category to filter by.
     */
    filterByCategory(categoryId) {
        this.filter = categoryId;
        this.renderPortfolio();
    }

    /**
     * Fetches all works from the API and returns them.
     *
     * @returns {Promise<Work[]>} A Promise that resolves with an array of Work objects.
     */
    static async fetchWorks() {
        let works;
        try {
            works = await fetchApi("/works");
        } catch (error) {
            console.error(`Error fetching works: ${error}`);
            works = [];
        }
        return works.map(
            (workData) =>
                new Work(
                    workData.id,
                    workData.imageUrl,
                    workData.title,
                    workData.categoryId,
                    workData.userId
                )
        );
    }

    /**
     * Adds a work to the list of works.
     * @param {Object} workData An object with the following properties:
     *                          - id: The ID of the work.
     *                          - imageUrl: The URL of the image of the work.
     *                          - title: The title of the work.
     *                          - categoryId: The ID of the category of the work.
     * @returns {Promise<Object>} A Promise that resolves with an object with the following properties:
     *                            - success: A boolean indicating whether the work was added successfully.
     *                            - error: The error message if the work was not added successfully.
     */
    async addWork(workData) {
        try {
            if (!!auth.isLoggedIn() === false) {
                throw new Error("Not logged in");
            }
            const work = new Work(
                workData.id,
                workData.imageUrl,
                workData.title,
                workData.categoryId,
                auth.getUserID()
            );
            if (this.works.some((w) => w.id === work.id)) {
                throw new Error("Work already exists");
            }
            this.works.push(work);
            const workDataWithUserId = {
                ...workData,
                userId: auth.getUserID(),
            };
            await fetchApi(
                "/works",
                "POST",
                {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.getToken()}`,
                },
                JSON.stringify(workDataWithUserId)
            );
            return {
                success: true,
                error: null,
            };
        } catch (error) {
            console.error(`Error adding work: ${error}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    /**
     * Deletes a work from the gallery
     * @param {number} workId The ID of the work to delete
     * @returns {Promise<{success: boolean, error: string?}>}
     * @throws {Error} If not logged in
     * @throws {Error} If the work is not found
     */
    async deleteWork(workId) {
        try {
            if (!!auth.isLoggedIn() === false) {
                throw new Error("Not logged in");
            }
            const index = this.works.findIndex((w) => w.id === workId);
            if (index === -1) {
                throw new Error("Work not found");
            }
            this.works.splice(index, 1);
            await fetchApi(`/works/${workId}`, "DELETE", {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.getToken()}`,
            });
            return {
                success: true,
                error: null,
            };
        } catch (error) {
            console.error(`Error deleting work: ${error}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}

export const galleryService = AllWorks.getInstance();
galleryService.works = await AllWorks.fetchWorks();
