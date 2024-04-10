import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  min-width: 30em;
  height: calc(100vh - 5em);
  background-color: #bbd2ec;
  top: 5em;
  left: 20%;
  position: absolute;
`;

const Title = styled.h1`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  top: 10px;
  background-color: white;
  border-radius: 5px;
  font-weight: 600;
  font-size: 1.5em;
  width: 20%;
  height: 50px;
`;

const BodyContainer = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 15%;
  width: 80%;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
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

const Content = styled.p``;

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
        <Content>{sentence.trim()}</Content>
      </div>
    ));
  };

  return (
    <Container>
      <Title>{formattedId} 해설</Title>
      <BodyContainer>
        <img
          src={problem.data.img}
          alt="Problem Image"
          style={{ objectFit: 'contain', width: '30%', height: 'auto' }}
        />
        <BoxContainer>
          <Box style={{ backgroundColor: '#e0f7fa' }}>
            <SemiTitle>정답: {answer.data.answer}</SemiTitle>
            <SemiTitle>정답 해설</SemiTitle>
            <Content>{answer.data.commentary}</Content>
          </Box>

          <Box style={{ backgroundColor: '#ffebee' }}>
            <SemiTitle>오답 해설</SemiTitle>
            {splitText(answer.data.wrongCommentary)}
          </Box>
        </BoxContainer>
      </BodyContainer>
    </Container>
  );
};

export default ProblemCommentary;
