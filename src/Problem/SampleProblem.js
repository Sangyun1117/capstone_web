import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  collectionGroup,
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { Box, Typography, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { MyPageSideBar } from './SideBar';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function SampleProblem() {
  const location = useLocation();
  const { data, index } = location.state;
  //const param = 'era';
  const userEmail = useSelector((state) => state.userEmail);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  //const { param } = route.params;
  const [page, setPage] = useState(index);
  const [imageUrl, setImageUrl] = useState(null);
  const [displayProblem, setDisplayProblem] = useState(null);
  const [isWebAnswerOpen, setWebAnswerOpen] = useState(false);
  const [bookMarkList, setBookMarkList] = useState([]);
  const [bookMarkStar, setBookMarkStar] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [problemType, setProblemType] = useState(null);
  const [problemEra, setProblemEra] = useState(null);
  const toggleWebAnswer = () => {
    setWebAnswerOpen((prev) => {
      if (!prev) getAnswer();
      return !prev;
    });
  };

  const getData = async (item) => {
    try {
      const subCollectionId = String(Math.floor(parseInt(item) / 100));
      const docRef = doc(
        firestore,
        'exam round',
        subCollectionId,
        subCollectionId,
        item
      );
      const docSnap = await getDoc(docRef);
      setImageUrl(docSnap.data().img);
      console.log(docSnap.data().id);
      setProblemType(docSnap.data().type);
      setProblemEra(docSnap.data().era);
      // setProblems(newProblems);
      setDisplayProblem(docSnap.data().id);
      if (isLoggedIn) getBookMark(docSnap.data().id);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAnswer = async () => {
    try {
      const docRef = doc(
        firestore,
        'answer round',
        String(Math.floor(parseInt(displayProblem) / 100)),
        String(Math.floor(parseInt(displayProblem) / 100)),
        displayProblem
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAnswer(docSnap.data());
        console.log('Document data:', docSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addBookMark = async () => {
    await setDoc(
      doc(firestore, 'users', userEmail, 'bookMark', displayProblem),
      {}
    );
    setBookMarkList([...bookMarkList, displayProblem]);
  };
  const deleteBookMark = async () => {
    await deleteDoc(
      doc(firestore, 'users', userEmail, 'bookMark', displayProblem)
    );
    const newArray = bookMarkList.filter((item) => item !== displayProblem);
    setBookMarkList(newArray);
  };
  const getBookMark = async (firstProblem) => {
    try {
      var firstBookMark = [];
      const querySnapshot = await getDocs(
        collection(firestore, 'users', userEmail, 'bookMark')
      );
      querySnapshot.forEach((doc) => {
        firstBookMark.push(doc.id);
        console.log(doc.id, ' => ', doc.data());
      });
      setBookMarkList(firstBookMark);
      if (firstBookMark.includes(firstProblem)) {
        console.log('체크 true' + firstProblem);
        setBookMarkStar(true);
      } else {
        console.log('체크 false' + firstProblem);
        setBookMarkStar(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePrevious = () => {
    if (page > 0) {
      const newPage = page - 1;
      setPage(newPage);
      getData(data[newPage]);
      setWebAnswerOpen(false);
    }
  };

  const handleNext = () => {
    if (page + 1 < data.length) {
      const newPage = page + 1;
      setPage(newPage);
      getData(data[newPage]);
      setWebAnswerOpen(false);
    }
  };

  const handleBookMark = () => {
    if (!bookMarkStar) {
      setBookMarkStar(true);
      addBookMark();
    } else {
      setBookMarkStar(false);
      deleteBookMark();
    }
  };

  useEffect(() => {
    console.log(data[index]);
    getData(data[index]);
  }, []); //컴포넌트가 마운트될 때만 실행

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <MyPageSideBar />
      <Box
        style={{
          width: '50%',
        }}
      >
        <Box>
          <Typography
            style={{
              fontSize: '25px',
              paddingLeft: '8%',
              paddingTop: '5%',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            북마크
          </Typography>
        </Box>
        <Box
          style={{
            paddingLeft: '8%',
            paddingRight: '12%',
            paddingTop: '1%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography style={{ fontSize: '120%' }}>
            한국사 능력 검정 시험 {Math.floor(parseInt(displayProblem) / 100)}회{' '}
            {parseInt(displayProblem) % 100}번
          </Typography>

          <Box>
            {isLoggedIn && (
              <Button
                onClick={handleBookMark}
                variant="outlined"
                color="primary"
              >
                {bookMarkStar ? (
                  <Box style={{ display: 'flex', flexDirection: 'row' }}>
                    <StarIcon sx={{ color: '#FFFF00' }} />
                    <Typography>북마크 해제</Typography>
                  </Box>
                ) : (
                  <Box style={{ display: 'flex', flexDirection: 'row' }}>
                    <StarBorderIcon sx={{ color: '#000000' }} />
                    <Typography>북마크 등록</Typography>
                  </Box>
                )}
              </Button>
            )}{' '}
            <Button
              onClick={toggleWebAnswer}
              variant="outlined"
              color="primary"
            >
              {isWebAnswerOpen ? (
                <Typography>해설 닫기</Typography>
              ) : (
                <Typography>해설 보기</Typography>
              )}
            </Button>
          </Box>
        </Box>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingLeft: '8%',
            paddingTop: '1%',
          }}
        >
          <span style={{ backgroundColor: 'lightBlue' }}>&nbsp;</span>
          <Typography style={{ paddingRight: '1%' }}>&nbsp;시대: </Typography>
          {problemEra && (
            <Typography style={{ paddingRight: '12%' }}>
              {problemEra}
            </Typography>
          )}
          <span style={{ backgroundColor: 'lightBlue' }}>&nbsp;</span>
          <Typography style={{ paddingRight: '1%' }}>&nbsp;유형: </Typography>
          {problemType &&
            problemType.map((type, index) => (
              <Typography key={index}>
                {type}
                {index !== problemType.length - 1 && <span>,&nbsp;</span>}
              </Typography>
            ))}
        </Box>

        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '5%',
          }}
        >
          {imageUrl && (
            <img
              key={imageUrl}
              src={imageUrl}
              alt="Image"
              style={{ width: '50%', aspectRatio: 1, marginBottom: 10 }}
              resizeMode="contain"
            />
          )}
          {isWebAnswerOpen && (
            <Box
              style={{ width: '50%', overflowY: 'auto', maxHeight: '400px' }}
            >
              <Typography>정답 : {answer?.answer}번</Typography>
              <Typography
                style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}
              >
                {'\n'}해설
              </Typography>
              <Typography>{answer?.commentary}</Typography>
              <Typography
                style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}
              >
                {'\n'}오답 해설
              </Typography>
              <Typography>{answer?.wrongCommentary}</Typography>
            </Box>
          )}
        </Box>
        <hr />
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={handlePrevious}
            variant="contained"
            style={{ marginLeft: '10%' }}
          >
            이전 문제
          </Button>
          <Typography>
            {page + 1}/{data.length}
          </Typography>
          <Button
            onClick={handleNext}
            variant="contained"
            style={{ marginRight: '10%' }}
          >
            다음 문제
          </Button>
        </Box>
        <hr />
      </Box>
    </div>
  );
}
