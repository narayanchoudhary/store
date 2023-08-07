// useDepositorOptions.js (Custom Hook)
import { useEffect, useState } from 'react';

const useDepositorOptions = () => {
    const [depositorOptions, setDepositorOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/sqlquery', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
              SELECT
                DeptrId,
                DeptrOwnerLedgerId,
                DeptrName,
                DeptrFatherName,
                DeptrAddress
              FROM 
                GM_DepositorMaster
              WHERE
                DeptrIsAgent = 'true'
              ORDER BY
                DeptrName
              `,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();

                    // Process the received data and create options for the Select component
                    let depositorOptions = data.map((element) => ({
                        value: element.DeptrId,
                        label: capitalizeFirstLetter(element.DeptrName) + ' ' + capitalizeFirstLetter(element.DeptrFatherName) + ' ' + capitalizeFirstLetter(element.DeptrAddress),
                        ledgerId: element.DeptrOwnerLedgerId,
                    }));
                    setDepositorOptions(depositorOptions);
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData(); // Call the function on mount
    }, []);

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return depositorOptions;
};

export default useDepositorOptions;
