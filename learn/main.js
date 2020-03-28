const {Blockchain, transactions} = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate("32d8aa5981a6fad62a062a276975eeb29ab29c4836abdbbaeef97b56fbe79cd9");
const wallet = myKey.getPublic('hex');
console.log(wallet);

let osc = new Blockchain();

const tx1 = new transactions(wallet, 'public', 10);

tx1.signTransaction(myKey);

osc.addTransactions(tx1);



console.log('mining');
osc.minePendingTransactions(wallet);
console.log(osc.getBalanceOfAddress(wallet));