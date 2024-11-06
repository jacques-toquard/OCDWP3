import { fetchApi } from "./api-service";

async function createCategoryLookup() {
    let categories;
    try {
        categories = await fetchApi("/categories");
    } catch (error) {
        console.error(`Error fetching categories: ${error}`);
        categories = [];
    }
    const categoriesMap = new Map(categories.map((cat) => [cat.id, cat.name]));
    return {
        getNameById: (id) => categoriesMap.get(id) ?? "Sans catégorie",
        getAllCategories: () => [...categories],
    };
}

export let categoryLookup = createCategoryLookup();
