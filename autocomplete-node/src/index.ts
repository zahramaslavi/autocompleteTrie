import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import routes from "./routes";
import { initTrie } from "./controllers";

const app = express();

(async () => {
    try {
        app.use(cors())
        app.listen(3001);
        console.log("Listening on port 3001!--");
    
        app.use(morgan("dev"));

        app.use((req, res, next) => {
            // Todo: authentication
            next();
        });

        initTrie();

        app.use(bodyParser.json());

        app.use("/", routes);

        app.use((req, res) => {
            res.status(404).render("404");
        });
    } catch (error) {
        console.log("An error happened: ", error);        
    }
})();

export default app;