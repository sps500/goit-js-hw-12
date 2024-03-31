import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Определение функции clearGallery

export function clearGallery() {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
}

// Определение функции renderImages
export function renderImages(images) {
  const gallery = document.querySelector('.gallery');

  // Очищаем галерею перед добавлением новых изображений
  gallery.innerHTML = '';

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

  // После добавления изображений вызываем метод refresh для SimpleLightbox
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}
