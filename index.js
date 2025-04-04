import express from "express";
import {loadBackendGAM} from "./src/back/index-GAM.js";
import { loadBackendIBL } from "./src/back/index-IBL.js";
import { loadBackendPVS } from "./src/back/index-PVS.js";

//const cool = require('cool-ascii-faces');
const app = express();
const PORT = process.env.PORT || 16078;
const BASE_API= "/api/v1";

app.use("/",express.static("./public"));
app.use("/about",express.static("./public/about.html"));
app.use(express.json());

// app.get("/cool",(request,response)=>{
//     response.send(cool());
// });

loadBackendGAM(app);

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}...`);
});

// index-PVS.js

loadBackendPVS(app);

// index-IBL.js

loadBackendIBL(app);
