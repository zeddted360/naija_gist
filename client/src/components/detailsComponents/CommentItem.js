import { useState,useRef } from 'react';
import '../../public/commentItem.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
  faUser,
  faComment,
  faThumbsUp,
  faThumbsDown,
  faTrash,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import useFetch from '../../hooks/useFetch';
import { time } from '../../hooks/postedAt';
import ReplyToReply from './ReplyToReply';
import send from '../../public/images/send.webp';
import { useNavigate } from 'react-router-dom';

const CommentItem = ({ user, id, endPoint, mediaUrl,dark }) => {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { blog: comments, errors } = useFetch(`${endPoint}/getComment/${id}`);
  const [commentText, setCommentText] = useState('');
  const [commentFile, setCommentFile] = useState(null);
  const [replyText, setReplyText] = useState({ replyText: '' });
  const [replyFile, setReplyFile] = useState(null);
  const [error, setError] = useState({
    comment: '',
    reply: '',
    innerReply: '',
  });
  const [showReplyForm, setShowReplyForm] = useState({});
  const [showLike, setShowLike] = useState({});
  const [showLikeInner, setShowLikeInner] = useState({});
  const [showReplyInner, setShowReplyInner] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [btnMsg, setBtnMsg] = useState(false);
  const [deleteComment, setDeleteComment] = useState({});
  const [deleteInnerReply, setDeleteInnerReply] = useState({});

  const handleReplyInner = (_id) => {
    setShowReplyInner((prevState) => ({
      ...prevState,
      [_id]: !prevState[_id],
    }));
  };
  const handleShowLike = (_id) => {
    setShowLike((prevState) => ({
      ...prevState,
      [_id]: !prevState[_id],
    }));
  };
  // inner reply like
  const handleShowLikeInner = async (_id) => {
    setShowLikeInner((prevState) => ({
      ...prevState,
      [_id]: !prevState[_id],
    }));
  };
  // handle like inner reply
  const handleLikeInnerReply = async (_id, commentId) => {
    if (!user) {
      window.alert(
        'Sorry you ned to login before liking or unliking this reply'
      );
      navigate('/naija_gist/log_in');
      return;
    }
    try {
      const response = await axios.patch(`${endPoint}/likeReply/${_id}`, {
        username: user.username,
        commentId,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  //handle unlike inner reply
  const handleUnlikeInnerReply = async (_id, commentId) => {
    if (!user) {
      window.alert(
        'Sorry you ned to login before liking or unliking this reply'
      );
      navigate('/naija_gist/log_in');
      return;
    }
    try {
      const response = await axios.patch(`${endPoint}/unlikeReply/${_id}`, {
        username: user.username,
        commentId,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowOpenReply = (_id) => {
    setShowReplyForm((prevState) => ({
      ...prevState,
      [_id]: !prevState[_id],
    }));
  };
  // submit comment
  const handleSubmitComment = async () => {
    if (!user) {
      navigate('/naija_gist/log_in');
      return;
    }
    setIsDisabled(true);
    if (!commentText) {
      setError((prevState) => ({
        ...prevState,
        comment: 'Why no content?',
      }));
      inputRef.current.focus();
      setBtnMsg(false);
      setIsDisabled(false);
      return;
    }
    setBtnMsg(true);
    try {
      const formData = new FormData();
      formData.append('username', user.username);
      formData.append('postId', id);
      formData.append('commentFile', commentFile);
      formData.append('content', commentText.trim());
      const response = await axios.post(`${endPoint}/postComment`, formData, {
        'Content-Type': 'multipart/form-data',
      });
      setCommentText('');
      setCommentFile(null);
      setBtnMsg(false);
      setIsDisabled(false);
    } catch (error) {
      setIsDisabled(true);
      setBtnMsg(true);
      console.log(error.message);
      setError((prevState) => ({
        ...prevState,
        comment: error.message,
      }));
      setBtnMsg(false);
      setIsDisabled(false);
    }
  };
  //submit reply to a comment
  const handleReplySubmit = async (_id) => {
if (!user) {
  navigate('/naija_gist/log_in');
  return;
}
    setIsDisabled(true);
    if (!replyText.replyText) {
      setError((prevState) => ({
        ...prevState,
        reply: 'Why no content?',
      }));
      inputRef.current.focus();
      setIsDisabled(false);
      return;
    }
    setIsDisabled(true);
    setBtnMsg(true);
    const { username } = user;
    const formData = new FormData();
    formData.append('replyText', replyText.replyText.trim());
    formData.append('replyFile', replyFile);
    formData.append('username', username);
    try {
      const response = await axios.patch(
        `${endPoint}/replyComment/${_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      inputRef.current.value = ''
      setReplyText((prevState) => ({
        ...prevState,
        replyText: '',
      }));
      setBtnMsg(false);
      setIsDisabled(false);
    } catch (error) {
      setIsDisabled(true);
      setBtnMsg(true);
      setError(error.message);
      setBtnMsg(false);
      setIsDisabled(false);
    }
  };

  // handle delete comment
  const handleDeleteComment = async (_id) => {
    if (!user) {
      navigate('/naija_gist/log_in');
      return
    }
    if (!user) {
      navigate('/naija_gist/log_in');
      return;
    }
    const confirmDelete = window.confirm(
      'Are you sure to delete this comment?'
    );
    if (confirmDelete === false) {
      return;
    }
    setDeleteComment((prevState) => ({
      ...prevState,
      [_id]: !prevState[_id],
    }));
    // delete the comment here
    try {
      const response = await axios.delete(`${endPoint}/deleteComment/${_id}`);
      console.log(response);
      window.alert(response.data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  // handle delete inner reply

  const handleDeleteInnerReply = async (_id, commentId) => {
    if (!user) {
      navigate('/naija_gist/log_in');
      return
    }
    const confirmDelete = window.confirm('Are you sure to delete this reply?');
    if (!confirmDelete) {
      return;
    }
    setDeleteInnerReply((prevState) => ({
      ...prevState,
      [_id]: !prevState[_id],
    }));

    try {
      const response = await axios.patch(`${endPoint}/deleteReply/${_id}`, {
        commentId,
      });
      console.log(response.data);

      window.alert(response.data.message);
    } catch (error) {
      console.log(error.message);
    }
  };
  //handle like comment
  const handleLikeComment = async (_id) => {
    if (!user) {
      window.alert('Please login in to like this comment');
      navigate('/naija_gist/log_in');
      return;
    }
    try {
      const response = await axios.patch(`${endPoint}/likeComment/${_id}`, {
        username: user.username,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  //handle unlike comment
  const handleUnlikeComment = async (_id) => {
    if (!user) {
      navigate('/naija_gist/log_in');
      return;
    }
    try {
      const response = await axios.patch(`${endPoint}/unlikeComment/${_id}`, {
        username: user.username,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='comment-item'>
      <div className='form-container'>
        <label title='Add file' htmlFor='comment-file'>
          <input
            type='file'
            name='commentFile'
            onChange={(event) => setCommentFile(event.target.files[0])}
            id='comment-file'
            accept='.png, .webp, .jpeg, .jpg'
          />
          <FontAwesomeIcon
            style={{ fontSize: '1.5rem' }}
            className='file-icon'
            icon={faImage}
          />
        </label>
        <div className='text-area'>
          <textarea
            name='commentText'
            placeholder='leave a comment'
            ref={inputRef}
            value={commentText}
            onChange={(event) => {
              setError((prevState) => ({
                ...prevState,
                comment: '',
              }));
              setCommentText(event.target.value);
            }}
          />
          <button
            className='btn-comment'
            disabled={isDisabled}
            onClick={handleSubmitComment}
          >
            {btnMsg ? (
              'sending...'
            ) : (
              <FontAwesomeIcon
                style={{ height: '1.5rem', width: '1.5rem' }}
                icon={faPaperPlane}
              />
            )}
          </button>
        </div>
      </div>
      {error.comment && (
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
          {error.comment}
        </div>
      )}
      {comments && (
        <div className='comment-display'>
          {comments &&
            comments.map((comment) => {
              return (
                <div key={comment._id} className='comment'>
                  <div className={dark ? 'dark' : 'light'}>
                    <div className='comment-author'>
                      <span>
                        <FontAwesomeIcon
                          style={{ marginRight: '4px', fontSize: '1.5rem', width: '1.5rem', height:'1.5rem' }}
                          className='file-icon'
                          icon={faUser}
                        />
                        <i>{comment.username}</i>
                      </span>
                      <i>{time(comment.createdAt)}</i>
                    </div>
                    <p>{comment.comment}</p>
                    <div className='media'>
                      {(comment.media && comment.media.includes('png')) ||
                      comment.media.includes('jpg') ||
                      comment.media.includes('webp') ||
                      comment.media.includes('jpeg') ? (
                        <img
                          style={{ margin: '0 auto' }}
                          src={`${mediaUrl}/${comment.media}`}
                          alt='media'
                        />
                      ) : (
                        <video
                          style={{
                            display: comment.media.includes('mp4')
                              ? 'block'
                              : 'none',
                            margin: '0 auto',
                          }}
                          controls
                        >
                          <source
                            src={`${mediaUrl}/${comment.media}`}
                            alt='video'
                          />
                        </video>
                      )}
                    </div>
                    <div className='reply-like'>
                      <span
                        style={{
                          display: 'flex',
                          gap: '.5rem',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                        }}
                        onClick={() => handleShowLike(comment._id)}
                      >
                        {showLike[comment._id] ? (
                          <FontAwesomeIcon
                            style={{
                            width: '1.5rem', height: '1.5rem'
                            }}
                            onClick={() => {
                              setShowLike((prevState) => ({
                                ...prevState,
                                like: false,
                              }));
                              handleUnlikeComment(comment._id);
                            }}
                            icon={faThumbsUp}
                          />
                        ) : (
                          <FontAwesomeIcon
                            style={{ fontSize: '1.5rem',width: '1.5rem', height:'1.5rem' }}
                            onClick={() => {
                              setShowLike((prevState) => ({
                                ...prevState,
                                like: true,
                              }));
                              handleLikeComment(comment._id); //like  comment
                            }}
                            icon={faThumbsDown}
                          />
                        )}
                        <i style={{ fontSize: '.9rem' }}>
                          {!showLike[comment._id]
                            ? `${comment.likes.length !== 0 ? '' : 'like'} ${
                                comment.likes.includes(user.username)
                                  ? `you and ${comment.likes.length - 1} other${
                                      comment.likes.length - 1 > 1 ? 's' : ''
                                    }`
                                  : comment.likes.length !== 0
                                  ? `${comment.likes[0]} and ${
                                      comment.likes.length - 1
                                    } other${
                                      comment.likes.length - 1 > 1 ? 's' : ''
                                    }`
                                  : ''
                              }`
                            : `${comment.likes.length !== 0 ? '' : 'unlike'} ${
                                comment.likes.includes(user.username)
                                  ? `you and ${comment.likes.length - 1} other${
                                      comment.likes.length - 1 > 1 ? 's' : ''
                                    }`
                                  : comment.likes.length !== 0
                                  ? `${comment.likes[0]} and ${
                                      comment.likes.length - 1
                                    } other${
                                      comment.likes.length - 1 > 1 ? 's' : ''
                                    }`
                                  : ''
                              }`}
                        </i>
                      </span>
                      <span
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          gap: '.5rem',
                          justifyContent: 'space-between',
                          fontSize: '1.2rem',
                        }}
                        onClick={() => handleShowOpenReply(comment._id)}
                      >
                        <FontAwesomeIcon
                          style={{ fontSize: '1.5rem',width: '1.5rem', height:'1.5rem' }}
                          icon={faComment}
                        />
                        <i style={{ fontSize: '.9rem' }}>
                          {showReplyForm[comment._id] ? 'close' : 'reply'}
                        </i>
                      </span>
                      {comment.username === user.username && (
                        <span
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '.5rem',
                            justifyContent: 'space-between',
                            fontSize: '1.2rem',
                          }}
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <FontAwesomeIcon
                            style={{ fontSize: '1.5rem' ,width: '1.5rem', height:'1.5rem'}}
                            icon={faTrash}
                          />
                          <i style={{ fontSize: '.9rem' }}>
                            {!deleteComment[comment._id]
                              ? 'delete'
                              : 'deleting...'}
                          </i>
                        </span>
                      )}
                    </div>
                    {showReplyForm[comment._id] && (
                      <div className='reply-file'>
                        <div className='reply-container'>
                          {comment.replies
                            .filter((reply) => reply.commentId === comment._id)
                            .map((item) => {
                              return (
                                <div
                                  style={{ padding: '1rem' }}
                                  key={item._id}
                                  className={dark ? 'dark' : 'light'}
                                >
                                  <div className='user-reply'>
                                    <span
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <i>
                                        {' '}
                                        <FontAwesomeIcon
                                          style={{
                                            marginRight: '4px',
                                            fontSize: '1.5rem',
                                            width: '1.5rem',
                                            height: '1.5rem'
                                          }}
                                          className='file-icon'
                                          icon={faUser}
                                        />
                                        {item.username}
                                      </i>
                                      <i>{time(item.createAt)}</i>
                                    </span>
                                  </div>
                                  <div style={{ marginTop: '1rem' }}>
                                    <b style={{ color: 'dodgerblue' }}>
                                      {item.reply.split(' ')[0]}
                                    </b>
                                    <p>
                                      {item.reply.split(' ').slice(1).join(' ')}
                                    </p>
                                  </div>
                                  {item.media && (
                                    <div>
                                      {item.media.includes('png') ||
                                      item.media.includes('jpg') ||
                                      item.media.includes('webp') ||
                                      item.media.includes('jpeg') ? (
                                        <img
                                          style={{
                                            display: item.media
                                              ? 'block'
                                              : 'none',
                                            marginBottom: '1rem',
                                            margin: '0 auto',
                                          }}
                                          src={`${mediaUrl}/${item.media}`}
                                          alt='media'
                                        />
                                      ) : (
                                        <video
                                          style={{
                                            marginBottom: '1rem',
                                            margin: '0 auto',
                                          }}
                                          controls
                                        >
                                          <source
                                            src={`${mediaUrl}/${item.media}`}
                                          />
                                        </video>
                                      )}
                                    </div>
                                  )}
                                  {/* {reply to a reply} */}
                                  <div className='likes reply'>
                                    <span
                                      className='like'
                                      onClick={() =>
                                        handleShowLikeInner(item._id)
                                      }
                                    >
                                      {showLikeInner[item._id] ? (
                                        <FontAwesomeIcon
                                          style={{
                                            fontSize: '1.5rem',
                                            width: '1.5rem', height:'1.5rem'
                                          }}
                                          onClick={() => {
                                            setShowLikeInner((prevState) => ({
                                              ...prevState,
                                              like: false,
                                            }));

                                            handleUnlikeInnerReply(
                                              item._id,
                                              comment._id
                                            );
                                          }}
                                          icon={faThumbsUp}
                                        />
                                      ) : (
                                        <FontAwesomeIcon
                                          style={{
                                              fontSize: '1.5rem',
                                              width: '1.5rem',
                                              height: '1.5rem'
                                          }}
                                          onClick={() => {
                                            setShowLikeInner((prevState) => ({
                                              ...prevState,
                                              like: true,
                                            }));
                                            handleLikeInnerReply(
                                              item._id,
                                              comment._id
                                            );
                                          }}
                                          icon={faThumbsDown}
                                        />
                                      )}
                                      <i
                                        style={{
                                          margin: '.5rem',
                                          fontSize: '.9rem',
                                          width: '1.5rem',
                                          height: '1.5rem'
                                        }}
                                      >
                                        {!showLikeInner[item._id]
                                          ? `${
                                              item.likes.length !== 0
                                                ? ''
                                                : 'like'
                                            } ${
                                              item.likes.includes(user.username)
                                                ? `you and ${
                                                    item.likes.length - 1
                                                  } other${
                                                    item.likes.length - 1 > 1
                                                      ? 's'
                                                      : ''
                                                  }`
                                                : item.likes.length !== 0
                                                ? `${item.likes[0]} and ${
                                                    item.likes.length - 1
                                                  } other${
                                                    item.likes.length - 1 > 1
                                                      ? 's'
                                                      : ''
                                                  }`
                                                : ''
                                            }`
                                          : `${
                                              item.likes.length !== 0
                                                ? ''
                                                : 'unlike'
                                            } ${
                                              item.likes.includes(user.username)
                                                ? `you and ${
                                                    item.likes.length - 1
                                                  } other${
                                                    item.likes.length - 1 > 1
                                                      ? 's'
                                                      : ''
                                                  }`
                                                : item.likes.length !== 0
                                                ? `${item.likes[0]} and ${
                                                    item.likes.length - 1
                                                  } other${
                                                    item.likes.length - 1 > 1
                                                      ? 's'
                                                      : ''
                                                  }`
                                                : ''
                                            }`}
                                      </i>
                                    </span>
                                    <span
                                      style={{
                                        cursor: 'pointer',
                                        margin: '.5rem',
                                      }}
                                      onClick={() => handleReplyInner(item._id)}
                                      className='reply'
                                    >
                                      <FontAwesomeIcon
                                        style={{ fontSize: '1.5rem',
                                          width: '1.5rem',
                                          height: '1.5rem'
                                        }}
                                        icon={faComment}
                                      />
                                      <i
                                        style={{
                                          margin: '.5rem',
                                          fontSize: '.9rem',
                                        }}
                                      >
                                        {!showReplyInner[item._id]
                                          ? 'reply'
                                          : 'close'}
                                      </i>
                                    </span>
                                    {user.username === item.username && (
                                      <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={() =>
                                          handleDeleteInnerReply(
                                            item._id,
                                            comment._id
                                          )
                                        }
                                        className='reply'
                                      >
                                        <FontAwesomeIcon
                                          style={{ fontSize: '1.5rem',width: '1.5rem', height:'1.5rem' }}
                                          icon={faTrash}
                                        />
                                        <i
                                          style={{
                                            margin: '.5rem',
                                            fontSize: '.9rem',
                                          }}
                                        >
                                          {!deleteInnerReply[item._id]
                                            ? 'delete'
                                            : 'deleting...'}
                                        </i>
                                      </span>
                                    )}
                                  </div>
                                  {/* reply to a reply here */}
                                  {showReplyInner[item._id] && (
                                    <ReplyToReply
                                      faImage={faImage}
                                      FontAwesomeIcon={FontAwesomeIcon}
                                      _id={item._id}
                                      user={user}
                                      endPoint={endPoint}
                                      commentId={comment._id}
                                      error={error}
                                      setError={setError}
                                      sendImg={send}
                                      faPaperPlane={faPaperPlane}
                                    />
                                  )}
                                </div>
                              );
                            })}
                        </div>

                        <div className='reply-form'>
                          <label title='Add file' htmlFor='reply-file'>
                            <FontAwesomeIcon
                              style={{ fontSize: '1.5rem',width: '1.5rem', height:'1.5rem' }}
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
                            ref={inputRef}
                            value={replyText.replyText[comment._id]}
                            onChange={(event, _id) => {
                              const { name } = event.target;
                              setError((prevState) => ({
                                ...prevState,
                                reply: '',
                              }));
                              setReplyText((prevState) => ({
                                ...prevState,
                                [name]: event.target.value,
                                [_id]: !prevState[_id],
                              }));
                            }}
                          />
                          <button
                            disabled={isDisabled}
                            onClick={() => handleReplySubmit(comment._id)}
                            className='reply-button'
                          >
                            {btnMsg[comment._id] ? (
                              'sending...'
                            ) : (
                              <FontAwesomeIcon
                                style={{ fontSize: '1.5rem', width: '1.5rem', height:'1.5rem' }}
                                className='replytoreply'
                                icon={faPaperPlane}
                              />
                            )}
                          </button>
                        </div>
                        {error.reply && (
                          <div
                            style={{
                              color: 'crimson',
                              fontSize: '1rem',
                              textAlign: 'center',
                              border: 'solid .5px crimson',
                              padding: '.5rem',
                              width: '100%',
                              borderRadius: '.5rem',
                              fontWeight: 'bold',
                              backgroundColor: 'rgba(255,10,10,.2)',
                            }}
                          >
                            {error.reply}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
export default CommentItem;
