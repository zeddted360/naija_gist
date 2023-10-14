import '../public/create.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../hooks/useThemeContext';
const EditBlog = () => {
  //
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [progress, setProgress] = useState({ pc: 0, started: false });
  const [msg, setMsg] = useState('');
  const [files, setFiles] = useState('');
  const [errors, setErrors] = useState('');

  useEffect(() => {
    const goFetch = async () => {
      const response = await axios.get(
        `https:naija-gist-server.vercel.app/naija_gist/blog/${id}`
      );
      const data = response.data;
      setFormData(data);
      setFiles((prev) => data.media);
    };
    goFetch();
  }, [id]);
  const { dark } = useThemeContext();

  const handleChange = (event) => {
    const { name, value } = event.target;
   
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    
    setErrors('');
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title || !formData.content) {
      setErrors('All fields must be filled');
      return;
    }
    setMsg('Uploading...');
    setProgress((prevState) => ({
      ...prevState,
      started: true,
    }));
    const updatedData = new FormData();
    updatedData.append('title', formData.title.trim());
    updatedData.append('content', formData.content.trim());
    for (let i = 0; i < files.length; i++) {
      updatedData.append('edit_files', files[i]);
    }

    try {
      const response = await axios.put(
        `https:naija-gist-server.vercel.app/naija_gist/editBlog/${id}`,
        updatedData,
        {
          onUploadProgress: (progressEvent) => {
            setProgress((prevState) => ({
              ...prevState,
              pc: Math.floor(progressEvent.progress * 100),
            }));
          },
        }
      );
      setMsg('Done');
      navigate('/');
      setFormData({
        title: '',
        content: '',
      });
      setFiles('');
    } catch (error) {
      console.error(error.message);
      setErrors(error.message);
    }
  };

  return (
    <div className='create'>
      {!msg && (
        <div className='form-container'>
          <form onSubmit={handleSubmit}>
            <h1>Edit Blog</h1>
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
              onChange={(event) => {
                setFiles(event.target.files);
              }}
              name='edit_files'
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
      )}
      <div className='div'>
        {progress.started && (
          <div>
            <progress max='100' value={progress.pc}></progress>
            <br />
            <h3 style={{ textAlign: 'center' }}>{progress.pc}%</h3>
          </div>
        )}
        {msg && <h1>{msg} </h1>}
      </div>
    </div>
  );
};

export default EditBlog;
