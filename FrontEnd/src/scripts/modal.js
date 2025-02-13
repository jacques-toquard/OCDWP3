import { apiService } from './apiService.js';
import { galleryService } from './galleryService.js';

class Page {
  static instances = [];
  constructor(pageNumber, pageTitle = 'No Title', middleSection = '', bottomSection = '') {
    this.htmlElement = document.getElementById(`modalPage-${pageNumber}`);
    this.htmlElement.innerHTML = `<h2>${pageTitle}</h2>
    <div id="middleSection-${pageNumber}" class="middle-section">${middleSection}</div>
    <div id="bottomSection-${pageNumber}" class="bottom-section">${bottomSection}</div>`;
    Page.instances.push(this);
  }

  show() {
    Page.instances.forEach(page => {
      if (page !== this) {
        page.hide();
      }
    });
    this.htmlElement.style.display = 'flex';
  }

  hide() {
    this.htmlElement.style.display = 'none';
  }
}

const page1 = new Page(1, 'Galerie photo', '<p>future modalGallery</p>', '<button id="modalAddPhoto" class="modal-button">Ajouter une photo</button>');
document.getElementById('modalAddPhoto').addEventListener('click', () => {
  page2.show();
})
const page2 = new Page(2, 'Ajout photo');

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

export { Modal };
