import { galleryService } from "./gallery-service.js";
import { auth } from "./auth-service.js";
import { createCategoryButtons } from "./filter-buttons.js";
import { modal } from "./modal.js";

if (auth.isLoggedIn()) {
    const editBanner = document.getElementById("edit-banner");
    editBanner.style.display = "flex";
    const editButton = document.getElementById("edit-button");
    editButton.style.display = "flex";
    editButton.addEventListener("click", (event) => {
        modal.open();
    })
}

createCategoryButtons();
galleryService.renderPortfolio();