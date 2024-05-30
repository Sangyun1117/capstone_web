import React, { useState, useEffect } from 'react';
import HashLoader from 'react-spinners/HashLoader';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MyPagination from './MyPagination';

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 5em);
  width: 60%;
  min-width: 800px;
  background-color: #bbd2ec;
  top: 10em;
  left: 20%;
  position: absolute;
  overflow-y: auto;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 650px;
`;

const ListItem = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  width: 95%;
  min-height: 50px;
  top: 30px;
  padding: 10px 25px;
  margin: 8px;
  border-radius: 5px;
  border: none;
  font-weight: 500;
  background: transparent;
  background-color: #4dccc6;
  background-image: linear-gradient(315deg, #4dccc6 0%, #96e4df 74%);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  outline: none;
  &:before,
  &:after {
    position: absolute;
    content: '';
    right: 0;
    top: 0;
    background: rgba(2, 126, 251, 1);
    transition: all 0.3s ease;
  }

  &:before {
    height: 0%;
    width: 2px;
  }

  &:after {
    width: 0%;
    height: 2px;
  }

  &:hover {
    background: transparent;
    box-shadow: none;
  }

  &:hover:before {
    height: 100%;
  }

  &:hover:after {
    width: 100%;
  }

  & div {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    transition: all 0.3s ease;

    &:hover {
      color: rgba(2, 126, 251, 1);
    }
  }

  & div:before,
  & div:after {
    position: absolute;
    content: '';
    left: 0;
    bottom: 0;
    background: rgba(2, 126, 251, 1);
    transition: all 0.3s ease;
  }

  & div:before {
    width: 2px;
    height: 0%;
  }

  & div:after {
    width: 0%;
    height: 2px;
  }

  & div:hover:before {
    height: 100%;
  }

  & div:hover:after {
    width: 100%;
  }
`;

// 게시판 UI: 글 리스트 표시, 글 작성 버튼
const BoardScreenUI = ({ boardName, search }) => {
  const [posts, setPosts] = useState([]); // 게시글 데이터
  const [filteredPosts, setFilteredPosts] = useState([]); // 검색으로 필터링 된 글
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 9; // 페이지당 글 수
  const serverPath = useSelector((state) => state.serverPath);

  const navigate = useNavigate();

  // 글 검색
  useEffect(() => {
    setFilteredPosts(posts.filter((post) => post.title.includes(search)));
  }, [search, posts]);

  // 글 리스트 가져오기
  // id, 작성자 정보, 제목만 간략하게 가져온다.
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(serverPath + 'posts', {
        params: { boardName: boardName },
      })
      .then((response) => {
        const posts = response.data;

        if (posts) {
          const postList = Object.keys(posts).map((key) => ({
            id: posts[key].id,
            userEmail: posts[key].userEmail,
            title: posts[key].title,
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

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 현재 페이지에 해당하는 글 목록 계산
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <>
      <BodyContainer>
        {isLoading ? (
          <div style={{ marginTop: '30%' }}>
            <HashLoader loading={isLoading} size={50} />
          </div>
        ) : (
          <>
            <PostList>
              {currentPosts.map((item, index) => (
                <ListItem
                  key={item.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f8f8f8' : '#e8e8e8',
                  }}
                  onClick={() =>
                    navigate('/postDetail', {
                      state: {
                        boardName: boardName,
                        selectedItem: item,
                      },
                    })
                  }
                >
                  <div>
                    <h3 style={{ marginLeft: '10px' }}>
                      {item.title.length > 20
                        ? `${item.title.substring(0, 20)}..`
                        : item.title}
                    </h3>
                    <p style={{ marginLeft: '10px' }}>
                      {item.userEmail.split('@')[0]}
                    </p>
                  </div>
                </ListItem>
              ))}
            </PostList>
            <MyPagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredPosts.length}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </BodyContainer>
    </>
  );
};

export default BoardScreenUI;
