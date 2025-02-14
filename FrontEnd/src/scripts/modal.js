import { apiService } from './apiService.js';
import { galleryService } from './galleryService.js';

function createModalFigure(imageSource, id) {
  const figure = document.createElement('figure');
  figure.dataset.workId = id;
  figure.style.position = 'relative';

  const image = document.createElement('img');
  image.src = imageSource;
  figure.appendChild(image);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-work');
  deleteButton.style.position = 'absolute';
  deleteButton.style.top = '10px';
  deleteButton.style.right = '10px';
  deleteButton.innerHTML = `
    <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9.64286C8.35714 10.3929 7.75 11 7 11H2C1.25 11 0.642857 10.3929 0.642857 9.64286V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V9.39286C2.25 9.56964 2.39464 9.71429 2.57143 9.71429C2.74821 9.71429 2.89286 9.56964 2.89286 9.39286V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V9.39286C4.17857 9.56964 4.32321 9.71429 4.5 9.71429C4.67679 9.71429 4.82143 9.56964 4.82143 9.39286V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V9.39286C6.10714 9.56964 6.25179 9.71429 6.42857 9.71429C6.60536 9.71429 6.75 9.56964 6.75 9.39286V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
    </svg>`;
  figure.appendChild(deleteButton);

  return figure;
}

var modalGallery = null;

function renderModalGallery(modalFigurelist) {
  if (!modalGallery) {
    modalGallery = document.createElement('div');
    modalGallery.id = 'modalGallery';
  }
  modalGallery.innerHTML = '';
  modalFigurelist.forEach(figure => {
    modalGallery.appendChild(figure);
    const figureDeleteButton = figure.querySelector('.delete-work');
    figureDeleteButton.addEventListener('click', async event => {
      event.preventDefault();
      event.stopPropagation();
      if (confirm('Are you sure you want to delete this work?')) {
        const workId = figure.dataset.workId;
        await apiService.delete(`/works/${workId}`);
        await page1.refreshModalGallery();
      }
    });
  });
  return modalGallery;
}

/**
 * Class representing a page in the modal.
 * @class Page
 * @static instances - Array of Page instances
 * @method show - Show the page
 * @method hide - Hide the page
 */
class Page {
  static instances = [];
  /**
   * Create a new page object.
   * @param {number} pageNumber - Number of the page, must match the id of the
   *   html element that will contain the page content.
   * @param {string} [pageTitle = 'No Title'] - Title of the page.
   * @param {HTMLElement} [middleSectionDivElement = null] - Content of the middle
   *   section of the page.
   * @param {string} [bottomSection = ''] - Content of the bottom section of the
   *   page.
   */
  constructor(
    pageNumber,
    pageTitle = 'No Title',
    middleSectionDivElement = null,
    bottomSection = ''
  ) {
    this.htmlElement = document.getElementById(`modalPage-${pageNumber}`);
    this.htmlElement.innerHTML = `<h2>${pageTitle}</h2>
    <div id="middleSection-${pageNumber}" class="middle-section"></div>
    <div id="bottomSection-${pageNumber}" class="bottom-section">${bottomSection}</div>`;
    if (middleSectionDivElement) {
      this.htmlElement
        .querySelector(`#middleSection-${pageNumber}`)
        .appendChild(middleSectionDivElement);
    }
    Page.instances.push(this);
  }

  /**
   * Shows the page and hides all other pages.
   */
  show() {
    Page.instances.forEach(page => {
      if (page !== this) {
        page.hide();
      }
    });
    this.htmlElement.style.display = 'flex';
  }

  /**
   * Hides the page.
   */

  hide() {
    this.htmlElement.style.display = 'none';
  }
}

const page1 = new Page(
  1,
  'Galerie photo',
  renderModalGallery(
    galleryService.works.map(work => createModalFigure(work.imageUrl, work.id))
  ),
  '<button id="modalAddPhoto" class="modal-button">Ajouter une photo</button>'
);
document.getElementById('modalAddPhoto').addEventListener('click', () => {
  page2.show();
});

const galleryRefreshCallback = {
  subscribers: [],

  callback: () => {
    console.log(galleryRefreshCallback.subscribers);
    galleryRefreshCallback.subscribers.forEach(callback => callback());
  },
};

page1.refreshModalGallery = async () => {
  await galleryService.loadWorks();
  let modalGallery = renderModalGallery(
    galleryService.works.map(work => createModalFigure(work.imageUrl, work.id))
  );
  let existingModalGallery = page1.htmlElement.querySelector('#modalGallery');
  if (existingModalGallery) {
    existingModalGallery.replaceWith(modalGallery);
  } else {
    page1.htmlElement.appendChild(modalGallery);
  }
  galleryRefreshCallback.callback();
};

const page2 = new Page(2, 'Ajout photo');

/**
 * Class representing a modal.
 * @class Modal
 * @property {HTMLElement} editButton - The edit button element.
 * @property {HTMLElement} modalElement - The modal element.
 * @property {HTMLElement} modalClose - The close button element.
 * @method open - Opens the modal.
 * @method close - Closes the modal.
 */
class Modal {
  constructor() {
    this.editButton = document.getElementById('editButton');
    this.editButton.addEventListener('click', () => {
      this.open();
    });
    this.modalElement = document.getElementById('modal');
    this.modalElement.addEventListener('click', event => {
      if (event.target === this.modalElement) {
        this.close();
      }
    });
    this.modalClose = document.getElementById('modalClose');
    this.modalClose.addEventListener('click', () => {
      this.close();
    });
  }

  open() {
    this.modalElement.style.display = 'flex';
  }

  close() {
    this.modalElement.style.display = 'none';
    page1.show();
  }
}

export { Modal, galleryRefreshCallback };
