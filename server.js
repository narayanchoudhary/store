var express = require('express');
var sql = require("mssql");

var app = express();
// config for your database
var config = {
    server: 'ASUS-PC',
    authentication: { type: 'default', options: { userName: 'SA', password: 'open', } },
    options: {
        encrypt: false,
        trustServerCertificate: true

    },
    database: 'Hariom',
};

app.get('/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query("select BillTotalAmt, COALESCE(sum(DONoOfLUnit),0) as DONoOfLUnit, DeptrId, DeptrName, DeptrFatherName, DeptrAddress, ItemName, DGPassNo, DReqNo, DGPassNoOfLUnit, DGPassWeightInQuintal , DGPassRemark,DGPassDate, RadRentPerPeriod from GM_DepositGatePass JOIN GM_DepositorMaster ON GM_DepositGatePass.DGPassDeptrId = GM_DepositorMaster.DeptrId JOIN GM_ItemMaster ON GM_DepositGatePass.DGPassItemId = GM_ItemMaster.ItemId JOIN GM_DepositRequest ON GM_DepositRequest.DReqId =  GM_DepositGatePass.DGPassId JOIN CM_RentAgreemenDetail ON GM_DepositRequest.DReqAgreementId = CM_RentAgreemenDetail.RadRentAgreementId LEFT JOIN GM_DeliveryOrder ON GM_DepositRequest.DReqId = GM_DeliveryOrder.DOWhrId LEFT JOIN GM_HambaliBillHeader ON DGPassId = BillWHRId  WHERE DGPassDate >= '2022-01-01' GROUP BY DeptrId, DeptrName, DeptrFatherName, DeptrAddress, ItemName, DGPassNo, DReqNo, DGPassNoOfLUnit, DGPassWeightInQuintal , DGPassRemark,DGPassDate, RadRentPerPeriod, BillTotalAmt ORDER BY DGPassNo ", function (err, recordset) {

            if (err) console.log(err)

            res.send(recordset.recordsets[0]);
        });
    });
});

app.get('/depositors', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query("select LedgerId, LedgerName, DeptrName, DeptrFatherName, DeptrAddress, convert(varchar, AccOpeBalDate, 5) as AccOpeBalDate, AccOpeBalDr, AccOpeBalCr from AccLedgerMaster JOIN GM_DepositorMaster ON LedgerId = DeptrOwnerLedgerId JOIN AccLedgerOpeBalance ON LedgerId = AccOpeBalLedgerId  WHERE LedgerGroupId = '47' ORDER BY LedgerName", function (err, recordset) {

            if (err) console.log(err)

            res.send(recordset.recordsets[0]);
        });
    });
});

app.get('/transactions', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query("select AccTransLedgerId, AccTransCr, AccTransDr, AccTransType, AccTransVoucherNo, convert(varchar, AccTransDate, 5) as AccTransDate, AccTransNarration from AccTrans WHERE AccTransDate >= '2021-04-01' AND AccTransDate <= '2022-03-31' ORDER BY AccTransDate", function (err, recordset) {

            if (err) console.log(err)

            res.send(recordset.recordsets[0]);
        });
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});