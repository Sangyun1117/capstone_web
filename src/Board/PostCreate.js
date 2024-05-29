import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/QuillEditor.css';
import swal from 'sweetalert';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 5em);
  width: 60%;
  min-width: 800px;
  background-color: #bbd2ec;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  margin: auto;
  position: relative;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 5px;
  font-weight: 600;
  font-size: 1.4em;
  width: 300px;
  padding: 10px;
  margin: 10px calc((100% - 300px) / 2);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const SubmitButton = styled(Button)`
  && {
    display: flex;
    right: 0px;
    justify-content: center;
    margin-left: auto;
    margin-right: 2.5%;
    margin-top: 20px;
    min-width: 100px;
    height: 50px;
    cursor: pointer;
    font-weight: 400;
    text-align: center;
    line-height: 50px;
    color: #fff;
    border-radius: 5px;

    transition: all 0.2s;
    background-color: #4dccc6;
    box-shadow: 0px 0px 0px 0px #01939a;
    border: none;
    font-size: 1em;
    &:hover {
      box-shadow: 0px 0px 0px 5px #01939a;
      background-color: #43b2ac;
    }
  }
`;

// 게시판 글 생성 화면
const PostCreate = () => {
  const location = useLocation();
  const { boardName, post } = location.state;
  const [title, setTitle] = useState(post ? post.title : '');
  const [body, setBody] = useState(post ? post.body : '');
  const navigate = useNavigate();

  const userEmail = useSelector((state) => state.userEmail);
  const serverPath = 'http://localhost:8080/';

  const getBoardDisplayName = (boardName) => {
    switch (boardName) {
      case 'questionBoard':
        return '질문';
      case 'tipBoard':
        return '팁';
      case 'reviewBoard':
        return '시험 후기';
      default:
        return '';
    }
  };
  const boardDisplayName = getBoardDisplayName(boardName);

  // 작성한 글을 db에 반영
  const handleSubmit = () => {
    if (body.length > 5000) {
      swal({
        title: '경고',
        text: '내용이 너무 깁니다.',
        icon: 'warning',
        dangerMode: true,
      });
      return; // 함수 실행을 여기서 중단
    }

    const postType = post ? 1 : 0; // 직성모드(0), 수정모드(1)
    const postId = post ? post.postId : userEmail + '_' + Date.now();

    // 새 글 데이터
    const newPost = {
      postId: postId,
      boardName: boardName,
      userEmail: userEmail,
      title: title,
      body: body,
      type: postType,
    };

    axios
      .post(serverPath + 'posts', newPost)
      .then((response) => {
        console.log('Post data updated successfully.');

        // 이전 화면으로 돌아간다.
        if (post) {
          navigate('/postDetail', {
            state: {
              boardName: boardName,
              post: newPost,
            },
          });
        } else navigate('/boardScreen');
      })
      .catch((error) => {
        console.error('Post data could not be saved.' + error);
      });
  };

  const handleSubmitButtonClick = () => {
    swal({
      title: '등록 확인',
      text: '작성한 글을 등록하시겠습니까?',
      icon: 'warning',
      buttons: ['취소', '확인'],
      dangerMode: true,
    }).then((willSubmit) => {
      if (willSubmit) {
        handleSubmit();
      }
    });
  };

  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 사이즈
        [{ align: [] }], // 정렬

        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ color: [] }, { background: [] }], // 글자색, 배경색
      ],
      handlers: {},
      fixed: true,
    },
  };

  return (
    <Container>
      <Title>
        {post
          ? `${boardDisplayName} 게시판 글 수정`
          : `${boardDisplayName} 게시판 글 작성`}
      </Title>
      <TextField
        required
        fullWidth
        id="outlined-required"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          display: 'flex',
          width: '95%',
          margin: '40px 2.5%',
          marginBottom: '10px',
          borderRadius: '5px',
          backgroundColor: 'white',
        }}
        variant="outlined"
        placeholder="제목을 입력하세요..."
      />

      <ReactQuill
        theme="snow"
        value={body}
        onChange={setBody}
        modules={quillModules}
        style={{ margin: '0px 2.5%' }}
      />

      <SubmitButton onClick={handleSubmitButtonClick}>등록하기</SubmitButton>
    </Container>
  );
};

export default PostCreate;
