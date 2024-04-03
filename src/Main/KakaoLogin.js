const KakaoLogin = () => {
    const imgul = "https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9D%B4%EB%AF%B8%EC%A7%80%2F%EC%B9%B4%EC%B9%B4%EC%98%A4%EB%A1%9C%EA%B7%B8%EC%9D%B8.png?alt=media&token=e0bac597-8693-473c-a22d-af6503973f2a";
    const Rest_api_key = '85f26ba1c7ccedc7e759bebd443a72f9'; //REST API KEY
    const redirect_uri = 'http://localhost:3000/'; //Redirect URI
    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

    const handleLogin = () => {
        window.location.href = kakaoURL;
    };

    return (
        <>
            <img src={imgul} alt="카카오 로그인" onClick={handleLogin} style={{ width: '300px', height: '70px', marginTop:50 }} />
        </>
    );
};

export default KakaoLogin;
