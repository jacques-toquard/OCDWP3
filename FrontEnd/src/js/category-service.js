import { fetchApi } from "./api-service.js";
/**
 * Creates an object that provides a mapping between category IDs and names.
 * If the API call fails, an empty array will be used, and the mapping will return
 * "Sans catégorie" for any ID.
 * @returns {{getNameById: (id: number) => string, getAllCategories: () => {id: number; name: string}[]}}
 */
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

export let categoryLookup = await createCategoryLookup();
