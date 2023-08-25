//import modules
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';

//Define the Nav component
const Nav = () => {
  return (
    <nav className={styles.nav}>
    {/* adds correct styles to nav component */}

      <ul className={styles.ul}>
      {/* adds correct styles to the ul component */}

        <li>
          <Link to="/" className={styles.link}>Home</Link>
          {/* adds a clickable link that navigates to the Home Page */}

        </li>
        <li>
          <Link to="/upload" className={styles.link}>Upload</Link>
          {/* adds a clickable link that navigates to the Upload Page */}

        </li>
        <li>
          <Link to="/browser" className={styles.link}>Browser</Link>
          {/* adds a clickable link that navigates to the Browser Page */}
          
        </li>
      </ul>
    </nav>
  )
}

export default Nav;