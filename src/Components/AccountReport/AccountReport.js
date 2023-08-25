import React, { useEffect, useState } from 'react';
import styles from './AccountReport.module.css';
import { formatIndianAmount } from '../../Utilities/Utilites';
import NikasDetailsPopup from '../NikasPopup/NIkasDetailsPopup';

const AccountReport = ({ year, depositor }) => {
    //console.log('depositor: ', depositor);
    const [openingBalance, setOpeningBalance] = useState({ AccOpeBalDr: 0, AccOpeBalCr: 0, AccOpeBalDate: 0 });
    const [avakData, setAvakData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [selectedAvak, setSelectedAvak] = useState(null);

    //console.log('transactions: ', transactions);

    useEffect(() => {

        const fetchOpeningBalance = async () => {
            try {
                const response = await fetch('http://localhost:5032/api/sqlquery', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            SELECT
                                CONVERT(varchar, AccOpeBalDate, 105) AS AccOpeBalDate,
                                AccOpeBalDr,
                                AccOpeBalCr
                            FROM
                                AccLedgerOpeBalance
                            WHERE
                                AccOpeBalDate = '${year.startYear}-04-01'
                            AND 
                                AccOpeBalLedgerId = ${depositor.ledgerId}
                        `,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    //console.log('Opeing balance:', data);
                    if (data.length !== 0)
                        setOpeningBalance(data[0]);
                    else
                        setOpeningBalance({ AccOpeBalDr: 0, AccOpeBalCr: 0, AccOpeBalDate: 0 });
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchAvak = async () => {
            try {
                const response = await fetch('http://localhost:5032/api/sqlquery', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            SELECT
                                ItemName,
                                DGPassNo,
                                DReqNo,
                                DGPassNoOfLUnit,
                                COALESCE(sum(DONoOfLUnit),0) as DONoOfLUnit,
                                DGPassWeightInQuintal,
                                DGPassRemark,
                                CONVERT(varchar, DGPassDate, 105) AS DGPassDate,
                                RadRentPerPeriod,
                                DReqId
                            FROM
                                GM_DepositGatePass
                            JOIN
                                GM_ItemMaster ON GM_DepositGatePass.DGPassItemId = GM_ItemMaster.ItemId
                            JOIN
                                GM_DepositRequest ON GM_DepositRequest.DReqId = GM_DepositGatePass.DGPassId
                            JOIN
                                CM_RentAgreemenDetail ON GM_DepositRequest.DReqAgreementId = CM_RentAgreemenDetail.RadRentAgreementId
                            LEFT JOIN
                                GM_DeliveryOrder ON GM_DepositRequest.DReqId = GM_DeliveryOrder.DOWhrId
                            WHERE
                                DGPassAgentId = ${depositor.value}
                            AND
                                DGPassDate >= '${year.startYear}-01-01'
                            AND
                                DGPassDate <= '${year.endYear}-01-01'
                            GROUP BY
                                SUBSTRING(DReqNo, PATINDEX('%[A-Z]%', DReqNo), 1),
                                ItemName,
                                DGPassDate,
                                DReqNo,
                                DGPassNo,
                                DGPassNoOfLUnit,
                                DGPassWeightInQuintal,
                                DGPassRemark,
                                RadRentPerPeriod,
                                DReqId
                            `,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    //console.log('Avak received:', data);
                    setAvakData(data);
                    // Process the received data as needed
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:5032/api/sqlquery', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            SELECT 
                            CONVERT(varchar, AccTransDate, 105) AS AccTransDateE,
                            AccTransVoucherNo,
                            AccTransType,
                            AccTransCr,
                            AccTransDr,
                            AccTransNarration
                            FROM AccTrans
                            WHERE AccTransEntryId NOT IN (
                                SELECT AccTransEntryId
                                FROM AccTrans
                                WHERE AccTransEntryId IN (
                                    SELECT AccTransEntryId
                                    FROM AccTrans
                                    WHERE AccTransLedgerId = ${depositor.ledgerId}
                                        AND AccTransDate >= '${year.startYear}-04-01'
                                        AND AccTransDate <= '${year.endYear}-03-31'
                                )
                                AND AccTransLedgerId = 3
                            )
                            AND AccTransLedgerId = ${depositor.ledgerId}
                            AND AccTransDate >= '${year.startYear}-04-01'
                            AND AccTransDate <= '${year.endYear}-03-31'
                            ORDER BY AccTransDate
                        `,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    //console.log('Ledger:', data);
                    setTransactions(data);
                    // Process the received data as needed
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (depositor === null) {
            setOpeningBalance(null)
            setAvakData([]);
            setTransactions([]);
        } else {
            fetchOpeningBalance();
            fetchAvak();
            fetchTransactions();
        }

    }, [depositor, year]);

    let balance;
    if (openingBalance) balance = openingBalance.AccOpeBalCr - openingBalance.AccOpeBalDr;



    return (
        <div className={styles.wrapper}>
            <div className={styles.dptrLabel}>{depositor && depositor.label}</div>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th>Date</th>
                        <th>CSR No</th>
                        <th>Item</th>
                        <th>Bharti</th>
                        <th>Pkt In</th>
                        <th>Pkt Out</th>
                        <th>Available</th>
                        <th>Location</th>
                        <th>Particular</th>
                        <th>&nbsp; Debite </th>
                        <th>Credit</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {openingBalance ?
                        <tr>
                            <td>{openingBalance.AccOpeBalDate}</td>
                            <td colSpan={8} style={{ textAlign: 'left' }}>Opening Balance.....</td>
                            {
                                openingBalance.AccOpeBalDr !== 0 ?
                                    <>
                                        <td className={`${styles.amount} ${styles.debit}`}>{formatIndianAmount(openingBalance.AccOpeBalDr)}</td>
                                        <td></td>
                                    </>
                                    :
                                    <>
                                        <td></td>
                                        <td className={`${styles.amount} ${styles.credit}`}>{formatIndianAmount(openingBalance.AccOpeBalCr)}</td>
                                    </>
                            }
                            <td className={styles.amount}>{
                                formatIndianAmount(balance)
                            }</td>
                        </tr>
                        :
                        null
                    }

                    {
                        avakData.map((avak) => {
                            let amount = (avak.DGPassWeightInQuintal * avak.RadRentPerPeriod);
                            let weight = Math.round(avak.RadRentPerPeriod > 100 ? avak.DGPassWeightInQuintal * 100 : avak.DGPassWeightInQuintal);
                            let rate = avak.RadRentPerPeriod > 100 ? avak.RadRentPerPeriod / 100 : avak.RadRentPerPeriod;
                            let bharti = Math.round(weight / avak.DGPassNoOfLUnit);
                            let style = avak.DReqNo.includes('C') ? styles.chips : styles.rashan;
                            let bhartiStyle = bharti > 72 || bharti < 50 ? styles.bhartiWarning : styles.bharti;
                            balance = (balance - amount);
                            return <tr key={avak.DReqNo} className={`${style}`} onClick={() => setSelectedAvak(avak)}>
                                <td>01-04-{year.startYear}</td>
                                <td>{avak.DReqNo}</td>
                                <td>{avak.ItemName}</td>
                                <td className={bhartiStyle}>{bharti}</td>
                                <td className={styles.packet}>{avak.DGPassNoOfLUnit}</td>
                                <td className={styles.packet}>{avak.DONoOfLUnit}</td>
                                <td className={styles.packet}>{avak.DGPassNoOfLUnit - avak.DONoOfLUnit}</td>
                                <td className={styles.location}>{avak.DGPassRemark}</td>
                                <td className={styles.particular} >{weight + ' kg '}x{' ' + rate.toFixed(2)}</td>
                                <td className={`${styles.amount} ${styles.debit}`} >{formatIndianAmount(amount)}</td>
                                <td></td>
                                <td className={styles.amount} >{formatIndianAmount(balance)}</td>
                            </tr>
                        })
                    }
                    {
                        transactions.map((transaction) => {
                            balance = transaction.AccTransType === 'Dr' ? balance - transaction.AccTransDr : balance + transaction.AccTransCr;
                            return (
                                <tr key={transaction.AccTransVoucherNo}>
                                    <td>{transaction.AccTransDateE}</td>
                                    <td>{transaction.AccTransVoucherNo}</td>
                                    <td colSpan={7}>{transaction.AccTransNarration}</td>
                                    {
                                        transaction.AccTransType === 'Dr' ?
                                            <>
                                                <td className={`${styles.amount} ${styles.debit}`}> {formatIndianAmount(transaction.AccTransDr)}</td>
                                                <td> </td>
                                            </>
                                            :
                                            <>
                                                <td></td>
                                                <td className={`${styles.amount} ${styles.credit}`} > {formatIndianAmount(transaction.AccTransCr)}</td>
                                            </>

                                    }
                                    <td className={styles.amount} >{formatIndianAmount(balance)}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
            <NikasDetailsPopup avak={selectedAvak} onClose={() => { setSelectedAvak(null) }} />
        </div>
    )
};

export default AccountReport;
