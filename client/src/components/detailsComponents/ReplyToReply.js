import { useState } from 'react';
import axios from 'axios';

import sendImg from '../../public/images/send.webp';
const ReplyToReply = ({
  faImage,
  FontAwesomeIcon,
  _id,
  user,
  endPoint,
  commentId,
  faPaperPlane,
}) => {
  const [replyFile, setReplyFile] = useState(null);
  const [replyText, setReplyText] = useState({ replyText: '' });
  const [isDisabled, setIsDisabled] = useState(false);
    const [btnMsg, setBtnMsg] = useState(false);
  const [error, setError] = useState('');
  
// submit reply to a reply
  console.log(replyFile);
  const handleReplyToReplySubmit = async (_id) => {
    if (!replyText.replyText) {
        setError('why no content?');
      setIsDisabled(false);
      return;
    }
    setBtnMsg(true);
    setIsDisabled(true);
    const { username } = user;
    const formData = new FormData();
    formData.append('replyText', replyText.replyText);
    formData.append('replyFile', replyFile);
    formData.append('username', username);
    formData.append('commentId', commentId);
    try {
      const response = await axios.patch(
        `${endPoint}/replyToReply/${_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data);
      setReplyText((prevState) => ({
        ...prevState,
        replyText: '',
      }));
      setReplyFile(null);
      setIsDisabled(false);
      setBtnMsg(false);
    } catch (error) {
      setIsDisabled(true);
      setBtnMsg(true);
      console.log(error.message);
        setError(error.message);
      setIsDisabled(false);
      setBtnMsg(false);
    }
  };
  return (
    <div className='reply-to-reply'>
      <div className='reply-form'>
        <label title='Add file' htmlFor='reply-file'>
          <FontAwesomeIcon
            style={{ fontSize: '1.5rem' }}
            className='file-icon'
            icon={faImage}
          />
          <input
            id='reply-file'
            type='file'
            name='replyFile'
            onChange={(event) => {
              setReplyFile(event.target.files[0]);
            }}
            accept='.png, .webp, .jpeg, .jpg'
          />
        </label>
        <input
          type='text'
          name='replyText'
          value={replyText.replyText}
          onChange={(event, _id) => {
            const { name } = event.target;
            setError('');
            setReplyText((prevState) => ({
              ...prevState,
              [name]: event.target.value,
              [_id]: !prevState[_id],
            }));
          }}
        />
        <button
          disabled={isDisabled}
          onClick={() => handleReplyToReplySubmit(_id)}
          className='reply-button'
        >
          {btnMsg ? (
            'sending...'
          ) : (
            <FontAwesomeIcon
              style={{ height: '2rem', width: '2rem',fontSize:'1.5rem' }}
              icon={faPaperPlane}
            />
          )}
        </button>
      </div>
      {error && (
        <div
          style={{
            color: 'crimson',
            fontSize: '1rem',
            margin: '.2rem',
            textAlign: 'center',
            border: 'solid .5px crimson',
            padding: '.5rem',
            width: '100%',
            borderRadius: '.5rem',
            fontWeight: 'bold',
            backgroundColor: 'rgba(255,10,10,.2)',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default ReplyToReply;
