import { apiService } from './apiService.js';
import { galleryService } from './galleryService.js';

class Page {
  static instances = [];
  constructor(pageNumber) {
    this.htmlElement = document.getElementById(`modalPage-${pageNumber}`);
    Page.instances.push(this);
  }

  show() {
    Page.instances.forEach((page) => {
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

const page1 = new Page(1);
const page2 = new Page(2);

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
  }
}

export { Modal };
