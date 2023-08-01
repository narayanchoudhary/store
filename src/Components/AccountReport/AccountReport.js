import React, { useEffect, useState } from 'react';
import styles from './AccountReport.module.css';

const AccountReport = ({ year, depositor }) => {
    console.log('depositor: ', depositor);
    const [openingBalance, setOpeningBalance] = useState({ AccOpeBalDr: 0, AccOpeBalCr: 0, AccOpeBalDate: 0 });
    const [avakData, setAvakData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    console.log('transactions: ', transactions);
    useEffect(() => {
        // Function to send the request to the Express server

        const fetchOpeningBalance = async () => {
            try {
                const response = await fetch('http://narayan:5000/api/sqlquery', {
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
                    console.log('Opeing balance:', data);
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

        depositor && depositor.value && fetchOpeningBalance(); // Call the function to send the request on mount

        const fetchAvak = async () => {
            try {
                const response = await fetch('http://narayan:5000/api/sqlquery', {
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
                                RadRentPerPeriod
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
                                DGPassDeptrId = ${depositor.value + 1}
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
                                RadRentPerPeriod
                            `,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Avak received:', data);
                    setAvakData(data);
                    // Process the received data as needed
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        depositor && depositor.value && fetchAvak(); // Call the function to send the request on mount

        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://narayan:5000/api/sqlquery', {
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
                    console.log('Ledger:', data);
                    setTransactions(data);
                    // Process the received data as needed
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        depositor && depositor.value && fetchTransactions(); // Call the function to send the request on mount

    }, [depositor, year]);

    let balance = openingBalance.AccOpeBalCr - openingBalance.AccOpeBalDr;


    return (
        <div>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th>Date</th>
                        <th>CSR No</th>
                        <th>Item</th>
                        <th>Pkt In</th>
                        <th>Pkt Out</th>
                        <th>Available</th>
                        <th>Particular</th>
                        <th>Debite</th>
                        <th>Credit</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        <tr>
                            <td>{openingBalance.AccOpeBalDate}</td>
                            <td colSpan={6} style={{ textAlign: 'left' }}>Opening Balance.....</td>
                            {
                                openingBalance.AccOpeBalDr !== 0 ?
                                    <>
                                        <td className={`${styles.amount} ${styles.debit}`}>{openingBalance.AccOpeBalDr.toFixed(2)}</td>
                                        <td></td>
                                    </>
                                    :
                                    <>
                                        <td></td>
                                        <td className={`${styles.amount} ${styles.credit}`}>{openingBalance.AccOpeBalCr.toFixed(2)}</td>
                                    </>
                            }
                            <td className={styles.amount}>{
                                balance.toFixed(2)
                            }</td>
                        </tr>
                    }

                    {
                        avakData.map((avak) => {
                            let amount = (avak.DGPassWeightInQuintal * avak.RadRentPerPeriod).toFixed(2);
                            balance = (balance - amount);
                            let style = avak.DReqNo.includes('C') ? styles.chips : styles.rashan;
                            return <tr key={avak.DReqNo} className={style}>
                                <td>01-04-{year.startYear}</td>
                                <td>{avak.DReqNo}</td>
                                <td>{avak.ItemName}</td>
                                <td className={styles.packet}>{avak.DGPassNoOfLUnit}</td>
                                <td className={styles.packet}>{avak.DONoOfLUnit}</td>
                                <td className={styles.packet}>{avak.DGPassNoOfLUnit - avak.DONoOfLUnit}</td>
                                <td className={styles.particular} >{avak.DGPassWeightInQuintal + ' '}x{' ' + avak.RadRentPerPeriod}</td>
                                <td className={`${styles.amount} ${styles.debit}`} >{amount}</td>
                                <td></td>
                                <td className={styles.amount} >{balance.toFixed(2)}</td>
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
                                    <td colSpan={5}>{transaction.AccTransNarration}</td>
                                    {
                                        transaction.AccTransType === 'Dr' ?
                                            <>
                                                <td className={`${styles.amount} ${styles.debit}`}> {transaction.AccTransDr.toFixed(2)}</td>
                                                <td> </td>
                                            </>
                                            :
                                            <>
                                                <td></td>
                                                <td className={`${styles.amount} ${styles.credit}`} > {transaction.AccTransCr.toFixed(2)}</td>
                                            </>

                                    }
                                    <td className={styles.amount} >{balance.toFixed(2)}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
        </div>
    )
};

export default AccountReport;
