const Joi = require('@hapi/joi')
const authSchema = Joi.object({
  mobile: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
})

module.exports = {
  authSchema,
}
