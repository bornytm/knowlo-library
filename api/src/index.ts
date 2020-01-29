import app from "./app";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import * as path from "path";

import { config } from "./config";
import { initDBAccessors } from "./modules/utils/init-dbaccessors";
import { AddressInfo } from "net";

app.set("port", config.PORT);

let server: https.Server | http.Server;
if (process.env.SSL === "true") {
	const options = {
		key: fs.readFileSync(path.join(__dirname, "../certs/private.key")),
		cert: fs.readFileSync(path.join(__dirname, "../certs/certificate.crt")),
	};
	server = https.createServer(options, app);
} else {
	server = http.createServer(app);
}

const onError = (error: any) => {
	if (error.syscall !== "listen")
		throw error;

	switch (error.code) {
		case "EACCES":
			console.error(config.PORT + " requires elevated privileges");
			process.exit(-1);
		case "EADDRINUSE":
			console.error(config.PORT + " is already in use");
			process.exit(-1);
		default:
			console.error(error.message);
			process.exit(-1);
	}
};

const onListening = () => {
	if (process.env.SSL === "true") { console.log("RUN WITH SSL"); }
	console.log("Listening on " + config.PORT);
	const addr = <AddressInfo> server.address();
	let apiUrl = process.env.SSL === "true" ? "https://" : "http://";
	apiUrl += `${process.env.API_HOST || "localhost"}:${addr.port}`;
	console.log(apiUrl);
};

server.on("error", onError);
server.on("listening", onListening);

const init = async () => {
	await initDBAccessors();
};

init().then(
	() => {
		server.listen(config.PORT);
	},
	err => {
		console.error(err.message);
		console.error(err.stack);
		process.exit(-1);
	},
);