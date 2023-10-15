import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

export const useCreate = (url) => {
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const [errors, setErrors] = useState('');
  const [files, setFiles] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const { user } = useAuthContext();

  const handleFile = (event) => {
    const { files } = event.target;
    Array.from(files).forEach((item) => {
      const arr = ['.png', '.jpeg', '.jpg', '.webp', '.mp4'];
      const lastIndex = item.name.lastIndexOf('.');
      const extName = item.name.slice(lastIndex);
      if (!arr.includes(extName)) {
        setErrors(
          'Sorry the file format is not accepted \n only jpg, png, jpeg, webp and mp4 files are accepted'
        );
        return;
      } else {
        setErrors('');
        setFiles((prevState) => files);
      }
    });
  };
  const handleFileUpload = () => {
    if (!files) {
      setMsg('no file selected');
    }
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate('/naija_gist/log_in');
      return;
    }
    if (!formData.title || !formData.content) {
      setErrors('All fields must be filled');
      return;
    }
    try {
      const data = new FormData();

      data.append('title', formData.title.trim());
      data.append('content', formData.content.trim());
      data.append('postedBy', user.username);
      for (let i = 0; i < files.length; i++) {
        data.append('blogs_files', files[i]);
      }
      setMsg('Uploading...');
      setProgress((prevState) => {
        return {
          ...prevState,
          started: true,
        };
      });
      const response = await axios.post(url, data, {
        onUploadProgress: (progressEvent) => {
          setProgress((prevState) => {
            return {
              ...prevState,
              pc: progressEvent.progress * 100,
            };
          });
        },
      });
      setMsg('Uploaded');
      navigate('/');
      setFormData({
        title: '',
        content: '',
      });
      setFiles('');
      setErrors('');
    } catch (error) {
      window.alert(error.message);
    }
  };

  return {
    errors,
    handleChange,
    handleSubmit,
    formData,
    handleFile,
    msg,
    progress,
  };
};
