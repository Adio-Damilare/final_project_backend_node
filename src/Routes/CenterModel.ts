import  Express,{NextFunction, Request, Response}  from "express";
import { schema, validation_schema } from "../validator";
import CenterController from "../controller/CenterController";
 const Router=Express.Router();
Router.route("/create").post(validation_schema(schema.create_ceneter,'create'),CenterController.create)

Router.route('/login').post(validation_schema(schema.login_center,'login'),CenterController.Login)

Router.route('/').get(validation_schema(schema.get_center,'getcenter'),CenterController.Get_Login_center);

Router.get('/search',validation_schema(schema.get_center,'getcenter'),CenterController.Get_All_Center)
Router.post('/donate',validation_schema(schema.donateProof,'donate'),CenterController.MakeDonations);

Router.post('/pledge',validation_schema(schema.pledge,'pledge'),CenterController.MakePledge)
Router.post('/fulfill',validation_schema(schema.donateProof,'donate'),CenterController.FulfillPledge)


Router.post('/editprofile',CenterController.EditProfile)
Router.patch('/update/:unique_id',CenterController.VerifyDonation)
Router.delete('/delete/donation/:unique_id',CenterController.DeleteDonation)

export default Router;