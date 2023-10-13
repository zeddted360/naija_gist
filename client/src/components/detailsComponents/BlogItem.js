import useFetch from '../../hooks/useFetch';
import { useState } from 'react';
import '../../public/blogItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faThumbsDown,
  faTrash,
  faFilePen,
  faUser,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { time } from '../../hooks/postedAt';
 
const BlogItem = ({ id, mediaUrl, navigate, user, dark, endPoint }) => {
  const url = new URL((window.location.href));
  console.log(url)
  const { blog, errors } = useFetch(`${endPoint}/blog/${id}`);
  const [error, setError] = useState('');
  const [blogLikes, setBlogLikes] = useState({
    bg: null,
    length: '',
  });
  //delete blog
  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this blog'
    );
    if (confirmDelete === true) {
      try {
        const response = await axios.delete(`${endPoint}/deleteBlog/${_id}`);
        window.alert(response.data);
        navigate('/');
      } catch (error) {
        console.log(error.message);
        setError('sorry request interrupted due to network error');
        window.setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } else {
      return;
    }
  };
  //like blog
  const handleLikeBlog = async (_id) => {
    if (!user) {
      navigate('/naija_gist/log_in');
      return;
    }
    setBlogLikes((prevState) => ({
      ...prevState,
      bg: true,
    }));
    try {
      const response = await axios.patch(`${endPoint}/LikeBlog/${_id}`, {
        username: user.username,
      });
      setBlogLikes((prevState) => ({
        ...prevState,
        bg: true,
        length: response.data,
      }));
    } catch (error) {
      console.log(error.message);
    }
  };
  // unlike blog
  const handleUnlikeBlog = async (_id) => {
    if (!user) {
      navigate('/naija_gist/log_in');
      return;
    }
    setBlogLikes((prevState) => ({
      ...prevState,
      bg: false,
    }));
    try {
      const response = await axios.patch(`${endPoint}/unlikeBlog/${_id}`, {
        username: user.username,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div style={{ width: '100%' }} className='blog-container'>
      {blog ? (
        <div
          style={{ display: !error ? 'block' : 'none' }}
          className='blog-item'
        >
          <h2>{blog.title}</h2>
          {Array.isArray(blog.media) && (
            <div
              className={
                blog.media.length !== 0 ? 'media-only-media' : 'media-only'
              }
            >
              {blog.media &&
                blog.media.map((media, index) => {
                  return (
                    <div key={index} div className='media-content'>
                      {media.includes('.png') ||
                      media.includes('.jpeg') ||
                      media.includes('.webp') ||
                      media.includes('.jpg') ? (
                        <img src={`${mediaUrl}/${media}`} alt='media' />
                      ) : (
                        <video controls>
                          <source src={`${mediaUrl}/${media}`} />
                        </video>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
          {
            <div className='author'>
              <i>{blog.postedBy}</i>
              <i>{time(blog.createdAt)}</i>
            </div>
          }
          <div style={{ lineHeight: '1.5', padding: '1rem' }}>
            <span
              style={{
                textTransform: 'capitalize',
                border: 'none',
                fontSize: '1.1rem',
              }}
            >
              {typeof blog.content === 'string' && blog.content.split(' ')[0]}
            </span>
            <span style={{ border: 'none' }}>
              {typeof blog.content === 'string' &&
                blog.content.split(' ').splice(1).join(' ')}
            </span>
          </div>
          <div className='utilities'>
            {Array.isArray(blog.likes) && (
              <button onClick={() => handleLikeBlog(blog._id)}>
                <FontAwesomeIcon
                  style={{
                    backgroundColor:
                      blog.likes.includes(user.username) && blogLikes.bg
                        ? 'dodgerblue'
                        : '',
                    padding: '.5rem',
                    fontSize: '1.5rem',
                  }}
                  className='like'
                  icon={faThumbsUp}
                />
                <b
                  style={{
                    marginLeft: '.5rem',
                    fontSize: '.9rem',
                    display: !blog.likes.length && 'none',
                  }}
                >
                  {Array.isArray(blog.likes)
                    ? `${
                        blog.likes.includes(user.username)
                          ? 'You'
                          : blog.likes[0]
                      } and ${blog.likes.length - 1} other${
                        blog.likes.length > 1 ? 's' : ''
                      }`
                    : blogLikes.length}
                </b>
              </button>
            )}
            <button onClick={() => handleUnlikeBlog(blog._id)}>
              <FontAwesomeIcon
                style={{ fontSize: '1.5rem' }}
                className='unlike'
                icon={faThumbsDown}
              />
            </button>
            {blog.postedBy === user.username && (
              <button onClick={() => handleDelete(blog._id)}>
                <FontAwesomeIcon
                  style={{ fontSize: '1.5rem' }}
                  className='delete'
                  icon={faTrash}
                />
              </button>
            )}
            {blog.postedBy === user.username && (
              <button htmlFor='edit'>
                <Link id='edit' to={`/naija_gist/details/${blog._id}/edit`}>
                  <FontAwesomeIcon
                    className='edit'
                    style={{ color: '#171717', fontSize: '1.5rem' }}
                    icon={faFilePen}
                  />
                </Link>
              </button>
            )}
          </div>
        </div>
      ) : (
        <h1>{errors}</h1>
      )}
      {error && <h1>{error}</h1>}
    </div>
  );
};
export default BlogItem;
