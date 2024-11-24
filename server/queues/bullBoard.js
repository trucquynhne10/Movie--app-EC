const { createBullBoard } = require('@bull-board/api')
const { BullAdapter } = require('@bull-board/api/bullAdapter')
const { ExpressAdapter } = require('@bull-board/express')
const checkPlanExpirationQueue = require('./checkPlanExpirationQueue')

const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

createBullBoard({
    queues: [new BullAdapter(checkPlanExpirationQueue)],
    serverAdapter: serverAdapter
})

module.exports = serverAdapter.getRouter()
