const ethService = require('./ethService.js')
const Tx = require('ethereumjs-tx').Transaction
const fs = require('fs')
const solc = require('solc')
var web3 = ethService.web3

// 编译合约
var source = fs.readFileSync("./contract/contract.sol", "utf8");
var compile = solc.compile(source, 1);
// var bytecode = compile.contracts[':TetherToken'].bytecode;
// 获取abi 不在本地编译合约的，可直接拷贝合约abi在此赋值
var abi = compile.contracts[':TetherToken'].interface;
abi = JSON.parse(abi)
//合约实例
var conAdd = '0x785859EdD69cFE827c216233eAb714834E40E7ea'
var contract = new web3.eth.Contract(abi, conAdd)

// 代币余额
async function balance(account) {
    let balance
    await contract.methods.balanceOf(account).call().then((res) => {
        balance = web3.utils.fromWei(res, 'MWEI')
    })
    return balance
}

async function tran(from, to, num, limit, priKey) {
    let gasPrice = await ethService.getGasPrice();
    let hash;
    await web3.eth.getTransactionCount(from, (err, txcount) => {
        if (err) {
            console.log(err)
        } else {
            const txObject = {
                nonce: web3.utils.toHex(txcount),
                to: conAdd,
                gasLimit: web3.utils.toHex(limit),
                gasPrice: web3.utils.toHex(gasPrice * 2),
                data: contract.methods.transfer(to, web3.utils.toWei(num, 'MWEI')).encodeABI()
            }// console.log(txObject)
            // 签署交易
            const tx = new Tx(txObject, {
                chain: 'ropsten',
                hardfork: 'petersburg'
            })
            tx.sign(Buffer.from(priKey.substring(2), 'hex'))
            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')
            // 广播交易
            web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                if (!err) {
                    hash = txHash
                    console.log("success:" + txHash)
                    return hash
                } else {
                    console.log(err);
                }
            })
        }
    })
}

module.exports = {
    balance,
    tran
}

