import { categoryLookup } from "./category-service.js";
import { galleryService } from "./gallery-service.js";

const filtersDiv = document.getElementById("filters");

function createCategoryButtons() {
    const categories = [{ id: "all", name: "Tous" }, ...categoryLookup.getAllCategories()];
    
    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.dataset.categoryId = category.id;
        button.addEventListener("click", handleCategoryFilter);
        filtersDiv.appendChild(button);
    });
}

function handleCategoryFilter(event) {
    const selectedCategoryId = event.target.dataset.categoryId;
    
    document.querySelectorAll("#filters button").forEach(button => {
        button.classList.toggle("active", button === event.target);
    });

    galleryService.filterByCategory(selectedCategoryId);
}

createCategoryButtons();