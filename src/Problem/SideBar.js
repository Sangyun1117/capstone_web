import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Navigation } from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import '../css/Problem.css';

export function ProblemSideBar() {
  const navigate = useNavigate(); // 네비게이션 훅 사용

  return (
    <Box className="sidebar-container">
      <Typography style={{ paddingLeft: '10%', fontSize: '150%' }}>
        문제풀이
      </Typography>
      <Navigation
        onSelect={({ itemId }) => {
          if (itemId.startsWith('/')) navigate(itemId);
        }}
        items={[
          {
            title: '기출문제',
            itemId: '/practiceRoundSelect',
          },
          {
            title: '시대별 풀이',
            itemId: 'era',
            subNav: [
              {
                title: '전삼국시대',
                itemId: '/eraProblem/era1',
              },
              {
                title: '삼국시대',
                itemId: '/eraProblem/era2',
              },
              {
                title: '남북국시대',
                itemId: '/eraProblem/era3',
              },
              {
                title: '후삼국시대',
                itemId: '/eraProblem/era4',
              },
              {
                title: '고려',
                itemId: '/eraProblem/era5',
              },
              {
                title: '조선',
                itemId: '/eraProblem/era6',
              },
              {
                title: '개항기',
                itemId: '/eraProblem/era7',
              },
              {
                title: '일제강점기',
                itemId: '/eraProblem/era8',
              },
              {
                title: '해방이후',
                itemId: '/eraProblem/era9',
              },
            ],
          },
          {
            title: '유형별 풀이',
            itemId: 'type',
            subNav: [
              {
                title: '사건',
                itemId: '/typeProblem/type1',
              },
              {
                title: '유물',
                itemId: '/typeProblem/type2',
              },
              {
                title: '인물',
                itemId: '/typeProblem/type3',
              },
              {
                title: '문화',
                itemId: '/typeProblem/type4',
              },
              {
                title: '장소',
                itemId: '/typeProblem/type5',
              },
              {
                title: '그림',
                itemId: '/typeProblem/type6',
              },
              {
                title: '제도',
                itemId: '/typeProblem/type7',
              },
              {
                title: '조약',
                itemId: '/typeProblem/type8',
              },
              {
                title: '기구',
                itemId: '/typeProblem/type9',
              },
              {
                title: '단체',
                itemId: '/typeProblem/type10',
              },
              {
                title: '미분류',
                itemId: '/typeProblem/type11',
              },
            ],
          },
          {
            title: '킬러문제',
            itemId: '/killerProblem',
          },
        ]}
      />
    </Box>
  );
}

export function MyPageSideBar() {
  const navigate = useNavigate(); // 네비게이션 훅 사용
  return (
    <Box className="sidebar-container">
      <Typography style={{ paddingLeft: '10%', fontSize: '150%' }}>
        나의 풀이정보
      </Typography>
      <Navigation
        onSelect={({ itemId }) => {
          if (itemId.startsWith('/')) navigate(itemId);
        }}
        items={[
          {
            title: '오답노트',
            itemId: '/wrongProblem',
          },
          {
            title: '북마크',
            itemId: '/bookmarkProblem',
          },
          {
            title: '통계',
            itemId: '/statistics',
          },
        ]}
      />
    </Box>
  );
}

export function MediaSideBar() {
  const navigate = useNavigate(); // 네비게이션 훅 사용
  return (
    <Box className="sidebar-container">
      <Typography style={{ paddingLeft: '10%', fontSize: '150%' }}>
        미디어
      </Typography>
      <Navigation
        onSelect={({ itemId }) => {
          if (itemId.startsWith('/')) navigate(itemId);
        }}
        items={[
          {
            title: '역사이야기',
            itemId: '/historyTales',
          },
          {
            title: '즐겨찾는영상',
            itemId: '/likedVideos',
          },
          {
            title: '게임',
            itemId: '/quizGame',
          },
          {
            title: '용어사전',
            itemId: '/dictionaryHome',
          },
        ]}
      />
    </Box>
  );
}
