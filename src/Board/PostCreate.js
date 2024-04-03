import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import HashLoader from 'react-spinners/HashLoader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 60%;
  min-width: 30em;
  background-color: #bbd2ec;
  top: 10em;
  left: 20%;
  position: fixed;
`;

const TitleInput = styled.input`

`

const BodyInput = styled.textarea`

`

const SubmitButton = styled.button`

`

// 게시판 글 생성 화면
const PostCreate = ({ route, navigation }) => {
  const { boardName, post, commentList } = route.params;
  const [title, setTitle] = useState(post ? post.title : '');
  const [body, setBody] = useState(post ? post.body : '');
  const [userName, setUserName] = useState();

  const userEmail = useSelector((state) => state.userEmail);
  //const serverPath = 'http://192.168.0.3:8080/';
  const serverPath = 'http://223.194.133.165:8080/';
  useEffect(() => {
    setUserName(userEmail?.split('@')[0]);
  }, [userEmail]);

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
          navigation.navigate('PostDetail', {
            post: newPost,
            boardName: boardName,
          });
        } else navigation.navigate('BoardScreen');
      })
      .catch((error) => {
        console.error('Post data could not be saved.' + error);
      });
  };

  return (
    <Container>
      <TitleInput
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <BodyInput
        rows="10" 
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <SubmitButton onClick={handleSubmit}>
        등록
      </SubmitButton>
    </Container>
  );
};

export default PostCreate;
