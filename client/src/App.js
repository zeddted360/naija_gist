import Header from './components/Header';
import Footer from './components/Footer';
import './app.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Details from './routes/Details';
import SignUp from './routes/SignUp';
import LogIn from './routes/LogIn';
import NotFound from './routes/NotFound';
import{useThemeContext} from './hooks/useThemeContext'
import Create from './routes/Create';
import  EditBlog  from "./routes/EditBlog";

const App = () => {
  const { dark } = useThemeContext();
  return (
    <div
      style={{
        backgroundColor: dark ? '#171717' : '#e4e4e7',
        color: dark ? '#e4e4e7' : '#171717',
      }}
      className='wrapper'
    >
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path='/' Component={Home} />
          <Route path='/naija_gist/details/:id' Component={Details} />
          <Route path='/naija_gist/sign_up' Component={SignUp} />
          <Route path='/naija_gist/log_in' Component={LogIn} />
          <Route path='/naija_gist/create' Component={Create} />
          <Route path='/naija_gist/details/:id/edit' Component={EditBlog} />
          <Route path='*' Component={NotFound} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
