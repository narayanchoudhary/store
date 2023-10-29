var express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getPool } = require('./connectDB');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


async function startServer() {

    try {
        let pool = await getPool();

        app.get('/', function (req, res) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            pool.query("select COALESCE(sum(DONoOfLUnit),0) as DONoOfLUnit, DeptrId, DeptrName, DeptrFatherName, DeptrAddress, ItemName, DGPassNo, DReqNo, DGPassNoOfLUnit, DGPassWeightInQuintal , DGPassRemark,DGPassDate, RadRentPerPeriod from GM_DepositGatePass JOIN GM_DepositorMaster ON GM_DepositGatePass.DGPassDeptrId = GM_DepositorMaster.DeptrId JOIN GM_ItemMaster ON GM_DepositGatePass.DGPassItemId = GM_ItemMaster.ItemId JOIN GM_DepositRequest ON GM_DepositRequest.DReqId =  GM_DepositGatePass.DGPassId JOIN CM_RentAgreemenDetail ON GM_DepositRequest.DReqAgreementId = CM_RentAgreemenDetail.RadRentAgreementId LEFT JOIN GM_DeliveryOrder ON GM_DepositRequest.DReqId = GM_DeliveryOrder.DOWhrId WHERE DGPassDate >= '2023-01-01' GROUP BY DeptrId, DeptrName, DeptrFatherName, DeptrAddress, ItemName, DGPassNo, DReqNo, DGPassNoOfLUnit, DGPassWeightInQuintal , DGPassRemark,DGPassDate, RadRentPerPeriod ORDER BY DGPassNo ", function (err, recordset) {
                if (err) {
                    console.log(err)
                    res.send(err);
                } else
                    res.send(recordset.recordsets[0]);
            });
        });

        app.get('/depositors', function (req, res) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            pool.query("select LedgerId, LedgerName, DeptrName, DeptrFatherName, DeptrAddress, convert(varchar, AccOpeBalDate, 5) as AccOpeBalDate, AccOpeBalDr, AccOpeBalCr from AccLedgerMaster JOIN GM_DepositorMaster ON LedgerId = DeptrOwnerLedgerId JOIN AccLedgerOpeBalance ON LedgerId = AccOpeBalLedgerId  WHERE LedgerGroupId = '47' AND AccOpeBalDate = '2023-04-01' ORDER BY LedgerName", function (err, recordset) {
                if (err) console.log(err)
                res.send(recordset.recordsets[0]);
            });
        });

        app.post('/api/sqlquery', async (req, res) => {
            console.log('request aayee')
            res.setHeader('Access-Control-Allow-Origin', '*');
            const { query } = req.body;
            pool.query(query, function (err, recordset) {
                if (err) {
                    console.log(err.originalError.info);

                    res.status(500).send(err.originalError.info);
                } else
                    res.send(recordset.recordsets[0]);
            });
        });

        app.get('/transactions', function (req, res) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            pool.query("select AccTransLedgerId, AccTransCr, AccTransDr, AccTransType, AccTransVoucherNo, convert(varchar, AccTransDate, 5) as AccTransDate, AccTransNarration from AccTrans WHERE AccTransDate >= '2023-04-01' AND AccTransDate <= '2024-03-31' ORDER BY AccTransDate", function (err, recordset) {
                if (err) console.log(err)
                res.send(recordset.recordsets[0]);
            });
        });

        app.listen(5032, function () {
            console.log('Server is running..');
        });
    } catch (error) {
        console.log(error);
    }

}

startServer();

module.exports = {
    startServer
}
