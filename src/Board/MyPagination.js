import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const MyPagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  onPageChange,
}) => {
  // 총 페이지 수 계산
  const count = Math.ceil(totalItems / itemsPerPage);

  const handleChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Stack spacing={2}>
      <Pagination
        count={count}
        page={currentPage}
        onChange={handleChange}
        color="secondary"
        style={{ display: 'flex', height: '30%', width: '100%', marginBottom: '20px' }}
      />
    </Stack>
  );
};

export default MyPagination;
