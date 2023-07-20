require("dotenv").config();

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const { logger } = require("./middleware/logger");
const helmet = require("helmet");
const winston = require("winston");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const { PORT } = process.env;

app.use(helmet());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(logger);
app.use(
	cors({
		origin: [
			"https://tech-recruitr-frontend.onrender.com",
			"http://localhost:3000",
			"http://localhost:3001",
		],
	})
);
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);

	if (req.method == "OPTIONS") {
		res.header(
			"Access-Control-Allow-Methods",
			"PUT, POST, PATCH, DELETE, GET"
		);
		return res.status(200).json({});
	}

	return next();
});

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")(app);

app.listen(PORT, winston.info(`App is listening on port ${PORT}`));
