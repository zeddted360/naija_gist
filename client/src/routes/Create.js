import '../public/create.css';
import { useThemeContext } from '../hooks/useThemeContext';
import {useCreate} from '../hooks/useCreate';
const Create = () => {
  const { dark } = useThemeContext();

 const {
   handleFile,
   errors,
   handleChange,
   handleSubmit,
   formData,
   msg,
   progress,
 } = useCreate('https://naija-gist-server.vercel.app/naija_gist/blog/post');
  return (
    <div className='create'>
      {!msg || !progress ? (
        <div className='form-container'>
          <form onSubmit={handleSubmit}>
            <h1>Post Blog</h1>
            <label htmlFor='title'>Title :</label>
            <input
            className='title'
              id='title'
              type='text'
              value={formData.title}
              onChange={handleChange}
              placeholder='Title'
              name='title'
            />
            <label htmlFor='content'>Content :</label>
            <textarea
              id='content'
              value={formData.content}
              onChange={handleChange}
              placeholder='Whats on your mind'
              name='content'
              cols='10'
              rows='10'
            />
            <input
              type='file'
              id='media'
              onChange={handleFile}
              name='blogs_files'
              multiple
            />
             {errors && (
              <div style={{
                color: 'crimson',
                border: 'solid 1px',
                textAlign: 'center',
                borderRadius: '.5rem',
                padding: '1rem',
                fontSize:'bold',
                backgroundColor:'rgba(200,5,5,.1)',
              }} className='error'>
                {errors}
              </div>
            )}
            <button className={!dark ? 'a-light' : 'a-dark'}>Post</button>
          </form>
        </div>
      ) : (
        <div className='div'>
          {progress.started && (
            <div>
              <progress max='100' value={progress.pc}></progress><br/>
              <h3 style={{textAlign:'center'}}>{Math.floor(progress.pc)}%</h3>
            </div>
          )}
          {msg && (
            <h1 >{msg} </h1>
          )}
        </div>
      )}
    </div>
  );
};

export default Create;
