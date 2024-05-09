import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import styled from 'styled-components';
import { HashLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import swal from 'sweetalert';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100% - 5em);
  width: 60%;
  min-width: 30em;
  background-color: #bbd2ec;
  top: 5em;
  left: 20%;
  position: absolute;
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
  min-height: 20%;
  width: 40%;
  position: relative;
`;

const AnswerButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 80px;
  min-height: 50px

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
  border: none;
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
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 시작 인덱스
  const [allProblems, setAllProblems] = useState([]); // 모든 문제 정보
  const [allAnswers, setAllAnswers] = useState([]); // 모든 답안 정보

  const [recommendProblems, setRecommendProblems] = useState([]); // 추천 문제

  const [answerShown, setAnswerShown] = useState([]); // 정답 보임 여부
  const [isLoading, setIsLoading] = useState(false); // 로딩 여부
  const userEmail = useSelector((state) => state.userEmail); // 유저 이메일

  // 배열 섞는 함수
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // 요소 위치 교환
    }
  }

  // Firestore에서 데이터를 가져오고 섞는 함수
  const fetchAndShuffle = async (ref) => {
    const snapshot = await getDocs(ref);
    let items = [];
    snapshot.forEach((doc) => items.push(doc.id));
    console.log('items: ');
    console.log(items);
    shuffleArray(items);
    return items;
  };

  useEffect(() => {
    const fetchProblemsAndAnswers = async () => {
      setIsLoading(true);
      let tempAllProblems = {};
      let tempAllAnswers = {};

      // 문제 정보 가져오기
      for (let round = 61; round <= 68; round++) {
        const roundRef = collection(firestore, `exam round/${round}/${round}`);
        const roundSnapshot = await getDocs(roundRef);
        let roundProblems = {}; // 객체로 초기화
        roundSnapshot.forEach((doc) => {
          roundProblems[doc.id] = doc.data().img; // 문제 ID를 키로, 이미지 URL을 값으로 저장
        });
        tempAllProblems[round] = roundProblems;
      }
      console.log(tempAllProblems);

      // 답안 정보 가져오기
      for (let round = 61; round <= 68; round++) {
        const answerRef = collection(
          firestore,
          `answer round/${round}/${round}`
        );
        const answerSnapshot = await getDocs(answerRef);
        let roundAnswers = {};
        answerSnapshot.forEach((doc) => {
          roundAnswers[doc.id] = doc.data().answer;
        });
        tempAllAnswers[round] = roundAnswers;
      }
      console.log(tempAllAnswers);

      setAllProblems(tempAllProblems);
      setAllAnswers(tempAllAnswers);
    };
    fetchProblemsAndAnswers(); // 모든 문제, 정답 정보 가져오기
  }, [userEmail]);

  useEffect(() => {
    const fetchUserRelatedData = async () => {
      // 유저 오답, 킬러문제, 북마크 문제 가져오기 및 섞기
      const wrongProblemsRef = collection(
        firestore,
        `users/${userEmail}/wrongProblems`
      );
      const killerProblemsRef = collection(firestore, 'killer round');
      const bookMarksRef = collection(firestore, `users/${userEmail}/bookMark`);

      const [a1, a2, a3] = await Promise.all([
        fetchAndShuffle(wrongProblemsRef),
        fetchAndShuffle(killerProblemsRef),
        fetchAndShuffle(bookMarksRef),
      ]);
      console.log(a1);
      console.log(a2);
      console.log(a3);

      // 각 추천문제 배열에 문제번호에 맞게 id, 문제 사진, 답 정보를 저장한다.
      const indexRecommendProblems = [a1, a2, a3];

      // 배열 업데이트 필요성 검사 함수
      const isUpdateNeeded = (array, allData) => {
        return array.some((id) => {
          const round = parseInt(id.toString().substring(0, 2), 10);
          return !allData[round] || !allData[round][id];
        });
      };

      // 배열 업데이트 함수
      const updateArrayWithInfo = (array, allProblems, allAnswers) => {
        return array.map((id) => {
          const round = parseInt(id.toString().substring(0, 2), 10);
          const img = allProblems[round] ? allProblems[round][id] : null;
          const answer = allAnswers[round] ? allAnswers[round][id] : null;
          return { id, img, answer };
        });
      };

      // 상태 업데이트 공통 로직
      const newRecommendProblems = indexRecommendProblems.map(
        (array, index) => {
          if (
            isUpdateNeeded(array, allProblems) ||
            isUpdateNeeded(array, allAnswers)
          ) {
            return updateArrayWithInfo(array, allProblems, allAnswers);
          } else {
            return array; // 필요한 업데이트가 없는 경우 기존 배열을 그대로 반환
          }
        }
      );

      console.log(newRecommendProblems);

      setRecommendProblems(newRecommendProblems);
    };
    console.log('test');
    fetchUserRelatedData();
  }, [allProblems, allAnswers]);

  // 현재 인덱스가 변경되면 해당 인덱스부터 10개 문제를 보이게 한다.
  useEffect(() => {
    console.log('ci: ' + currentIndex);
    if (recommendProblems.length === 0) return;

    let updArr = [];
    let ci = 0;
    if (currentIndex !== 0) ci = currentIndex - 1;
    // recommendProblems 사용하여 배열 업데이트 처리를 위한 함수
    const updateArrayFromRecommend = (recommendArr, perChunk, ci) => {
      // recommendProblems 내의 각 배열에 접근
      return recommendArr
        .map((sourceArray) => {
          let startIndex = ci * perChunk;
          let endIndex = startIndex + perChunk;

          if (startIndex < sourceArray.length) {
            return sourceArray.slice(
              startIndex,
              Math.min(endIndex, sourceArray.length)
            );
          }
          return [];
        })
        .flat(); // 2차원 배열을 1차원 배열로 평탄화
    };
    // recommendProblems를 사용하여 배열 업데이트
    updArr = updateArrayFromRecommend(
      [
        recommendProblems[0], // userWrongProblems 대응
        recommendProblems[1], // killerRound 대응
        recommendProblems[2], // userBookMark 대응
      ],
      10,
      ci
    ); // 전체 문제를 10개 단위로 나누어 현재 인덱스에 따라 해당하는 문제들을 표시

    setCurrentProblems(updArr); // 현재 문제 상태 업데이트
    setIsLoading(false);
  }, [recommendProblems, currentIndex]); // currentIndex 의존성 추가

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

  // 여기서 UI를 렌더링하거나 recommendedProblems를 사용할 수 있음
  return (
    <Container>
      <Title>추천 문제</Title>
      {isLoading ? (
        <HashLoader style={{ display: 'flex' }} />
      ) : (
        <>
          <CardContainer>
            {currentProblems.map((item) => (
              <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
            ))}
          </CardContainer>

          <MoveButtonContainer>
            {currentIndex <= 1 ? (
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
  );
};

export default RecommendationQuestion;
