import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogOut = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const logOut = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    setTimeout(() => {
    navigate('/naija_gist/log_in');
    }, 1000);
  };
  return { logOut }
};
