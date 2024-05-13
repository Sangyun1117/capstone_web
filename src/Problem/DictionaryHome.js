import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { Box, Typography, Button } from '@mui/material';
import { query, collection, getDocs, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { MediaSideBar } from './SideBar';

export default function DictionaryHome() {
  const userEmail = 'aaa@aaa.com';
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const MAX_ITEM = 10; // 한 페이지에 표시될 아이템 수
  const pageNumberLimit = 5;
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5); // 현재 보이는 페이지 번호의 최대값
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0); // 현재 보이는 페이지 번호의 최소값

  const getData = async () => {
    var datas = [];
    const collRef = collection(firestore, 'dictionary', 'character', '조선');
    const q = query(collRef, orderBy('eid'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      datas.push({ name: doc.id, ...doc.data() });
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
        paddingTop: '10%',
      }}
    >
      <MediaSideBar />
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
          용어사전
        </Typography>
        <List dense={true} style={{ paddingTop: '10%' }}>
          {currentItems.map((word, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                onClick={() =>
                  navigate('/dictionary', {
                    state: {
                      id: word.eid,
                    },
                  })
                }
                style={{ cursor: 'pointer' }}
              >
                <span style={{ paddingRight: '5%' }}>
                  {index + 1 + (currentPage - 1) * MAX_ITEM}
                </span>

                {word.name}
              </ListItemText>
            </ListItem>
          ))}
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
          {pageNumbers.map((number) => {
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
          })}
          <Button
            onClick={handleNextBtn}
            disabled={currentPage === pageNumbers[pageNumbers.length - 1]}
          >
            다음
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
