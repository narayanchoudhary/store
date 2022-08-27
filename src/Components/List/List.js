import './List.css';
import Modal from 'react-modal';
import { useState } from 'react';

Modal.setAppElement('#root');

function List({ accounts }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(false);

    let filteredAccounts = accounts.filter((account) => account.closingBalance !== 0);
    let sumOfLena = 0;
    let sumOfDena = 0;

    filteredAccounts.forEach(account => {
        if (account.closingBalance < 0)
            sumOfLena = sumOfLena + account.closingBalance;
        else
            sumOfDena = sumOfDena + account.closingBalance
    });

    const handleClickOnList = (ledgerId) => {
        let selectedAccount = accounts.filter((account) => account.ledgerId === ledgerId)[0];
        setSelectedAccount(selectedAccount);
        setIsModalOpen(true);
    }

    return (
        <div className='crDrListContainer'>
            <div className='crDrList crDrListHeader'>
                <div className='crDrListName'>Name</div>
                <div className='crDrListLena'>Lena</div>
                <div className='crDrListDena'>Dena</div>
            </div>
            {
                filteredAccounts.map((account, index) => {
                    return (
                        <div className={index % 2 !== 0 ? "crDrList crDrListEven" : "crDrList"} key={account.ledgerId} onClick={() => handleClickOnList(account.ledgerId)}>
                            <div className='crDrListName'>{account.ledgerName}</div>
                            {

                                account.closingBalance < 0 ?
                                    <><div className='crDrListLena'>{account.closingBalance}</div><div className='crDrListDena'></div></>
                                    :
                                    <><div className='crDrListLena'></div><div className='crDrListDena'>{account.closingBalance}</div></>

                            }
                        </div>
                    )

                })
            }
            <div className='crDrList crDrListFooter'>
                <div className='crDrListName'>Total</div>
                <div className='crDrListLena'>{sumOfLena}</div>
                <div className='crDrListDena'>{sumOfDena}</div>
            </div>

            {/* Single Account Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={()=> setIsModalOpen(false)}
                overlayClassName="Overlay"
            >
                <button className="close-button" data-close aria-label="Close modal" type="button" onClick={() => setIsModalOpen(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <span onClick={() => setIsModalOpen(false)} className="close-button topright">&times;</span>

                {selectedAccount &&
                    <div>
                        <div className="ledgerName">{selectedAccount.ledgerName}</div>

                        <div className="row header">
                            <div className="date">Date</div>
                            <div className="voucherNo">VNo</div>
                            <div className="narration">Narration</div>
                            <div className="cr">Credit</div>
                            <div className="dr">Debite</div>
                            <div className="balance">Balance</div>
                        </div>
                        {
                            selectedAccount && selectedAccount.rows.map((row) => {
                                return (
                                    <div className="row">
                                        <div className="date">{row.date}</div>
                                        <div className="voucherNo">{row.voucherNo}</div>
                                        <div className="narration">{row.narration}</div>
                                        <div className="cr">{row.cr}</div>
                                        <div className="dr">{row.dr}</div>
                                        <div className="balance">{row.balance}</div>
                                    </div>
                                )
                            })
                        }
                        <div className="row footer">
                            <div className="date"></div>
                            <div className="voucherNo"></div>
                            <div className="narration"></div>
                            <div className="cr"></div>
                            <div className="dr"></div>
                            <div className="balance">{selectedAccount.rows[selectedAccount.rows.length - 1].balance > 0 ? 'Jama' : selectedAccount.rows[selectedAccount.rows.length - 1].balance < 0 ? 'Lena' : 'Nill'}</div>
                        </div>
                        <br />
                        <br />
                        <br />
                    </div>
                }

            </Modal>
        </div>
    )

}

export default List;