import { Link } from "react-router-dom";
import styles from './Home.module.css';

const Home = () => {
    return <div className={styles.outermost}>
        <div className={styles.secondOuter}>
            <Link to={'/root'}>Single Ledger</Link>
            <Link to={'/AvakRegister'}>Avak Register</Link>
            <Link to={'/khate'}>Khate</Link>
            <Link to={'/list'}>List</Link>
        </div>
    </div>
}

export default Home;