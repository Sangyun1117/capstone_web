import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 60%;
  min-width: 30em;
  background-color: #bbd2ec;
  top: 5em;
  left: 20%;
  position: absolute;
`;

const BodyInput = styled.textarea`
  margin: 1%;
  height: 60%;
  width: '95%',
  left: '1.5%',
`;

const SubmitButton = styled.button`
  display: flex;
  position: absolute;
  top: 70%;
  right: 10px;
  justify-content: center;
  margin: 10px;
  width: 10%;
  min-width: 70px;
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
  font-size: 2em;
  &:hover {
    box-shadow: 0px 0px 0px 5px #01939a;
  }
  margin-right: 10px;
`;

// 게시판 글 생성 화면
const PostCreate = () => {
  const location = useLocation();
  const { boardName, post } = location.state;
  const [title, setTitle] = useState(post ? post.title : '');
  const [body, setBody] = useState(post ? post.body : '');
  const navigate = useNavigate();

  const userEmail = useSelector((state) => state.userEmail);
  const serverPath = 'http://192.168.0.3:8080/';
  //const serverPath = 'http://223.194.133.165:8080/';

  // 작성한 글을 db에 반영
  const handleSubmit = () => {
    const postType = post ? 1 : 0; // 직성모드(0), 수정모드(1)
    const postId = post ? post.id : userEmail + '_' + Date.now();

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
            post: newPost,
            boardName: boardName,
          });
        } else navigate('/boardScreen');
      })
      .catch((error) => {
        console.error('Post data could not be saved.' + error);
      });
  };

  return (
    <Container>
      <TextField
        required
        fullWidth
        id="outlined-required"
        label="제목을 입력하세요"
        onChange={(e) => setTitle(e.target.value)}
        style={{
          margin: '1.5% 1%',
          backgroundColor: 'white',
          width: '98%',
        }}
      />
      <BodyInput
        rows="10"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
    </Container>
  );
};

export default PostCreate;
