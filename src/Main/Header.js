import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUserEmail, setLoggedIn } from '../state';
import { useDispatch } from 'react-redux';
import logo from '../Images/logo.png';
import '../css/Header.css';
import swal from 'sweetalert';

const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userEmail = useSelector((state) => state.userEmail);
  const navigate = useNavigate();

  useEffect(() => {
    const localUserEmail = localStorage.getItem('userEmail');
    // 로컬스토리지에 로그인 정보 있으면 로그인 유지 처리
    if (localUserEmail != null) {
      dispatch(setUserEmail(localUserEmail));
      dispatch(setLoggedIn(true));
    }
  }, []);

  const handleLogout = () => {
    swal({
      title: '로그아웃',
      text: '로그아웃 하시겠습니까?',
      icon: 'warning',
      buttons: ['취소', '확인'],
      dangerMode: true,
    }).then((willSubmit) => {
      if (willSubmit) {
        localStorage.removeItem('userEmail');
        dispatch(setUserEmail(null));
        dispatch(setLoggedIn(false));
        navigate('/');
        window.location.reload(); // 페이지를 새로고침합니다.
      }
    });
  };

  const handleLinkClick = (path) => (e) => {
    e.preventDefault(); // 기본 링크 동작 방지
    if (!isLoggedIn) {
      navigate('/login'); // 로그아웃 상태면 로그인 페이지로 리다이렉트
    } else {
      navigate(path); // 로그인 상태면 전달받은 경로로 이동
    }
  };

  return (
    <div className="header">
      <Link to="/" >
        <img src={logo} alt="Logo" style={{ marginLeft: '40px' }} />
      </Link>
      <div className="navList">
        <div className="menu">
          <div className="item">문제풀이</div>
          <div className="menu-content">
            <div className="sub-item">
              <Link to="practiceRoundSelect">기출문제</Link>
            </div>
            <div className="sub-item">
              <Link to="eraProblem/era1">시대별 풀이</Link>
            </div>
            <div className="sub-item">
              <Link to="typeProblem/type1">유형별 풀이</Link>
            </div>
            <div className="sub-item">
              <Link to="killerProblem">킬러문제</Link>
            </div>
            <div className="sub-item">
              <a
                href="recommendationQuestion"
                onClick={handleLinkClick('recommendationQuestion')}
              >
                추천문제
              </a>
            </div>
          </div>
        </div>
        <div className="menu">
          <div className="item">나의 풀이정보</div>
          <div className="menu-content">
            <div className="sub-item">
              <Link to="wrongProblem">오답노트</Link>
            </div>
            <div className="sub-item">
              <Link to="bookmarkProblem">북마크</Link>
            </div>
            <div className="sub-item">
              <Link to="statistics">오답통계</Link>
            </div>
          </div>
        </div>

        <div className="menu">
          <div className="item">미디어</div>
          <div className="menu-content">
            <div className="sub-item">
              <Link to="historyTales">역사이야기</Link>
            </div>
            <div className="sub-item">
              <Link to="likedVideos">즐겨찾는 영상</Link>
            </div>
            <div className="sub-item">
              <Link to="quizGame">게임</Link>
            </div>
            <div className="sub-item">
              <Link to="dictionaryHome">용어사전</Link>
            </div>
            <div className="sub-item">
              <Link to="eventMap">역사지도</Link>
            </div>
          </div>
        </div>
        <div className="menu">
          <Link
            to="boardScreen"
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <div className="item">게시판</div>
          </Link>
        </div>
      </div>
      <div className="right-align">
        {isLoggedIn ? (
          <>
            <span style={{ fontSize: '12px' }}>{userEmail.split('@')[0]}님 환영합니다.</span>
            <button className="white-background-button" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="white-background-button">
              로그인
            </Link>
            <Link to="/createId" className="white-background-button">
              회원가입
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default Header;
