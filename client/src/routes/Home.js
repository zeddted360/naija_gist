// 
import useFetch from '../hooks/useFetch';
import '../public/home.css';
import { useThemeContext } from '../hooks/useThemeContext';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { time } from '../hooks/postedAt';

const Home = () => {

  const mediaUrl = 'https://naija-gist-server.vercel.app/images';
  const { blog, errors } = useFetch(
    'https://naija-gist-server.vercel.app/naija_gist/blog/home'
  );
  const { dark } = useThemeContext();
  
  if (errors) {
    return <h1 style={{ textAlign: 'center' }}>{errors}</h1>;
  }
  let view;
  if (blog.length !== 0) {
  view = blog.map((item) => {
    return (
      <Link
        to={`/naija_gist/details/${item._id}`}
        className={dark ? 'item dark' : 'item light'}
        key={item._id}
      >
        <div>
          <h2>{item.title}</h2>
          <div className='media-containers'>
            {!item.media.includes(null) &&
              item.media.map((mediaItem, index) => {
                return (
                  <div className='medias' key={index}>
                    {mediaItem.includes('.png') ||
                    mediaItem.includes('.jpg') ||
                    mediaItem.includes('.webp') ||
                    mediaItem.includes('.jpeg') ? (
                      <img src={`${mediaUrl}/${mediaItem}`} alt='media' />
                    ) : (
                      <video controls>
                        <source src={`${mediaUrl}/${mediaItem}`} />
                      </video>
                    )}
                  </div>
                );
               
  })}
          </div>
          <div className='timestamp'>
            {item.postedBy && <i>Posted by: {item.postedBy}</i>}
            <span>{time(item.createdAt)}</span>
          </div>
        </div>
      </Link>
    );
  });
    
  } 
  

  return <div className='home'>{!blog ? <h1>Loading...</h1> : view}</div>;
};

export default Home;
