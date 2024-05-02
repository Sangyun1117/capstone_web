import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css'; // Home.css 파일을 import
const MainImage =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9B%B9%EB%B0%B0%EA%B2%BD.png?alt=media&token=f474dc62-3b03-45d1-a206-3aec90b3338a';
//기출, 시대별, 유형별, 오답노트, 역사이야기 순서
const Imageicon1 =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%95%84%EC%9D%B4%EC%BD%98%EA%B8%B0%EC%B6%9C1.png?alt=media&token=45fa3185-dbe2-4106-ad10-95899931e22c';
const Imageicon2 =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%95%84%EC%9D%B4%EC%BD%98%EC%8B%9C%EB%8C%80%EB%B3%841.png?alt=media&token=cb848315-6fcc-49bb-bf29-226b4a9b868b';
const Imageicon3 =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%95%84%EC%9D%B4%EC%BD%98%EC%9C%A0%ED%98%95%EB%B3%841.png?alt=media&token=7195ff8d-ab17-41f2-83f0-edec5e22736f';
const Imageicon4 =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%95%84%EC%9D%B4%EC%BD%98%EC%98%A4%EB%8B%B5%EB%85%B8%ED%8A%B81.png?alt=media&token=e7ee573a-dde4-4288-974b-37a3ba23c6dc';
const Imageicon5 =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%95%84%EC%9D%B4%EC%BD%98%EC%97%AD%EC%82%AC%EC%9D%B4%EC%95%BC%EA%B8%B01.png?alt=media&token=a6a9e1c3-7587-4c73-93a6-12e301868fbe';

//맨 아랫줄 이미지 모음. 시험일정, 시험장 위치, 국사편찬위원회, 한국사 데이터베이스, 원서접수 순서
const ImageBottom1 =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%8B%9C%ED%97%98%EC%9D%BC%EC%A0%95.png?alt=media&token=9b215c0e-97bf-4a40-b822-b8adec900752';
const ImageBottom2 =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%8B%9C%ED%97%98%EC%9E%A5%EC%9C%84%EC%B9%98.png?alt=media&token=6442cd8e-b2cf-4d1e-961e-1ac1a95a953b';
const ImageBottom3 =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%9B%90%EC%84%9C%EC%A0%91%EC%88%98.png?alt=media&token=88b005ae-c46a-4f40-9cea-388df96cedfa';

const ImageEnd1 =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EA%B5%AD%EC%82%AC%ED%8E%B8%EC%B0%AC%EC%9C%84%EC%9B%90%ED%9A%8C.jpg?alt=media&token=2389d417-430d-4466-baae-345b0c19f807';
const ImageEnd2 =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%ED%95%9C%EA%B5%AD%EC%82%AC%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4.jpg?alt=media&token=168b5172-1e7b-4e6f-8b4c-57b5a10f4b65';
const ImageEnd3 =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%9A%B0%EB%A6%AC%EC%97%AD%EC%82%AC%EB%84%B7.png?alt=media&token=9bb425dc-d55c-41a5-b70b-2a5e518a1cfd';
const ImageEnd4 =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%ED%95%9C%EC%9E%90%EA%B2%80%EC%83%89.png?alt=media&token=922afe62-c709-4779-bb9c-33d776f26e9b';

const ImageBottom1Click = () => {
  //시험일자 바로가기
  const url =
    'https://www.historyexam.go.kr/pst/list.do?bbs=noti&netfunnel_key=643EAE51AD711B455A45EF2511C3C6D7AC377AFF2A8F3E2FEA055DB02C15CB0689A23223CA6D46EE956DD98AA3543D84125B7516085E4A385DEA168E6706A36431EC04EEDFB889C72B391126386E38961CF6BADBB12E604C00464C9F2FE9B694FED063BE1D716BF970330C6A38157F1B312C302C30';
  window.open(url, '_blank');
};

const ImageBottom2Click = () => {
  //시험장 바로가기
  const url =
    'https://www.historyexam.go.kr/pageLink.do?link=examArea&netfunnel_key=A7C6BCE6C1D50D746A073461AD6BB8C00B78D837E48C55A8426BCB6526EC2F9CC0E96849D62F8CD057B58E08BCD55907425B035A14AC0B295C824DBDE5ADAC893D7504703B4DB656754956F6A2967CE75040FF6CCA34DB8A028CF47044B6F18A234B1EEDF2C1E725FD8CB4420BEBC394382C312C302C30';
  window.open(url, '_blank');
};

const ImageBottom3Click = () => {
  //원서접수 바로가기
  const url = 'https://www.historyexam.go.kr/user/userLgin.do';
  window.open(url, '_blank');
};

const ImageEnd1Click = () => {
  //국사편찬위원회 바로가기
  const url = 'https://www.history.go.kr/';
  window.open(url, '_blank');
};

const ImageEnd2Click = () => {
  //한국사 데이터베이스 바로가기
  const url = 'https://db.history.go.kr/';
  window.open(url, '_blank');
};

const ImageEnd3Click = () => {
  //우리역사넷 바로가기
  const url = 'http://contents.history.go.kr/front';
  window.open(url, '_blank');
};

const ImageEnd4Click = () => {
  //한자검색 바로가기
  const url = 'https://koreanhistory.or.kr/newchar/';
  window.open(url, '_blank');
};

const Home = () => (
  <div className="container">
    <div>
      <div>
        <img src={MainImage} alt="배경이미지" className="main-image" />
      </div>
    </div>
    <div className="images-container">
      <div className="image-container">
        <img src={Imageicon1} alt="기출아이콘" className="icon" />
        <p>기출문제</p>
      </div>
      <div className="image-container">
        <img src={Imageicon2} alt="시대별풀이아이콘" className="icon" />
        <p>시대별 풀이</p>
      </div>
      <div className="image-container">
        <img src={Imageicon3} alt="유형별풀이아이콘" className="icon" />
        <p>유형별 풀이</p>
      </div>
      <div className="image-container">
        <img src={Imageicon4} alt="오답노트아이콘" className="icon" />
        <p>오답노트</p>
      </div>
      <div className="image-container">
        <img src={Imageicon5} alt="역사이야기아이콘" className="icon" />
        <p>역사이야기</p>
      </div>
    </div>

    <div className="bottom-container">
      <img
        src={ImageBottom1}
        alt="시험일정"
        className="image-bottom1"
        onClick={ImageBottom1Click}
      />
      <img
        src={ImageBottom2}
        alt="시험장위치"
        className="image-bottom2"
        onClick={ImageBottom2Click}
      />
      <img
        src={ImageBottom3}
        alt="원서접수"
        className="image-bottom3"
        onClick={ImageBottom3Click}
      />
    </div>

    <div className="end-container">
      <img
        src={ImageEnd1}
        alt="기출아이콘"
        className="image-end"
        onClick={ImageEnd1Click}
      />
      <img
        src={ImageEnd2}
        alt="기출아이콘"
        className="image-end"
        onClick={ImageEnd2Click}
      />
      <img
        src={ImageEnd3}
        alt="기출아이콘"
        className="image-end"
        onClick={ImageEnd3Click}
      />
      <img
        src={ImageEnd4}
        alt="기출아이콘"
        className="image-end"
        onClick={ImageEnd4Click}
      />
    </div>
  </div>
);

export default Home;
