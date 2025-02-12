import { authService } from './authService.js';
import { apiService } from './apiService.js';

class Modal {
  constructor() {
    this.editButton = document.getElementById('editButton');
    this.editButton.addEventListener('click', () => {
      this.open();
    });
  }

  open() {}

  close() {}
}

export { Modal };
