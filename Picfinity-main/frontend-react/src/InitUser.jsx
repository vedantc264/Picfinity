import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState } from './store/user';
import api from './services/api';
import Dashboard from './pages/Dashboard';

const InitUser = () => {
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser({ loggedIn: false, email: '', user_id: -1, name: '', profileImage: '', saved: [] });
        return;
      }

      try {
        const response = await api.get('/user/me');
        if (response.data.user) {
          setUser({
            loggedIn: true,
            email: response.data.user.email,
            user_id: response.data.user.user_id || response.data.user.id,
            name: response.data.user.name || '',
            profileImage: response.data.user.profileImage || '',
            saved: []
          });
        } else {
          localStorage.removeItem('token');
          setUser({ loggedIn: false, email: '', user_id: -1, name: '', profileImage: '', saved: [] });
        }
      } catch (error) {
        console.error('Init user error:', error);
        localStorage.removeItem('token');
        setUser({ loggedIn: false, email: '', user_id: -1, name: '', profileImage: '', saved: [] });
      }
    }

    init();
  }, [setUser]);

  return <Dashboard />;
};

export default InitUser;
