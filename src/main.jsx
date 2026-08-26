// Production cache refresh
import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  HashRouter,
  Routes,
  Route,
} from 'react-router-dom';

import './styles.css';

import App from './App';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/blog"
          element={<Blog />}
        />

        <Route
          path="/blog/:slug"
          element={<BlogPost />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);