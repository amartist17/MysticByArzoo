const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv/config");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const upload = require("express-fileupload"); 
app.use(upload());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));


const apiRouter = require("./routes/apiRoute");
app.use("/api", apiRouter);

const viewRouter = require("./routes/viewRoute");
app.use("/", viewRouter);

app.all('*', (req, res, next) => {
    // next(new AppError(`Page ${req.originalUrl} not found`, 404));
    res.render('error',{
        status: '404',
        message:  `Page ${req.originalUrl} not found`,
    });
  });

module.exports = app;
