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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.validation_schema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_schema = (schema, params) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            yield schema
                .validateAsync(['login', 'create', 'donate', 'pledge'].includes(params)
                ? req.body
                : params == 'getcenter' ? {
                    token: (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1],
                    bearer: (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[0]
                } : {});
            next();
        }
        catch (error) {
            res.status(200).json({
                message: error.message,
                status: false
            });
        }
    });
};
exports.validation_schema = validation_schema;
exports.schema = {
    create_ceneter: joi_1.default.object({
        center_name: joi_1.default.string().required(),
        country: joi_1.default.string().required(),
        no_orphanage: joi_1.default.number().required(),
        state: joi_1.default.string().required(),
        phone_number: joi_1.default.number().required(),
        lga: joi_1.default.string().required(),
        email: joi_1.default.string().required(),
        address: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
        goal: joi_1.default.string().required(),
        bankDetails: joi_1.default.object({
            bank: joi_1.default.string().required(),
            acctNo: joi_1.default.string().required(),
            code: joi_1.default.string().required(),
        })
    }),
    login_center: joi_1.default.object({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }),
    get_center: joi_1.default.object({
        bearer: joi_1.default.string().required().valid('BEARER'),
        token: joi_1.default.string().required(),
    }),
    donateProof: joi_1.default.object({
        email: joi_1.default.string(),
        firstname: joi_1.default.string(),
        lastname: joi_1.default.string(),
        phoneno: joi_1.default.string(),
        image: joi_1.default.string().required(),
        donate: joi_1.default.string().required(),
        comment: joi_1.default.string(),
        orphan_id: joi_1.default.string().required(),
        centerName: joi_1.default.string().required(),
        throughPaystack: joi_1.default.boolean().required(),
    }),
    pledge: joi_1.default.object({
        email: joi_1.default.string().required(),
        firstname: joi_1.default.string().required(),
        lastname: joi_1.default.string().required(),
        donate: joi_1.default.string().required(),
        day: joi_1.default.string().required(),
        orphan_id: joi_1.default.string().required(),
        centerName: joi_1.default.string().required(),
    })
};
