// Importing dependencies
import session from 'express-session';
// import Sequelize from 'sequelize';
import uuid from 'uuid';
import connectSessionSequelize from "connect-session-sequelize";
// Importing sequelize connection string
import db from "./db.js";
// Importing .env config
import env from '../config/env.js';
const { v4 } = uuid;
export default class Session {
    SequelizeStore;
    SessionStore;
    app;
    secret;
    constructor(app, secret) {
        // Express application
        this.app = app;
        // Session secret
        this.secret = secret;
        // Creatiing a connector
        this.SequelizeStore = connectSessionSequelize(session.Store);
        // Creating new sequelize store, SequelizeStore takes object as parameter,
        // Parameter key "db" - our sequelize connection
        this.SessionStore = new this.SequelizeStore({
            db: db,
        });
        // Force sequelize to create Database table if it does not exist 
        this.SessionStore.sync();
    }
    init() {
        this.app.use(session({
            // Session id generation method1
            genid: () => {
                return v4();
            },
            store: this.SessionStore,
            secret: this.secret,
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 3600 * 1000 * 24,
                secure: env.env === 'production' ? true : false // If we are in production mode -  make cookie secure
            }
        }));
    }
}
