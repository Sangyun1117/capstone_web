import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
const element = document.getElementById('root')
const root = createRoot(element);
root.render(
<BrowserRouter>
<App />
</BrowserRouter>
);