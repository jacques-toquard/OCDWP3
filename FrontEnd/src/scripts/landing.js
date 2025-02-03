import { authService } from './authService.js';

if (authService.isLoggedIn()) {
  const editBanner = document.getElementById('editBanner');
  editBanner.style.display = 'flex';
  const editButton = document.getElementById('editButton');
  editButton.style.display = 'flex';
}
