import React from 'react';
import KakaoLogin from 'react-kakao-login';
import { firestore } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth 사용
import kakaoLoginImg from '../Images/kakaologin.png';

const SocialLoginKakao = () => {
    const kakaoClientId = '52a93a7d9dad3f9f09e39cd75e331fe8';
    const navigate = useNavigate();

    //카카오톡 로그인 성공시
    const kakaoOnSuccess = async (data) => {
        //dadta에서 카카오 로그인 정보 추출
        const email = data.profile.kakao_account.email;
        const nickname = data.profile.properties.nickname;
        const password = 'FQxNBFBbqUk1ee5';
        const auth = getAuth();

        
        try{
          //로그인 시도. 계정이 있는 경우와 없는 경우로 나뉨
          await signInWithEmailAndPassword(auth, email, password);
          console.log("계정 있음. 바로 로그인");
        }catch (error) {
          //계정이 없을 경우
          console.log(error.code)
          if (error.code === 'auth/invalid-credential') {
            //새 문서 작성과 계정 생성 작업 실행
            console.log("계정 없음. 생성 작업 실행");
            await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(firestore, "users", email), {
                    email: email,
                    name: nickname,
                  });
          }
        }
          localStorage.setItem('userEmail', email);
          navigate('/');
          window.location.reload();
    };

    const kakaoOnFailure = (error) => {
        console.log(error);
    };

    return (
        <KakaoLogin
            token={kakaoClientId}
            onSuccess={kakaoOnSuccess}
            onFail={kakaoOnFailure}
            useLoginForm={false} // 이 옵션은 react-kakao-login 라이브러리 버전에 따라 다를 수 있습니다.
            render={({ onClick }) => (
                <img
                    src={kakaoLoginImg}
                    alt="카카오 로그인"
                    onClick={onClick}
                    style={{ cursor: 'pointer', width: '300px', height: '65px', marginTop: 20 }} // 여기에서 이미지 크기를 설정합니다.
                />
            )}
        />
    );
};

export default SocialLoginKakao;
