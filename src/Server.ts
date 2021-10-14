import cookieParser from 'cookie-parser';
import path from 'path';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import api from './route/api';
import web from './route/web';
import { Config } from './config';
var cons = require('consolidate');
const appApi = express();
const appWeb = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

appApi.use(express.json());
appApi.use(express.urlencoded({ extended: true }));
appApi.use(cors({
    origin: [`http://localhost:${Config.Props.WEB.port}`]
}))
appWeb.use(express.urlencoded({ extended: true }));
appApi.use(cookieParser());
appWeb.use(cookieParser());

/* Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}
*/

// Add APIs
appApi.use('/api', api);


/************************************************************************************
 *                              Serve front-end content
***********************************************************************************/

const staticDir = path.join(__dirname, 'public');
const staticView = path.join(__dirname, 'view');
appWeb.engine('html', cons.swig)
appWeb.set("views", staticView)
appWeb.set('view engine', 'html');
appApi.use('/public', express.static(staticDir));
appWeb.use(web)

// Export express instance
export const appAPI = appApi;
export const appWEB = appWeb;
