import {NextFunction, Request, Response} from 'express';
import Joi from 'joi';
import joi from 'joi';
export const validation_schema = (schema: any, params: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
           
            await schema
                .validateAsync(
                    ['login', 'create','donate','pledge'].includes(params)
                        ? req.body
                        :params=='getcenter'?{
                                token:req.headers.authorization?.split(' ')[1],
                                bearer:req.headers.authorization?.split(' ')[0]
                        }:{

                        }
                )
                next()
        } catch (error: any) {
            res.status(200).json({
                message: error.message,
                status: false
            });
        }
    };
};

export const schema = {
    create_ceneter: joi.object({
        center_name: joi.string().required(),
        country: joi.string().required(),
        no_orphanage: joi.number().required(),
        state: joi.string().required(),
        phone_number: joi.number().required(),
        lga: joi.string().required(),
        email: joi.string().required(),
        address: joi.string().required(),
        password: joi.string().required(),
        goal: joi.string().required(),
        bankDetails:joi.object({
            bank: joi.string().required(),
            acctNo: joi.string().required(),
            code: joi.string().required(),
        })
    }),
    login_center:joi.object({
        email: joi.string().required() ,
        password: joi.string().required() ,
    }),
    get_center:joi.object({
        bearer: joi.string().required().valid('BEARER'),
        token:joi.string().required(),

    }),
    donateProof:joi.object(
        {
            email:joi.string(),
            firstname:joi.string(),
            lastname:joi.string(),
            phoneno:joi.string(),
            image:joi.string().required(),
            donate:joi.string().required(),
            comment:joi.string(),
            orphan_id:joi.string().required(),
            centerName:joi.string().required(),
            throughPaystack:joi.boolean().required(),

          }
    ),
    pledge:joi.object({
        email: joi.string().required(),
        firstname:joi.string().required(),
        lastname:joi.string().required(),
        donate:joi.string().required(),
        day:joi.string().required(),
        orphan_id:joi.string().required(),
        centerName:joi.string().required(),
    })
};












































