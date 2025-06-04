import './App.css'
import styles from './App.module.css';
import Header from './shared/Header';
import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import TodosPage from './pages/TodosPage';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  let location = useLocation();

  const [title, setTitle] = useState('');

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setTitle('Todo List');
        break;
      case "/about":
        setTitle('About');
        break;
      default:
        setTitle('Not Found');
        break;
    }
  }, [location])

  return (
    <>
      <div className={styles.block}>
        <Header title={title} />
        <Routes>
          <Route path="/" element={<TodosPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div >
    </>
  )
}

export default App
