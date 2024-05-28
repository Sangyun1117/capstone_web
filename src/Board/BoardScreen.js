import React, { useState } from 'react';
import styled from 'styled-components';
import BoardScreenUI from './BoardScreenUI';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  left: 20%;
  width: 60%;
  min-width: 800px;
  background-color: #dfe9f5;
  z-index: 2;
`;

const NavLinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 50%;
  height: 5em;
`;

const StyledLink = styled.button`
  display: flex; // flex 컨테이너 설정
  flex-wrap: wrap; // 컨테이너 너비를 초과하는 경우 줄 바꿈
  justify-content: center; // 가운데 정렬
  gap: 10px; // 요소 간 간격 설정
  background: none;
  border: none;
  text-decoration: none;
  color: #008b8b;
  cursor: pointer;
  font-weight: bold;
  font-size: 1em;
  padding-bottom: 10px;
`;

const UIContainer = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  height: 5em;
`;

const CommentInput = styled.input`
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 5px;
  background-color: #bbd2ec;
  padding: 0 10px;
  margin: 0px 10px;
`;

const WriteButton = styled.button`
  width: 4%;
  min-width: 70px;
  height: 50px;
  font-weight: 600;
  text-align: center;
  line-height: 50px;
  color: #fff;
  border-radius: 5px;
  background-color: #4dccc6;
  margin-right: 10px;

  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 0px #01939a;
  border: none;
  font-size: 2em;
  &:hover {
    box-shadow: 0px 0px 0px 5px #01939a;
  }
`;

const BoardScreen = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('questionBoard'); // 현재 탭
  const [search, setSearch] = useState(''); // 검색 텍스트
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const QuestionBoard = () => (
    <BoardScreenUI title="질문" boardName="questionBoard" search={search} />
  );
  const StudyTipBoard = () => (
    <BoardScreenUI title="공부 팁" boardName="tipBoard" search={search} />
  );
  const ExamReviewBoard = () => (
    <BoardScreenUI title="시험 후기" boardName="reviewBoard" search={search} />
  );

  return (
    <>
      <Container>
        <NavLinkContainer>
          <StyledLink
            onClick={() => setCurrentTab('questionBoard')}
            style={{
              borderBottom:
                currentTab === 'questionBoard' ? '2px solid #008b8b' : 'none',
              fontSize: currentTab === 'questionBoard' ? '1.2em' : '1em',
            }}
          >
            질문
          </StyledLink>
          <StyledLink
            onClick={() => setCurrentTab('tipBoard')}
            style={{
              borderBottom:
                currentTab === 'tipBoard' ? '2px solid #008b8b' : 'none',
              fontSize: currentTab === 'tipBoard' ? '1.2em' : '1em',
            }}
          >
            공부 팁
          </StyledLink>
          <StyledLink
            onClick={() => setCurrentTab('reviewBoard')}
            style={{
              borderBottom:
                currentTab === 'reviewBoard' ? '2px solid #008b8b' : 'none',
              fontSize: currentTab === 'reviewBoard' ? '1.2em' : '1em',
            }}
          >
            시험 후기
          </StyledLink>
        </NavLinkContainer>
        <UIContainer>
          <CommentInput
            type="text"
            placeholder="검색하기"
            onChange={(e) => setSearch(e.target.value)}
          />
          <WriteButton
            onClick={() => {
              isLoggedIn
                ? navigate('/postCreate', {
                    state: { boardName: currentTab },
                  })
                : navigate('/login');
            }}
          >
            +
          </WriteButton>
        </UIContainer>
      </Container>
      {currentTab === 'questionBoard' && <QuestionBoard />}
      {currentTab === 'tipBoard' && <StudyTipBoard />}
      {currentTab === 'reviewBoard' && <ExamReviewBoard />}
    </>
  );
};

export default BoardScreen;
