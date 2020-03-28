const {Blockchain, transactions, Block} = require('./Blockchain.js');
const EC = require("elliptic").ec;
const ec = new EC('secp256k1');
var dificulty = 2;
var http = require('http');
 
var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var miner = ["http://127.0.0.1:2030"];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

scoin = new Blockchain()



function sendTransaction(bod, add){
	request.post(add + "/transactions", {
	    
	    body: {
            index: bod.index,
            fromAddress: bod.fromAddress,
            toAddress: bod.toAddress,
            amount: bod.amount,
            signature: bod.signature
            
        },
	    json: true
	  }, function(error, response, body){
         console.log(body);
         
	});
}

app.post('/transactions', function (req, res) {
    var bod = req.body;
    const tr = new transactions(Number(bod.index), bod.fromAddress, bod.toAddress, Number(bod.amount), bod.signature);
    if(tr.isValid() === false){
        console.log("Is not a valid transaction");
        res.send('Is not a valid transaction');
    }
    else{
        for(let i=0; i<miner.length ; i++){
            console.log("L");
            const currentMiner = miner[i];
            sendTransaction(bod, currentMiner);
        }
    }
    res.send("fin");
});

app.post('/newBlock', function (req, res) {
    var bod = req.body;
    var blk = new Block();
    bod = JSON.parse(bod.msg);
    blk.index = bod.index;
    blk.timestamp = bod.timestamp;
    var tra = [];
    for(let i=0;i<bod.transactions.length;i++){
        const currentTrans = bod.transactions[i];
        tra.push(new transactions(currentTrans.index, currentTrans.fromAddress, currentTrans.toAddress, currentTrans.amount, currentTrans.signature));
    }
    blk.transactions = tra;
    
    blk.nonce = bod.nonce;
    blk.previousHash = bod.previousHash;
    blk.hash = bod.hash;
    console.log(blk.hasValidTransactions());
    console.log(blk.hashBlock());
    console.log(blk.hash);
    console.log(blk);
    if(blk.hash.substring(0, dificulty) === Array(dificulty + 1).join("0") && blk.hash == blk.hashBlock() && blk.hasValidTransactions()){
        scoin.addBlock(blk);
        res.send("OK");
    }
    console.log(scoin);
    console.log(scoin.getBalanceOfAddress("044fdfb35ab7883a323f1fe1c00ff37f549e986e52f93b94e44936a59ca9eccc74abd166ec28ef44e81bfa639a3fbd890d795937a861d96b7613c9962397676d7e"));
});

app.post('/getBalance', function (req, res) {
    var bod = req.body;
    res.send(String(scoin.getBalanceOfAddress(bod.address)));
    console.log(scoin.getBalanceOfAddress(bod.address));
});

app.listen(2040,function(){
    console.log('listening on port 2040')
});