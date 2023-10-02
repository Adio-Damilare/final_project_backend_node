"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validator_1 = require("../validator");
const CenterController_1 = __importDefault(require("../controller/CenterController"));
const Router = express_1.default.Router();
Router.route("/create").post((0, validator_1.validation_schema)(validator_1.schema.create_ceneter, 'create'), CenterController_1.default.create);
Router.route('/login').post((0, validator_1.validation_schema)(validator_1.schema.login_center, 'login'), CenterController_1.default.Login);
Router.route('/').get((0, validator_1.validation_schema)(validator_1.schema.get_center, 'getcenter'), CenterController_1.default.Get_Login_center);
Router.get('/search', (0, validator_1.validation_schema)(validator_1.schema.get_center, 'getcenter'), CenterController_1.default.Get_All_Center);
Router.post('/donate', (0, validator_1.validation_schema)(validator_1.schema.donateProof, 'donate'), CenterController_1.default.MakeDonations);
Router.post('/pledge', (0, validator_1.validation_schema)(validator_1.schema.pledge, 'pledge'), CenterController_1.default.MakePledge);
Router.post('/fulfill', (0, validator_1.validation_schema)(validator_1.schema.donateProof, 'donate'), CenterController_1.default.FulfillPledge);
Router.post('/editprofile', CenterController_1.default.EditProfile);
Router.patch('/update/:unique_id', CenterController_1.default.VerifyDonation);
Router.delete('/delete/donation/:unique_id', CenterController_1.default.DeleteDonation);
exports.default = Router;
