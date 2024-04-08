import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100% - 5em);
  width: 60%;
  min-width: 30em;
  background-color: #bbd2ec;
  top: 5em;
  left: 20%;
  position: absolute;
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
  width: 50%;
  height: 50px;
`

const CardContainer = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  top: 100px;
  width: 50%;
`

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;  
  margin: 10px;
  background-color: white;
  border-radius: 10px;
  height: 40px;
`
const PracticeRoundSelect = () => {
  const [examRounds, setExamRounds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamRounds = async () => {
      try {
        const list = [];
        const examRoundCollection = collection(firestore, 'exam round');
        const examRoundSnapshot = await getDocs(examRoundCollection);
        examRoundSnapshot.forEach((doc) => {
          list.push({ id: doc.id, ref: doc.ref });
        });
        setExamRounds(list);
      } catch (err) {
        console.error('Error fetching data: ', err);
      }
    };
    fetchExamRounds();
  }, []);

  const handleSelect = async (item) => {
    try {
      const answerRoundCollection = collection(firestore, 'answer round');
      const answerRoundSnapshot = await getDocs(answerRoundCollection);
      let answerItem;
      answerRoundSnapshot.forEach((doc) => {
        if (doc.id == item.id) answerItem = { id: doc.id, ref: doc.ref };
      });

      // 가져온 답안 데이터를 ProblemDetail 화면으로 전달
      navigate('/problemDetail', {
        state: {
          examDoc: item,
          answerDoc: answerItem,
        },
      })
    } catch (err) {
      console.error('Error fetching data: ', err);
    }
  };
    // 네비게이트할 때 item 등의 직렬화 문제로 안되는거같음. 확인하기.
  const renderItem = (item) => {
    return (
      <Card onClick={() => handleSelect(item)}>
        {item.id}회차
      </Card>
    );
  };

  return (
    <Container>
      <Title>기출문제 회차선택</Title>
      <CardContainer>
        {examRounds.map((item) => (
          <React.Fragment key={item.id}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </CardContainer>
    </Container>
  );
};

export default PracticeRoundSelect;
