import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { Box, Typography, Button } from '@mui/material';
import { query, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { MyPageSideBar } from './SideBar';
import Modal from 'react-modal';

export default function BasicProblemList({ param }) {
  const userEmail = 'aaa@aaa.com';
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
    getData();
  }, []);

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
          width: '40%',
        }}
      >
        <Typography
          style={{
            fontSize: '25px',
            paddingLeft: '8%',
            paddingTop: '5%',
            fontWeight: 'bold',
            textDecoration: 'underline',
          }}
        >
          {param === 'bookMark' ? '북마크' : '오답노트'}
        </Typography>
        <List dense={true} style={{ paddingTop: '10%' }}>
          {currentItems.length > 0 ? (
            currentItems.map((problem, index) => (
              <ListItem
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
                <ListItemText>
                  {index + 1 + (currentPage - 1) * MAX_ITEM}
                </ListItemText>
                <ListItemText
                  onClick={() =>
                    navigate('/sample', {
                      state: {
                        data: data,
                        index: index + (currentPage - 1) * MAX_ITEM,
                      },
                    })
                  }
                  style={{ cursor: 'pointer' }}
                >
                  한국사 능력 검정 시험 {Math.floor(parseInt(problem) / 100)}회{' '}
                  {parseInt(problem) % 100}번
                </ListItemText>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="작성 글이 없습니다" />
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
      {/* <ProblemDeleteModal
        isOpen={isProblemDeleteModalOpen}
        onClose={closeProblemDeleteModal}
        problemName={deleteSelectedProblem}
      ></ProblemDeleteModal> */}
    </Box>
  );
}

// const ProblemDeleteModal = ({ isOpen, onClose, problemName }) => {
//   if (!isOpen) {
//     return null; // 카드 모달이 닫혀있으면 아무것도 렌더링하지 않음
//   }
//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       className="delete-modal"
//       overlayClassName="modal-overlay"
//     >
//       <h3 style={{ fontSize: '18px' }}>
//         <span style={{ color: 'red' }}>{problemName}</span>을 삭제하시겠습니까?
//       </h3>
//       <div className="modal-button">
//         <Button
//           variant="outlined"
//           onClick={onClose}
//           style={{ marginRight: '10px' }}
//         >
//           취소
//         </Button>
//         <Button variant="outlined" color="error">
//           삭제
//         </Button>
//       </div>
//     </Modal>
//   );
// };
