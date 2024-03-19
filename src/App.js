import { Route, Routes, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './state';
import Home from './Main/Home';
import About from './Main/About';

import BoardScreen from './Board/BoardScreen';
import PostCreate from './Board/PostCreate';
import PostDetail from './Board/PostDetail';
import QuizGame from './Game/QuizGame';
import UnsolvedScreen from './Game/UnsolvedScreen';
import './css/App.css'; // App.css 파일을 import

const logo =
  'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EC%9B%B9%ED%99%88%EB%9D%BC%EB%B2%A8.jpg?alt=media&token=63425a12-b57b-4035-aa33-f5b11a2f5067';

//여기에 네비게이션 추가.
const App = () => (
  <div style={{ height: '100vh' }}>
    <div className="header">
      <Link to="/">
        <img src={logo} alt="Logo" style={{ marginLeft: '1em' }} />
      </Link>
      <div className="right-align">
        <span>로그인</span>
        <span>회원가입</span>
      </div>
    </div>
    <div className="content" style={{ height: '93%', overflowY: 'hidden' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/boardScreen" element={<BoardScreen />} />

        <Route path="/postCreate" element={<PostCreate />} />
        <Route path="/postDetail" element={<PostDetail />} />

        <Route path="/quizGame" element={<QuizGame />} />
        <Route path="/unsolvedScreen" element={<UnsolvedScreen />} />
      </Routes>
    </div>
  </div>
);
export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
