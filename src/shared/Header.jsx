import styles from './Header.module.css';
import logo from '../assets/todo.png'
import { NavLink } from 'react-router';

function Header({
  title
}) {

  return (
    <>
      <div className={styles.header}>
        <img src={logo} className={styles.logo} />
        <h1>{title}</h1>
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.active : styles.inactive} >Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? styles.active : styles.inactive}>About</NavLink>
        </nav>
      </div>
    </>
  );
}

export default Header