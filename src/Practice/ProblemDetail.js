import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as BoldStar } from '@fortawesome/free-solid-svg-icons'; // 굵은 별
import { faStar as VoidStar } from '@fortawesome/free-regular-svg-icons'; // 빈 별
import { firestore } from '../firebaseConfig';
import { HashLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import swal from 'sweetalert';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  width: 60%;
  min-width: 30em;
  background-color: #bbd2ec;
  top: 5em;
  left: 20%;
  position: absolute;
`;
const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 98%;
  margin: 20px;
  top: 100px;
`;
const IdText = styled.div`
  display: flex;
  padding: 10px;
  font-weight: 600;
  font-size: 1.5em;
  align-items: center;
  background-color: white;
  border-radius: 10px;
`;
const BookmarkButton = styled.button`
  background-color: #bbd2ec;
  border: none;
`;
const ProblemImage = styled.img`
  object-fit: contain;
  width: 500px;
  height: auto;

  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 0px #838abd;
  border: none;
  font-size: 1em;
  &:hover {
    box-shadow: 0px 0px 0px 5px #838abd;
  }
`;
const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 7%;
`;
const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 200px;
  margin: 20px;
  padding: 20px;
`;
const SelectButton = styled.button`
  margin: 20px;
  width: 50px;
  min-width: 30px;
  height: 50px;
  color: white;
  border-radius: 10px;

  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 0px white;
  border: none;
  font-size: 2em;
  &:hover {
    box-shadow: 0px 0px 0px 5px white;
  }
`;
const MoveButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 70px;
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

const Line = styled.div`
  display: flex;
  background-color: #7bb4e3;
  width: 80%;
  height: 10px;
  margin: 30px;
  border-radius: 20px;
`;

const ProblemDetail = () => {
  const location = useLocation();
  const { examDocId } = location.state;
  const [problems, setProblems] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoices, setUserChoices] = useState({});
  const [originBookMark, setOriginBookMark] = useState([]); // 필터링 안된 기존 북마크 저장
  const [indexBookMark, setIndexBookMark] = useState([]); // 북마크 인덱스 저장

  const navigate = useNavigate();

  // 로그인 정보
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userEmail = useSelector((state) => state.userEmail);

  const [userId, setUserId] = useState();
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  const id = String(problems[currentIndex]?.id);
  const formattedId = `${id.slice(0, 2)}회차 ${parseInt(id.slice(2))}번`;

  useEffect(() => {
    if (userEmail) {
      setUserId(userEmail.split('.')[0]);
    }
  }, [userEmail]);

  // 문제, 답 가져오기
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        const list = [];
        const problemCollection = collection(
          firestore,
          'exam round',
          examDocId,
          examDocId
        );
        const problemSnapshot = await getDocs(problemCollection);
        problemSnapshot.forEach((problemDoc) => {
          list.push({ id: problemDoc.id, data: problemDoc.data() });
        });
        setProblems(list);

        const alist = [];
        const answerCollection = collection(
          firestore,
          'answer round',
          examDocId,
          examDocId
        );
        const answerSnapshot = await getDocs(answerCollection);
        answerSnapshot.forEach((answerDoc) => {
          alist.push({ id: answerDoc.id, data: answerDoc.data() });
        });
        setAnswers(alist);

        const initialChoices = {};
        list.forEach((problem) => {
          initialChoices[problem.id] = 1;
        });
        setUserChoices(initialChoices);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data: ', err);
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [examDocId]);

  // 북마크 가져오기
  const fetchBookmarks = async () => {
    if (!isLoggedIn) return;

    const bookMarkRef = collection(firestore, 'users', userEmail, 'bookMark');
    try {
      const querySnapshot = await getDocs(bookMarkRef);

      // 기존 회차의 북마크 정보 삭제
      const batch = writeBatch(firestore);
      querySnapshot.forEach((item) => {
        if (item.id.substring(0, 2) === examDocId) {
          const docRef = doc(
            firestore,
            'users',
            userEmail,
            'bookMark',
            item.id
          );
          batch.delete(docRef);
        }
      });
      await batch.commit(); // Batch 작업 실행으로 모든 문서 일괄 삭제
      console.log('All existing bookmarks deleted.');

      // 6101, 6103, 6201, 6335, ... 등 북마크 중 회차에 맞는 id만 필터링
      const filteredIds = [];
      const originIds = [];
      querySnapshot.forEach((doc) => {
        if (doc.id.substring(0, 2) === examDocId.substring(0, 2)) {
          filteredIds.push(doc.id);
        } else {
          originIds.push(doc.id);
        }
      });
      setOriginBookMark(originIds);

      // 북마크를 인덱스 형태로 추가 저장. 예) 6101 -> 0, 6102 -> 1, ...
      const indexArray = filteredIds.map((id) => {
        return id - examDocId * 100 - 1;
      });
      setIndexBookMark(indexArray);

      console.log('Bookmarks fetched and filtered successfully.');
    } catch (error) {
      console.error('Error fetching bookmarks: ', error);
    }
  };
  useEffect(() => {
    fetchBookmarks();
  }, [userId]);

  // 북마크 저장
  useEffect(() => {
    const bookmarkSave = async () => {
      if (!isLoggedIn) return;
      if (indexBookMark.length === 0) {
        return;
      }

      try {
        originBookMark.forEach(async (item) => {
          const itemRef = doc(
            firestore,
            'users',
            userEmail,
            'bookMark',
            item.toString()
          );
          // 문서를 빈 상태로 저장
          await setDoc(itemRef, {});
        });

        console.log('All items saved successfully.');
      } catch (error) {
        console.error('Data could not be saved. ' + error);
      }
    };

    if (originBookMark.length > 0) {
      bookmarkSave();
    }
  }, [originBookMark]);

  // 북마크 선택 시 상태 변경
  const handleBookmark = (index) => {
    if (!isLoggedIn) return;
    if (indexBookMark.includes(index)) {
      // 이미 북마크한 문제라면 북마크 해제
      setIndexBookMark(indexBookMark.filter((i) => i !== index));
    } else {
      // 아직 북마크하지 않은 문제라면 북마크 설정
      setIndexBookMark([...indexBookMark, index]);
    }
  };

  // 이전 문제로 이동
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  // 다음 문제로 이동
  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  // 답안 선택
  const handleSelect = (number) => {
    setUserChoices((prevChoices) => ({
      ...prevChoices,
      [problems[currentIndex].id]: number,
    }));
  };

  // 북마크 저장 후 결과 페이지로 이동
  const saveBookMarkAndNavigate = () => {
    if (isLoggedIn) {
      // 로그인 되었을 떄만 북마크 저장
      // originBookMark 상태변수 업데이트 시 useEffect에 의해 저장 로직 실행됨.
      const saveBookMarkArray = indexBookMark.map((id) => {
        return id + examDocId * 100 + 1;
      });
      setOriginBookMark((prevOriginBookMark) => [
        ...prevOriginBookMark,
        ...saveBookMarkArray,
      ]);
    }
    const examId = examDocId;
    navigate('/practiceResult', {
      state: {
        userChoices,
        problems,
        answers,
        examId,
      },
    });
  };

  // 제출 확인 창
  const handleSubmit = (dataRef) => {
    swal({
      title: '제출 확인',
      text: '답을 제출하시겠습니까?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willContinue) => {
      if (willContinue) {
        saveBookMarkAndNavigate();
      }
    });
  };

  return (
    <Container>
      {isLoading ? (
        <HashLoader style={{ display: 'flex' }} />
      ) : (
        <>
          <TopContainer>
            <IdText>{formattedId}</IdText>
            {isLoggedIn ? (
              <BookmarkButton onClick={() => handleBookmark(currentIndex)}>
                <FontAwesomeIcon
                  icon={
                    indexBookMark.includes(currentIndex) ? BoldStar : VoidStar
                  }
                  size="4x"
                  color={indexBookMark.includes(currentIndex) ? 'gold' : 'gray'}
                />
              </BookmarkButton>
            ) : null}
          </TopContainer>

          <BottomContainer>
            {problems.length > 0 && (
              <ProblemImage
                src={problems[currentIndex].data.img}
                alt="문제 이미지"
                onClick={() => {
                  swal({
                    icon: problems[currentIndex].data.img,
                    button: '닫기',
                    className: 'custom-swal',
                  });
                }}
              />
            )}

            <SelectContainer>
              {[1, 2, 3, 4, 5].map((number) => (
                <SelectButton
                  key={number}
                  onClick={() => handleSelect(number)}
                  style={{
                    backgroundColor:
                      userChoices[problems[currentIndex].id] === number
                        ? '#523383'
                        : '#978ff9',
                  }}
                >
                  <div>{number}</div>
                </SelectButton>
              ))}
            </SelectContainer>
            <Line />
            <MoveButtonContainer>
              {currentIndex === 0 ? (
                <DisabledButton>
                  <div>이전</div>
                </DisabledButton>
              ) : (
                <MoveButton onClick={handlePrev}>
                  <div>이전</div>
                </MoveButton>
              )}

              <MoveButton onClick={handleSubmit}>
                <div>제출</div>
              </MoveButton>

              {currentIndex === problems.length - 1 ? (
                <DisabledButton>
                  <div>다음</div>
                </DisabledButton>
              ) : (
                <MoveButton onClick={handleNext}>
                  <div>다음</div>
                </MoveButton>
              )}
            </MoveButtonContainer>
          </BottomContainer>
        </>
      )}
    </Container>
  );
};

export default ProblemDetail;
