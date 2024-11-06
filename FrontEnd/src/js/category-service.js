import { fetchApi } from "./api-service";

async function createCategoryLookup() {
    const categories = await fetchApi("/categories");
    const categoriesMap = new Map(categories.map((cat) => [cat.id, cat.name]));
    return {
        getNameById: (id) => categoriesMap.get(id) ?? "Sans catégorie",
        getAllCategories: () => [...categories],
    };
}

export let categoryLookup = createCategoryLookup();
