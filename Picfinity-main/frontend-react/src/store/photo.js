import { atom } from 'recoil';
import { selector } from 'recoil';
export const photoState = atom({
  key: 'photoState',
  default: [{
      photoId: 1,
      title: null,
      photo_url: "https://firebasestorage.googleapis.com/v0/b/photo-gallery-cee36.appspot.com/o/images%2F542f346c609d5434161b473ec763e934.jpg?alt=media&token=e82ed32d-90bf-43e8-a514-a4163a537757",
      description: "Fire",
      category: "Nature",
      likes: 0
    }]
});
