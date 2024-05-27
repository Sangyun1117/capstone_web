﻿import React, { useState, useEffect } from 'react';
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
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'; // 화살표
import { firestore } from '../firebaseConfig';
import { HashLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import swal from 'sweetalert';
import { Box } from '@mui/material';
import { ProblemSideBar } from '../Problem/SideBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 5em);
  width: 60%;
  min-width: 800px;
  background-color: #bbd2ec;
  margin-right: 15%;
  position: relative;
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
const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 2%;
  background-color: #bbd2ec;
`;
const ProblemImage = styled.img`
  object-fit: contain;
  width: 400px;
  min-width: 200px;
  height: auto;

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
const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 70px;
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
const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;
const MoveButton = styled.button`
  width: 60px;
  height: 60px;
  background-color: #838abd;
  color: white;
  border-radius: 30px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 0px white;
  border: none;
  font-size: 1em;
  &:hover {
    box-shadow: 0px 0px 0px 5px white;
  }
`;
const ArrowButton = styled(MoveButton)`
  font-size: 2em;
  background-color: ${(props) =>
    props.disabled ? '#495057' : '#838abd'}; // 비활성화 색상 변경
  margin: 20px;
  &:hover {
    box-shadow: ${(props) => props.disabled ? '0px 0px 0px 0px white' : '0px 0px 0px 5px white'};
  }
`;
const SubmitButton = styled(MoveButton)`
  width: 100px;
  height: 60px;
  background-color: #838abd;
  color: white;
  border-radius: 10px;
  margin-top: 30px;
  margin-bottom: 20px;
`;

const ProblemDetail = () => {
  const location = useLocation();
  const { examDocId } = location.state; // 회차 정보
  const [problems, setProblems] = useState([]); // 문제 정보
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 문제번호
  const [userChoices, setUserChoices] = useState({}); // 선택한 답 리스트
  const [indexBookMark, setIndexBookMark] = useState([]); // 북마크 인덱스 저장
  const [finalBookMark, setFinalBookMark] = useState([]); // 최종적으로 db에 반영할 북마크
  const [isBookmarkSaved, setIsBookmarkSaved] = useState(false); // 최종 북마크 저장 확인

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

  // 문제 정보 가져오기
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const plist = [];
        const problemCollection = collection(
          firestore,
          'exam round',
          examDocId,
          examDocId
        );

        const problemSnapshot = await getDocs(problemCollection);
        problemSnapshot.forEach((problemDoc) => {
          plist.push({ id: problemDoc.id, data: problemDoc.data() });
        });
        setProblems(plist);

        const initialChoices = {};
        plist.forEach((problem) => {
          initialChoices[problem.id] = 1;
        });
        setUserChoices(initialChoices);
      } catch (err) {
        console.error('Error fetching problem data: ', err);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      await fetchProblems();
      setIsLoading(false);
    };
    
    fetchData();
  }, [examDocId]);

  useEffect(() => {
    console.log('useEffect: problems: ');
    console.log(problems);
  }, [problems])

  // 북마크 가져오기
  const fetchBookmarks = async () => {
    if (!isLoggedIn) return;

    const bookMarkRef = collection(firestore, 'users', userEmail, 'bookMark');
    try {
      const querySnapshot = await getDocs(bookMarkRef);

      // 6101, 6103, 6201, 6335, ... 등 북마크 중 회차에 맞는 id만 필터링
      const filteredIds = [];
      querySnapshot.forEach((doc) => {
        if (doc.id.substring(0, 2) === examDocId.substring(0, 2)) {
          filteredIds.push(doc.id);
        }
      });

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
      try {
        const savePromises = finalBookMark.map(async (item) => {
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

        await Promise.all(savePromises);

        console.log('FINAL: BOOKMARK SAVED.');
        setIsBookmarkSaved(true); // 모든 북마크 저장이 완료되면 상태 업데이트
      } catch (error) {
        console.error('Data could not be saved. ' + error);
        setIsBookmarkSaved(true); // 오류가 발생해도 상태 업데이트
      }
    };

    if (finalBookMark.length > 0 && isLoggedIn) {
      bookmarkSave();
    }
  }, [finalBookMark]);

  // 최종적으로 북마크 저장 완료 후 결과 화면으로 이동
  useEffect(() => {
    if (isBookmarkSaved) {
      navigate('/practiceResult', {
        state: {
          userChoices,
          problems,
          examDocId,
        },
      });
    }
  }, [isBookmarkSaved]);

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

      if(saveBookMarkArray.length === 0){ // 북마크 없으면 바로 네비게이트
        setIsBookmarkSaved(true);
      }

      setFinalBookMark(saveBookMarkArray); // 북마크 저장 후 네비게이트
    }
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
    <Box style={{ display: 'flex', flexDirection: 'row' }}>
      <ProblemSideBar />
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
                    color={
                      indexBookMark.includes(currentIndex) ? 'gold' : 'gray'
                    }
                  />
                </BookmarkButton>
              ) : null}
            </TopContainer>

            <BottomContainer>
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

              <ImageContainer>
                <ArrowButton onClick={handlePrev} disabled={currentIndex === 0}>
                  <IoIosArrowBack color="white" />
                </ArrowButton>

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

                <ArrowButton
                  onClick={handleNext}
                  disabled={currentIndex === problems.length - 1}
                >
                  <IoIosArrowForward color="white" />
                </ArrowButton>
              </ImageContainer>

              <SubmitButton onClick={handleSubmit}>
                <div>제출</div>
              </SubmitButton>
            </BottomContainer>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ProblemDetail;
