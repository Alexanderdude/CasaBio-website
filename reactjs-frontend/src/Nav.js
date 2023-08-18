//import modules
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';
//Define the Nav component
const Nav = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li>
          <Link to="/" className={styles.link}>Home</Link>
        </li>
        <li>
          <Link to="/upload" className={styles.link}>Upload</Link>
        </li>
        <li>
          <Link to="/browser" className={styles.link}>Browser</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Nav;