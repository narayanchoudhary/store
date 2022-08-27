import "./Khate.css";


export default function Khate({accounts}) {  
  console.log(accounts);

  return (
    <div className="accountContainer">
      {

        accounts.map((account) => {
          if (account.rows.length > 0) {
            return (
              <div>
                <div className="ledgerName">{account.ledgerName}</div>

                <div className="row header">
                  <div className="date">Date</div>
                  <div className="voucherNo">VNo</div>
                  <div className="narration">Narration</div>
                  <div className="cr">Credit</div>
                  <div className="dr">Debite</div>
                  <div className="balance">Balance</div>
                </div>
                {
                  account.rows.map((row) => {
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
                  <div className="balance">{account.rows[account.rows.length - 1].balance > 0 ? 'Jama' : account.rows[account.rows.length - 1].balance < 0 ? 'Lena' : 'Nill'}</div>
                </div>
                <br />
                <br />
                <br />
              </div>
            );
          }
        })
      }
    </div>
  );
}