import { categoryLookup } from "./category-service.js";
import { galleryService } from "./gallery-service.js";

/**
 * Handles a click on a category filter button.
 * @param {Event} event The click event.
 */
function handleCategoryFilter(event) {
    const selectedCategoryId = event.target.dataset.categoryId;
    
    document.querySelectorAll("#filters button").forEach(button => {
        button.classList.toggle("active", button === event.target);
    });

    galleryService.filterByCategory(selectedCategoryId);
}

/**
 * Creates the category filter buttons in the #filters div.
 * The buttons are created by iterating over the categories in the categoryLookup
 * and creating a button for each one. The button is given the textContent of the
 * category name, and the dataset.categoryId is set to the category id.
 * The button is also given an event listener for the click event, which calls
 * handleCategoryFilter when clicked.
 */
export function createCategoryButtons() {
    const filtersDiv = document.getElementById("filters");
    const categories = [{ id: "all", name: "Tous" }, ...categoryLookup.getAllCategories()];
    
    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.dataset.categoryId = category.id;
        button.addEventListener("click", handleCategoryFilter);
        filtersDiv.appendChild(button);
    });
}