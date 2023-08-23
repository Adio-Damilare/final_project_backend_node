import {NextFunction, Request, Response} from 'express';
import Orphanagecenter from '../models/Orphangecenter';
import {Op} from 'sequelize';
import {compare, genSalt, hash} from 'bcrypt';
import {sign, verify} from 'jsonwebtoken';
import dotEnv from 'dotenv';
import Donation from '../models/Donation';
import {v2 as cloudinary} from 'cloudinary';
import axios from 'axios';
import Pledge from '../models/Pledge';
import {Months, sendMail} from './Email';
import cron from 'node-cron';
dotEnv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure:true,
});


export default class CenterController {
    public static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const found = await Orphanagecenter.findOne({
                where: {
                    [Op.or]: {
                        email: req.body.email,
                        phone_number: req.body.phone_number
                    }
                },
                attributes: ['email', 'phone_number']
            });
            if (found != null) {
                let data = found.dataValues;
                return res.status(200).json({
                    message:
                        data.email == req.body.email && data.phone_number == req.body.phone_number
                            ? 'Email Address and Phone number  already used kindly login to your account'
                            : data.email == req.body.email
                            ? 'Email Address  already used kindly login to your account'
                            : 'Phone number  already used kindly login to your account',
                    status: false
                });
            }
            let checkBank = await axios
                .get(`https://api.paystack.co/bank/resolve?account_number=${req.body.bankDetails.acctNo}&bank_code=${req.body.bankDetails.code}&currency=NGN`, {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                    }
                })
                .then((_response) => {
                    return _response.data;
                })
                .catch((_error) => {
                    if (_error.message == 'Request failed with status code 422') {
                        return {
                            status: false,
                            message: 'Invalid account number or you select wrong bank'
                        };
                    }
                    return {
                        status: false,
                        message: 'Something went wrong'
                    };
                });
            if (!checkBank.status) {
                return res.status(200).json({
                    message: checkBank?.message,
                    status: false
                });
            }

            const hashpassword = await CenterController.hash_password(req.body.password);
            const create = await Orphanagecenter.create({
                ...req.body,
                acctNo: checkBank.data.account_number,
                account_name: checkBank.data.account_name,
                bank: req.body.bankDetails.bank,
                password: hashpassword
            }).then((_res)=>{

                return res.status(200).json({
                    message: 'Center created successfully',
                    status: true
                });
            }).catch((_errror)=>{
                console.log(_errror.message)
                return res.status(500).json({
                    message: 'Center created successfully',
                    status: false
                });

            });
        } catch (ex) {
            next(ex);
        }
    }

    public static async Login(req: Request, res: Response, next: NextFunction) {
        try {
            const found = await Orphanagecenter.findOne({
                where: {
                    [Op.or]: {
                        email: req.body.email,
                        phone_number: Number.isNaN(Number(req.body.email)) ? 10 : Number(req.body.email)
                    }
                }
            });
            if (found == null) {
                return res.status(200).json({
                    message: 'Invalid email or phone number',
                    status: false
                });
            }
            let is_equal = await CenterController.verify_password(req.body.password, found.dataValues.password);

            if (!is_equal) {
                return res.status(200).json({
                    message: 'Incorrect password',
                    status: false
                });
            }
            let token = await CenterController.encoded_data({unique_id: found.dataValues.unique_id}, process.env.CENTER_LOGIN_JWT as string);

            res.status(200).json({
                message: 'successfully login',
                token,
                status: true
            });
        } catch (ex) {
            next(ex);
        }
    }

    public static async Get_Login_center(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req?.headers.authorization?.split(' ')[1];
            const response: any = await CenterController.verify_data(token as string, process.env.CENTER_LOGIN_JWT as string);
            if (!response?.status) {
                return res.status(200).json({
                    massage: 'Not authorized to this page',
                    status: false
                });
            }
            let found = await Orphanagecenter.findOne({
                where: {
                    unique_id: response.data.unique_id
                },
                include: [
                    {
                        model: Donation,
                        attributes: {exclude: ['OrphanagecenterUniqueId']}
                    },
                    {
                        model: Pledge,
                        attributes: {exclude: ['OrphanagecenterUniqueId']}
                    }
                ]
            });
            if (found == null) {
                return res.status(200).json({
                    massage: 'Center Not found',
                    status: false
                });
            }
            found['dataValues']['Donation'] = CenterController.Sort(found?.dataValues?.Donation);
            found['dataValues']['Pledge'] = CenterController.Sort(found?.dataValues?.Pledge);
            res.status(200).json({
                massage: 'successfully login',
                center: {...found?.dataValues, bankDetails: found?.dataValues?.bankDetails},
                status: true
            });
        } catch (ex) {
            next(ex);
        }
    }

    public static async Get_All_Center(req: Request, res: Response, next: NextFunction) {
        try {
           Orphanagecenter.findAll({
                where:
                    req.query.state === 'ANY' && req.query.local == 'ANY'
                        ? {}
                        : {
                              state: req.query.state,
                              lga: req.query.local
                          },
                attributes: {exclude: ['password', 'updatedAt', 'createdAt']}
            })
                .then((found) => {
                    found = found?.map((data: any) => ({...data.dataValues}));
                    return res.status(200).json({
                        status: true,
                        centers: found
                    });
                })
                .catch((_err) => {
                    res.status(400).json({message: 'something went wrong', status: true});
                });
        } catch (ex) {
            next(ex);
        }
    }

    public static async MakeDonation(req: Request, res: Response, next: NextFunction) {
        try {
            const {image, centerName, ...other} = req.body;
            let sentEmail = true;
           
            if (req.body.email != 'anonymous') {
                sentEmail = await sendMail({
                    reciever: req.body.email,
                    subject: 'You have successfully donated!!',
                    message: `
                    <div style="min-height:70vh; display:flex;align-items:center; justify-content:center;">
                     <p style="width:100%;text-align:center; font-size:18px">
                    Thank you<i> ${req.body.firstname}  ${req.body.lastname}</i> for donating ${req.body.donate} to ${centerName} center.<br/>
                    </p>
                </div>`
                })
                    .then((res) => res)
                    .catch((err) => false);
            }
            if (!sentEmail) {
                return res.status(200).json({
                    message: 'Something went wrong ',
                    status: false
                });
            }
            let cloudImage: any = {image: 'null', status: true};
            
            if (image !== 'null') {
                cloudImage = await cloudinary.uploader
                    .upload(image, {public_id: 'olympic_flag', resource_type: 'image'})
                    .then((result) => {
                        return {
                            image: result?.secure_url,
                            status: true
                        };
                    })
                    .catch((_err) => {
                        return {
                            status: false
                        };
                    });
            }
            
            if (!cloudImage?.status) {
                return res.status(200).json({
                    message: 'something went wrong',
                    status: false
                });
            }
            
            
           Donation.create({...other, image: cloudImage?.image})
                .then((result) => {
                    res.status(200).json({
                        message: 'Successfuly donated',
                        status: true
                    });
                })
                .catch((err) => {
                    console.log(err.message)
                    res.status(200).json({
                        message: 'Something went wrong',
                        status: false
                    });
                });
        } catch (ex) {
            next(ex);
        }
    }
    
    public static async MakePledge(req: Request, res: Response, next: NextFunction) {
        try {
            const {centerName, ...rest} = req.body;
            const sentEmail = await sendMail({
                reciever: req.body.email,
                subject: `Pledge to be donating to ${centerName} center monthly`,
                message: `<div style="min-height:70vh; display:flex;align-items:center; justify-content:center;">
             <p style="width:50%;text-align:center; font-size:18px">
                 Thank you<i> ${req.body.firstname}  ${req.body.lastname}</i> for pledging to be donating to ${centerName} center monthly.<br/>
                 Note : You will be recieving reminder email at ${req.body.day} of every monthly to fulfil your promise.
             </p>
         </div>`
            });

            if (!sentEmail)
                return res.status(200).json({
                    message: 'Something went wrong ',
                    status: false
                });

             Pledge.create(rest)
                .then((_response) => {
                    res.status(200).json({
                        message: 'Successfuly pledge',
                        status: true
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        message: 'Something went wrong',
                        status: false
                    });
                });
        } catch (ex) {
            next(ex);
        }
    }

    public static async EditProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const {token, ...rest} = req.body;
            const response: any = await CenterController.verify_data(token as string, process.env.CENTER_LOGIN_JWT as string);
            if (!response?.status) {
                return res.status(200).json({
                    massage: 'Not authorized to this page',
                    status: false
                });
            }
            console.log(rest, response);
             Orphanagecenter.findByPk(response.data.unique_id)
                .then((response) => {
                    if (response) return response?.update(rest);
                })
                .then((response) => {
                    console.log(response);
                    return res.status(200).json({
                        message: 'success update',
                        status: true
                    });
                })
                .catch((_err) => {
                    console.log(_err);
                    return res.status(200).json({
                        message: 'Failed to update',
                        status: false
                    });
                });
        } catch (ex) {
            next(ex);
        }
    }

    public static async VerifyDonation(req: Request, res: Response, next: NextFunction) {
        try {
            const {unique_id} = req.params;
            Donation.findByPk(unique_id)
                .then((_resp) => {
                    _resp
                        ?.update({
                            verify: true
                        })
                        .then((_res) => {
                            res.status(200).json({
                                message: 'successfuly update',
                                status: true
                            });
                        })
                        .catch((_error) => {
                            res.status(200).json({
                                message: 'fail to update',
                                status: false
                            });
                        });
                })
                .catch((_error) => {
                    res.status(200).json({
                        message: 'fail to update',
                        status: false
                    });
                });
        } catch (ex) {
            next(ex);
        }
    }

    public static async DeleteDonation(req: Request, res: Response, next: NextFunction) {
        try {
            const {unique_id} = req.params;
            Donation.destroy({where: {unique_id}})
                .then((_resp) => {
                    res.status(200).json({status: true, message: 'deleted successfully'});
                })
                .catch((_error) => {
                    res.status(200).json({
                        message: 'fail to delete',
                        status: false
                    });
                });
        } catch (ex) {
            next(ex);
        }
    }

    private static encoded_data = async (data: object, word: string, time = 48) => {
        return sign(data, word, {expiresIn: `${time}h`});
    };
    private static hash_password = async (password: string) => {
        let salt = await genSalt(10);
        return hash(password, salt);
    };

    private static verify_password = (password: string, hash_password: string) => {
        return compare(password, hash_password);
    };

    private static verify_data = async (encoded_string: string, key: string) => {
        return verify(encoded_string, key, (_err: any, _result) => {
            if (_err) return {error: _err, status: false};
            return {data: _result, status: true};
        });
    };

    private static Sort = (array: any) => {
        return array?.sort((a: any, b: any) => b.createdAt.localCompare(a.createdAt));
    };
}

cron.schedule('38-45 17 1-31 1-12 *', function () {
    const s = new SendMailToPromise();
});

class SendMailToPromise {
    constructor() {
        SendMailToPromise.GetUsers();
    }
    private static async GetUsers() {
        const userPledges = await Pledge.findAll({
            where: {
                day: {
                    [Op.lte]: new Date().getDay()
                },
                month: Months[new Date().getMonth()]
            }
        })
            .then((res: any) => {
                if (res == null) return console.log('No promise found');
                res.map((val: any) => {
                    sendMail({
                        reciever: val.dataValues.email,
                        subject: 'Remindering email of the pledge you promise',
                        message: `                    
                    <div class="" style="font-family: poppin; width: 100%; background:rgb(78, 73, 73)">
             <div class="row" style="width: 90%; margin: 40px auto;border: 1px solid rgb(230, 227, 227);
                  padding: 20px;box-shadow: 5px 5px 3px 3px rgb(179, 172, 172); border-radius: 10px; background:#fff">
             <div style="text-align: center; word-spacing: 1px;">
            <p class="" style="font-size: 29px;">Good day ${val.dataValues.firstname} ${val.dataValues.lastname}, this is to remind you the pledge you promise ${val.dataValues.centerName}center monthly. <br/>
            To fulfill your promise <a href=""  style='color:blue '>click here</a>
            </p>
            <b style="font-size: 18px;">
                note: This email will be resend to you tomorrow to stop the email   <a href="" style='color:blue '>click here</a>
                </b>
         </div>
        </div>
    </div>
`
                    });
                });
            })
            .catch((_err) => {
                return null;
            });
    }
}
