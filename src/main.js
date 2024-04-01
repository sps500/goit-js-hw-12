import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { searchImages, resetPage, increasePage } from './js/pixabay-api'; // Добавлены импорты resetPage и increasePage
import { clearGallery, renderImages } from './js/render-functions';

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const gallery = document.getElementById('gallery');
  const loader = document.getElementById('loader');

  let page = 1; // Початкова сторінка для завантаження
  let query = ''; // Початковий пустий рядок для пошуку
  let maxPage = 1; // Початкова максимальна сторінка
  let loadMoreBtn;

  // Функція показу повідомлення про помилку
  function showError(message) {
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: message,
    });
  }

  // Функція показу завантажувача
  function showLoader() {
    loader.style.display = 'block';
  }

  // Функція приховування завантажувача
  function hideLoader() {
    loader.style.display = 'none';
  }

  // Функція для перевірки видимості кнопки "Load more"
  function checkLoadMoreBtnVisibility() {
    if (page <= maxPage) {
      // Якщо поточна сторінка менша або дорівнює максимальній сторінці, показуємо кнопку "Load more"
      loadMoreBtn.classList.remove('hidden');
    } else {
      // Інакше ховаємо кнопку "Load more"
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

    clearGallery();
    showLoader();
    resetPage(); // Сброс текущей страницы перед началом нового поиска

    try {
      const { images, totalHits } = await searchImages(query, page);
      renderImages(images);
      maxPage = Math.ceil(totalHits / 15);
    } catch (error) {
      showError('Failed to fetch images. Please try again later.');
    } finally {
      hideLoader();
      checkLoadMoreBtnVisibility();
    }
  });

  // Обробник кліку на кнопку "Load more"
  loadMoreBtn = document.querySelector('.js-btn-load');

  loadMoreBtn.addEventListener('click', async () => {
    increasePage(); // Увеличение текущей страницы перед загрузкой следующей страницы
    showLoader();
    try {
      const { images, totalHits } = await searchImages(query, page);
      renderImages(images);
      maxPage = Math.ceil(totalHits / 15);
    } catch (error) {
      showError('Failed to fetch more images. Please try again later.');
    } finally {
      hideLoader();
      checkLoadMoreBtnVisibility();
    }
  });

  // Ініціалізуємо SimpleLightbox при завантаженні сторінки
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
});
