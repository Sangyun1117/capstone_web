import { Route, Routes } from 'react-router-dom';
import './css/App.css'
import { Provider } from 'react-redux';
import store from './state';
import Home from './Main/Home';
import About from './Main/About';
import Login from './Main/Login';
import CreateId from './Main/CreateId';
import Header from './Main/Header';

import BoardScreen from './Board/BoardScreen';
import PostCreate from './Board/PostCreate';
import PostDetail from './Board/PostDetail';
import QuizGame from './Game/QuizGame';
import UnsolvedScreen from './Game/UnsolvedScreen';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const App = () => (
  <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/createId" element={<CreateId />} />

      <Route path="/boardScreen" element={<BoardScreen />} />
      <Route path="/postCreate" element={<PostCreate />} />
      <Route path="/postDetail" element={<PostDetail />} />
      <Route path="/quizGame" element={<QuizGame />} />
      <Route path="/unsolvedScreen" element={<UnsolvedScreen />} />
    </Routes>
  </>
  );
  
export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
