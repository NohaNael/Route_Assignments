import joi from 'joi'
import { Types } from 'mongoose'

export const sendMessage = {
    body: joi.object({
        content: joi.string().required().messages({
            'string.empty': 'Message is required',
        }),
    }),

    params: joi.object({
        receiverID: joi.string().custom((value, helpers) => {
            return Types.ObjectId.isValid(value) || helpers.message("invalid receiverID format")
        })
    })
}

export const toggleRead = {
    params: joi.object({
        messageID: joi.string().custom((value, helpers) => {
            return Types.ObjectId.isValid(value) || helpers.message("invalid messageID format")
        })
    })
}