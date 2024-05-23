import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import { ProblemSideBar } from '../Problem/SideBar';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  min-height: calc(100vh - 5em);
  min-width: 800px;
  background-color: #bbd2ec;
  top: 5em;
  left: 20%;
  position: absolute;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
  background-color: white;
  border-radius: 5px;
  font-weight: 600;
  font-size: 1.5em;
  width: 20%;
  min-width: 300px;
  height: 50px;
`;

const BodyContainer = styled.div`
  display: flex;
  margin-top: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 7%;
  width: 80%;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-top: 50px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffebee;
  margin: 20px;
  padding: 10px;
  border-radius: 20px;
  width: 40%;
`;

const SemiTitle = styled.h2`
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 5px;
`;

const ProblemCommentary = () => {
  const location = useLocation();
  const { problem, answer } = location.state; // 문제, 답 정보

  const formattedId = `${problem.id.slice(0, 2)}회차 ${parseInt(
    problem.id.slice(2)
  )}번`;

  const splitText = (text) => {
    const regex = /(①|②|③|④|⑤)[^①-⑤]*/g;
    const sentences = text.match(regex);

    return sentences.map((sentence, index) => (
      <div key={index}>
        <p>{sentence.trim()}</p>
      </div>
    ));
  };

  return (
    <div>
      <ProblemSideBar />

      <Container>
        <Title>{formattedId} 해설</Title>
        <BodyContainer>
          <img
            src={problem.data.img}
            alt="Problem Image"
            style={{
              objectFit: 'contain',
              width: '30%',
              minWidth: '350px',
              height: 'auto',
            }}
          />

          <BoxContainer>
            <Box style={{ backgroundColor: '#e0f7fa' }}>
              <SemiTitle>정답: {answer.data.answer}</SemiTitle>
              <SemiTitle>정답 해설</SemiTitle>
              <p>{answer.data.commentary}</p>
            </Box>

            <Box style={{ backgroundColor: '#ffebee' }}>
              <SemiTitle>오답 해설</SemiTitle>
              {splitText(answer.data.wrongCommentary)}
            </Box>
          </BoxContainer>
        </BodyContainer>
      </Container>
    </div>
  );
};

export default ProblemCommentary;
