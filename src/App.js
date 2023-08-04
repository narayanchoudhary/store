import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  HashRouter,
} from "react-router-dom";
import AvakRegister from './Components/AvakRegister/AvakRegister';
import Khate from './Components/Khate/Khate';
import { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';
import List from './Components/List/List';
import Account from './Components/Account/Account';
import Root from './Components/Report/Report';

function App() {

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    axios.get("http://narayan:5000/depositors").then((dRes) => {
      axios.get("http://narayan:5000/transactions").then((tRes) => {

        let accounts = [];
        dRes.data.forEach((depositor) => {
          let account = {
            ledgerId: depositor.LedgerId,
            ledgerName: (depositor.DeptrName + ' ' + depositor.DeptrFatherName + ' ' + depositor.DeptrAddress).toLowerCase(),
            rows: [],
            closingBalance: 0,
          };

          let balance = depositor.AccOpeBalCr - depositor.AccOpeBalDr;
          // Add Opening Balance row
          if (balance !== 0)
            account.rows.push({
              date: depositor.AccOpeBalDate,
              voucherNo: '-',
              narration: 'Opening Balance',
              cr: depositor.AccOpeBalCr !== 0 ? depositor.AccOpeBalCr : null,
              dr: depositor.AccOpeBalDr !== 0 ? depositor.AccOpeBalDr : null,
              balance: balance,
            });

          let filteredTransactions = [];
          filteredTransactions = tRes.data.filter((t) => t.AccTransLedgerId === depositor.LedgerId);
          if (filteredTransactions.length > 0) {
            filteredTransactions.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(moment(a.AccTransDate, "DD-MM-YY")) - new Date(moment(b.AccTransDate, "DD-MM-YY"));
            });
          }

          filteredTransactions.forEach((transaction) => {
            balance += transaction.AccTransCr - transaction.AccTransDr;
            account.rows.push({
              date: transaction.AccTransDate,
              voucherNo: transaction.AccTransVoucherNo,
              narration: transaction.AccTransNarration,
              cr: parseFloat(transaction.AccTransCr.toFixed(2)) !== 0 ? parseFloat(transaction.AccTransCr.toFixed(2)) : null,
              dr: parseFloat(transaction.AccTransDr.toFixed(2)) !== 0 ? parseFloat(transaction.AccTransDr.toFixed(2)) : null,
              balance: parseFloat(balance.toFixed(2))
            });
          });

          if (account.rows.length > 0)
            account.closingBalance = account.rows[account.rows.length - 1].balance;

          // if (account.rows.length > 0)
          //   if (account.rows[account.rows.length - 1].balance !== 0)
          //     list.push({
          //       account
          //       closingBalance: account.rows[account.rows.length - 1].balance,
          //     })

          accounts.push(account);
        });
        setAccounts(accounts);
      });
    });
  }, []);



  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/avakRegister" element={<AvakRegister />} />
        <Route path="/khate" element={<Khate accounts={accounts} />} />
        <Route path='/list' element={<List accounts={accounts} />} />
        <Route path='/account' element={<Account />} />
      </Routes>
    </HashRouter>

  );
}

export default App;
