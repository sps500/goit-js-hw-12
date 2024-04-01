import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = null;

// Получаем высоту одной карточки галереи
function getGalleryCardHeight() {
  const galleryCard = document.querySelector('.image-container');
  const cardHeight = galleryCard.getBoundingClientRect().height;
  return cardHeight;
}

// Прокручиваем страницу на две высоты карточки галереи
function scrollToNextGroup() {
  const cardHeight = getGalleryCardHeight();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth', // Делаем прокрутку плавной
  });
}

// Определение функции clearGallery
export function clearGallery() {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
}

// Определение функции renderImages
export function renderImages(images, append = false) {
  const gallery = document.querySelector('.gallery');

  // Функция для создания <li> с <p> и классом
  function createListItemWithParagraph(label, value, className) {
    const listItem = document.createElement('li');
    listItem.textContent = `${label}`;
    listItem.classList.add(className); // Добавление класса к <li>
    const paragraph = document.createElement('p');
    paragraph.textContent = `${value}`;
    listItem.appendChild(paragraph); // Добавление <p> к <li>
    return listItem;
  }

  // Создаем или очищаем галерею в зависимости от флага append
  if (!append) {
    gallery.innerHTML = '';
  }

  images.forEach(image => {
    // Создаем элемент ссылки для каждого изображения
    const link = document.createElement('a');
    link.href = image.largeImageURL;
    link.dataset.src = image.largeImageURL; // Добавляем data-src для SimpleLightbox

    // Создаем элемент изображения
    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.title = image.tags;

    // Добавляем изображение к ссылке
    link.appendChild(img);

    // Создаем список с данными
    const dataList = document.createElement('ul');
    dataList.classList.add('my-ul-class');

    // Создаем элемент <li> для каждого значения и добавляем к <ul>
    const likesItem = createListItemWithParagraph(
      'Likes:',
      image.likes,
      'my-li-class'
    );
    const viewsItem = createListItemWithParagraph(
      'Views:',
      image.views,
      'my-li-class'
    );
    const commentsItem = createListItemWithParagraph(
      'Comments:',
      image.comments,
      'my-li-class'
    );
    const downloadsItem = createListItemWithParagraph(
      'Downloads:',
      image.downloads,
      'my-li-class'
    );

    dataList.appendChild(likesItem);
    dataList.appendChild(viewsItem);
    dataList.appendChild(commentsItem);
    dataList.appendChild(downloadsItem);

    // Создаем элемент для размещения списка данных
    const info = document.createElement('div');
    info.classList.add('image-info');
    info.appendChild(dataList);

    // Создаем контейнер для изображения и данных
    const container = document.createElement('div');
    container.classList.add('image-container');
    container.appendChild(link);
    container.appendChild(info);

    // Добавляем контейнер к галерее
    gallery.appendChild(container);
  });

  // Создаем или обновляем SimpleLightbox
  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a');
  } else {
    lightbox.refresh();
  }

  // Прокручиваем страницу на две высоты карточки галереи
  scrollToNextGroup();
}
