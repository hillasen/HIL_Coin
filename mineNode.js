const {Blockchain, transactions} = require('./Blockchain.js');
var express = require('express')

var app = express()
var bodyParser = require('body-parser');

var nodes = ["http://127.0.0.1:2040"];
var request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))



coin = new Blockchain();



//BlockIndex is the index of variable chain
function broadcastBlock(blockIndex){
    for(let i=0;i<nodes.length;i++){
        bod = JSON.stringify(coin.chain[blockIndex]);
        console.log(bod);
        request.post(nodes[i] + "/newBlock", {
	    
            body: {
                msg: bod
            },
            json: true
          }, function(error, response, body){
             console.log(body);
             
        });
    }
}

app.get('/transactions', function (req, res) {
    var bod = req.query;
    const tr = new transactions(bod.index, bod.fromAddress, bod.toAddress, Number(bod.amount), bod.signature);
    if(tr.isValid() === false){
        console.log("Is not a valid transaction");
        res.send('Is not a valid transaction');
    }
    else{
        coin.addTransactions(tr);
        if(coin.getTransactionsIndex() % 4 == 0){
          coin.mineTransactions();
          console.log(coin.getLastBlock());
        }
        res.send('Init');
    }
});
// 2c879d7652ee39e9c2ec07e2f387cc2b2f7a367e479d9f5ad03f63beeb0edd10
// 044fdfb35ab7883a323f1fe1c00ff37f549e986e52f93b94e44936a59ca9eccc74abd166ec28ef44e81bfa639a3fbd890d795937a861d96b7613c9962397676d7e


app.post('/transactions', function (req, res) {
    var bod = req.body;
    const tr = new transactions(Number(bod.index), bod.fromAddress, bod.toAddress, Number(bod.amount), bod.signature);
    //console.log(tr);
    if(tr.isValid() === false){
        console.log("Is not a valid transaction");
        res.send('Is not a valid transaction');
    }
    else{
        res.send('Init');
        coin.addTransactions(tr);
        if(coin.getTransactionsIndex() % 4 == 0){
          coin.mineTransactions(function() {
              console.log("Mine Fin");
              
          });
          console.log(coin.getLastBlock());
          broadcastBlock(1);
        }
       
    }
});

app.post('/lastBlock', function (req, res) {
    var bod = req.body;
    res.send(coin.getLastBlock());
});

app.listen(2030,function(){
    console.log('listening on port 2030')
});
    
    
