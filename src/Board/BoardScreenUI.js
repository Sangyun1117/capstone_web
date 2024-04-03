import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import HashLoader from 'react-spinners/HashLoader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90%;
  width: 60%;
  min-width: 30em;
  background-color: #bbd2ec;
  top: 10em;
  left: 20%;
  position: fixed;
`;

const TopContainer = styled.div`
  position: flex;
  flex-direction: row;
  top: 10em;
`;

const CommentInput = styled.input`
  position: absolute;
  height: 50px;
  top: 4em;
  right: 25.5%;
  width: 20%;
  border: none;
  border-radius: 5px;
  background-color: #bbd2ec;
  margin-bottom: 10px;
  padding: 0 10px;
  z-index: 1;
  font-size: 1.5em;
`;

const WriteButton = styled.button`
  width: 4%;
  height: 50px;
  position: absolute;
  right: 21%;
  top: 3em;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  line-height: 50px;
  color: #fff;
  border-radius: 5px;
  transition: all 0.2s;
  background-color: #5dc8cd;
  box-shadow: 0px 0px 0px 0px #01939a;
  border: none;
  font-size: 2em;
  z-index: 1;
  &:hover {
    box-shadow: 0px 0px 0px 5px #01939a;
  }
`;

// 게시판 UI: 글 리스트 표시, 글 작성 버튼
const BoardScreenUI = ({ boardName }) => {
  const [posts, setPosts] = useState([]); // 게시글 데이터
  const [search, setSearch] = useState(''); // 검색 텍스트
  const [filteredPosts, setFilteredPosts] = useState([]); // 검색으로 필터링 된 글
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userEmail = useSelector((state) => state.userEmail);
  // 안드로이드 환경에서는 localhost로 작성하면 에러 발생하므로 ip주소 입력 필요.
  //const serverPath = 'http://192.168.0.3:8080/';
  const serverPath = 'http://223.194.133.88:8080/';
  const navigate = useNavigate();

  // 글 검색
  useEffect(() => {
    setFilteredPosts(posts.filter((post) => post.title.includes(search)));
  }, [search, posts]);

  // 글 가져오기
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(serverPath + 'posts', { params: { boardName: boardName } })
      .then((response) => {
        const posts = response.data;

        if (posts) {
          const postList = Object.keys(posts).map((key) => ({
            id: key,
            postId: posts[key].postId,
            userEmail: posts[key].userEmail,
            title: posts[key].title,
            body: posts[key].body,
          }));
          setPosts(postList);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error: ' + error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <TopContainer>
        <CommentInput
          type="text"
          placeholder="글 검색"
          onChange={(e) => setSearch(e.target.value)}
        />
        <WriteButton
          onClick={() => {
            isLoggedIn
              ? navigate('/postCreate', {
                  boardName: boardName,
                })
              : navigate('/'); // 로그인 페이지 생기면 이 부분 수정하기
          }}
        >
          +
        </WriteButton>
      </TopContainer>
      <Container>
        {isLoading ? (
          <HashLoader loading={isLoading} size={50} />
        ) : (
          <>
            <div>
              <div className="postList">
                {filteredPosts.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f8f8' : '#e8e8e8',
                    }}
                    onClick={() =>
                      navigate('/postDetail', {
                        post: item,
                        boardName: boardName,
                      })
                    }
                  >
                    <div className="cardContent">
                      <h3>
                        {item.title.length > 20
                          ? `${item.title.substring(0, 20)}..`
                          : item.title}
                      </h3>
                      <p>{item.userEmail.split('@')[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default BoardScreenUI;
