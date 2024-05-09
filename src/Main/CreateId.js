import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import '../css/Login.css';

const CreateId = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkpassword, setcheckPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (!isValidEmail(email)) {
        throw new Error('유효한 이메일 주소를 입력하세요.');
      }
      if (password !== checkpassword) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      if (!isValidPassword(password)) {
        throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
      }
      if (!isValidName(name)) {
        throw new Error('유효한 이름을 입력하세요.');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      try {
        await setDoc(doc(firestore, "users", email), {
          email: email,
          name: name,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      console.log('Successfully signed up:', user.uid);
      alert("회원가입이 완료되었습니다.");
      navigate('/login');

    } catch (error) {
      if(error.code === 'auth/email-already-in-use'){
        setError("이미 사용중인 이메일입니다.");
      }
      else{
        setError(error.message);
      }
    }
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const isValidName = (name) => {
    return name.trim() !== '';
  };

  return (
    <div className="logincontainer">
      <div className="form">
        <h2 className="center">회원가입</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSignUp}>
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


          <div className="input-field">
            <input
              type="password"
              value={checkpassword}
              onChange={(e) => setcheckPassword(e.target.value)}
              placeholder="Password check"
              style={{ width: '290px', height: '30px', fontSize: '15px' }}
            />
          </div>

          <div className="input-field">
            <input
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              style={{ width: '290px', height: '30px', fontSize: '15px' }}
            />
          </div>
          <button type="submit" class="login-button">가입하기</button>
        </form>
      </div>
    </div>
  );
};

export default CreateId;
