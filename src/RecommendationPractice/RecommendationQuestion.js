import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import styled from 'styled-components';
import { HashLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import swal from 'sweetalert';
import { Box } from '@mui/material';
import { ProblemSideBar } from '../Problem/SideBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100% - 5em);
  width: 60%;
  min-width: 30em;
  background-color: #bbd2ec;
  margin-right: 15%;
  position: relative;
  padding-bottom: 5em;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 5px;
  font-weight: 600;
  font-size: 1.5em;
  width: 20%;
  min-height: 50px;
  margin-top: 30px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 5%;
  width: 100%;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  background-color: white;
  border-radius: 10px;
  min-height: 400px;
  width: 45%;
  position: relative;
`;

const AnswerButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  padding: 5px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 90px;

  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 0px #838abd;
  border: none;
  font-size: 1em;
  &:hover {
    box-shadow: 0px 0px 0px 5px #838abd;
  }
`;

const ProblemImage = styled.img`
  max-width: 90%;
  max-height: 70%;
  margin-top: 20px;

  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 0px #838abd;
  border: 10px solid white;
  border-radius: 10px;
  font-size: 1em;
  &:hover {
    box-shadow: 0px 0px 0px 5px #838abd;
  }
`;

const Episode = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  margin: 10px;
  background-color: white;
  padding: 5px;
  border-radius: 5px;
`;

const MoveButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 70px;
  margin-top: 20px;
`;

const MoveButton = styled.button`
  width: 70px;
  height: 70px;
  margin: 20px;
  background-color: #838abd;
  color: white;
  border-radius: 10px;
  font-weight: 500;

  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 0px white;
  border: none;
  font-size: 1em;
  &:hover {
    box-shadow: 0px 0px 0px 5px white;
  }
`;

const DisabledButton = styled.button`
  width: 70px;
  height: 70px;
  margin: 20px;
  background-color: #495057;
  color: #868e96;
  border-radius: 10px;
  border: none;
  font-weight: 500;
`;

const RecommendationQuestion = () => {
  const [currentProblems, setCurrentProblems] = useState([]); // 현재 페이지에 표시될 문제들
  const [currentIndex, setCurrentIndex] = useState(1); // 현재 시작 인덱스
  const [recommendProblems, setRecommendProblems] = useState([]); // 추천 문제

  const [answerShown, setAnswerShown] = useState([]); // 정답 보임 여부
  const [isLoading, setIsLoading] = useState(false); // 로딩 여부

  const userEmail = useSelector((state) => state.userEmail); // 유저 이메일
  const prevProblemsRef = useRef(currentProblems); // 추천문제 업데이트 감지용 useRef

  // 배열 섞는 함수
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // 요소 위치 교환
    }
  }

  // Firestore에서 데이터를 가져오고 섞는 함수
  const fetchData = async (ref) => {
    const snapshot = await getDocs(ref);
    let items = [];
    snapshot.forEach((doc) => items.push(doc.id));
    return items;
  };

  // Firestore에서 특정 회차의 문제 정보와 답안 정보를 가져오는 함수
  const fetchRoundData = async (round, id) => {
    const problemRef = doc(firestore, `exam round/${round}/${round}`, id);
    const answerRef = doc(firestore, `answer round/${round}/${round}`, id);

    const problemDoc = await getDoc(problemRef);
    const answerDoc = await getDoc(answerRef);

    let problemData = problemDoc.exists() ? problemDoc.data().img : null;
    let answerData = answerDoc.exists() ? answerDoc.data().answer : null;

    return { id, img: problemData, answer: answerData };
  };

  useEffect(() => {
    if (userEmail === null) return;

    const fetchUserRelatedData = async () => {
      // 유저 오답, 킬러문제, 북마크 문제 가져오기 및 섞기
      const wrongProblemsRef = collection(
        firestore,
        `users/${userEmail}/wrongProblems`
      );
      const killerProblemsRef = collection(firestore, 'killer round');
      const bookMarksRef = collection(firestore, `users/${userEmail}/bookMark`);

      const [a1, a2, a3] = await Promise.all([
        fetchData(wrongProblemsRef),
        fetchData(killerProblemsRef),
        fetchData(bookMarksRef),
      ]);

      // 모든 문제를 하나의 배열에 저장
      let recommendDatas = [...a1, ...a2, ...a3];

      // 배열을 섞는다
      shuffleArray(recommendDatas);
      setRecommendProblems(recommendDatas);
    };
    fetchUserRelatedData();
  }, [userEmail]);

  // 현재 인덱스가 변경되면 해당 인덱스부터 10개 문제를 보이게 한다.
  useEffect(() => {
    if (recommendProblems.length === 0) return;

    let ci = 0;
    if (currentIndex !== 0) ci = currentIndex - 1;

    // recommendProblems 사용하여 배열 업데이트 처리를 위한 함수
    const updateArrayFromRecommend = async (recommendArr, ci) => {
      // 시작 인덱스와 끝 인덱스를 계산하여 10개 문제를 선택
      const startIndex = ci * 10;
      const endIndex = startIndex + 10;
      const choiceTen = recommendArr.slice(
        startIndex,
        Math.min(endIndex, recommendArr.length)
      );

      // 선택된 10문제의 이미지와 답 정보를 가져온다.
      const fetchProblemsAndAnswers = async (array) => {
        return Promise.all(
          array.map(async (id) => {
            const round = parseInt(id.toString().substring(0, 2), 10);
            return fetchRoundData(round, id);
          })
        );
      };

      const recommendData = await fetchProblemsAndAnswers(choiceTen);
      return recommendData;
    };

    const fetchAndSetProblems = async () => {
      const updArr = await updateArrayFromRecommend(recommendProblems, ci);
      if (updArr[0] === null) return;
      setCurrentProblems(updArr); // 현재 문제 상태 업데이트
    };

    fetchAndSetProblems();
  }, [recommendProblems, currentIndex]);

  useEffect(() => {
    setIsLoading(true);

    if (currentProblems.length !== 0) {
      // currentProblems가 이전 상태와 다른지 비교.
      // 다르면 추천문제가 업데이트 되었다는 것을 의미하므로 로딩을 종료한다.
      if (
        JSON.stringify(prevProblemsRef.current) !==
        JSON.stringify(currentProblems)
      ) {
        setIsLoading(false);
      }
      // 이전 상태를 업데이트
      prevProblemsRef.current = currentProblems;
    }
  }, [currentProblems]);

  // 이전 / 다음 문제 10개 보여주기
  function handlelMove(state) {
    setCurrentIndex(currentIndex + state);
    window.scrollTo(0, 0); // 맨 위로 스크롤
  }

  const renderItem = (item) => {
    if (typeof item === 'string') return;
    // 답 표시 상태를 토글하는 함수
    const handleToggleAnswer = (id) => {
      if (answerShown.includes(id)) {
        // 이미 답이 표시된 경우, 해당 id를 answerShown 배열에서 제거
        setAnswerShown(answerShown.filter((answerId) => answerId !== id));
      } else {
        // 답이 표시되지 않은 경우, 해당 id를 answerShown 배열에 추가
        setAnswerShown([...answerShown, id]);
      }
    };

    return (
      <Card key={item.id}>
        {/* answerShown 배열에 item.id가 있는지에 따라 버튼의 텍스트를 변경 */}
        <AnswerButton onClick={() => handleToggleAnswer(item.id)}>
          {answerShown.includes(item.id) ? `정답: ${item.answer}` : '정답 보기'}
        </AnswerButton>
        <Episode>{`${item.id.slice(0, 2)}회차 ${parseInt(
          item.id.slice(2)
        )}번`}</Episode>

        {/* 이미지 클릭 시 크게 표시*/}
        <ProblemImage
          src={item.img}
          alt={`문제 ${item.id}`}
          onClick={() => {
            swal({
              icon: item.img,
              button: '닫기',
              className: 'custom-swal',
            });
          }}
        />
      </Card>
    );
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'row' }}>
      <ProblemSideBar />
      <Container>
        <Title>추천 문제</Title>
        {isLoading ? (
          <HashLoader style={{ display: 'flex' }} />
        ) : (
          <>
            <CardContainer>
              {currentProblems.map((item) => (
                <React.Fragment key={item.id}>
                  {renderItem(item)}
                </React.Fragment>
              ))}
            </CardContainer>

            <MoveButtonContainer>
              {currentIndex === 1 ? (
                <DisabledButton>
                  <div>이전</div>
                </DisabledButton>
              ) : (
                <MoveButton onClick={() => handlelMove(-1)}>
                  <div>이전</div>
                </MoveButton>
              )}
              {currentProblems.length < 10 ? (
                <DisabledButton>
                  <div>다음</div>
                </DisabledButton>
              ) : (
                <MoveButton onClick={() => handlelMove(1)}>
                  <div>다음</div>
                </MoveButton>
              )}
            </MoveButtonContainer>
          </>
        )}
      </Container>
    </Box>
  );
};

export default RecommendationQuestion;
