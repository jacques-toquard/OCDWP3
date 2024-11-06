import { galleryService } from "./gallery-service.js";

class Modal {
    constructor() {
        this.addWorkMode = false;
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
        galleryService.renderModalGallery();
        this.addWorkModeButton = document.getElementById("modal-add-photo");
        this.addWorkModeButton.addEventListener("click", (event) => {
            this.addWorkModeOpen();
        });
        this.modalTitle = document.getElementById("modal-title");
        this.modalGallery = document.getElementById("modal-gallery");
        this.modalWorkModeDiv = document.getElementById("modal-work-mode");
        this.modalWorkModeValider = document.getElementById("modal-valider");//TODO add event listener
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
        if (this.addWorkMode) {
            this.addWorkModeClose();
        }
    }

    addWorkModeOpen() {
        this.addWorkMode = true;
        this.modalTitle.textContent = "Ajout photo";
        this.modalGallery.style.display = "none";
        this.addWorkModeButton.style.display = "none";
        this.modalWorkModeValider.style.display = "block";
        this.modalWorkModeDiv.style.display = "flex";
    }

    addWorkModeClose() {
        this.addWorkMode = false;
        this.modalTitle.textContent = "Galerie photo";
        this.modalGallery.style.display = "grid";
        this.addWorkModeButton.style.display = "block";
        this.modalWorkModeValider.style.display = "none";
        this.modalWorkModeDiv.style.display = "none";
    }
}

export const modal = new Modal();
