const Joi = require('@hapi/joi')
const getOtpSchema = Joi.object({
    mobile: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .error(new Error("mobile not correct")),
})
const checkOtpSchema = Joi.object({
    mobile: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(), code: Joi.string()
        .min(4)
        .max(6)
        .error(new Error("sent code not correct"))
})

module.exports = {
    getOtpSchema, checkOtpSchema
}
