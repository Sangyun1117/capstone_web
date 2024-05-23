import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Card, Typography } from 'antd';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: #838abd;
  padding: 20px;
`;

const { Title } = Typography;

const UnsolvedScreen = ({ unsolved }) => {
  const navigate = useNavigate();

  const renderItem = (item) => {
    return (
      <Card
        title={`시대: ${item.data.era}`}
        style={{ margin: '20px', width: '80%' }}
      >
        <p style={{ fontSize: '1.5em', marginBottom: '30px' }}>
          {item.data.explanation}
        </p>
        <Title level={5}>답: {item.data.keyword}</Title>
      </Card>
    );
  };

  return (
    <Container>
      <Title
        level={2}
        style={{
          backgroundColor: 'white',
          borderRadius: '5px',
          padding: '5px',
        }}
      >
        넘긴 문제 정답
      </Title>
      {unsolved.map((item) => (
        <React.Fragment key={item.data.keyword}>
          {renderItem(item)}
        </React.Fragment>
      ))}
    </Container>
  );
};

export default UnsolvedScreen;
