import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { ProblemSideBar } from '../Problem/SideBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  min-width: 30em;
  height: 5000px;
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
  width: 20%;
  height: 50px;
`;
const ShowButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  top: 10px;
  width: 180px;
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
const ListContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  flex-direction: column;
  top: 5%;
  width: 55%;
`;
const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
`;
const ListRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;
const CommantButton = styled.div`
  display: flex;
  background-color: #838abd;
  color: white;
  font-weight: 600;
  font-size: 1.2em;
  padding: 10px;
  border-radius: 5px;

  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 0px #7bb4e3;
  border: none;
  font-size: 1em;
  &:hover {
    box-shadow: 0px 0px 0px 5px #7bb4e3;
  }
`;

const PracticeResult = () => {
  const location = useLocation();
  const { userChoices, problems, answers, examId } = location.state;

  const choicesArray = Object.entries(userChoices);
  const [showOnlyWrong, setShowOnlyWrong] = useState(false); // 오답만 보기 여부

  const [originWrongEras, setOriginWrongEras] = useState(new Array(9).fill(-1)); // 기존 오답들 시대 데이터
  const [originWrongTypes, setOriginWrongTypes] = useState(
    new Array(11).fill(-1)
  ); // 기존 오답들 유형 데이터

  const [newWrongEras, setNewWrongEras] = useState(new Array(9).fill(0)); // 새 오답 시대 데이터
  const [newWrongTypes, setNewWrongTypes] = useState(new Array(11).fill(0)); // 새 유형 시대 데이터

  const [saveWrongEras, setSaveWrongEras] = useState(new Array(9).fill(-1)); // 저장용 시대 데이터
  const [saveWrongTypes, setSaveWrongTypes] = useState(new Array(11).fill(-1)); // 저장용 시대 데이터

  const [wrongIndexes, setWrongIndexes] = useState(new Array(50).fill(-1)); // 오답 인덱스
  const [totalScore, setTotalScrore] = useState(100);
  const navigate = useNavigate();

  // 로그인 정보
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userEmail = useSelector((state) => state.userEmail);

  // era 이름에 따라 인덱스를 반환하는 함수
  function getEraIndex(eraName) {
    const eras = [
      '전삼국',
      '삼국',
      '남북국',
      '후삼국',
      '고려',
      '조선',
      '개항기',
      '일제강점기',
      '해방이후',
    ];
    return eras.indexOf(eraName);
  }

  // type 이름에 따라 인덱스를 반환하는 함수
  function getTypeIndex(typeName) {
    const types = [
      '문화',
      '유물',
      '사건',
      '인물',
      '장소',
      '그림',
      '제도',
      '일제강점기',
      '조약',
      '단체',
      '미분류',
    ];
    return types.indexOf(typeName);
  }

  // 새 오답 분류 정보 저장
  useEffect(() => {
    const updatedWrongEras = [...newWrongEras];
    const updatedWrongTypes = [...newWrongTypes];
    let saveWrongIndexes = new Array(50).fill(1);
    let score = 100;

    // 오답 인덱스 저장
    choicesArray.forEach(([index, value], i) => {
      const answer = answers.find((answer) => answer.id === index);
      const problem = problems.find((problem) => problem.id === index);

      if (answer && problem && value != answer.data.answer) {
        score -= problem.data.score;
        saveWrongIndexes[i] = 0;

        // 오답에 해당하는 era의 인덱스를 찾아 updatedWrongEras 배열의 해당 위치 값을 1 증가
        const eraIndex = getEraIndex(problem.data.era);
        if (eraIndex !== -1) {
          updatedWrongEras[eraIndex] += 1; // 해당 era 인덱스의 값을 1 증가
        }

        // 오답 문제 유형 저장
        const typeIndexArray = problem.data.type;
        for (let i = 0; i < typeIndexArray.length; i++) {
          const typeIndex = getTypeIndex(typeIndexArray[i]);
          if (typeIndex !== -1) {
            updatedWrongTypes[typeIndex] += 1; // 해당 type 인덱스의 값을 1 증가
          }
        }
      }
    });
    if (isLoggedIn) {
      setNewWrongEras(updatedWrongEras);
      setNewWrongTypes(updatedWrongTypes);
    }
    setWrongIndexes(saveWrongIndexes);
    setTotalScrore(score);
  }, [isLoggedIn]);

  // 오답 업데이트
  useEffect(() => {
    if (!isLoggedIn || wrongIndexes[0] === -1) return;
    const newIds = [];
    const wrongRef = collection(firestore, 'users', userEmail, 'wrongProblems');
    // 오답문제 번호 가져오기
    const updateWrongProblems = async () => {
      try {
        const querySnapshot = await getDocs(wrongRef);

        // 기존 오답 정보 삭제
        const batch = writeBatch(firestore);
        querySnapshot.forEach((item) => {
          if (item.id.substring(0, 2) === examId) {
            const docRef = doc(
              firestore,
              'users',
              userEmail,
              'wrongProblems',
              item.id
            );
            batch.delete(docRef); // 기존 현재 회차의 오답 정보만 삭제
          }
        });
        await batch.commit(); // Batch 작업 실행으로 모든 문서 일괄 삭제
        console.log('All existing wrong ploblems deleted.');

        // 현재 오답 인덱스에 회차정보를 더해서 저장 예) 0 -> 6101, 1 -> 6102, ...
        for (let i = 0; i < 50; i++) {
          if (wrongIndexes[i] === 0) newIds.push(examId * 100 + i + 1);
        }

        try {
          newIds.forEach(async (item) => {
            const itemRef = doc(
              firestore,
              'users',
              userEmail,
              'wrongProblems',
              item.toString()
            );
            // 문서를 빈 상태로 저장
            await setDoc(itemRef, {});
          });

          console.log('All items saved successfully.');
        } catch (error) {
          console.error('Data could not be saved. ' + error);
        }

        console.log('Wrong ploblems updated.');
      } catch (error) {
        console.error('Error updating wrong ploblems: ', error);
      }
    };

    updateWrongProblems();
  }, [wrongIndexes]);

  // 기존 데이터 가져온 후 상태변수에 저장
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchData = async () => {
      const wrongRef = doc(
        firestore,
        'users',
        userEmail,
        'wrongStatistics',
        'data'
      );
      try {
        const docSnap = await getDoc(wrongRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          let check = 1;
          const keys = ['era', 'type'];

          keys.forEach((key) => {
            if (!data[key]) {
              // 기존 데이터가 없는 경우 체크
              check = 0;
            }
            let setStateFunction, newValues;
            if (key === 'era') {
              setStateFunction = setOriginWrongEras;
              newValues = new Array(9).fill(0);
            } else if (key === 'type') {
              setStateFunction = setOriginWrongTypes;
              newValues = new Array(11).fill(0);
            }
            if (setStateFunction && newValues) {
              updateStateFromSnapshot(data, key, setStateFunction, newValues);
            }
          });
          if (check === 0) {
            // 기존 데이터가 없는 경우 기존 데이터를 0으로만 구성된 배열로 초기화
            console.log('Data initializing.');
            setOriginWrongEras(new Array(9).fill(0));
            setOriginWrongTypes(new Array(11).fill(0));
          }
        } else {
          console.log('No such document!');
          // 문서가 존재하지 않는 경우, 새 문서 생성
          await setDoc(wrongRef, {
            era: new Array(9).fill(0),
            type: new Array(11).fill(0),
          });
          console.log('Document successfully created with initial data.');
          fetchData();
        }
      } catch (error) {
        console.error('Error fetching document: ', error);
      }
    };

    fetchData();
  }, []);

  // 상태변수에 기존 데이터 저장
  function updateStateFromSnapshot(data, key, setStateFunction, newValues) {
    if (data[key]) {
      const updatedValues = newValues.map(
        (value, index) => value + (data[key][index] || 0)
      );
      setStateFunction(updatedValues);
    }
  }

  // 기존 데이터에 새 데이터를 누적하여 상태변수에 저장
  useEffect(() => {
    if (originWrongEras[0] === -1) return;
    setSaveArray(newWrongEras, originWrongEras, setSaveWrongEras);
  }, [newWrongEras, originWrongEras]);

  useEffect(() => {
    if (originWrongTypes[0] === -1) return;
    setSaveArray(newWrongTypes, originWrongTypes, setSaveWrongTypes);
  }, [newWrongTypes, originWrongTypes]);

  function setSaveArray(newArray, originArray, setStateFunction) {
    const size = newArray.length;
    const arr = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
      arr[i] = newArray[i] + originArray[i];
    }
    setStateFunction(arr);
  }

  // 누적한 데이터를 db에 저장
  useEffect(() => {
    if (!isLoggedIn) return;
    if (saveWrongEras[0] == -1) return; // 가장 처음 useEffect 실행 시 저장 방지

    const wrongRef = doc(
      firestore,
      'users',
      userEmail,
      'wrongStatistics',
      'data'
    );
    const wrongStatisticsSave = async () => {
      try {
        await updateDoc(wrongRef, {
          era: saveWrongEras,
          type: saveWrongTypes,
        });
        console.log('Data updated successfully.');
      } catch (error) {
        console.error('Data could not be saved.' + error);
      }
    };
    wrongStatisticsSave();
  }, [isLoggedIn, saveWrongEras, saveWrongTypes]);

  // 해설 버튼 클릭 시 이동
  const handleCommentary = (index) => {
    const answer = answers.find((answer) => answer.id === index);
    const problem = problems.find((problem) => problem.id === index);
    navigate('/problemCommentary', {
      state: {
        problem: problem,
        answer: answer,
      },
    });
  };

  // 오답만 보기 여부
  const filteredData = showOnlyWrong
    ? choicesArray.filter((_, index) => wrongIndexes[index] === 0)
    : choicesArray;

  return (
    <Box>
      <ProblemSideBar />

      <Container>
        <Title>총점: {totalScore}</Title>
        <ShowButton onClick={() => setShowOnlyWrong(!showOnlyWrong)}>
          {showOnlyWrong ? '전부 표시' : '틀린 문제만 표시'}
        </ShowButton>

        <ListContainer>
          {filteredData.map((item) => {
            const [index, value] = item;
            const answer = answers.find((answer) => answer.id === index);

            // 틀린 문제만 보이는 경우
            if (showOnlyWrong && wrongIndexes[index] === 0) {
              return null;
            }

            return (
              <ListItem key={index}>
                <ListRow>
                  <div
                    style={{ fontWeight: '600', fontSize: '1.2em' }}
                  >{`${parseInt(index.slice(-2))}번`}</div>
                  <div
                    style={{
                      margin: '10px',
                      color: wrongIndexes[parseInt(index.slice(-2)) - 1]
                        ? 'blue'
                        : 'red',
                    }}
                  >
                    {`선택: ${value}`}
                  </div>
                  <div style={{ margin: '10px' }}>{`정답: ${
                    answer ? answer.data.answer : '정답 정보 없음'
                  }`}</div>
                </ListRow>
                <CommantButton onClick={() => handleCommentary(index)}>
                  해설
                </CommantButton>
              </ListItem>
            );
          })}
        </ListContainer>
      </Container>
    </Box>
  );
};

export default PracticeResult;
