"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Orphangecenter_1 = __importDefault(require("../models/Orphangecenter"));
const sequelize_1 = require("sequelize");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const Donation_1 = __importDefault(require("../models/Donation"));
const cloudinary_1 = require("cloudinary");
const axios_1 = __importDefault(require("axios"));
const Pledge_1 = __importDefault(require("../models/Pledge"));
const Email_1 = require("./Email");
const node_cron_1 = __importDefault(require("node-cron"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.ClOUD_API_SECRET,
    secure: true
});
class CenterController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const found = yield Orphangecenter_1.default.findOne({
                    where: {
                        [sequelize_1.Op.or]: {
                            email: req.body.email,
                            phone_number: req.body.phone_number
                        }
                    },
                    attributes: ['email', 'phone_number']
                });
                if (found != null) {
                    let data = found.dataValues;
                    return res.status(200).json({
                        message: data.email == req.body.email && data.phone_number == req.body.phone_number
                            ? 'Email Address and Phone number  already used kindly login to your account'
                            : data.email == req.body.email
                                ? 'Email Address  already used kindly login to your account'
                                : 'Phone number  already used kindly login to your account',
                        status: false
                    });
                }
                let checkBank = yield axios_1.default
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
                        message: checkBank === null || checkBank === void 0 ? void 0 : checkBank.message,
                        status: false
                    });
                }
                const hashpassword = yield CenterController.hash_password(req.body.password);
                const create = yield Orphangecenter_1.default.create(Object.assign(Object.assign({}, req.body), { acctNo: checkBank.data.account_number, account_name: checkBank.data.account_name, bank: req.body.bankDetails.bank, password: hashpassword }))
                    .then((_res) => {
                    return res.status(200).json({
                        message: 'Center created successfully',
                        status: true
                    });
                })
                    .catch((_errror) => {
                    return res.status(500).json({
                        message: 'Center created successfully',
                        status: false
                    });
                });
            }
            catch (ex) {
                next(ex);
            }
        });
    }
    static Login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const found = yield Orphangecenter_1.default.findOne({
                    where: {
                        [sequelize_1.Op.or]: {
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
                let is_equal = yield CenterController.verify_password(req.body.password, found.dataValues.password);
                if (!is_equal) {
                    return res.status(200).json({
                        message: 'Incorrect password',
                        status: false
                    });
                }
                let token = yield CenterController.encoded_data({ unique_id: found.dataValues.unique_id }, process.env.CENTER_LOGIN_JWT);
                res.status(200).json({
                    message: 'successfully login',
                    token,
                    status: true
                });
            }
            catch (ex) {
                next(ex);
            }
        });
    }
    static Get_Login_center(req, res, next) {
        var _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (_b = req === null || req === void 0 ? void 0 : req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
                const response = yield CenterController.verify_data(token, process.env.CENTER_LOGIN_JWT);
                if (!(response === null || response === void 0 ? void 0 : response.status)) {
                    return res.status(200).json({
                        massage: 'Not authorized to this page',
                        status: false
                    });
                }
                let found = yield Orphangecenter_1.default.findOne({
                    where: {
                        unique_id: response.data.unique_id
                    },
                    include: [
                        {
                            model: Donation_1.default,
                            attributes: { exclude: ['OrphanagecenterUniqueId'] }
                        },
                        {
                            model: Pledge_1.default,
                            attributes: { exclude: ['OrphanagecenterUniqueId'] }
                        }
                    ]
                });
                if (found == null) {
                    return res.status(200).json({
                        massage: 'Center Not found',
                        status: false
                    });
                }
                found['dataValues']['Donation'] = CenterController.Sort((_c = found === null || found === void 0 ? void 0 : found.dataValues) === null || _c === void 0 ? void 0 : _c.Donation);
                found['dataValues']['Pledge'] = CenterController.Sort((_d = found === null || found === void 0 ? void 0 : found.dataValues) === null || _d === void 0 ? void 0 : _d.Pledge);
                res.status(200).json({
                    massage: 'successfully login',
                    center: Object.assign(Object.assign({}, found === null || found === void 0 ? void 0 : found.dataValues), { bankDetails: (_e = found === null || found === void 0 ? void 0 : found.dataValues) === null || _e === void 0 ? void 0 : _e.bankDetails }),
                    status: true
                });
            }
            catch (ex) {
                next(ex);
            }
        });
    }
    static Get_All_Center(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Orphangecenter_1.default.findAll({
                    where: req.query.state === 'ANY' && req.query.local == 'ANY'
                        ? {}
                        : {
                            state: req.query.state,
                            lga: req.query.local
                        },
                    attributes: { exclude: ['password', 'updatedAt', 'createdAt'] }
                })
                    .then((found) => {
                    found = found === null || found === void 0 ? void 0 : found.map((data) => (Object.assign({}, data.dataValues)));
                    return res.status(200).json({
                        status: true,
                        centers: found
                    });
                })
                    .catch((_err) => {
                    res.status(400).json({ message: 'something went wrong', status: true });
                });
            }
            catch (ex) {
                next(ex);
            }
        });
    }
    static MakeDonation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { image, centerName } = req, other = __rest(req, ["image", "centerName"]);
                let sentEmail = true;
                if (req.email != 'anonymous') {
                    sentEmail = yield (0, Email_1.sendMail)({
                        reciever: req.email,
                        subject: 'You have successfully donated!!',
                        message: `
                    <div style="min-height:70vh; display:flex;align-items:center; justify-content:center;">
                     <p style="width:100%;text-align:center; font-size:18px">
                    Thank you<i> ${req.firstname}  ${req.lastname}</i> for donating ${req.donate} to ${centerName} center.<br/>
                    </p>
                </div>`
                    })
                        .then((res) => res)
                        .catch((err) => false);
                }
                if (!sentEmail) {
                    return {
                        message: 'Something went wrong ',
                        status: false
                    };
                }
                let cloudImage = { image: 'null', status: true };
                if (image !== 'null') {
                    cloudImage = yield cloudinary_1.v2.uploader
                        .upload(image, { public_id: 'olympic_flag', resource_type: 'image' })
                        .then((result) => {
                        return {
                            image: result === null || result === void 0 ? void 0 : result.secure_url,
                            status: true
                        };
                    })
                        .catch((_err) => {
                        return {
                            status: false
                        };
                    });
                }
                if (!(cloudImage === null || cloudImage === void 0 ? void 0 : cloudImage.status)) {
                    return {
                        message: 'something went wrong',
                        status: false
                    };
                }
                return Donation_1.default.create(Object.assign(Object.assign({}, other), { image: cloudImage === null || cloudImage === void 0 ? void 0 : cloudImage.image }))
                    .then((result) => {
                    return {
                        message: 'Successfuly donated',
                        status: true
                    };
                })
                    .catch((err) => {
                    return {
                        message: 'Something went wrong',
                        status: false
                    };
                });
            }
            catch (ex) {
                return {
                    message: ex.message,
                    status: false
                };
            }
        });
    }
    static MakeDonations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CenterController.MakeDonation(req.body);
            res.status(200).json(result);
        });
    }
    static FulfillPledge(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CenterController.MakeDonation(req.body);
            if (result.status) {
                return Pledge_1.default.findOne({
                    where: {
                        email: req.body.email
                    }
                }).then((_res) => {
                    return _res === null || _res === void 0 ? void 0 : _res.update({
                        month: new Date().getMonth() == 11 ? 0 : new Date().getMonth() + 1
                    });
                }).then((_res) => {
                    res.status(200).json({
                        message: "successfully fulfill the pledge",
                        status: true
                    });
                }).catch(err => {
                    console.log(err.message);
                    res.status(200).json({
                        message: 'something went wrong',
                        status: false
                    });
                });
            }
            res.status(200).json(result);
        });
    }
    static MakePledge(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _b = req.body, { centerName } = _b, rest = __rest(_b, ["centerName"]);
                const sentEmail = yield (0, Email_1.sendMail)({
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
                Pledge_1.default.create(req.body)
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
            }
            catch (ex) {
                next(ex);
            }
        });
    }
    static EditProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _b = req.body, { token } = _b, rest = __rest(_b, ["token"]);
                const response = yield CenterController.verify_data(token, process.env.CENTER_LOGIN_JWT);
                if (!(response === null || response === void 0 ? void 0 : response.status)) {
                    return res.status(200).json({
                        massage: 'Not authorized to this page',
                        status: false
                    });
                }
                Orphangecenter_1.default.findByPk(response.data.unique_id)
                    .then((response) => {
                    if (response)
                        return response === null || response === void 0 ? void 0 : response.update(rest);
                })
                    .then((response) => {
                    return res.status(200).json({
                        message: 'success update',
                        status: true
                    });
                })
                    .catch((_err) => {
                    return res.status(200).json({
                        message: 'Failed to update',
                        status: false
                    });
                });
            }
            catch (ex) {
                next(ex);
            }
        });
    }
    static VerifyDonation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { unique_id } = req.params;
                Donation_1.default.findByPk(unique_id)
                    .then((_resp) => {
                    _resp === null || _resp === void 0 ? void 0 : _resp.update({
                        verify: true
                    }).then((_res) => {
                        res.status(200).json({
                            message: 'successfuly update',
                            status: true
                        });
                    }).catch((_error) => {
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
            }
            catch (ex) {
                next(ex);
            }
        });
    }
    static DeleteDonation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { unique_id } = req.params;
                Donation_1.default.destroy({ where: { unique_id } })
                    .then((_resp) => {
                    res.status(200).json({ status: true, message: 'deleted successfully' });
                })
                    .catch((_error) => {
                    res.status(200).json({
                        message: 'fail to delete',
                        status: false
                    });
                });
            }
            catch (ex) {
                next(ex);
            }
        });
    }
}
exports.default = CenterController;
_a = CenterController;
CenterController.encoded_data = (data, word, time = 48) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, jsonwebtoken_1.sign)(data, word, { expiresIn: `${time}h` });
});
CenterController.hash_password = (password) => __awaiter(void 0, void 0, void 0, function* () {
    let salt = yield (0, bcrypt_1.genSalt)(10);
    return (0, bcrypt_1.hash)(password, salt);
});
CenterController.verify_password = (password, hash_password) => {
    return (0, bcrypt_1.compare)(password, hash_password);
};
CenterController.verify_data = (encoded_string, key) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, jsonwebtoken_1.verify)(encoded_string, key, (_err, _result) => {
        if (_err)
            return { error: _err, status: false };
        return { data: _result, status: true };
    });
});
CenterController.Sort = (array) => {
    return array === null || array === void 0 ? void 0 : array.sort((a, b) => b.createdAt.localCompare(a.createdAt));
};
node_cron_1.default.schedule('35 01 * * *', function () {
    console.log('heeee');
    const s = new SendMailToPromise();
});
class SendMailToPromise {
    constructor() {
        SendMailToPromise.GetUsers();
    }
    static GetUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            Pledge_1.default.findAll({
                where: {
                    month: {
                        [sequelize_1.Op.lt]: new Date().getMonth()
                    }
                }
            })
                .then((res) => {
                if (res == null)
                    return;
                if (res.dataValues.day <= new Date().getDay()) {
                    res.map((val) => {
                        const url = `${process.env.FRONT_END_URL}center/fulfillpledge?email=${val.dataValues.email}&firstname=${val.dataValues.firstname}&lastname=${val.dataValues.lastname}&centerName=${val.dataValues.centerName}&donate=${val.dataValues.donate}&orphan_id=${val.dataValues.orphan_id}&month=${val.dataValues.month}`;
                        (0, Email_1.sendMail)({
                            reciever: val.dataValues.email,
                            subject: 'Remindering email of the pledge you promise',
                            message: `                    
                            <div class="" style="font-family: poppin; width: 100%; min-height: 50vh; ">
                            <div class="row" style="width: 80%; margin: 40px auto; padding: 20px">
                                <div style="text-align: center; word-spacing: 1px">
                                    <p class="" style="font-size: 29px">
                                        Good day ${val.dataValues.firstname} ${val.dataValues.lastname}, this is a soft reminder of your pledge you promise ${val.dataValues.centerName}center monthly. <br />
                                        To fulfill your promise
                                        
                                         <a href="${url}" target='_blank' style="color: blue;display: block;width:100%; padding:20px;background:blue;color:white; border-radius:10px">click here</a>
                                    </p>
                                    <b style="font-size: 18px"> note: This soft reminder email will be resend to you tomorrow </b>
                                </div>
                            </div>
                        </div> `
                        });
                    });
                }
            })
                .catch((_err) => {
                return null;
            });
        });
    }
}
