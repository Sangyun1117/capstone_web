import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const images = {
  main: 'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9B%B9%EB%B0%B0%EA%B2%BD.png?alt=media&token=f474dc62-3b03-45d1-a206-3aec90b3338a',
  icons: [
    //기출, 시대별, 유형별, 오답노트, 역사이야기
    'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%95%84%EC%9D%B4%EC%BD%98%EA%B8%B0%EC%B6%9C1.png?alt=media&token=45fa3185-dbe2-4106-ad10-95899931e22c',
    'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%95%84%EC%9D%B4%EC%BD%98%EC%8B%9C%EB%8C%80%EB%B3%841.png?alt=media&token=cb848315-6fcc-49bb-bf29-226b4a9b868b', 
    'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%95%84%EC%9D%B4%EC%BD%98%EC%9C%A0%ED%98%95%EB%B3%841.png?alt=media&token=7195ff8d-ab17-41f2-83f0-edec5e22736f', 
    'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%95%84%EC%9D%B4%EC%BD%98%EC%98%A4%EB%8B%B5%EB%85%B8%ED%8A%B81.png?alt=media&token=e7ee573a-dde4-4288-974b-37a3ba23c6dc', 
    'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%95%84%EC%9D%B4%EC%BD%98%EC%97%AD%EC%82%AC%EC%9D%B4%EC%95%BC%EA%B8%B01.png?alt=media&token=a6a9e1c3-7587-4c73-93a6-12e301868fbe'
  ],
  bottom: [
    // 시험일정, 시험장 위치, 원서 접수
    'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%8B%9C%ED%97%98%EC%9D%BC%EC%A0%95.png?alt=media&token=9b215c0e-97bf-4a40-b822-b8adec900752', 
    'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%8B%9C%ED%97%98%EC%9E%A5%EC%9C%84%EC%B9%98.png?alt=media&token=6442cd8e-b2cf-4d1e-961e-1ac1a95a953b', 
    'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%9B%90%EC%84%9C%EC%A0%91%EC%88%98.png?alt=media&token=88b005ae-c46a-4f40-9cea-388df96cedfa'
  ],
  end: [
    // 국사편찬위원회, 한국사 데이터베이스, 우리역사넷, 유니코드 한자 검색시스템
    'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EA%B5%AD%EC%82%AC%ED%8E%B8%EC%B0%AC%EC%9C%84%EC%9B%90%ED%9A%8C.jpg?alt=media&token=2389d417-430d-4466-baae-345b0c19f807', 
    'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%ED%95%9C%EA%B5%AD%EC%82%AC%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4.jpg?alt=media&token=168b5172-1e7b-4e6f-8b4c-57b5a10f4b65', 
    'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%9A%B0%EB%A6%AC%EC%97%AD%EC%82%AC%EB%84%B7.png?alt=media&token=9bb425dc-d55c-41a5-b70b-2a5e518a1cfd', 
    'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%ED%95%9C%EC%9E%90%EA%B2%80%EC%83%89.png?alt=media&token=922afe62-c709-4779-bb9c-33d776f26e9b'
  ]
};

const links = [
  'practiceRoundSelect', // 기출 문제
  'eraProblem/era1', // 시대별
  'typeProblem/type1', // 유형별
  'wrongProblem', // 오답 노트
  'historyTales' // 역사 이야기
]

const openUrl = (url) => window.open(url, '_blank');

const Home = () => (
  <div className="container">
    <div>
      <img src={images.main} alt="배경이미지" className="main-image" />
    </div>
    <div className="images-container">
      {images.icons.map((icon, index) => (
        <Link to={links[index]} className="image-container" key={index}>
          <img src={icon} alt={`아이콘${index + 1}`} className="icon" />
          <p>{['기출문제', '시대별 풀이', '유형별 풀이', '오답노트', '역사이야기'][index]}</p>
        </Link>
      ))}
    </div>
    <div className="bottom-container">
      <img
        src={images.bottom[0]}
        alt="시험일정"
        className="image-bottom"
        onClick={() => openUrl('https://www.historyexam.go.kr/pst/list.do?bbs=noti')}
      />
      <img
        src={images.bottom[1]}
        alt="시험장위치"
        className="image-bottom"
        onClick={() => openUrl('https://www.historyexam.go.kr/pageLink.do?link=examArea')}
      />
      <img
        src={images.bottom[2]}
        alt="원서접수"
        className="image-bottom"
        onClick={() => openUrl('https://www.historyexam.go.kr/user/userLgin.do')}
        style={{border: '1px solid black', height: '148px'}}
      />
    </div>
    <div className="end-container">
      {images.end.map((endImage, index) => (
        <img
          key={index}
          src={endImage}
          alt={`엔드아이콘${index + 1}`}
          className="image-end"
          onClick={() => openUrl([
            'https://www.history.go.kr/', // 국사편찬위원회
            'https://db.history.go.kr/', // 한국사 데이터베이스
            'http://contents.history.go.kr/front', // 우리역사넷
            'https://koreanhistory.or.kr/newchar/' // 유니코드 한자 검색시스템
          ][index])}
        />
      ))}
    </div>
  </div>
);

export default Home;
