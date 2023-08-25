import './AvakRegister.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select'

function AvakRegister() {
  const [data, setData] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [depositors, setDepositors] = useState([]);
  const [items, setItems] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [depositorsFilterOptions, setDepositorsFilterOptions] = useState([]);
  const [itemFilterOptions, setItemFilterOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([{ value: 'Chips', label: 'Chips' }, { value: 'Rashan', label: 'Rashan' }]);
  const [statusOptions, setStatusOptions] = useState([{ value: 'Open', label: 'Open' }, { value: 'Closed', label: 'Closed' }]);

  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [selectedDepositors, setSelectedDepositors] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [csrFilter, setCsrFilter] = useState('');
  const [packetFilter, setPacketFilter] = useState('');
  const [gayeFilter, SetGayeFilter] = useState('');
  const [balanceFilter, setBalanceFilter] = useState('');

  const [totals, setTotals] = useState({
    weight: 0,
    rent: 0,
    packet: 0,
    gaye: 0,
    balance: 0
  });

  useEffect(() => {
    axios.get('http://localhost:5032')
      .then(res => {
        setData(res.data);

        let addresses = [];
        let depositors = [];
        let items = [];
        res.data.forEach(item => {
          addresses.push({ value: item.DeptrAddress, label: item.DeptrAddress, });
          depositors.push({ value: item.DeptrId, label: item.DeptrName + ' ' + item.DeptrFatherName, address: item.DeptrAddress, });
          items.push({ value: item.ItemName, label: item.ItemName, });
        });

        let uniqueAddresses = addresses.filter((value, index, self) => index === self.findIndex((t) => t.value === value.value));
        uniqueAddresses.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
        setAddresses(uniqueAddresses);

        let uniqueDepositors = depositors.filter((value, index, self) => index === self.findIndex((t) => t.value === value.value));
        uniqueDepositors.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
        setDepositors(uniqueDepositors);
        setDepositorsFilterOptions(uniqueDepositors);

        let uniqueItems = items.filter((value, index, self) => index === self.findIndex((t) => t.value === value.value));
        uniqueItems.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
        setItems(uniqueItems);
        setItemFilterOptions(uniqueItems);

      }).catch(err => {
        //console.log(err);
      });
  }, []);

  useEffect(() => {
    let filteredData = [];
    let tselectedAddresses = selectedAddresses.length > 0 ? selectedAddresses : addresses;
    let tselectedDepositors = selectedDepositors.length > 0 ? selectedDepositors : depositors;
    let tselectedItems = selectedItems.length > 0 ? selectedItems : items;
    let tselectedType = selectedType.length > 0 ? selectedType : typeOptions;
    let tselectedStatus = selectedStatus.length > 0 ? selectedStatus : statusOptions;

    let totalOfPacket = 0;
    let totalOfWeight = 0;
    let totalOfRent = 0;
    let totalOfGaye = 0;
    let totalOfBalance = 0;

    data.forEach(d => {
      let weight = d.DGPassWeightInQuintal;
      let type = 'Chips';
      let balance = d.DGPassNoOfLUnit - d.DONoOfLUnit;
      let status = balance ? 'Open' : 'Closed';
      if (d.DReqNo.includes('R')) {
        weight = d.DGPassWeightInQuintal * 100;
        type = 'Rashan';
      }
      if (tselectedAddresses.find(address => address.value === d.DeptrAddress)
        && tselectedDepositors.find(depositor => depositor.value === d.DeptrId)
        && tselectedItems.find(item => item.value == d.ItemName)
        && tselectedStatus.find(s => s.value === status)
        && tselectedType.find(t => t.value === type)
        && (csrFilter === '' || d.DReqNo == csrFilter)
        && (packetFilter === '' || d.DGPassNoOfLUnit == packetFilter)
        && (gayeFilter === '' || d.DONoOfLUnit == gayeFilter)
        && (balanceFilter === '' || balance == balanceFilter)
      ) {
        filteredData.push({ type, balance, status, ...d });
        totalOfPacket += d.DGPassNoOfLUnit;
        totalOfWeight += Math.round(weight);
        totalOfRent += Math.round(d.DGPassWeightInQuintal * d.RadRentPerPeriod);
        totalOfGaye += d.DONoOfLUnit;
        totalOfBalance += balance;
      }
    });

    setFilteredData(filteredData);
    setTotals({
      weight: Math.round(totalOfWeight),
      rent: Math.round(totalOfRent),
      packet: totalOfPacket,
      gaye: totalOfGaye,
      balance: totalOfBalance,
    });
  }, [selectedAddresses, selectedDepositors, selectedType, selectedStatus, selectedItems, csrFilter, packetFilter, gayeFilter, balanceFilter, data]);

  useEffect(() => {
    if (selectedAddresses.length === 0) {
      setDepositorsFilterOptions(depositors);
    }
    else {
      let filteredDepositors = [];
      depositors.forEach(item => {
        if (selectedAddresses.find(address => address.value === item.address)) {
          filteredDepositors.push(item);
        }
      });
      setDepositorsFilterOptions(filteredDepositors);
    }
  }, [selectedAddresses]);

  useEffect(() => {

    if (selectedItems.length === 0) {
      let filteredItems = [];
      items.forEach(item => {
        if (filteredData.find(data => data.ItemName === item.value)) {
          filteredItems.push(item);
        }
      });
      setItemFilterOptions(filteredItems);
    }
  }, [filteredData, selectedItems]);

  return (
    <div className='avak-register'>
      <div className='flex-container topSticky'>
        <div className=' flex-items address filter-container'>
          <Select
            options={addresses}
            isMulti
            onChange={(selectedAddresses) => setSelectedAddresses(selectedAddresses)}
            placeholder='Address'
            components={selectedAddresses.length != 0 ? { DropdownIndicator: () => null, IndicatorSeparator: () => null } : null}
            isClearable={selectedAddresses.length === 0}
          />
        </div>
        <div className=' flex-items name filter-container'>
          <Select
            isMulti
            options={depositorsFilterOptions}
            onChange={(selectedDepositors) => setSelectedDepositors(selectedDepositors)}
            placeholder='Depositor'
            components={selectedDepositors.length != 0 ? { DropdownIndicator: () => null, IndicatorSeparator: () => null } : null}
            isClearable={selectedDepositors.length === 0}
          />
        </div>
        <div className=' flex-items type filter-container'>
          <Select
            isMulti
            options={typeOptions}
            onChange={(selectedType) => setSelectedType(selectedType)}
            placeholder='Type'
            components={selectedType.length != 0 ? { DropdownIndicator: () => null, IndicatorSeparator: () => null } : null}
            isClearable={selectedType.length === 0}
          />
        </div>
        <div className=' flex-items status filter-container'>
          <Select
            isMulti
            options={statusOptions}
            onChange={(selectedStatus) => setSelectedStatus(selectedStatus)}
            placeholder='Status'
            components={selectedStatus.length != 0 ? { DropdownIndicator: () => null, IndicatorSeparator: () => null } : null}
            isClearable={selectedStatus.length === 0}
          />
        </div>

        <div className=' flex-items item filter-container'>
          <Select
            isMulti
            options={itemFilterOptions}
            onChange={(selectedItems) => setSelectedItems(selectedItems)}
            placeholder='Item'
            components={selectedItems.length != 0 ? { DropdownIndicator: () => null, IndicatorSeparator: () => null } : null}
            isClearable={selectedItems.length === 0}
          />
        </div>
        <div className=' flex-items receipt-number'>
          <input
            className='filters input-filters'
            type='text'
            value={csrFilter}
            onChange={(event) => setCsrFilter(event.target.value)}
            placeholder='CSR'
          />
        </div>
        <div className=' flex-items packet'>
          <input
            className='filters input-filters'
            type='text'
            value={packetFilter}
            onChange={(event) => setPacketFilter(event.target.value)}
            placeholder='Packet'
          />
        </div>
        <div className=' flex-items gaye'>
          <input
            className='filters input-filters'
            type='text'
            value={gayeFilter}
            onChange={(event) => SetGayeFilter(event.target.value)}
            placeholder='Gaye'
          />
        </div>
        <div className=' flex-items balancee'>
          <input
            className='filters input-filters'
            type='text'
            value={balanceFilter}
            onChange={(event) => setBalanceFilter(event.target.value)}
            placeholder='Balance'
          />
        </div>
        <div className=' flex-items weight'>
          <input
            className='filters input-filters'
            type='text'
            value={balanceFilter}
            onChange={(event) => setBalanceFilter(event.target.value)}
            placeholder='Weight'
          />
        </div>
        <div className=' flex-items amount'>
          <input
            className='filters input-filters'
            type='text'
            value={balanceFilter}
            onChange={(event) => setBalanceFilter(event.target.value)}
            placeholder='Amount'
          />
        </div>
        <div className='flex-items location'>

        </div>
        <div className='flex-items hammali'>

        </div>

        {/*<div className=' flex-items packet'><input className='filters' type='text' /></div>
        <div className=' flex-items weight'><input className='filters' type='text' /></div>
        <div className=' flex-items location'><input className='filters' type='text' /></div> */}
      </div>
      {filteredData.map((item, index) => {
        let className = 'flex-container';
        let weight = item.DGPassWeightInQuintal;
        if (item.DReqNo.includes('R')) {
          className += ' Rashan';
          weight = item.DGPassWeightInQuintal * 100;
        }

        return (

          <div className={className} >
            <div className=' flex-items address'>{item.DeptrAddress}</div>
            <div className=' flex-items name'>{item.DeptrName + ' ' + item.DeptrFatherName}</div>
            <div className=' flex-items type'>&nbsp;{item.type}</div>
            <div className=' flex-items status'>&nbsp;{item.status}</div>
            <div className=' flex-items item'>&nbsp;{item.ItemName}</div>
            <div className=' flex-items receipt-number'>{item.DReqNo}</div>
            <div className=' flex-items packet'>{item.DGPassNoOfLUnit} &nbsp;</div>
            <div className=' flex-items gaye'>{item.DONoOfLUnit} &nbsp;</div>
            <div className=' flex-items balancee'>{item.DGPassNoOfLUnit - item.DONoOfLUnit} &nbsp;</div>
            <div className=' flex-items weight'>{Math.round(weight)} kg &nbsp;</div>
            <div className=' flex-items amount'> &nbsp;{Math.round(item.DGPassWeightInQuintal * item.RadRentPerPeriod)}/- &#8377; &nbsp;</div>
            <div className=' flex-items location'> &nbsp; {item.DGPassRemark}</div>
            <div className=' flex-items hammali'> &nbsp; {item.BillTotalAmt}</div>
          </div>
        )
      })}
      <div className='flex-container totalRow'>
        <div className=' flex-items address'>{ }</div>
        <div className=' flex-items name'>{ }</div>
        <div className=' flex-items type'>{ }</div>
        <div className=' flex-items status'></div>
        <div className=' flex-items item'>{ }</div>
        <div className=' flex-items total receipt-number'>{'Total-->'}</div>
        <div className=' flex-items total packet'>{totals.packet} &nbsp;</div>
        <div className=' flex-items total gaye'>{totals.gaye} &nbsp;</div>
        <div className=' flex-items total balancee'>{totals.balance} &nbsp;</div>
        <div className=' flex-items total weight'>{totals.weight} kg &nbsp;</div>
        <div className=' flex-items total amount'> &nbsp;{totals.rent}/- &#8377; &nbsp;</div>
        <div className=' flex-items total location'>{ }</div>
        <div className=' flex-items total hammali'>{ }</div>
      </div>
    </div>
  );
}

export default AvakRegister;
