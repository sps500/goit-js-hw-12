import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { searchImages, resetPage, increasePage } from './js/pixabay-api';
import { renderImages } from './js/render-functions';

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const gallery = document.getElementById('gallery');
  const loader = document.getElementById('loader');

  let page = 1;
  let query = '';
  let maxPage = 1;
  let loadMoreBtn;

  function showError(message) {
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: message,
    });
  }

  function showLoader() {
    loader.style.display = 'block';
  }

  function hideLoader() {
    loader.style.display = 'none';
  }

  function checkLoadMoreBtnVisibility() {
    if (page <= maxPage) {
      loadMoreBtn.classList.remove('hidden');
    } else {
      loadMoreBtn.classList.add('hidden');
      showError("We're sorry, but you've reached the end of search results.");
    }
  }

  searchForm.addEventListener('submit', async event => {
    event.preventDefault();

    query = event.target.elements.query.value.trim();
    if (!query) {
      showError('Please enter a search query');
      return;
    }

    showLoader();
    resetPage();

    try {
      const { images, totalHits } = await searchImages(query, page);
      renderImages(images);
      maxPage = Math.ceil(totalHits / 15);
    } catch (error) {
      showError('Failed to fetch images. Please try again later.');
    } finally {
      hideLoader();
      checkLoadMoreBtnVisibility();
      window.scrollBy({
        top: gallery.getBoundingClientRect().height * 2,
        behavior: 'smooth',
      });
    }
  });

  loadMoreBtn = document.querySelector('.js-btn-load');

  loadMoreBtn.addEventListener('click', async () => {
    increasePage();
    showLoader();
    try {
      const { images, totalHits } = await searchImages(query, page);
      renderImages(images, true); // Передаем второй аргумент для добавления новых изображений
      maxPage = Math.ceil(totalHits / 15);
    } catch (error) {
      showError('Failed to fetch more images. Please try again later.');
    } finally {
      hideLoader();
      checkLoadMoreBtnVisibility();
      window.scrollBy({
        top: gallery.getBoundingClientRect().height * 2,
        behavior: 'smooth',
      });
    }
  });

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
  });
});
