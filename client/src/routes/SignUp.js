import '../public/signup.css';
import { useThemeContext } from '../hooks/useThemeContext';
import { Link } from 'react-router-dom';
import { useSignUpHook } from '../hooks/useSignUp';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
const SignUp = () => {
  const { dark } = useThemeContext();
  const {
    errors,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    showAlert,
  } = useSignUpHook(`https://naija-gist-server.vercel.app/naija_gist/sign_up`);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const inputRef1 = useRef(null);

  const [eyeOpen, setEyeOpen] = useState(true);
  const [eyeClose, setEyeClose] = useState(false);
  const [genPass, setGenPass] = useState(false);

  const handleShowPassword = () => {
    inputRef.current.type = 'text';
    inputRef1.current.type = 'text';

    setEyeOpen(false);
    setEyeClose(true);
  };
  const handleHidePassword = () => {
    inputRef.current.type = 'password';
    inputRef1.current.type = 'password';

    setEyeClose(false);
    setEyeOpen(true);
  };

  const HandleGeneratePassword = (l) => {
    const uc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lc = 'abcdefghijklmnopqrstuvwxyz';
    const chars = '_-.,*&^%$#@!+=;:?><|';
    const num = '0123456789';
    const allChars = uc + lc + chars + num;
    let password = '';
    for (let i = 0; i < l; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }
    let genPassword = (inputRef.current.value = password);
    let genPassword1 = (inputRef1.current.value = password);

    setFormData((prevState) => ({
      ...prevState,
      password: genPassword,
      cPassword: genPassword1,
    }));
  };
  const blur = () => {
    setTimeout(() => {
      setGenPass(false);
    }, 1000);
  };

  return (
    <div className='sign-up'>
      <div className={dark ? 'sign-up-form-dark' : 'sign-up-form-light'}>
        <h2>Sign Up</h2>
        <br />
        <form autoComplete='off' onSubmit={handleSubmit}>
          {eyeOpen && (
            <FontAwesomeIcon
              onClick={handleShowPassword}
              className={!genPass ? 'eye-open-s' : 'eye-open-c'}
              style={{ fontSize: '2rem' }}
              icon={faEye}
            />
          )}
          {eyeClose && (
            <FontAwesomeIcon
              onClick={handleHidePassword}
              className={!genPass ? 'eye-open-s' : 'eye-open-c'}
              style={{ fontSize: '2rem' }}
              icon={faEyeSlash}
            />
          )}
          <label htmlFor='username'>username: </label>
          <input
            style={{ height: '2.5rem' }}
            type='text'
            name='username'
            id='username'
            placeholder='eg zeddted360'
            value={formData.username}
            onChange={handleChange}
          />

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
            onFocus={() => {
              setGenPass(true);
            }}
            onBlur={blur}
          />
          {genPass && (
            <span className='strong-pass'>
              <b>
                Enter a strong password or click on the button below to generate
                a strong password
              </b>
              <div
                onClick={() => HandleGeneratePassword(16)}
                className='strong-password'
              >
                Generate
              </div>
            </span>
          )}
          <label htmlFor='cpassword'>Confirm Password : </label>
          <input
            style={{ height: '2.5rem' }}
            type='password'
            name='cPassword'
            id='cPassword'
            placeholder='eg. Abcde1234'
            value={formData.cPassword}
            onChange={handleChange}
            ref={inputRef1}
          />
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
            to='/naija_gist/log_in'
          >
            Log in
          </Link>
        </div>
      </div>
      {showAlert && (
        <div style={{ display: errors ? 'none' : 'block' }} className='alert'>
          <h3>
            A verification link has been sent to your email address to confirm
            if this email exists or is really yours
          </h3>
          <br />
          <p>
            Please do well to confirm before 12 hours expiration time and
            proceed to login
          </p>
          <button
            onClick={() => {
              navigate('/naija_gist/log_in');
            }}
            className='ok'
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUp;
