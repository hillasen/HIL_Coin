
const {Blockchain, transactions} = require('./Blockchain.js');
const EC = require("elliptic").ec;
const ec = new EC('secp256k1');

scoin = new Blockchain()

const myKey = ec.keyFromPrivate("2c879d7652ee39e9c2ec07e2f387cc2b2f7a367e479d9f5ad03f63beeb0edd10");
const wallet = myKey.getPublic('hex');

const friendKey = ec.keyFromPrivate("0c47d2b073f801a0de073c42a1cff205c8ec626ec6b35c72a57dc86967f4adcd");
const friendWallet = friendKey.getPublic('hex')


const tx1 = new transactions(scoin.getTransactionsIndex(), wallet, friendWallet, 10)
tx1.signTransaction(myKey);
scoin.addTransactions(tx1);
const tx2 = new transactions(scoin.getTransactionsIndex(), friendWallet, wallet, 5)
const tx3 = new transactions(scoin.getTransactionsIndex(), friendWallet, wallet, 20)


tx2.signTransaction(friendKey);


scoin.addTransactions(tx2);
tx3.signTransaction(friendKey);
scoin.mineTransactions();

scoin.addTransactions(tx3);
scoin.mineTransactions();
console.log(JSON.stringify(scoin.chain,null,4));
console.log(scoin.isChainValid());
console.log(scoin.getBalanceOfAddress(wallet))