import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const SelectDepositor = ({ onChange }) => {
    const [depositorOptions, setDepositorOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        onChange(selectedOption);
    }, [selectedOption, onChange]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://narayan:5000/api/sqlquery', {
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


    // Custom styles to capitalize the options
    const customStyles = {
        option: (provided) => ({
            ...provided,
            textTransform: 'capitalize',
        }),
        singleValue: (provided) => ({
            ...provided,
            textTransform: 'capitalize',
        }),
        menu: (provided) => ({
            ...provided,
            width: "max-content",
            minWidth: "100%"
        }),
    };

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };


    return (
        <div style={{ flex: 1 }}>

            <Select
                options={depositorOptions}
                value={selectedOption}
                onChange={(selectedOption) => { setSelectedOption(selectedOption); }}
                styles={customStyles}
                isClearable
                isSearchable
                placeholder='Select Depositor'
            />
        </div>
    );
};

export default SelectDepositor;
