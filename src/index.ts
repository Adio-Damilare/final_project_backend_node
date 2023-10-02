import express, {NextFunction, Request, Response} from 'express';
import Http from 'http';
import cors from 'cors';
import env from 'dotenv';
import {sequelize} from './connection';
import centerRoute from './Routes/CenterModel'



const Server = express();
env.config();

// passing in mildware to express
Server.use(express.json({limit: '1000mb'}));
Server.use(express.urlencoded({extended: true, limit: '1000mb'}));
Server.use(
    cors({
        credentials: true,
        methods: ['POST', 'GET', 'DELETE', 'PATCH', 'PUT'],
        origin: '*',
        optionsSuccessStatus: 200
    })
);
(async () => {
    try {
        await sequelize.authenticate().then(async(res)=>{
            // await sequelize.drop()
            await sequelize.sync();
            console.log('connect to databse successfully');
        }).catch((err)=>console.log(`Failed to connect to database with the error of ${err.message}`));
    } catch (err: any) {
        console.log(err.message);
    }
})();

//  to get the method and ip of the request
Server.use((req, response, next) => {
    console.log(`Incoming -> Method [${req.method}]  url -> [${req.url}] IP -> [${req.socket.remoteAddress}]`);
    response.on('finish', () => {
        console.log(`Incoming -> Method [${req.method}]  url -> [${req.url}] IP -> [${req.socket.remoteAddress}]  Status - [${response.statusCode}]`);
    });
    next();
});

//  entry point main
Server.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            message: 'Welcome to Oluwadamilare final project back-end ',
            status: true
        });
    } catch (ex) {
        next(ex);
    }
});


Server.use("/api/center/",centerRoute)

Server.use((req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(404).send({
            message: 'unknown Request to this application',
            status: false
        });
    } catch (err: any) {
        next(err);
    }
});

let PORT = process.env.PORT || 9000;

Http.createServer(Server).listen(PORT, () => {
    console.log(`App is Listen On Port ${PORT}`);
});