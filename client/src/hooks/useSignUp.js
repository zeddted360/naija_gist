import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

export const useSignUpHook = (url) => {
  const navigate = useNavigate();

  const { user, dispatch } = useAuthContext();
  const [showAlert, setShowAlert] = useState(false);

  const [errors, setErrors] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    cPassword: '',
  });

  // handle form change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors('');
  };
  // handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { username, email, password } = formData;
      if (!password || !username || !email || !formData.cPassword) {
        throw Error('All Fields must be filled');
        return;
      }
      if (password !== formData.cPassword) {
        throw Error('Password do not match');
        return;
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.error);
      }
      if (response.ok) {
        setShowAlert((prevAlert) => true);
        setErrors('');
        setFormData({
          username: '',
          email: '',
          password: '',
          cPassword: '',
        });
        // save user to local storage
        localStorage.setItem('user', JSON.stringify(data));
        dispatch({ type: 'LOGIN', payload: data });
      }
    } catch (error) {
      console.log(error.message);
      setErrors(error.message);
    }
  };
  return {
    errors,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    showAlert,
  };
};
