import { authService } from './authService.js';
import { categoryLookup } from './categoryService.js';
import { galleryService } from './galleryService.js';
import { Modal, galleryRefreshCallback } from './modal.js';

if (authService.isLoggedIn()) {
  const editBanner = document.getElementById('editBanner');
  editBanner.style.display = 'flex';
  const editButton = document.getElementById('editButton');
  editButton.style.display = 'flex';
  const modal = new Modal();
}

const galleryDiv = document.getElementById('gallery');
let galleryActiveFilter = 'all';

function renderGallery() {
  galleryDiv.innerHTML = '';
  const works = galleryService.getWorksByCategory(galleryActiveFilter);
  // ! console.log(works);
  works.forEach(work => {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    const figCaption = document.createElement('figcaption');

    image.src = work.imageUrl;
    image.alt = work.title;
    figCaption.textContent = work.title;

    figure.appendChild(image);
    figure.appendChild(figCaption);
    galleryDiv.appendChild(figure);
  });
}

galleryRefreshCallback.subscribers.push(renderGallery);

const categories = [
  { id: 'all', name: 'Tous' },
  ...categoryLookup.getAllCategories(),
];

renderGallery();

function handleCategoryFilter(categoryId) {
  galleryActiveFilter = categoryId;
  document.querySelectorAll('#filters button').forEach(button => {
    button.classList.toggle('active', button.dataset.category === categoryId);
  });
  renderGallery();
}

const filtersDiv = document.getElementById('filters');

console.log(categories);
categories.forEach(category => {
  const filterButton = document.createElement('button');
  filterButton.textContent = category.name ?? 'Sans catégorie';
  filterButton.dataset.category = category.id;
  filterButton.addEventListener('click', () => {
    handleCategoryFilter(filterButton.dataset.category);
  });
  filtersDiv.appendChild(filterButton);
  if (category.id === 'all') {
    filterButton.classList.add('active');
  }
});
