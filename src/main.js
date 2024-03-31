import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { searchImages } from './js/pixabay-api';
import { clearGallery, renderImages } from './js/render-functions';

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const loader = document.getElementById('loader');
  let lightbox;

  searchForm.addEventListener('submit', async event => {
    event.preventDefault();

    const query = event.target.elements.query.value.trim();
    if (!query) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Please enter a search query',
      });
      return;
    }

    clearGallery();
    loader.style.display = 'block';

    try {
      const images = await searchImages(query);
      renderImages(images);

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
        position: 'topRight',
        message: 'Failed to fetch images. Please try again later.',
      });
    } finally {
      loader.style.display = 'none';
    }
  });

  // Инициализируем SimpleLightbox при загрузке страницы
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
});
