import express from 'express';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {db} from './utils/db.js'
import indexRouter from './routes/index.js';
import {createHandler} from "graphql-http/lib/use/express";
import expressPlayground from 'graphql-playground-middleware-express';
import {schemaWithResolvers} from "./graphql/index.js";
import { PubSub } from 'graphql-subscriptions';

const graphQLPlayground = expressPlayground.default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pubsub = new PubSub();

const app = express();

app.set('db', db);
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/playground', graphQLPlayground({endpoint: '/graphql'}))
app.all('/graphql', createHandler({
    schema: schemaWithResolvers,
    context: (req) => ({req, pubsub: pubsub, db: db})
}));
app.use('/', indexRouter);

export default app;
