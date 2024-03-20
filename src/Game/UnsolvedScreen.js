import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
  flex-grow: 1;
  padding-top: 10px;
  background-color: #bbd2ec;
`;

const Card = styled.div`
  margin-vertical: 8px;
  margin-horizontal: 16px;
  padding: 10px;
`;

const Era = styled.div`
  padding-bottom: 5px;
`;

const EraText = styled.span`
  font-size: 13px;
`;

const Explanation = styled.div`
  padding-bottom: 5px;
`;

const Keyword = styled.span`
  font-size: 17px;
`;

const Title = styled.h1`
  padding-top: 15px;
  font-size: 20px;
  font-weight: bold;
  background-color: #bbd2ec;
  text-align: center;
`;

const UnsolvedScreen = ( ) => {
  const { state } = useLocation();
  const unsolved = state.unsolved;console.log(unsolved);
  const renderItem = (item) => {
    return (
      <Card>
        <Era>
          <EraText>시대: {item.data.era}</EraText>
        </Era>
        <Explanation>
          <span>{item.data.explanation}</span>
        </Explanation>
        <div>
          <Keyword>답: {item.data.keyword}</Keyword>
        </div>
      </Card>
    );
  };

  return (
    <>
      <div>
        <Title>넘긴 문제 정답</Title>
      </div>
      <Container>
        {unsolved.map((item) => (
          <React.Fragment key={item.data.keyword}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </Container>
    </>
  );
};

export default UnsolvedScreen;
