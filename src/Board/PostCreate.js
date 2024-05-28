import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 5em);
  width: 60%;
  min-width: 30em;
  background-color: #bbd2ec;
  padding: 2em;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  margin: auto;
  position: relative;
`;

const BodyInput = styled.textarea`
  display: flex;
  height: 200px;
  width: 98%;
  height: 60%;
  margin-top: 50px;

  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1em;
  font-size: 1em;
  font-weight: 400;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: none;
  background-color: #e6e6fa;
`;

const SubmitButton = styled(Button)`
  && {
    display: flex;
    right: 0px;
    justify-content: center;
    margin-top: 30px;
    margin-left: auto;
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

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1em;
  background-color: white;
  border-radius: 5px;
  font-weight: 600;
  font-size: 1.4em;
  width: 300px;
  padding: 10px;
  margin: 20px calc((100% - 300px) / 2);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const StyledEditorWrapper = styled.div`
  .ck-editor__editable {
    height: 500px;
    overflow-y: auto; // 내용이 많아지면 스크롤 활성화
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
  //const serverPath = 'http://192.168.0.3:8080/';
  //const serverPath = 'http://223.194.133.15:8080/';
  //const serverPath = 'http://192.168.0.3:8080/';
  const serverPath = 'http://192.168.181.1:8080/';

  // 작성한 글을 db에 반영
  const handleSubmit = () => {
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

  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 사이즈
        [{ 'align': [] }], // 정렬

        ['bold', 'italic', 'underline', 'strike'],
        ['image'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'color': [] }, { 'background': [] }], // 글자색, 배경색
      ],
      handlers: {
        'image': imageHandler,
      },
    },
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post(serverPath + 'posts/uploadImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const imageUrl = response.data;
        const quill = this.quill;
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', imageUrl);
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    };
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
          margin: '1em 0',
          backgroundColor: '#ffffff',
          borderRadius: '5px',
          backgroundColor: '#e6e6fa',
        }}
        variant="outlined"
        placeholder="제목을 입력하세요..."
      />

      {/* <BodyInput
        rows="10"
        placeholder="내용을 입력하세요..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      /> */}
      <ReactQuill
        theme="snow"
        value={body}
        onChange={setBody}
        modules={quillModules}
        style={{ height: '500px', overflowY: 'auto', backgroundColor: 'white' }}
      />

      <SubmitButton onClick={handleSubmit}>등록하기</SubmitButton>
    </Container>
  );
};

export default PostCreate;
