
//import Blockchain, transaction, Block from Blockchain.js
//블럭체인, 거래, 블럭을 Blockchain.js 에서 임포트
const {Blockchain, transactions, Block} = require('./Blockchain.js');
// Sign module
//전자 서명 모듈
const EC = require("elliptic").ec;
const ec = new EC('secp256k1');
const dificulty = 3; // This is dificulty for mining, this have to be same with blockchain.js DON'T CHANGE IT 이것은 채굴을 위한 난이도 입니다. 항상 Blockchain.js 와 같아야 합니다. 수정 금지!
// HTTP module for pure p2p
// 퓨어 P2P를 위한 HTTP 모듈
var http = require('http');
 
var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var miner = [];
var nodes = [];
var check = 10;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

scoin = new Blockchain()

function init(){
    wait.push(scoin.getLastBlock());
}

if(process.argv[2] == null){
    throw Error("Error, don't have any start node!");
    console.log("Error, connect node!");
}
else{
    console.log("Requesting connection to " + process.argv[2]);
    request.post(process.argv[2] + "/isOnline", {
	    
	    body: {
            msg: "online"
            
        },
        timeout: 3000,
	    json: true
	  }, function(error, response, body){
        if (error) {
            console.log("Not available node");
            throw Error("Not available node! Please use another start node!");
            return 0;
        }
        miner.push(process.argv[2]);
         return 0;
         
	});
    
}

function isOnline(add, code){
    request.post(add + "/isOnline", {
	    
	    body: {
            msg: "online"
            
        },
        timeout: 3000,
	    json: true
	  }, function(error, response, body){
        if (error) {
            console.log("Not");
            miner.splice(code, 1);
            return 0;
        }
        
         return 0;
         
	});
}

function addMiner(add){
    request.post(add + "/isOnline", {
	    
	    body: {
            msg: "online"
            
        },
        timeout: 3000,
	    json: true
	  }, function(error, response, body){
        if (error || miner.hasOwnProperty(add)) {
            console.log("No");
            return 0;
        }
        miner.push(add);
        console.log("Add");
        return 0;
         
	});
}

function sendTransaction(bod, add, code){
	request.post(add + "/transactions", {
	    
	    body: {
            index: bod.index,
            fromAddress: bod.fromAddress,
            toAddress: bod.toAddress,
            amount: bod.amount,
            signature: bod.signature
            
        },
        timeout: 2000,
	    json: true
	  }, function(error, response, body){
          if(error){
            isOnline(add, code)
          }
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
            sendTransaction(bod, currentMiner, i);
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
    //반복문 돌며 확인 후 긴것
    console.log(scoin.getWaitsLast());
    if(blk.hash.substring(0, dificulty) === Array(dificulty + 1).join("0") && blk.hash === blk.hashBlock() && blk.hasValidTransactions() && blk.previousHash === scoin.getWaitsLast().hash){
        scoin.addWaits(blk);
        res.send("OK");
    }
    else if(blk.previousHash !== scoin.getWaitsLast().hash){
        console.log("Ncorrect");
    }
    console.log(scoin);
    console.log(scoin.getBalanceOfAddress("044fdfb35ab7883a323f1fe1c00ff37f549e986e52f93b94e44936a59ca9eccc74abd166ec28ef44e81bfa639a3fbd890d795937a861d96b7613c9962397676d7e"));
});

app.post('/getBalance', function (req, res) {
    var bod = req.body;
    res.send(String(scoin.getBalanceOfAddress(bod.address)));
    console.log(scoin.getBalanceOfAddress(bod.address));
});

app.post('/isOnline', function (req, res) {
    res.send("Online");
});

app.post('/addMiner', function (req, res) {
    var bod = req.body;
    addMiner(bod.address);
    res.send("OK");
    
});

app.post('/isOnline', function (req, res) {
    res.send("Online");
});

app.listen(2040,function(){
    console.log('listening on port 2040')
});