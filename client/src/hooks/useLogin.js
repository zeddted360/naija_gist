import {useState} from 'react'
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogin =(url)=> {
const navigate = useNavigate()
  const { user, dispatch } = useAuthContext();
  const [errors, setErrors] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // handle form change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors('')
  };

  // handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const {  email, password } = formData;
      if (!password ||  !email ) {
        throw Error('All Fields must be filled');
        return;
      }
     
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data);
      }
      if (response.ok) {
        setErrors('');
        setFormData({
          email: '',
          password: '',
        });
                  localStorage.setItem('user', JSON.stringify(data));
                  dispatch({ type: 'LOGIN', payload: data });
                 navigate('/')
      }
    } catch (error) {
      setErrors(error.message);
    }
  };
  return { errors, formData,handleSubmit,handleChange };
}