import { useThemeContext } from '../hooks/useThemeContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import BlogItem from '../components/detailsComponents/BlogItem';
import CommentItem from '../components/detailsComponents/CommentItem';

const Details = () => {
  const navigate = useNavigate();
  const { dark } = useThemeContext();
  const { id } = useParams();
  const { user } = useAuthContext();

  const mediaUrl = 'https:naija-gist-server.vercel.app/images';
  const endPoint = 'https:naija-gist-server.vercel.app/naija_gist';
  return (
    <div style={{ width: '100%', padding: '.5rem' }} className='container'>
      <BlogItem
        id={id}
        mediaUrl={mediaUrl}
        navigate={navigate}
        user={user}
        dark={dark}
        endPoint={endPoint}
      />
      <CommentItem
        id={id}
        mediaUrl={mediaUrl}
        navigate={navigate}
        user={user}
        dark={dark}
        endPoint={endPoint}
      />
    </div>
  );
};

export default Details;
