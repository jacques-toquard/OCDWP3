import { galleryService } from "./gallery-service.js";

class Modal {

    /**
     * Modal constructor
     * @constructor
     * Sets up the modal element and its associated events.
     * @param {HTMLElement} modalElement The HTML element that will be used as the modal.
     * @param {HTMLElement} modalClose The HTML element that will be used to close the modal.
     */
    constructor() {
        this.modalElement = document.getElementById("modal");
        const modalClose = document.getElementById("modal-close");
        modalClose.addEventListener("click", (event) => {
            this.close();
        });

        this.modalElement.addEventListener("click", (event) => {
            if (event.target === this.modalElement) {
                this.close();
            }
        });
    }


    /**
     * Shows the modal.
     */
    open() {
        this.modalElement.style.display = "flex";
    }

    /**
     * Hides the modal.
     */
    close() {
        this.modalElement.style.display = "none";
    }
}

export const modal = new Modal();