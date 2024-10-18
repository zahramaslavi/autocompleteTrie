import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import routes from "./routes";
import Redis from "ioredis";
import { Request, Response } from "express";
import TrieRedis from "./repository/trieRedis";

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use((req, res, next) => {
    // Todo: authentication
    next();
});

let redisClient: Redis = new Redis({
    host: 'redis-server',
    port: 6379
});
let redisTrie: TrieRedis | null = null;
app.use((req: Request, res: Response, next) => {
    req.redisTrie = redisTrie; // Attach redisClient to req
    next();
});

app.use(bodyParser.json());

app.use("/", routes);

declare global {
    namespace Express {
        interface Request {
            redisTrie: TrieRedis | null;
        }
    }
}

app.use((req: Request, res: Response) => {
    res.status(404).render("404");
});

let server: any = null;

export const startServer = async () => {
    try {
        await new Promise<void>((resolve, reject) => {
            redisClient.on("connect", () => {
                console.log("Connected to Redis");
                resolve();
            });

            redisClient.on("error", (error) => {
                console.log("Redis connection error:", error);
                reject(error);
            });
        });


        redisTrie = new TrieRedis(redisClient);
        
        const words = {"best": 10, "bet": 5, "buy": 3, "bee": 4, "bar": 11, "current": 9, "currency": 3, "car": 19, "read": 30, "red": 5, "reading": 4, "beg": 7, "boom": 4, "broom":3, "khoshkholgh": 100, "khosh": 3, "khoshahang": 1};
        
        redisTrie.initTrie(words);        

        server = app.listen(3001);
        console.log("Listening on port 3001!--");

        return server;
        
    } catch (error) {
        console.log("An error happened: ", error);        
    }
}

export const closeServer = async () => {
    try {
        if (redisClient) {
            await redisClient.quit();
        }

        if (server) {
            server.close(() => {
                console.log("Server closed.");
            });
        }
    } catch (error) {
        console.error("Error closing server:", error);
    }
};

export default app;