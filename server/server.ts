import express, { Express } from 'express';
import cors from "cors";
import fs from "fs";
import path from "path";
import { createLanguageModel, createJsonTranslator, processRequests, Result } from "typechat";
import { QueryParams } from "./queryParamsSchema.js";
import dotenv from "dotenv";

const app: Express = express();
const port = 1337;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
dotenv.config();

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(path.join(__dirname, "queryParamsSchema.ts"), "utf8");
const translator = createJsonTranslator<QueryParams>(model, schema, "QueryParams");

console.log(translator);

app.post("/api/query-request", async (req, res) => {
    const { newMessage } = req.body;
    console.log(newMessage);

    if (!newMessage || newMessage === "") {
        console.log("missing query");
        res.json({error: "missing query"});
        return;
    }

    // query TypeChat to translate this into an intent
    const response: Result<QueryParams> = await translator.translate(newMessage as string);

    if (!response.success) {
        console.log(response.message);
        res.json({error: response.message});
        return;
    }

    await processQuery(response.data);

    res.json({
        items: response.data
    });
});

const processQuery = async (cart: QueryParams) => {
    // Outputs the resulting query
    console.log(JSON.stringify(cart, undefined, 2));
};

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running on port 1337`);
});


