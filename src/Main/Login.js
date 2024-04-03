import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import '../css/Login.css';
import KakaoLogin from './KakaoLogin';
import { setUserEmail, setLoggedIn } from '../state';
import { useDispatch } from 'react-redux';

const Login = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('userEmail', email); // 로컬스토리지에 저장
      dispatch(setUserEmail(email)); // 이메일 상태 업데이트
      dispatch(setLoggedIn(true)); // 로그인 상태 업데이트
      navigate('/');  // 로그인 성공 시 홈스크린으로 이동
    } catch (error) {
      setError('로그인 실패. 아이디와 비밀번호를 확인하세요.');
    }
  };

  return (
    <div className="logincontainer">
      <div className="form">
        <h2 className="center" style={{margin:'10px'}}>로그인</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin} style={{ textAlign: 'center' }}>
          <div className="input-field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{ width: '290px', height: '30px', fontSize: '15px' }}
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ width: '290px', height: '30px', fontSize: '15px' }}
            />
          </div>
          <button type="submit" className="login-button">로그인</button>
        </form>
      </div>
      <KakaoLogin />
    </div>
  );
  
};

export default Login;
