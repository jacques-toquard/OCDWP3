import { authService } from './authService.js';
import { apiService } from './apiService.js';

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
