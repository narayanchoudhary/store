import { useState } from 'react';
import AccountReport from '../AccountReport/AccountReport';
import SelectDepositor from '../SelectDepositor/SelectDepositor';
import SelectYear from '../SelectYear/SelectYear';
import styles from './Report.module.css';
const Report = () => {
    const [selectedYear, setSelectedYear] = useState();
    const [selectedDepositor, setSelectedDepositor] = useState(null);
    return (
        <div className={styles.root}>
            <div className={styles.form}>
                <SelectYear onChange={setSelectedYear} />
                <SelectDepositor onChange={setSelectedDepositor} />
            </div>
            <div className={styles.report}>
                <AccountReport year={selectedYear} depositor={selectedDepositor}></AccountReport>
            </div>

        </div>
    )
}

export default Report;

