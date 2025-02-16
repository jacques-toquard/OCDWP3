import { apiService } from './apiService.js';
import { categoryLookup } from './categoryService.js';

/**
 * Represents a single work/project item
 * @class Work
 * @property {number|string} id - Unique identifier for the work
 * @property {number|string} userId - ID of the user who created the work
 * @property {string} imageUrl - URL of the work's image
 * @property {string} title - Title of the work
 * @property {number|string} categoryId - ID of the work's category
 * @property {string} category - Name of the work's category
 */
class Work {
  /**
   * Creates a new Work instance
   * @param {number|string} id - Unique identifier for the work
   * @param {number|string} userId - ID of the user who created the work
   * @param {string} imageUrl - URL of the work's image
   * @param {string} title - Title of the work
   * @param {number|string} categoryId - ID of the work's category
   */
  constructor(id, userId, imageUrl, title, categoryId) {
    this.id = id;
    this.userId = userId;
    this.imageUrl = imageUrl;
    this.title = title;
    this.categoryId = categoryId;
    this.category = categoryLookup.getNameById(categoryId);
  }
}

/**
 * Manages a collection of works/projects
 * @class Gallery
 * @property {Work[]} works - Array of Work instances
 * @method loadWorks - Loads works from the API and converts them to Work instances
 * @method getWorksByCategory - Returns an array of works that belong to the specified category
 */
class Gallery {
  /**
   * Creates a new Gallery instance
   */
  constructor() {
    /** @type {Work[]} Array of Work instances */
    this.works = [];
  }

  /**
   * Loads works from the API and converts them to Work instances.
   * If the API call fails, the works array will be set to empty and the error will be logged.
   * @async
   * @returns {Promise<void>}
   * @throws {Error} Logs error to console but doesn't throw
   */
  async loadWorks() {
    try {
      const works = await apiService.get('/works');
      this.works = works.map(
        work =>
          new Work(
            work.id,
            work.userId,
            work.imageUrl,
            work.title,
            work.categoryId
          )
      );
    } catch (error) {
      console.error(error);
      this.works = [];
    }
  }

  /**
   * Returns an array of works that belong to the specified category.
   * @param {string} category - The category to filter by.
   * @returns {Work[]} An array of works that belong to the specified category.
   */
  getWorksByCategory(categoryId) {
    return this.works.filter(
      work => categoryId === 'all' || work.categoryId == categoryId // * 1 == "1"
    );
  }

  addWork(work) {
    this.works.push(work);
  }

  deleteWork(workId) {
    this.works = this.works.filter(work => work.id !== +workId);
  }
}

const galleryService = new Gallery();
await galleryService.loadWorks();

export { galleryService, Work };
