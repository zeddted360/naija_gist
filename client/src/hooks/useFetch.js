import { useState, useEffect } from 'react';
import { useDispatch } from './useDispatch';
import { useAuthContext } from './useAuthContext';
import axios from 'axios';

const useFetch = (url) => {
  const { user } = useAuthContext();
  const { dispatch } = useDispatch();
  const [blog, setBlogs] = useState([]);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    try {
      const fetch = async () => {
        const response = await axios.get(url, {
          headers: {
            authorization: `Bearer ${user.userToken}`,
          },
        });
        
        setBlogs(response.data);
        dispatch({ type: 'GET_ALL_BLOGS', payload: response.data });

      };
      fetch();
    } catch (error) {
      setErrors(error.message);
    }
  }, [url, blog, dispatch, user.userToken]);

  return { blog, errors };
};
export default useFetch;
