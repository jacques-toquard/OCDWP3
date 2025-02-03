import { apiService } from './apiService.js';

/**
 * Creates a category lookup service.
 *
 * @returns {Object} A category lookup service.
 * @property {function(number): string} getNameById - Returns the name of a category by its id.
 * @property {function(): Array<Object>} getAllCategories - Returns an array of all categories.
 */
async function createCategoryLookup() {
  let categories;
  try {
    categories = await apiService.get('/categories');
  } catch (error) {
    console.error(`Error fetching categories: ${error}`);
    categories = [];
  }
  const categoriesMap = new Map(categories.map(cat => [cat.id, cat.name]));
  return {
    /**
     * Returns the name of a category by its id.
     * @param {number} id - The id of the category.
     * @returns {string} The name of the category or 'Sans catégorie' if not found.
     */
    getNameById: id => categoriesMap.get(id) ?? 'Sans catégorie',
    /**
     * Returns an array of all categories.
     * @returns {Array<Object>} An array of all categories.
     */
    getAllCategories: () => [...categories],
  };
}

const categoryLookup = await createCategoryLookup();

export { categoryLookup };
