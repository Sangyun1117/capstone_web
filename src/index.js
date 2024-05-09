import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
const element = document.getElementById('root')
const root = createRoot(element);
if (window.Kakao && !window.Kakao.isInitialized()) {
    // JavaScript 키를 사용하여 카카오 SDK 초기화
    window.Kakao.init('52a93a7d9dad3f9f09e39cd75e331fe8');
  }
root.render(
<BrowserRouter>
<App />
</BrowserRouter>
);