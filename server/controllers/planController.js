const Plan = require('../models/Plan')

const DEFAULT_SERVER_ERROR_MSG = 'Oops! Something wrong!'

const planController = {
    getPlans: async (req, res) => {
        try {
            const plans = await Plan.find()

            res.status(200).json({ data: plans })
        } catch (err) {
            res.status(500).json({
                message: err.message || DEFAULT_SERVER_ERROR_MSG
            })
        }
    }
}

module.exports = planController
