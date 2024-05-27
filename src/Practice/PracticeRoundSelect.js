import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import { ProblemSideBar } from '../Problem/SideBar';
import { Box } from '@mui/material';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  min-height: calc(100% - 5em);
  width: 60%;
  min-width: 800px;
  background-color: #bbd2ec;
  margin-right: 15%;
  position: relative;
`;

const Title = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  top: 10px;
  background-color: white;
  border-radius: 5px;
  font-weight: 600;
  font-size: 1.5em;
  min-width: 25%;
  height: 50px;
`;

const CardContainer = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  top: 20%;
  width: 50%;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  background-color: white;
  border-radius: 10px;
  height: 50px;

  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 0px #838abd;
  border: none;
  font-size: 1em;
  &:hover {
    box-shadow: 0px 0px 0px 5px #838abd;
  }
`;
const PracticeRoundSelect = () => {
  const [examRounds, setExamRounds] = useState([]); // 기출 문제 회차
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  const fetchExamRounds = async () => {
    try {
      console.log('test1');
      setIsLoading(true);
      const list = [];
      const examRoundCollection = collection(firestore, 'exam round');
      const examRoundSnapshot = await getDocs(examRoundCollection);
      examRoundSnapshot.forEach((doc) => {
        list.push({ id: doc.id, ref: doc.ref });
      });
      setExamRounds(list);
      console.log('test2');
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data: ', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExamRounds();
  }, []);

  const handleSelect = async (item) => {
    try {
      const answerRoundCollection = collection(firestore, 'answer round');
      const answerRoundSnapshot = await getDocs(answerRoundCollection);
      let answerItem;
      answerRoundSnapshot.forEach((doc) => {
        if (doc.id == item.id) answerItem = { id: doc.id };
      });

      // 선택한 회차를 ProblemDetail 화면으로 전달
      navigate('/problemDetail', {
        state: {
          examDocId: item.id,
        },
      });
    } catch (err) {
      console.error('Error fetching data: ', err);
    }
  };

  const renderItem = (item) => {
    return <Card onClick={() => handleSelect(item)}>{item.id}회차</Card>;
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'row' }}>
      <ProblemSideBar />
      <Container>
        <Title>기출문제 회차선택</Title>
        {isLoading ? (
          <HashLoader style={{ display: 'flex' }} />
        ) : (
          <>
            <CardContainer>
              {examRounds.map((item) => (
                <React.Fragment key={item.id}>
                  {renderItem(item)}
                </React.Fragment>
              ))}
            </CardContainer>
          </>
        )}
      </Container>
    </Box>

  );
};

export default PracticeRoundSelect;
