import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import { ProblemSideBar } from '../Problem/SideBar';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  min-height: calc(100vh - 5em);
  min-width: 800px;
  background-color: #bbd2ec;
  margin-right: 15%;
  position: relative;
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  top: 10px;
  width: 10vw;
  min-width: 100px;
  height: 70px;
  margin: 20px;
  background-color: #838abd;
  color: white;
  border-radius: 10px;
  font-weight: 500;
  font-size: 1.1em;

  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 0px white;
  border: none;
  font-size: 1em;
  &:hover {
    box-shadow: 0px 0px 0px 5px white;
  }
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
  const navigate = useNavigate();
  const { problem, index } = location.state; // 문제, 답 정보
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [answer, setAnswer] = useState([]); // 답 정보
  const formattedId = `${problem.id.slice(0, 2)}회차 ${parseInt(
    problem.id.slice(2)
  )}번`;
  const examDocId = index.slice(0, 2);

  // 답 정보 가져오기
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const answerDocRef = doc(
          firestore,
          'answer round',
          examDocId,
          examDocId,
          index,
        );

        const answerDocSnapshot = await getDoc(answerDocRef);
        if (answerDocSnapshot.exists()) {
          const data = answerDocSnapshot.data();
          const answerObj = {
            id: answerDocSnapshot.id,
            answer: data.answer,
            commentary: data.commentary,
            wrongCommentary: data.wrongCommentary,
          };
          setAnswer(answerObj);
        } else {
          console.error('No such document!');
        }
      } catch (err) {
        console.error('Error fetching answer data: ', err);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      await fetchAnswers();
      setIsLoading(false);
    };
    
    fetchData();
  }, [examDocId]);

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
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <ProblemSideBar />
      <Container>
        {isLoading ? (
          <HashLoader style={{ display: 'flex' }} />
          ) : (
            <>
              <Title>{formattedId} 해설</Title>
              <BackButton onClick={() => navigate(-1)}>돌아가기</BackButton>
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
                    <SemiTitle>정답: {answer.answer}</SemiTitle>
                    <SemiTitle>정답 해설</SemiTitle>
                    <p>{answer.commentary}</p>
                  </Box>

                  <Box style={{ backgroundColor: '#ffebee' }}>
                    <SemiTitle>오답 해설</SemiTitle>
                    {splitText(answer.wrongCommentary)}
                  </Box>
                </BoxContainer>
              </BodyContainer>
            </>
          )
        }
      </Container>
      
    </div>
  );
};

export default ProblemCommentary;
