import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const options = [
    { value: 1, label: '2023-2024', startYear: '2023', endYear: '2024' },
    { value: 2, label: '2022-2023', startYear: '2022', endYear: '2023' },
    { value: 3, label: '2021-2022', startYear: '2021', endYear: '2022' },
]

const SelectYear = ({ onChange }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        onChange(selectedOption);
    }, [selectedOption, onChange]);

    useEffect(() => {
        setSelectedOption(options[0])
    }, []);

    return (
        <div>
            <Select
                options={options}
                value={selectedOption}
                onChange={(selectedOption) => { setSelectedOption(selectedOption); }}
                isSearchable={false}
            />
        </div>
    );
};

export default SelectYear;
