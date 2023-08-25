import React, { useEffect, useState } from 'react';
import Select, { createFilter } from 'react-select';
import useDepositorOptions from '../../Hooks/useDepositors';

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

const SelectDepositor = ({ onChange }) => {
    // Fetch depositor options using the custom hook
    const depositorOptions = useDepositorOptions();

    // State to store selected address, selected depositor, and unique addresses
    const [selectedAddress, setSelectedAddress] = useState({ value: 'All', label: 'All' });
    const [selectedDepositor, setSelectedDepositor] = useState(null);

    // Generate unique addresses and sort them alphabetically
    const uniqueAddresses = Array.from(new Set(depositorOptions.map((depositor) => depositor.address))).sort();

    // Add "All" option at the beginning
    uniqueAddresses.unshift('All');

    // Filter depositors based on selected address ('All' means no filter)
    let filteredDepositors;
    if (selectedAddress === null) {
        filteredDepositors = [];
    } else {
        filteredDepositors = selectedAddress.value === 'All'
            ? depositorOptions
            : depositorOptions.filter((depositor) => depositor.address === selectedAddress.value);
    }

    // Notify parent component about selected depositor change
    useEffect(() => {
        onChange(selectedDepositor);
    }, [selectedDepositor, onChange]);

    return (
        <>
            {/* Dropdown for selecting address */}
            <div style={{ width: '30%' }}>
                <Select
                    options={uniqueAddresses.map((address) => ({ value: address, label: address }))}
                    value={selectedAddress}
                    onChange={(selectedAddress) => { setSelectedAddress(selectedAddress); setSelectedDepositor(null); }}
                    styles={customStyles}
                    isClearable
                    isSearchable
                    placeholder='Select Village'
                    filterOption={createFilter({ matchFrom: "start" })}

                />
            </div>

            {/* Dropdown for selecting depositor */}
            <div style={{ width: '50%' }}>
                <Select
                    options={filteredDepositors}
                    value={selectedDepositor}
                    onChange={(selectedDepositor) => { setSelectedDepositor(selectedDepositor); }}
                    styles={customStyles}
                    isClearable
                    isSearchable
                    placeholder='Select Depositor'
                    autoFocus
                    filterOption={createFilter({ matchFrom: "start" })}

                />
            </div>
        </>
    );
};

export default SelectDepositor;
