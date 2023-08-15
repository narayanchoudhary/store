import { useState, useEffect } from "react";
import styles from './NikasDetailsPopup.module.css';

const NikasPopup = ({ avak, onClose }) => {
    const [nikasData, setNikasData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNikasData = async () => {
            try {
                const response = await fetch('http://localhost:5032/api/sqlquery', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            SELECT
                                *,
                                CONVERT(varchar, DODate, 105) AS date
                            FROM
                                GM_DeliveryOrder
                            WHERE
                                DOWhrId = '${avak.DReqId}'
                        `,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Nikas Data:', data);
                    setNikasData(data);
                    setError(null);
                    setLoading(false);
                } else {
                    console.error('Error:', response);
                    const errorResponse = await response.text();
                    setError(errorResponse || response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        avak && fetchNikasData();

    }, [avak]);

    if (!avak) return;

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                <h4 className={styles.heading}>Nikas Details</h4>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <pre>
                        <div className={styles.error}>{error}</div>
                    </pre>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Packet</th>
                                <th>Date</th>
                                <th>Nikas No</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                nikasData.map((nikas) => <tr key={nikas.DOId}>
                                    <td>{nikas.DONoOfLUnit}</td>
                                    <td>{nikas.date}</td>
                                    <td>{nikas.DOReqFormNo}</td>
                                    <td>{nikas.DOCustomerRefNo}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                )}
                <button className={styles.closeButton} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default NikasPopup;
