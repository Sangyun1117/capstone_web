import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { HashLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Button } from 'antd';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 93%;
  width: 60%;
  min-width: 30em;
  background-color: #bbd2ec;
  min-top: 7%;
  left: 20%;
  position: fixed;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 58%;
  min-width: 28em;
  height: 2.5em;
  position: fixed;
  top: 4em;
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;
  border-radius: 1em;
  background-color: white;
`;

const Score = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;
  border-radius: 1em;
  background-color: white;
`;

const BodyContainer = styled.div`
  position: fixed;
  height: 80%;
  top: 11em;
  width: 60%;
  min-width: 30em;
`;

const Guess = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5vh;
`;
const Explanation = styled.div`
  display: flex;
  padding: 3em;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 50vw;
  min-width: 25em;
`;
const Keypad = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const KeyButton = styled.button`
  margin: 0.7em;
  padding: 0.2em;
  width: 15vw;
  min-height: 4vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border-color: black;
  border-width: 0.1em;
  border-radius: 0.5em;
  font-size: 2em;
`;
const Line = styled.div`
  background-color: #838abd;
  border-width: 1em;
  border-radius: 0.5em;
  margin-bottom: 0.1em;
`;

const QuizGame = () => {
  const [keywords, setKeywords] = useState([]); // 퀴즈 문제 리스트
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [currentKeyword, setCurrentKeyword] = useState(); // 현재 문제
  const [keypadKeywords, setKeypadKeywords] = useState([]); // 키패드 랜덤 글자 리스트
  const [guess, setGuess] = useState(''); // 사용자 답 추측 문자열
  const [guessCount, setGuessCount] = useState(0); // guess의 글자 수
  const [currentIndex, setCurrentIndex] = useState(0); // 랜덤 문제 인덱스 리스트의 현재 인덱스
  const [randomIndexList, setRandomIndexList] = useState([]); // 랜덤 문제 인덱스 리스트
  const [timer, setTimer] = useState(120); // 타이머. 2분 제한
  const countdownRef = useRef(null); // 타이머 id를 저장할 ref
  const [score, setScore] = useState(0); // 스코어
  const navigate = useNavigate();
  const [selectedButtons, setSelectedButtons] = useState(
    // 15개의 키패드 선택 여부 상태
    new Array(15).fill(false)
  );
  const [unsolved, setUnsolved] = useState([]); // 넘긴 문제 저장
  const [solveCount, setSolveCount] = useState(0); // 문제 수 카운트

  // 키워드 가져오기
  useEffect(() => {
    const fetchExamRounds = async () => {
      try {
        setIsLoading(true);
        const list = [];
        const keywordCollection = collection(firestore, 'keyword');
        const keywordSnapshot = await getDocs(keywordCollection);
        keywordSnapshot.forEach((doc) => {
          list.push({ data: doc.data() });
        });
        setKeywords(list);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data: ', err);
        setIsLoading(false);
      }
    };
    fetchExamRounds();
  }, []);

  // 문제 만들기를 위한 랜덤 인덱스 생성
  const fillRandomArray = (length) => {
    let randomList = Array.from({ length }, (_, i) => i);
    for (let i = randomList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomList[i], randomList[j]] = [randomList[j], randomList[i]];
    }
    return randomList;
  };

  // 처음 문제 뽑기
  useEffect(() => {
    const randomList = fillRandomArray(keywords.length);
    setRandomIndexList(randomList); // 상태 업데이트
    setCurrentKeyword(keywords[randomList[currentIndex]]);
  }, [keywords]);

  // 현재 키워드, 키패드 세팅
  // 3. 문제 업데이트 시 키패드 업데이트
  useEffect(() => {
    if (currentKeyword) {
      setGuess(
        new Array(currentKeyword.data.keyword.length).fill('□').join('')
      );

      // 랜덤 키워드 5개 뽑기
      let selectedKeywords = [...keywords]
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);

      // currentKeyword를 제외
      selectedKeywords = selectedKeywords.filter(
        (keyword) => keyword.data.keyword !== currentKeyword.data.keyword
      );

      let charArray = selectedKeywords.flatMap((keyword) =>
        keyword.data.keyword.split('')
      );

      // 현재 키워드의 문자열을 제외한 문자 개수만큼만 뽑기
      const remainingCount = 15 - currentKeyword.data.keyword.length;
      charArray = charArray.slice(0, remainingCount);

      // 현재 키워드의 문자열을 charArray에 추가
      charArray = charArray.concat(currentKeyword.data.keyword.split(''));

      // 문자 배열을 랜덤으로 섞음
      for (let i = charArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [charArray[i], charArray[j]] = [charArray[j], charArray[i]];
      }
      setKeypadKeywords(charArray);
    }
  }, [currentKeyword]);

  // 2. 문제 인덱스 변경 시 문제 업데이트
  useEffect(() => {
    if (currentIndex < keywords.length) {
      setCurrentKeyword(keywords[randomIndexList[currentIndex]]);
    }
  }, [currentIndex]);

  // 답 검사
  useEffect(() => {
    // 글자 수가 모두 채워졌을 때
    if (guessCount === currentKeyword?.data.keyword.length) {
      // 정답인 경우
      if (guess == currentKeyword.data.keyword) {
        // 다음 문제 세팅
        // 1. 현재 문제 인덱스 변경
        setCurrentIndex(currentIndex + 1);
        setScore(score + 1); // 스코어 추가
        setSolveCount(solveCount + 1); // 문제 수 카운트
      }
      // guess 초기화
      setGuess(
        new Array(currentKeyword.data.keyword.length).fill('□').join('')
      );
      setGuessCount(0); // 선택 글자 수 초기화
      setSelectedButtons(new Array(15).fill(false)); // 키패드 선택 초기화
    }
  }, [guessCount]);

  // 문제 소진 시 알림창
  useEffect(() => {
    if (solveCount !== 0 && solveCount === keywords.length) {
      setSolveCount(0);
      stopTimer();

      const buttons =
        unsolved.length > 0
          ? {
              cancel: '나가기',
              catch: {
                text: '넘긴 문제 보기',
                value: 'catch',
              },
            }
          : {};

      swal({
        title: '문제가 소진되었습니다.',
        text: '최종 점수: ' + score,
        icon: 'info',
        buttons: buttons,
        dangerMode: true,
      }).then((value) => {
        switch (value) {
          case 'catch':
            console.log(unsolved);
            navigate('/unsolvedScreen', { state: { unsolved } });
            break;

          default:
            navigate('/');
        }
      });
    }
  }, [solveCount, unsolved]);

  // 타이머 시작
  useEffect(() => {
    setTimer(120); // 타이머 초기화

    // 타이머 시작
    countdownRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) return prevTimer - 1;
        clearInterval(countdownRef.current); // 타이머가 0이 되면 자동으로 정지
        return 0; // 타이머가 0이 되면 상태를 0으로 설정
      });
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(countdownRef.current);
  }, []);

  // 타이머 중지 함수
  const stopTimer = () => {
    clearInterval(countdownRef.current);
  };

  // 타임 오버 시 게임 종료 처리
  useEffect(() => {
    if (timer === 0) {
      stopTimer();
      // 타임 오버 및 점수 알림
    swal({
      title: "타임 오버!",
      text: "최종 점수: " + score,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willContinue) => {
      if (willContinue) {
        // 넘긴 문제가 있을 경우, 넘긴 문제 목록 페이지로 이동
        if (unsolved.length > 0) {
          navigate('/unsolvedScreen', { state: { unsolved } });
        } else {
          // 그렇지 않으면 홈으로 이동
          navigate('/');
        }
      }
    });
  }
  }, [timer, unsolved]);

  // 키패드 클릭 시 화면 반영
  const handleSelect = (char, index) => {
    if (
      guessCount < currentKeyword?.data.keyword.length &&
      !selectedButtons[index]
    ) {
      // 선택된 버튼의 상태를 업데이트
      const newSelectedButtons = [...selectedButtons];
      newSelectedButtons[index] = true;
      setSelectedButtons(newSelectedButtons);

      setGuess((prevGuess) => prevGuess.replace('□', char));
      setGuessCount(guessCount + 1);
    }
  };

  // 넘기기 버튼 클릭 시
  const handleNextButton = () => {
    // 현재 문제를 미해결 문제 리스트에 추가
    setUnsolved((prevUnsolved) => [...prevUnsolved, keywords[currentIndex]]);
    // 다음 문제로 이동
    setCurrentIndex(currentIndex + 1);
    // guess 초기화
    setGuess(new Array(currentKeyword.data.keyword.length).fill('□').join(''));
    setGuessCount(0); // 선택 글자 수 초기화
    setSelectedButtons(new Array(15).fill(false)); // 키패드 선택 초기화
    setSolveCount(solveCount + 1); // 문제 수 카운트
  };

  // 키패드 배치
  const buttons = Array.from({ length: 3 }, (_, i) => (
    <div key={i} style={{ flexDirection: 'row' }}>
      {Array.from({ length: 5 }, (_, j) => {
        const index = i * 5 + j;
        return (
          <KeyButton
            key={index}
            style={
              selectedButtons[index]
                ? { backgroundColor: '#7bb4e3' }
                : { backgroundColor: '#dfe9f5' }
            }
            onClick={() => handleSelect(keypadKeywords[index], index)}
          >
            {keypadKeywords[index]}
          </KeyButton>
        );
      })}
    </div>
  ));

  return (
    <Container>
      {isLoading ? (
        <HashLoader />
      ) : (
        <>
          <TopBar>
            <Timer>
              <span style={timer <= 10 ? { color: 'red' } : { color: 'black' }}>
                {timer > 60
                  ? `남은 시간: ${Math.floor(timer / 60)}분 ${timer % 60}초`
                  : `남은 시간: ${timer}초`}
              </span>
            </Timer>
            <Score>
              <span>점수: {score}</span>
            </Score>
          </TopBar>
          <div style={{position: 'fixed', top: '8em', width: '60%', minWidth: '30em', left: '20%'}}>
            <Button type="primary" danger onClick={() => handleNextButton()} style={{position: 'absolute', right: '0.5em'}}>문제 넘기기
            </Button>
            </div>
          <BodyContainer>    
            <Guess>
              <span style={{ fontSize: '4em' }}>{guess}</span>
            </Guess>
            <Explanation>
            <span style={{ fontSize: currentKeyword?.data.explanation?.length > 70 ? '15px' : '20px' }}>
                {currentKeyword?.data.explanation}
            </span>
            </Explanation>
            <Keypad>{buttons}</Keypad>
          </BodyContainer>
        </>
      )}
    </Container>
    
  );
};
export default QuizGame;
