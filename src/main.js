// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { searchImages } from './js/pixabay-api';
import { clearGallery, renderImages } from './js/render-functions';

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const loader = document.getElementById('loader');
  let lightbox; // Оголошуємо змінну lightbox тут, щоб мати доступ до неї поза блоком обробника подій

  searchForm.addEventListener('submit', async event => {
    event.preventDefault();

    const query = event.target.elements.query.value.trim();
    if (!query) {
      iziToast.error({
        title: 'Error',
        message: 'Please enter a search query',
      });
      return;
    }

    clearGallery(); // Виклик функції clearGallery
    loader.style.display = 'block';

    try {
      const images = await searchImages(query);
      renderImages(images);

      // Після відображення нових зображень оновлюємо lightbox
      if (lightbox) {
        lightbox.refresh();
      } else {
        lightbox = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        });
      }
    } catch (error) {
      console.error(error.message);
      iziToast.error({
        title: 'Error',
        message: 'Failed to fetch images. Please try again later.',
      });
    } finally {
      loader.style.display = 'none';
    }
  });
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
});
