import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { query, collection, getDocs, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { MediaSideBar } from './SideBar';

export default function DictionaryHome() {
  // const userEmail = 'aaa@aaa.com';
  const navigate = useNavigate();
  const [type, setType] = useState('character');
  const [era, setEra] = useState('고려');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const MAX_ITEM = 10; // 한 페이지에 표시될 아이템 수
  const pageNumberLimit = 5;
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5); // 현재 보이는 페이지 번호의 최대값
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0); // 현재 보이는 페이지 번호의 최소값

  const handleChangeType = (event) => {
    setType(event.target.value);
    setCurrentPage(1);
  };
  const handleChangeEra = (event) => {
    setEra(event.target.value);
    setCurrentPage(1);
  };

  const getData = async () => {
    var datas = [];
    const collRef = collection(firestore, 'dictionary', type, era);
    const q = query(collRef, orderBy('eid'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      datas.push({ name: doc.id, ...doc.data() });
    });
    setData(datas);
  };

  useEffect(() => {
    getData();
  }, [era, type]);

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
      <MediaSideBar />
      <Box
        style={{
          width: '50%',
          minWidth: '600px',
        }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: '8%',
          }}
        >
          <Typography
            style={{
              fontSize: '25px',
              paddingLeft: '8%',
              fontWeight: 'bold',
              textDecoration: 'underline',
              paddingRight: '30%',
            }}
          >
            용어사전
          </Typography>
          <FormControl style={{ width: '20%', paddingRight: '2%' }}>
            <InputLabel id="era-select-label">Type</InputLabel>
            <Select
              labelId="era-select-label"
              id="era-select"
              value={era}
              label="Era"
              onChange={handleChangeEra}
              sx={{ height: '30px', '.MuiSelect-select': { height: '50px' } }}
            >
              <MenuItem value={'전삼국'}>전삼국</MenuItem>
              <MenuItem value={'삼국'}>삼국</MenuItem>
              <MenuItem value={'남북국'}>남북국</MenuItem>
              <MenuItem value={'후삼국'}>후삼국</MenuItem>
              <MenuItem value={'고려'}>고려</MenuItem>
              <MenuItem value={'조선'}>조선</MenuItem>
              <MenuItem value={'개항기'}>개항기</MenuItem>
              <MenuItem value={'일제강점기'}>일제강점기</MenuItem>
              <MenuItem value={'해방이후'}>해방이후</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{ width: '20%' }}>
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={type}
              label="Type"
              onChange={handleChangeType}
              sx={{ height: '30px', '.MuiSelect-select': { height: '50px' } }}
            >
              <MenuItem value={'character'}>인물</MenuItem>
              <MenuItem value={'incident'}>사건</MenuItem>
              <MenuItem value={'agency'}>단체</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <List
          dense={true}
          style={{ paddingTop: '7%', paddingLeft: '10%', paddingRight: '10%' }}
        >
          {currentItems.length > 0 ? (
            currentItems.map((word, index) => (
              <ListItem key={index}>
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
              currentPage === pageNumbers[pageNumbers.length - 1] ||
              currentItems.length === 0
            }
          >
            다음
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
