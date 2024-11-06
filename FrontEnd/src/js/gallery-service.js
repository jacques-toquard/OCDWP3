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
        this.works = AllWorks.fetchWorks();
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
        return works;
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
