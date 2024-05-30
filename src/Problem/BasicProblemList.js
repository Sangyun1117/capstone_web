import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { Box, Typography, Button } from '@mui/material';
import { query, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { MyPageSideBar } from './SideBar';
import Modal from 'react-modal';
import '../css/Problem.css';

export default function BasicProblemList({ param }) {
  const userEmail = useSelector((state) => state.userEmail);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const MAX_ITEM = 10; // 한 페이지에 표시될 아이템 수
  const pageNumberLimit = 5;
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5); // 현재 보이는 페이지 번호의 최대값
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0); // 현재 보이는 페이지 번호의 최소값

  const [isProblemDeleteModalOpen, setProblemDeleteModalOpen] = useState(false); //문제 삭제 모달
  const [deleteSelectedProblem, setDeleteSelectedProblem] = useState(0);
  const openProblemDeleteModal = (problem) => {
    setProblemDeleteModalOpen(true);
    setDeleteSelectedProblem(problem);
  };
  const closeProblemDeleteModal = () => {
    setProblemDeleteModalOpen(false);
  };

  const deleteProblem = async (clickedProblem) => {
    closeProblemDeleteModal();
    const newData = data.filter((problem) => problem !== clickedProblem);
    setData(newData);

    await deleteDoc(doc(firestore, 'users', userEmail, param, clickedProblem));

    const indexOfLastItem = currentPage * MAX_ITEM;
    const indexOfFirstItem = indexOfLastItem - MAX_ITEM;
    const newCurrentItems = newData.slice(indexOfFirstItem, indexOfLastItem);
    // 현재 페이지에 아이템이 없고, 현재 페이지가 첫 페이지가 아니면 이전 페이지로 이동
    if (newCurrentItems.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getData = async () => {
    var datas = [];
    const q = query(collection(firestore, 'users', userEmail, param));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      datas.push(doc.id);
    });
    setData(datas);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      const paramText = param === 'bookMark' ? '북마크' : '오답노트';
      window.alert(paramText + '를 보실려면 로그인을 해주세요');
      navigate('/login');
    } else {
      getData();
    }
  }, [userEmail]);

  const indexOfLastItem = currentPage * MAX_ITEM;
  const indexOfFirstItem = indexOfLastItem - MAX_ITEM;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextBtn = () => {
    setCurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevBtn = () => {
    setCurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / MAX_ITEM); i++) {
    pageNumbers.push(i);
  }

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <MyPageSideBar />
      <Box
        style={{
          width: '60%',
          minWidth: '750px',
        }}
      >
        <Typography
          style={{
            fontSize: '25px',
            paddingLeft: '8%',
            paddingTop: '8%',
            fontWeight: 'bold',
            textDecoration: 'underline',
          }}
        >
          {param === 'bookMark' ? '북마크' : '오답노트'}
        </Typography>
        <List
          dense={true}
          style={{
            paddingTop: '7%',
            paddingLeft: '10%',
            paddingRight: '10%',
            paddingBottom: '5%',
          }}
        >
          <Box
            style={{
              backgroundColor: '#01204E',
              color: 'white',
              height: '30px',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Box
              style={{
                padding: '4px',
                paddingLeft: '10px',
                paddingRight: '10px',
                width: '40px',
                textAlign: 'center',
                borderRight: 'solid 1px',
              }}
            >
              번호
            </Box>
            <Box
              style={{
                padding: '4px',
                width: '100%',
                textAlign: 'center',
              }}
            >
              문제 번호
            </Box>
            <Box
              style={{
                padding: '4px',
                paddingLeft: '10px',
                paddingRight: '10px',
                width: '40px',
                textAlign: 'center',
                borderLeft: 'solid 1px',
              }}
            >
              삭제
            </Box>
          </Box>
          {currentItems.length > 0 ? (
            currentItems.map((problem, index) => (
              <ListItem
                className={`list-item ${index % 2 === 1 ? 'even-item' : ''}`}
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => openProblemDeleteModal(problem)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                {/* <ListItemText style={{ width: '20px' }}>
                  {index + 1 + (currentPage - 1) * MAX_ITEM}
                </ListItemText> */}
                <ListItemText
                  onClick={() =>
                    navigate('/sample', {
                      state: {
                        data: data,
                        index: index + (currentPage - 1) * MAX_ITEM,
                        param: param,
                      },
                    })
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '30px',
                      textAlign: 'center',
                      border: '1px solid',
                    }}
                  >
                    {index + 1 + (currentPage - 1) * MAX_ITEM}
                  </span>
                  <span style={{ paddingLeft: '30%' }}>
                    한국사 능력 검정 시험 {Math.floor(parseInt(problem) / 100)}
                    회 {parseInt(problem) % 100}번
                  </span>
                </ListItemText>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="저장된 문제가 없습니다." />
            </ListItem>
          )}
        </List>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button onClick={handlePrevBtn} disabled={currentPage === 1}>
            이전
          </Button>
          {currentItems.length === 0 ? (
            <Button
              key="1"
              onClick={() => paginate(1)}
              style={{
                fontWeight: currentPage === 1 ? 'bold' : 'normal',
                fontSize: currentPage === 1 ? '120%' : '100%',
              }}
            >
              1
            </Button>
          ) : (
            pageNumbers.map((number) => {
              if (
                number < maxPageNumberLimit + 1 &&
                number > minPageNumberLimit
              ) {
                return (
                  <Button
                    key={number}
                    onClick={() => paginate(number)}
                    style={{
                      fontWeight: currentPage === number ? 'bold' : 'normal',
                      fontSize: currentPage === number ? '120%' : '100%',
                    }}
                  >
                    {number}
                  </Button>
                );
              } else {
                return null;
              }
            })
          )}
          <Button
            onClick={handleNextBtn}
            disabled={
              pageNumbers.length === 0 ||
              currentPage === pageNumbers[pageNumbers.length - 1]
            }
          >
            다음
          </Button>
        </Box>
      </Box>
      <ProblemDeleteModal
        isOpen={isProblemDeleteModalOpen}
        onClose={closeProblemDeleteModal}
        clickedProblem={deleteSelectedProblem}
        deleteProblem={deleteProblem}
      ></ProblemDeleteModal>
    </Box>
  );
}

const ProblemDeleteModal = ({
  isOpen,
  onClose,
  clickedProblem,
  deleteProblem,
}) => {
  if (!isOpen) {
    return null; // 카드 모달이 닫혀있으면 아무것도 렌더링하지 않음
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="delete-modal"
      overlayClassName="modal-overlay"
    >
      <h3 style={{ fontSize: '18px', paddingBottom: '20px' }}>
        <span style={{ color: 'red' }}>
          {Math.floor(parseInt(clickedProblem) / 100)}회{' '}
          {parseInt(clickedProblem) % 100}번
        </span>
        을 삭제하시겠습니까?
      </h3>
      <div className="modal-button">
        <Button
          variant="outlined"
          onClick={onClose}
          style={{ marginRight: '10px' }}
        >
          취소
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => deleteProblem(clickedProblem)}
        >
          삭제
        </Button>
      </div>
    </Modal>
  );
};
