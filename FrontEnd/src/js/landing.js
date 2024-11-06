import { categoryLookup } from "./category-service.js";
import { galleryService } from "./gallery-service.js";

// const galleryDiv = document.getElementById("gallery");
const filtersDiv = document.getElementById("filters");

const categoryNames = ["Tous", ...categoryLookup.getAllCategories().map((cat) => cat.name)];


categoryNames.forEach((catName) => {
    const button = document.createElement("button");
    button.innerText = catName;
    button.addEventListener("click", (event) => {
        //TODO: portfolio.filterByCategory(catName);
        document.querySelectorAll("#filters button").forEach((button) => {
            button.classList.remove("active");            
        })
        button.classList.add("active");
    });
    filtersDiv.appendChild(button);
})