const API_KEY = '43047310-ec96e83c6d494f225a37e8405';
import axios from 'axios';

const PER_PAGE = 15;
let currentPage = 1;

export async function searchImages(keyword) {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
    keyword
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${PER_PAGE}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    return data.hits.map(image => ({
      webformatURL: image.webformatURL,
      largeImageURL: image.largeImageURL,
      tags: image.tags,
      likes: image.likes,
      views: image.views,
      comments: image.comments,
      downloads: image.downloads,
    }));
  } catch (error) {
    throw new Error('Failed to fetch images from Pixabay API');
  }
}

export function resetPage() {
  currentPage = 1;
}

export function increasePage() {
  currentPage++;
}
