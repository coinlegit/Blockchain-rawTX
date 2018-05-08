const ethTx = require('ethereumjs-tx');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const keythereum = require('keythereum');

let toAccount = web3.eth.accounts[1];//這邊需要改成目標帳戶
let money = '0x115C';//需要轉帳金額
let address = web3.eth.accounts[0];//需改成需要轉出的帳戶
let datadir = "/Users/wangsai/Library/Ethereum/"
let password = 'pwd';//帳戶密碼
let pk;

web3.personal.unlockAccount(web3.eth.accounts[0], password);

var keyObject = keythereum.importFromFile(address, datadir);
var privateKey = keythereum.recover(password, keyObject);

const gasPrice = web3.eth.gasPrice;

const gasPriceHex = web3.toHex(gasPrice);
const gasLimitHex = web3.toHex(300000);
const nonce = web3.eth.getTransactionCount(web3.eth.coinbase);
const nonceHex = web3.toHex(nonce);
const txParams = {
  nonce: nonceHex,
  gasPrice: gasPriceHex,
  gasLimit: gasLimitHex,
  from: address,
  to: toAccount, 
  value: money
};
console.log(txParams);
const tx = new ethTx(txParams);
const privKey = Buffer.from(privateKey,'hex');

tx.sign(privKey);
const serializedTx = tx.serialize();
const rawTx = '0x' + serializedTx.toString('hex');
console.log("rawTx: " + rawTx);

web3.eth.sendRawTransaction(rawTx, function(err, hash){
	if(err) {
		throw err;
	}
	if(!err){
		console.log("hash: " + hash);
	}
});