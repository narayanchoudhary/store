import React, { useEffect } from 'react';

const Account = () => {
    useEffect(() => {
        // Function to send the request to the Express server
        const fetchData = async () => {
            try {
                const response = await fetch('http://narayan:5000/api/sqlquery', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: 'SELECT * from GM_ItemMaster;', // Replace with your actual SQL query
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Data received:', data);
                    // Process the received data as needed
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData(); // Call the function to send the request on mount
    }, []);

    return <div>Account Component</div>;
};

export default Account;
