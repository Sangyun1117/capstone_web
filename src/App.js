import { Route, Routes } from 'react-router-dom';
import './css/App.css';
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

import KillerProblem from './Problem/KillerProblem';
import Dictionary from './Problem/Dictionary';
import {
  Era1Problem,
  Era2Problem,
  Era3Problem,
  Era4Problem,
  Era5Problem,
  Era6Problem,
  Era7Problem,
  Era8Problem,
  Era9Problem,
} from './Problem/EraProblem';

import {
  Type1Problem,
  Type2Problem,
  Type3Problem,
  Type4Problem,
  Type5Problem,
  Type6Problem,
  Type7Problem,
  Type8Problem,
  Type9Problem,
  Type10Problem,
  Type11Problem,
} from './Problem/TypeProblem';
import WrongProblem from './Problem/WrongProblem';
import { BookmarkProblem } from './Problem/BookmarkProblem';
import SampleProblem from './Problem/SampleProblem';

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
      <Route path="/killerProblem" element={<KillerProblem />} />
      <Route path="/eraProblem">
        <Route path="era1" element={<Era1Problem />} />
        <Route path="era2" element={<Era2Problem />} />
        <Route path="era3" element={<Era3Problem />} />
        <Route path="era4" element={<Era4Problem />} />
        <Route path="era5" element={<Era5Problem />} />
        <Route path="era6" element={<Era6Problem />} />
        <Route path="era7" element={<Era7Problem />} />
        <Route path="era8" element={<Era8Problem />} />
        <Route path="era9" element={<Era9Problem />} />
      </Route>
      <Route path="/typeProblem">
        <Route path="type1" element={<Type1Problem />} />
        <Route path="type2" element={<Type2Problem />} />
        <Route path="type3" element={<Type3Problem />} />
        <Route path="type4" element={<Type4Problem />} />
        <Route path="type5" element={<Type5Problem />} />
        <Route path="type6" element={<Type6Problem />} />
        <Route path="type7" element={<Type7Problem />} />
        <Route path="type8" element={<Type8Problem />} />
        <Route path="type9" element={<Type9Problem />} />
        <Route path="type10" element={<Type10Problem />} />
        <Route path="type11" element={<Type11Problem />} />
      </Route>
      <Route path="/dictionary" element={<Dictionary />} />
      <Route path="/wrongProblem" element={<WrongProblem />} />
      <Route path="/bookmarkProblem" element={<BookmarkProblem />} />
      <Route path="/sample" element={<SampleProblem />} />
    </Routes>
  </>
);

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
