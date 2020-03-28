const SHA256 = require('crypto-js/sha256');
const EC = require("elliptic").ec;
const ec = new EC('secp256k1');

class transactions{
    constructor(index, fromAddress, toAddress, amount, signature){
        this.index = index;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.signature = signature;
        
    }
    claculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.timestamp + this.amount + this.index).toString();
    }
    signTransaction(signingKey){
        if (signingKey.getPublic('hex') != this.fromAddress) {
            console.log(signingKey.getPublic('hex'));
            console.log(this.fromAddress);
            console.log("Another walet");
            return false;
        }
        const hashTx = this.claculateHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.signature = sig.toDER('hex');
        return true;
    }
    isValid(){
        if(this.fromAddress == null){
            return false;
        }
        if(!this.signature || this.signature.length === 0){
            return false;
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex'); 
        return publicKey.verify(this.claculateHash(), this.signature);
    }
    
}

class Block{
    constructor(index, timestamp, transactions, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = 0;
        this.previousHash = previousHash;
        this.hash = this.hashBlock();
    }
    hashBlock(){
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }
    mineBlock(dificulty){
        while(this.hash.substring(0, dificulty) !== Array(dificulty + 1).join("0")){
            this.nonce++;
            this.hash = this.hashBlock();
        }
    }
    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.pendingChain = [];
        this.dificulty = 2;
        this.transactionsIndex = 0;
    }
    createGenesisBlock(){
        return new Block(0, "2020-03-24", [new transactions("GenesisBlock", "", 0), new transactions("GenesisBlock", "", 0)]);
    }
    getLastBlock(){
        return this.chain[this.chain.length - 1];
    }
    getLastIndex(){
        return this.chain.length - 1;
    }
    getNewIndex(){
        return this.chain.length;
    }
    addTransactions(transactions){
        this.pendingChain.push(transactions);
        this.transactionsIndex++;
    }
    getTransactionsIndex(){
        return this.transactionsIndex;
    }
    mineTransactions(callback){

        let block = new Block(this.getNewIndex(), Date.now(), this.pendingChain, this.getLastBlock().hash);
        block.mineBlock(this.dificulty);
        console.log("Mine Finished");
        this.chain.push(block);
        this.pendingChain = [];
        callback();
    }
    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(!currentBlock.hasValidTransactions()){
                console.log("1");
                return false;
            }

            if(currentBlock.hash !== currentBlock.hashBlock()){
                console.log("2");
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                console.log("3");
                return false;
            }
        }
        return true;
    }
    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress == address){
                    balance -= trans.amount;
                }
                if(trans.toAddress == address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }
    addBlock(block){

        
        this.chain.push(block);
        
    }

}

module.exports.Blockchain = Blockchain;
module.exports.transactions = transactions;
module.exports.Block = Block;