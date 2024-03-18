import React, { useState } from 'react';
import styled from 'styled-components';
import PostCreate from './PostCreate';
import PostDetail from './PostDetail';
import BoardScreenUI from './BoardScreenUI';

const TabNavigatorContainer = styled.div`
  padding-top: 10px;
  background-color: #dfe9f5;
`;

const NavLinkContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px;
`;

const StyledLink = styled.button`
  background: none;
  border: none;
  text-decoration: none;
  color: blue;
  cursor: pointer;
`;

const QuestionBoard = () => (
  <BoardScreenUI title="질문 게시판" boardName="questionBoard" />
);
const StudyTipBoard = () => (
  <BoardScreenUI title="공부 팁 게시판" boardName="tipBoard" />
);
const ExamReviewBoard = () => (
  <BoardScreenUI title="시험 후기 게시판" boardName="reviewBoard" />
);

const TabNavigator = ({ setCurrentTab }) => (
  <TabNavigatorContainer>
    <NavLinkContainer>
      <StyledLink onClick={() => setCurrentTab('questionBoard')}>질문 게시판</StyledLink>
      <StyledLink onClick={() => setCurrentTab('tipBoard')}>공부 팁 게시판</StyledLink>
      <StyledLink onClick={() => setCurrentTab('reviewBoard')}>시험 후기 게시판</StyledLink>
    </NavLinkContainer>
  </TabNavigatorContainer>
);

const BoardScreen = () => {
  const [currentTab, setCurrentTab] = useState('questionBoard');

  return (
    <>
      <TabNavigator setCurrentTab={setCurrentTab} />
      {currentTab === 'questionBoard' && <QuestionBoard />}
      {currentTab === 'tipBoard' && <StudyTipBoard />}
      {currentTab === 'reviewBoard' && <ExamReviewBoard />}
    </>
  );
};

export default BoardScreen;
