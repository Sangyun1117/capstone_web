import { useLocation } from 'react-router-dom';
import SampleProblem from './SampleProblem';
import BasicProblemList from './BasicProblemList';
export function BookmarkProblem() {
  return <BasicProblemList param={'bookMark'} />;
}
