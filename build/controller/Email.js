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
exports.sendMail = void 0;
const nodemailer_1 = require("nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = (0, nodemailer_1.createTransport)({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});
const sendMail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: data.reciever,
        subject: data.subject,
        html: data.message
    };
    let result = yield transporter.sendMail(mailOptions).then((_res) => {
        return true;
    }).catch((_error) => {
        console.log(_error.message);
        return false;
    });
    return result;
});
exports.sendMail = sendMail;
// export const Months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
