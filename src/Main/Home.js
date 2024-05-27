import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

//이미지 import
import icon1 from '../Images/icon1.png';
import icon2 from '../Images/icon2.png';
import icon3 from '../Images/icon3.png';
import icon4 from '../Images/icon4.png';
import icon5 from '../Images/icon5.png';
import background from '../Images/background.png';
import bottom1 from'../Images/bottom1.png';
import bottom2 from'../Images/bottom2.png';
import bottom3 from'../Images/bottom3.png';
import end1 from '../Images/end1.jpg';
import end2 from '../Images/end2.jpg';
import end3 from '../Images/end3.png';
import end4 from '../Images/end4.png';

const images = {
  icons: [
    //기출, 시대별, 유형별, 오답노트, 역사이야기
    icon1, icon2, icon3, icon4, icon5  
  ],
  bottom: [
    // 시험일정, 시험장 위치, 원서 접수
    bottom1, bottom2, bottom3
  ],
  end: [
    end1, end2, end3, end4
   
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
      <img src={background} alt="배경이미지" className="main-image" />
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
