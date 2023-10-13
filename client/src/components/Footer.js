import '../public/footer.css';
import { useThemeContext } from '../hooks/useThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faEnvelope } from '@fortawesome/free-solid-svg-icons';
const Footer = () => {
    const { dark } = useThemeContext();
    return (
      <div className={dark ? 'footer dark' : 'footer light'}>
        <div>
          <FontAwesomeIcon
            style={{ margin: '.3rem', fontSize: '1.5rem' }}
            icon={faLocationDot}
          />
         <p> For your advertisement contact us @ <i>+2347053541229</i></p>
        </div>
        <div>
          <FontAwesomeIcon
            style={{ margin: '.5rem', fontSize: '1.5rem' }}
            icon={faEnvelope}
          />
          <i>zeddted360@gmail.com</i>
        </div>
        <div>
          <b style={{ margin: '.5rem', fontSize: '1.5rem' }} >&copy; </b>
          <i>zeddted 2023</i>
        </div>
      </div>
    );
}
 
export default Footer;