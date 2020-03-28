const SHA256 = require('crypto-js/sha256');
const EC = require("elliptic").ec;
const ec = new EC('secp256k1');

class transactions{
    constructor(formAddress, toAddress, amount){
        this.formAddress = formAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    claculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            console.log(signingKey.getPublic('hex'));
            console.log(this.formAddress);
            throw new Error('You cannot sign transactions for other wallets!');
        }
        const hashTx = this.claculateHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.signature = sig.toDER('hex');
    }
    isValid(){
        if(this.fromAddress == null){
            return true;
        }
        if(!this.signature || this.signature.length === 0){
            throw new Error('No sign')
        }

        const publicKey = ec.KeyFromPublic(this.formAddress, 'hex');
        return publicKey.verify(this.claculateHash(), this.signature);
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.claculateHash();
        this.nonce = 0;
    }

    claculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    mineBlock(dificulty){
        while(this.hash.substring(0, dificulty) !== Array(dificulty+1).join("0")){
            this.hash = this.claculateHash();
            this.nonce++;
        }
        console.log("block_minded")
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
        this.dificulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("2020-03-24", "GenesisBlock", "0");
    }


    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now, this.pendingTransactions, this.getLatestBlock.hash);
        block.mineBlock(this.dificulty);

        console.log("Minde Good");
        this.chain.push(block);
        this.pendingTransactions.push(new transactions(null, miningRewardAddress, this.miningReward))
        
    }
    addTransactions(transactions){

        if(!transactions.formAddress || !transactions.toAddress){
            throw new Error("Add Add");
        }

        if(!transactions.isValid()){
            throw new Error("Not Valid");
        }

        this.pendingTransactions.push(transactions);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of Object.keys(block.transactions)){
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

    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.claculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.transactions = transactions;