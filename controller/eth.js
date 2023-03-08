const router = require('koa-router')()
const ethService = require('../service/ethService.js')
const conService = require('../service/conService.js')
router.prefix('/eth')

//创建账户
router.get('/create', async (ctx, next) => {
    let acc = ethService.create()
    ctx.body = acc
})

//获取gas价格
router.get('/gasPrice', async (ctx, next) => {
    let price = await ethService.getGasPrice()
    console.log(ethService.web3.utils.fromWei(price, 'gwei'))
    ctx.body = price
})

//查询账户余额
router.get('/balance', async (ctx, next) => {
    let balance = await ethService.balance('0x118234e32f67ad526B31Ad696f6533179a8cB42b')
    console.log(balance)
    ctx.body = balance
})

//交易
router.get('/tran', async (ctx, next) => {
    let hash = await ethService.tran('fromAdd', 'toAdd'
        , "1", "21000", 'from账户私钥privatekey')
    console.log(hash)
    ctx.body = hash
})

//合约余额
router.get('/conBalance', async (ctx, next) => {
    let valance = await conService.balance('账户add')
    console.log(valance)
    ctx.body = valance
})

//合约代币交易
router.get('/conTran', async (ctx, next) => {
    let hash = await conService.tran('fromAdd', 'toAdd', '100', '200000', 'from账户私钥privatekey')
    console.log(hash)
    ctx.body = hash
})

module.exports = router


