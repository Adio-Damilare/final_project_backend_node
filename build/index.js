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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = require("./connection");
const CenterModel_1 = __importDefault(require("./Routes/CenterModel"));
const Server = (0, express_1.default)();
dotenv_1.default.config();
// passing in mildware to express
Server.use(express_1.default.json({ limit: '1000mb' }));
Server.use(express_1.default.urlencoded({ extended: true, limit: '1000mb' }));
Server.use((0, cors_1.default)({
    credentials: true,
    methods: ['POST', 'GET', 'DELETE', 'PATCH', 'PUT'],
    origin: '*',
    optionsSuccessStatus: 200
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection_1.sequelize.authenticate().then((res) => __awaiter(void 0, void 0, void 0, function* () {
            yield connection_1.sequelize.sync();
            console.log('connect to databse successfully');
        })).catch((err) => console.log(`Failed to connect to database with the error of ${err.message}`));
    }
    catch (err) {
        console.log(err.message);
    }
}))();
//  to get the method and ip of the request
Server.use((req, response, next) => {
    console.log(`Incoming -> Method [${req.method}]  url -> [${req.url}] IP -> [${req.socket.remoteAddress}]`);
    response.on('finish', () => {
        console.log(`Incoming -> Method [${req.method}]  url -> [${req.url}] IP -> [${req.socket.remoteAddress}]  Status - [${response.statusCode}]`);
    });
    next();
});
//  entry point main
Server.get('/', (req, res, next) => {
    try {
        res.status(200).json({
            message: 'Welcome to Oluwadamilare final project back-end ',
            status: true
        });
    }
    catch (ex) {
        next(ex);
    }
});
Server.use("/api/center/", CenterModel_1.default);
Server.use((req, res, next) => {
    try {
        res.status(404).send({
            message: 'unknown Request to this application',
            status: false
        });
    }
    catch (err) {
        next(err);
    }
});
let PORT = process.env.PORT || 9000;
http_1.default.createServer(Server).listen(PORT, () => {
    console.log(`App is Listen On Port ${PORT}`);
});
