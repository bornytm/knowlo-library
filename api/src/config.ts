import { URL } from "url";

export interface Config {
	PRODUCTION_MODE: boolean;
	PORT: number;
	NAMESPACE: string;
	JWT_TOKEN_SECRET_KEY: string;
	NEO4J_SETTINGS: {
		uri: string;
		user: string;
		password: string;
	};
}

export let config: Config = {
	PRODUCTION_MODE: process.env.PRODUCTION_MODE ? (process.env.PRODUCTION_MODE === "true") : false,
	PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
	NAMESPACE: process.env.NAMESPACE ? process.env.NAMESPACE : "knowto",
	JWT_TOKEN_SECRET_KEY: process.env.JWT_TOKEN_SECRET_KEY ? process.env.JWT_TOKEN_SECRET_KEY : "54321-54321-54321-54321",
	NEO4J_SETTINGS: {
		uri: "bolt://localhost:7687",
		user: "neo4j",
		password: "dev",
	},
};

if (process.env.GRAPHENEDB_URL) {
	try {
		const grapheneURL = new URL(process.env.GRAPHENEDB_URL);
		config.NEO4J_SETTINGS = {
			uri: grapheneURL.protocol + "//" + grapheneURL.host,
			user: grapheneURL.username,
			password: grapheneURL.password,
		};
	} catch (err) {
		console.error(err);
		process.exit(-1);
	}
}