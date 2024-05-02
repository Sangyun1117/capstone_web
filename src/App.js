import { Route, Routes } from 'react-router-dom';
import './css/App.css'
import { Provider } from 'react-redux';
import store from './state';
import Home from './Main/Home';
import About from './Main/About';
import Login from './Main/Login';
import CreateId from './Main/CreateId';
import Header from './Main/Header';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import Statistics from './Statistics/Statistics';

import BoardScreen from './Board/BoardScreen';
import PostCreate from './Board/PostCreate';
import PostDetail from './Board/PostDetail';
import QuizGame from './Game/QuizGame';
import UnsolvedScreen from './Game/UnsolvedScreen';

import PracticeResult from './Practice/PracticeResult';
import PracticeRoundSelect from './Practice/PracticeRoundSelect';
import ProblemCommentary from './Practice/ProblemCommentary';
import ProblemDetail from './Practice/ProblemDetail';

import HistoryTalesScreen from './HistoryTales/HistoryTalesScreen'
import LikedVideosScreen from './HistoryTales/LikedVideosScreen'
import Modal from 'react-modal';
import EventMap from './Map/EventMap';

Modal.setAppElement('#root');
Chart.register(ChartDataLabels);  //차트 레이블 추가 코드
const App = () => (

  <>
  
    <Header />
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/createId" element={<CreateId />} />
      <Route path="/statistics" element={<Statistics />} />

      <Route path="/boardScreen" element={<BoardScreen />} />
      <Route path="/postCreate" element={<PostCreate />} />
      <Route path="/postDetail" element={<PostDetail />} />
      <Route path="/quizGame" element={<QuizGame />} />
      <Route path="/unsolvedScreen" element={<UnsolvedScreen />} />

      <Route path="/practiceResult" element={<PracticeResult />} />
      <Route path="/practiceRoundSelect" element={<PracticeRoundSelect />} />
      <Route path="/problemCommentary" element={<ProblemCommentary />} />
      <Route path="/problemDetail" element={<ProblemDetail />} />

      <Route path="/historyTales" element={<HistoryTalesScreen />} />
      <Route path="/likedVideos" element={<LikedVideosScreen />} />
      <Route path="/eventMap" element={<EventMap />} />
    </Routes>
  </>
  );
  
export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
