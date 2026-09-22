import { atom } from 'recoil';
import { selector } from 'recoil';
export const userState = atom({
  key: 'userState',
  default: {
    loggedIn: false,
    email : '',
    user_id : -1,
    name : '',
    profileImgae : '',
    saved : []
  },
});
export const loggedInSelector = selector({
    key: 'loggedInSelector',
    get: ({ get }) => {
      const { loggedIn } = get(userState);
      return loggedIn;
    },
  });