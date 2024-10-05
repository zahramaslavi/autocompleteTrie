import { Router } from "express";
import { getSearchTimes } from "../controllers/searchController";

const testRouter = Router()

testRouter.get("/times", getSearchTimes);
testRouter.get("/ties", (req, res) => {
    console.log("getting request ties")
    res.send({test: "test"});
});


export default testRouter;