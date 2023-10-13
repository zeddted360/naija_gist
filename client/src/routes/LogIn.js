import '../public/signup.css';
import { useThemeContext } from '../hooks/useThemeContext';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsLeftRightToLine,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';
import axios from 'axios';

const LogIn = () => {
  const inputRef = useRef(null);
  const { dark } = useThemeContext();
  const { errors, formData, handleSubmit, handleChange } = useLogin(
    `https://naija-gist-server.vercel.app/naija_gist/log_in`
  );
  const [eyeOpen, setEyeOpen] = useState(true);
  const [eyeClose, setEyeClose] = useState(false);
  const [resetMail, setResetMail] = useState(false);
  const [mail, setMail] = useState('');

  const handleShowPassword = () => {
    inputRef.current.type = 'text';
    setEyeOpen(false);
    setEyeClose(true);
  };
  const handleHidePassword = () => {
    inputRef.current.type = 'password';
    setEyeClose(false);
    setEyeOpen(true);
  };
  const showForgetForm = () => {
    setResetMail(true);
  };
  const sendResetMail = async () => {
    console.log(mail);
try{
  const response = await axios.post(
    `https://naija-gist-server.vercel.app/naija_gist/reset/password`,
    { mail }
  );
  window.alert(response.data.message);
  window.location.reload();
} catch (error) {
  console.log(error.message);
}
  };
  return (
    <div className='sign-up'>
      <div
        style={{ display: resetMail ? 'none' : 'block' }}
        className={dark ? 'sign-up-form-dark' : 'sign-up-form-light'}
      >
        <h2>Log In</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <label htmlFor='email'>Email : </label>
          <input
            style={{ height: '2.5rem' }}
            type='email'
            name='email'
            id='email'
            placeholder='eg. zeddted360@gmail.com'
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor='password'>Password : </label>
          <input
            ref={inputRef}
            style={{ height: '2.5rem' }}
            type='password'
            name='password'
            id='password'
            placeholder='eg. Abcde1234*'
            value={formData.password}
            onChange={handleChange}
          />
          <div onClick={showForgetForm} style={{ color: 'crimson' }}>
            forget password?{' '}
          </div>
          {eyeOpen && (
            <FontAwesomeIcon
              onClick={handleShowPassword}
              className='eye-open'
              style={{ fontSize: '2rem' }}
              icon={faEye}
            />
          )}
          {eyeClose && (
            <FontAwesomeIcon
              onClick={handleHidePassword}
              className='eye-open'
              style={{ fontSize: '2rem' }}
              icon={faEyeSlash}
            />
          )}
          {errors && <div className='errors'>{errors}</div>}
          <button className={dark ? 'dark' : 'light'}>Submit</button>
        </form>
        <div className='already'>
          <i
            style={{
              marginRight: '1rem',
            }}
          >
            Already have an account?
          </i>
          <Link
            style={{
              fontSize: '1rem',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
            to='/naija_gist/sign_up'
          >
            Sign Up
          </Link>
        </div>
      </div>
      {resetMail && (
        <div onClick={showForgetForm} className='show-forget-form'>
          <form onSubmit={sendResetMail}>
          <input
            onChange={(event) => setMail(event.target.value)}
            placeholder='Enter your email'
            value={mail} 
            type='email' 
            required
            />
          <button>send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LogIn;
