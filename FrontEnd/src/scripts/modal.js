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
    middleSection = '',
    bottomSection = ''
  ) {
    this.htmlElement = document.getElementById(`modalPage-${pageNumber}`);
    this.htmlElement.innerHTML = `<h2>${pageTitle}</h2>
    <div id="middleSection-${pageNumber}" class="middle-section">${middleSection}</div>
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
  '',
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

const page2 = new Page(
  2,
  'Ajout photo',
  null,
  `
    <button id="returnPage1">
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.439478 8.94458C-0.146493 9.53055 -0.146493 10.4822 0.439478 11.0681L7.9399 18.5686C8.52587 19.1545 9.47748 19.1545 10.0635 18.5686C10.6494 17.9826 10.6494 17.031 10.0635 16.445L5.11786 11.5041H19.4999C20.3297 11.5041 21 10.8338 21 10.004C21 9.17428 20.3297 8.50393 19.4999 8.50393H5.12255L10.0588 3.56303C10.6447 2.97706 10.6447 2.02545 10.0588 1.43948C9.47279 0.853507 8.52118 0.853507 7.93521 1.43948L0.43479 8.9399L0.439478 8.94458Z" fill="black"/>
      </svg>
    </button>
    <form id="modalAddWorkForm">
      <div id="modalAddWorkImageWrapper">
        <svg
          width="100"
          height="100"
          viewBox="0 0 76 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M63.5517 15.8879C64.7228 15.8879 65.681 16.8461 65.681 18.0172V60.5768L65.0156 59.7118L46.9165 36.2894C46.3176 35.5042 45.3727 35.0517 44.3879 35.0517C43.4031 35.0517 42.4715 35.5042 41.8594 36.2894L30.8136 50.5824L26.7546 44.8998C26.1557 44.0614 25.1975 43.569 24.1595 43.569C23.1214 43.569 22.1632 44.0614 21.5644 44.9131L10.9178 59.8183L10.319 60.6434V60.6034V18.0172C10.319 16.8461 11.2772 15.8879 12.4483 15.8879H63.5517ZM12.4483 9.5C7.75048 9.5 3.93103 13.3195 3.93103 18.0172V60.6034C3.93103 65.3012 7.75048 69.1207 12.4483 69.1207H63.5517C68.2495 69.1207 72.069 65.3012 72.069 60.6034V18.0172C72.069 13.3195 68.2495 9.5 63.5517 9.5H12.4483ZM23.0948 35.0517C23.9337 35.0517 24.7644 34.8865 25.5394 34.5655C26.3144 34.2444 27.0186 33.7739 27.6118 33.1807C28.2049 32.5876 28.6755 31.8834 28.9965 31.1083C29.3175 30.3333 29.4828 29.5027 29.4828 28.6638C29.4828 27.8249 29.3175 26.9943 28.9965 26.2192C28.6755 25.4442 28.2049 24.74 27.6118 24.1468C27.0186 23.5537 26.3144 23.0831 25.5394 22.7621C24.7644 22.4411 23.9337 22.2759 23.0948 22.2759C22.2559 22.2759 21.4253 22.4411 20.6503 22.7621C19.8752 23.0831 19.171 23.5537 18.5779 24.1468C17.9847 24.74 17.5142 25.4442 17.1931 26.2192C16.8721 26.9943 16.7069 27.8249 16.7069 28.6638C16.7069 29.5027 16.8721 30.3333 17.1931 31.1083C17.5142 31.8834 17.9847 32.5876 18.5779 33.1807C19.171 33.7739 19.8752 34.2444 20.6503 34.5655C21.4253 34.8865 22.2559 35.0517 23.0948 35.0517Z"
            fill="#B9C5CC"
          />
          </svg>
          <input type="file" id="modalAddWorkAddPhoto" name="photo" style="display: none;">
          <label for="modalAddWorkAddPhoto" id="modalAddWorkAddPhotoLabel">+ Ajouter photo</label>

          <div id="modalAddWorkImageConstraints">jpg, png: 4mo max</div>
        </div>
        <div id="modalAddWorkPreview"></div>
      </div>
    <div class="modal-add-work-inputs">
      <label for="title">Titre</label>
      <input type="text" id="title" />
    </div>
    <div class="modal-add-work-inputs">
      <label for="category">Catégorie</label>
      <select id="category">
      <option value="all">Tous</option>
      </select>
    </form>
  `,
  `
    <button id="modalAddWorkSubmit" type="submit">Send</button>
  `
);

page2.htmlElement
  .querySelector('#returnPage1')
  .addEventListener('click', () => {
    page1.show();
  });

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
