import '../public/header.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useThemeContext } from '../hooks/useThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDroplet,
  faBars,
  faHouse,
  faNewspaper,
  faFootball,
  faUser,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { useLogOut } from '../hooks/useLogOut';
import { useAuthContext } from '../hooks/useAuthContext';

const Header = () => {
  const [showBar, setShowBar] = useState(false);
  const [showDarkMode, setShowDarkMode] = useState(true);

  const { dark, setDarkTheme } = useThemeContext();

  const { logOut } = useLogOut();
  const { user } = useAuthContext();

  const hideBar = () => {
    setShowBar((prevShowBar) => !prevShowBar);
    setShowDarkMode((prevDarkMode) => !prevDarkMode);
  };
  return (
    <div className={dark ? 'header dark': 'header light'}>
      <div className='header-content'>
        <FontAwesomeIcon className='faDroplet' icon={faDroplet} />
        <Link
          style={{
            color: dark ? '#e4e4e7' : '#404040',
          }}
          className='name'
          to='/'
        >
          NaiJa Gist
        </Link>
        {user && (
          <span
            className='welcome'
            style={{
              marginTop: '40px',
              marginLeft: '20px',
              fontSize: '.98rem',
            }}
          >
            <FontAwesomeIcon icon={faUser} /> {user.username}
          </span>
        )}
      </div>
      <div className='nav'>
        <ul className='links'>
          <li>
            <Link
              style={{
                color: dark ? '#e4e4e7' : '#404040',
              }}
              className='a'
              to='/'
            >
              <FontAwesomeIcon icon={faHouse} /> Home
            </Link>
          </li>
          {/* <li>
            <Link
              style={{
                color: dark ? '#e4e4e7' : '#404040',
              }}
              className='a'
              to='/'
            >
              <FontAwesomeIcon icon={faNewspaper} /> News
            </Link>
          </li> */}
          {/* <li>
            <Link
              style={{
                color: dark ? '#e4e4e7' : '#404040',
              }}
              className='a'
              to='/'
            >
              <FontAwesomeIcon icon={faFootball} /> Sport
            </Link>
          </li> */}
        </ul>
        <div className='sign-in-up'>
          <Link
            className={dark ? 'a-dark' : 'a-light'}
            style={{
              display: user ? 'none' : 'block',
              color: dark ? '#e4e4e7' : '#404040',
            }}
            to='/naija_gist/sign_up'
          >
            Sign Up
          </Link>
          <Link
            className={dark ? 'a-dark' : 'a-light'}
            style={{
              display: user ? 'none' : 'block',

              color: dark ? '#e4e4e7' : '#404040',
            }}
            to='/naija_gist/log_in'
          >
            Log In
          </Link>
          {user && (
            <span
              style={{
                fontSize: '.98rem',
              }}
            >
              <FontAwesomeIcon icon={faUser} /> {user.username}
            </span>
          )}
          <Link
            className={dark ? 'a-dark' : 'a-light'}
            style={{
              color: dark ? '#e4e4e7' : '#404040',
            }}
            to='/naija_gist/create'
          >
            <FontAwesomeIcon icon={faPen} /> create post
          </Link>
          <Link
            onClick={logOut}
            className={dark ? 'a-dark' : 'a-light'}
            style={{
              display: !user ? 'none' : 'block',
              color: dark ? '#e4e4e7' : '#404040',
            }}
          >
            Log out
          </Link>
        </div>
      </div>
      <div className='bar-links'>
        <span onClick={hideBar}>
          <FontAwesomeIcon className='faBars' icon={faBars} />
        </span>
        {showBar && (
          <div
            onClick={hideBar}
            style={{
              backgroundColor: dark ? '#171717' : '#e4e4e7',
              color: dark ? '#e4e4e7' : '#171717',
            }}
            className='link-bar'
          >
            <Link
              className={dark ? 'a-dark' : 'a-light'}
              style={{
                color: dark ? '#e4e4e7' : '#404040',
              }}
              to='/'
            >
              <FontAwesomeIcon icon={faHouse} /> Home
            </Link>
            <Link
              className={dark ? 'a-dark' : 'a-light'}
              style={{
                color: dark ? '#e4e4e7' : '#404040',
              }}
              to='/naija_gist/create'
            >
              <FontAwesomeIcon icon={faPen} /> Create Post
            </Link>
            {/* <Link
              className={dark ? 'a-dark' : 'a-light'}
              style={{
                color: dark ? '#e4e4e7' : '#404040',
              }}
              to='/'
            >
              <FontAwesomeIcon icon={faNewspaper} /> News
            </Link> */}
            {/* <Link
              className={dark ? 'a-dark' : 'a-light'}
              style={{
                color: dark ? '#e4e4e7' : '#404040',
              }}
              to='/'
            >
              <FontAwesomeIcon icon={faFootball} /> Sport
            </Link> */}
            <Link
              className={dark ? 'a-dark' : 'a-light'}
              style={{
                display: user ? 'none' : 'block',
                color: dark ? '#e4e4e7' : '#404040',
              }}
              to='/naija_gist/sign_up'
            >
              Sign Up
            </Link>
            <Link
              className={dark ? 'a-dark' : 'a-light'}
              style={{
                display: user ? 'none' : 'block',
                color: dark ? '#e4e4e7' : '#404040',
              }}
              to='/naija_gist/log_in'
            >
              Log In
            </Link>
            <span
              onClick={logOut}
              className={dark ? 'a-dark alog' : 'a-light alog'}
              style={{
                display: !user ? 'none' : 'block',
                color: dark ? '#e4e4e7' : '#404040',
                fontSize: '1rem',
              }}
            >
              Log out
            </span>
            <div className='dark-mode'>
              <div className='dark'>Dark mode</div>
              <div
                onClick={() => {
                  setShowDarkMode((prevDarkMode) => !prevDarkMode);
                  setDarkTheme((prev) => ({ dark: !dark }));
                }}
                className='ball-container'
              >
                <div className={!showDarkMode ? 'roll' : 'ball'}>.</div>
              </div>
              <div className='light'>Light mode</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
