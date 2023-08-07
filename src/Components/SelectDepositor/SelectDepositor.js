import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import useDepositorOptions from '../../Hooks/useDepositors';


const SelectDepositor = ({ onChange }) => {
    const depositorOptions = useDepositorOptions();

    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        onChange(selectedOption);
    }, [selectedOption, onChange]);

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
                autoFocus
            />
        </div>
    );
};

export default SelectDepositor;
