// import 'simplelightbox/dist/simple-lightbox.min.css';
// import iziToast from 'izitoast';
// import 'izitoast/dist/css/iziToast.min.css';
// import { searchImages } from './js/pixabay-api';
// import { clearGallery, renderImages } from './js/render-functions';

// document.addEventListener('DOMContentLoaded', () => {
//   const searchForm = document.getElementById('search-form');
//   const loader = document.getElementById('loader');
//   let lightbox;

//   searchForm.addEventListener('submit', async event => {
//     event.preventDefault();

//     const query = event.target.elements.query.value.trim();
//     if (!query) {
//       iziToast.error({
//         title: 'Error',
//         position: 'topRight',
//         message: 'Please enter a search query',
//       });
//       return;
//     }

//     clearGallery();
//     loader.style.display = 'block';

//     try {
//       const images = await searchImages(query);
//       renderImages(images);

//       if (lightbox) {
//         lightbox.refresh();
//       } else {
//         lightbox = new SimpleLightbox('.gallery a', {
//           captionsData: 'alt',
//           captionDelay: 250,
//         });
//       }
//     } catch (error) {
//       console.error(error.message);
//       iziToast.error({
//         title: 'Error',
//         position: 'topRight',
//         message: 'Failed to fetch images. Please try again later.',
//       });
//     } finally {
//       loader.style.display = 'none';
//     }
//   });

//   // Инициализируем SimpleLightbox при загрузке страницы
//   lightbox = new SimpleLightbox('.gallery a', {
//     captionsData: 'alt',
//     captionDelay: 250,
//   });
// });
// // =======================================================
// async function onFormSubmit(e) {
//   e.preventDefault();
//   query = e.target.elements.query.value.trim();
//   page = 1;

//   if (!query) {
//     showError('Empty field');
//     return;
//   }

//   showLoader();

//   try {
//     const data = await fetchArticles(query, page);
//     if (data.totalResults === 0) {
//       showError('Sorry!');
//     }
//     maxPage = Math.ceil(data.totalResults / 15);
//     refs.articleListElem.innerHTML = '';
//     renderArticles(data.articles);
//   } catch (err) {
//     showError(err);
//   }

//   hideLoader();
//   checkBtnVisibleStatus();
//   e.target.reset();
// }

// async function onLoadMoreClick() {
//   page += 1;
//   showLoader();
//   const data = await fetchArticles(query, page);
//   renderArticles(data.articles);
//   hideLoader();
//   checkBtnVisibleStatus();

//   const height =
//     refs.articleListElem.firstElementChild.getBoundingClientRect().height;

//   scrollBy({
//     behavior: 'smooth',
//     top: 10,
//   });
// }

// ======================================
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { searchImages } from './js/pixabay-api';
import { clearGallery, renderImages } from './js/render-functions';

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const gallery = document.getElementById('gallery');
  const loader = document.getElementById('loader');

  let page = 1; // Початкова сторінка для завантаження
  let query = ''; // Початковий пустий рядок для пошуку
  let maxPage = 1; // Початкова максимальна сторінка

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

    try {
      const images = await searchImages(query, page);
      renderImages(images);
      maxPage = Math.ceil(images.length / 15);
    } catch (error) {
      showError('Failed to fetch images. Please try again later.');
    } finally {
      hideLoader();
      checkLoadMoreBtnVisibility();
    }
  });

  // Обробник кліку на кнопку "Load more"
  const loadMoreBtn = document.querySelector('.js-btn-load');

  loadMoreBtn.addEventListener('click', async () => {
    page++;
    showLoader();
    try {
      const images = await searchImages(query, page);
      renderImages(images);
      maxPage = Math.ceil(images.length / 15);
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
