import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { HashLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Container = styled.div`
flex: 1,
padding: 10,
backgroundColor: '#bbd2ec',
`;
const Timer = styled.div`
position: 'absolute',
top: 10,
left: 10,
padding: 10,
borderRadius: 10,
backgroundColor: 'white',
`;
const Score = styled.div`
position: 'absolute',
top: 10,
right: 10,
padding: 10,
borderRadius: 10,
backgroundColor: 'white',
`;
const Guess = styled.div`
flex: 2,
justifyContent: 'center',
alignItems: 'center',
`;
const Explanation = styled.div`
flex: 1.2,
justifyContent: 'center',
alignItems: 'center',
`;
const Keypad = styled.div`
flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
`;
const Button = styled.button`
margin: 5,
    padding: 20,
    width: '17%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
`;
const ButtonText = styled.span`
fontSize: 30,
textAlign: 'center',
`;
const Line = styled.div`
borderBottomColor: '#838abd',
borderBottomWidth: 5,
borderRadius: 5,
marginBottom: 5,
`;
const NextButton = styled.button`
position: 'absolute',
top: 60,
right: 10,
padding: 10,
borderRadius: 10,
backgroundColor: 'red',
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
  const [selectedButtons, setSelectedButtons] = useState(
    // 15개의 키패드 선택 여부 상태
    new Array(15).fill(false)
  );
  const [unsolved, setUnsolved] = useState([]); // 넘긴 문제 저장
  const [solveCount, setSolveCount] = useState(0); // 문제 수 카운트
  const isWeb = useSelector((state) => state.isWeb);

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
        .slice(0, 5);

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

  useEffect(() => {
    // solveCount == 문제 수일 때 문제 소진으로 인한 종료 처리
    if (solveCount != 0 && solveCount == keywords.length) {
      const buttons = [
        {
          text: '나가기',
          //onPress: () => navigation.navigate('Sidebar'),
        },
      ];

      if (unsolved.length > 0) {
        buttons.push({
          text: '넘긴 문제 보기',
          // onPress: () => navigation.navigate('UnsolvedScreen', { unsolved }),
        });
      }

      setSolveCount(0);
      stopTimer();

      const userConfirmed = window.confirm(
        '문제가 소진되었습니다. 최종 점수: ' + score
      );
      if (userConfirmed) {
        //navigation.navigate('Home');
      }
    }
  }, [solveCount, unsolved]);

  // 타이머 시작
  useEffect(
    React.useCallback(() => {
      // 타이머 초기화
      setTimer(120);

      countdownRef.current = setInterval(() => {
        if (timer > 0) setTimer((timer) => timer - 1);
      }, 1000);

      return () => clearInterval(countdownRef.current);
    }, [])
  );

  // 타이머 중지 함수
  const stopTimer = () => {
    clearInterval(countdownRef.current);
  };

  // 타임 오버 시 게임 종료 처리
  useEffect(() => {
    if (timer === 0) {
      stopTimer();
      const confirmExit = () => {
        const userConfirmed = window.confirm('타임 오버! 최종 점수: ' + score);
        if (userConfirmed) {
          if (unsolved.length > 0) {
            //.navigate('UnsolvedScreen', { unsolved });
          } else {
            //navigation.navigate('Sidebar');
            //navigation.goBack();
          }
        }
      };

      confirmExit();
    }
  }, [timer, unsolved, isWeb]);

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
          <Button
            key={index}
            style={[
              selectedButtons[index]
                ? { backgroundColor: '#7bb4e3' }
                : { backgroundColor: '#dfe9f5' },
            ]}
            onPress={() => handleSelect(keypadKeywords[index], index)}
          >
            <ButtonText>{keypadKeywords[index]}</ButtonText>
          </Button>
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
          <Guess>
            <span style={{ fontSize: 30 }}>{guess}</span>
          </Guess>
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
          <NextButton onPress={() => handleNextButton()}>
            <span style={{ color: 'white' }}>문제 넘기기</span>
          </NextButton>

          <Line />
          <Explanation>
            <span style={{ fontSize: 20 }}>
              {currentKeyword?.data.explanation}
            </span>
          </Explanation>
          <Line />
          <Keypad>{buttons}</Keypad>
        </>
      )}
    </Container>
  );
};
export default QuizGame;
