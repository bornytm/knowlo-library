import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import { HttpCodes } from "./datamodels/common/HttpCodes";
import { ContextService } from "./modules/utils/context/context-service";
import { ResourcesRouter } from "./modules/resources/resources-router";

const app: express.Express = express();

app.use((req: Request, res: Response, next: NextFunction) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
	next();
});

app.use(logger("dev"));

app.use(bodyParser.json({
	limit: 1024 * 1024 * 50,
}));
app.use(ContextService.Instance.getMiddleware);
/*
    Routes
*/
app.use(ResourcesRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(HttpCodes.NOT_FOUND);
	next(new Error("Not found."));
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	if (!res.statusCode || res.statusCode === HttpCodes.OK) res.status(HttpCodes.INTERNAL_ERROR);
	console.error(error);
	res.json({
		message: error.message,
		stack: error.stack,
	});
});

export default app;