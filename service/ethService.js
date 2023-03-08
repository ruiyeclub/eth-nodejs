const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction

var web3
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/...."));
}

// 创建账户
function create() {
    let acc = web3.eth.accounts.create()
    return acc
}

// 获取gas价格
async function getGasPrice() {
    let price
    await web3.eth.getGasPrice().then((res) => {
        price = res
    })
    return price
}

// 查询账户余额
async function balance(account) {
    let balance
    await web3.eth.getBalance(account).then((res) => {
        balance = web3.utils.fromWei(res, 'ether')
    })
    return balance
}

//交易eth
async function tran(fromAdd, to, num, limit, privatekey) {
    let gasPrice = await getGasPrice();
    console.log(gasPrice)
    let hash;
    await web3.eth.getTransactionCount(fromAdd, (err, txcount) => {
        if (err) {
            console.log(err)
        } else {
            const txObject = {
                nonce: web3.utils.toHex(txcount),
                to: to,
                value: web3.utils.toHex(web3.utils.toWei(num, 'ether')),
                gasLimit: web3.utils.toHex(limit),
                gasPrice: web3.utils.toHex(gasPrice)
            }
            console.log(txObject)
            // 签署交易
            const tx = new Tx(txObject, {
                chain: 'ropsten',
                hardfork: 'petersburg'
            })
            tx.sign(Buffer.from(privatekey.substring(2), 'hex'))
            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')
            // 广播交易

            web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                if (!err) {
                    hash = txHash
                } else {
                    console.log(err);
                }
            })
        }
    })
    return hash
}

module.exports = {
    create,
    getGasPrice,
    balance,
    tran
}

