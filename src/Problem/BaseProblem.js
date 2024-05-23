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
import { Container, Box, Typography, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { ProblemSideBar } from './SideBar';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';

export default function BaseProblem({ param, detail }) {
  const userEmail = useSelector((state) => state.userEmail);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const [nowType, setNowType] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [problems, setProblems] = useState([]);
  const [displayProblem, setDisplayProblem] = useState(null);
  const [problemCount, setProblemCount] = useState(0);
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

  const changeData = async () => {
    try {
      setNowType(detail);
      var newProblems = [];

      //킬러문제
      if (!detail) {
        var killerList = [];
        const q = query(collection(firestore, 'killer round'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          killerList.push(doc.id);
          console.log(doc.id);
        });
        console.log('killerList' + killerList);
        for (const item of killerList) {
          const subCollectionId = String(Math.floor(parseInt(item) / 100));
          const docRef = doc(
            firestore,
            'exam round',
            subCollectionId,
            subCollectionId,
            item
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            newProblems = [...newProblems, docSnap];
            console.log('Document data:', docSnap.data());
          } else {
            console.log('No such document!');
          }
        }
      }

      //시대별, 유형별 풀이
      else {
        const parentCollectionId = 'exam round'; // 부모 컬렉션
        const subCollectionIds = [
          '61',
          '62',
          '63',
          '64',
          '65',
          '66',
          '67',
          '68',
        ]; // 자식 컬렉션
        for (const subCollectionId of subCollectionIds) {
          console.log('Selected Problem:', detail);
          const q = query(
            collection(
              firestore,
              parentCollectionId,
              subCollectionId,
              subCollectionId
            ),
            param === 'era'
              ? where('era', '==', detail)
              : where('type', 'array-contains', detail)
          );

          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            newProblems = [...newProblems, doc];
            //console.log(doc.id, ' => ', doc.data());
          });
        }
      }
      setImageUrl(newProblems[0].data().img);
      console.log(newProblems[0].data().id);
      setProblemType(newProblems[0].data().type);
      setProblemEra(newProblems[0].data().era);
      setProblems(newProblems);
      setDisplayProblem(newProblems[0].data().id);
      setProblemCount(1);
      if (isLoggedIn) getBookMark(newProblems[0].data().id);
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
    if (problemCount > 1) {
      const temp = problems[problemCount - 2].data();
      setDisplayProblem(temp.id);
      setImageUrl(temp.img);
      setProblemCount((prevCount) => prevCount - 1);
      setProblemType(temp.type);
      setProblemEra(temp.era);
      if (bookMarkList.includes(temp.id)) {
        console.log('체크 true' + temp.id);
        setBookMarkStar(true);
      } else {
        console.log('체크 false' + temp.id);
        setBookMarkStar(false);
      }
      setWebAnswerOpen(false);
    }
  };

  const handleNext = () => {
    if (problemCount < problems.length) {
      const temp = problems[problemCount].data();
      setDisplayProblem(temp.id);
      setImageUrl(temp.img);
      setProblemCount((prevCount) => prevCount + 1);
      setProblemType(temp.type);
      setProblemEra(temp.era);
      if (bookMarkList.includes(temp.id)) {
        console.log('체크 true' + temp.id);
        setBookMarkStar(true);
      } else {
        console.log('체크 false' + temp.id);
        setBookMarkStar(false);
      }
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
    changeData();
  }, []); //컴포넌트가 마운트될 때만 실행

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <ProblemSideBar itemType={param} />
      {displayProblem ? (
        <Box
          style={{
            width: '60%',
            minWidth: '700px',
          }}
        >
          <Box style={{ paddingTop: '8%' }}>
            {detail ? (
              <Typography
                style={{
                  fontSize: '25px',
                  paddingLeft: '8%',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                }}
              >
                {param === 'era' ? '시대별 풀이' : '유형별 풀이'} - {nowType}
              </Typography>
            ) : (
              <Typography
                style={{
                  fontSize: '25px',
                  paddingLeft: '8%',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                }}
              >
                킬러 문제
              </Typography>
            )}
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
              한국사 능력 검정 시험 {Math.floor(parseInt(displayProblem) / 100)}
              회 {parseInt(displayProblem) % 100}번
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
              paddingBottom: '2%',
            }}
          >
            {imageUrl && (
              <img
                key={imageUrl}
                src={imageUrl}
                alt="Image"
                style={{ width: '50%', height: 'auto', marginBottom: 10 }}
                resizeMode="contain"
              />
            )}
            {isWebAnswerOpen && (
              <Box
                style={{ width: '50%', overflowY: 'auto', maxHeight: '600px' }}
              >
                <Typography>
                  정답 :{' '}
                  <span style={{ color: 'red' }}>{answer?.answer}번</span>
                </Typography>
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
              {problemCount}/{problems.length}
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
      ) : (
        <Box
          style={{
            width: '50%',
            height: '600px',
            minWidth: '700px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}
