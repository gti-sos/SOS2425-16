import express from "express"; 
import cors from "cors";
import { loadBackendGAM } from "./src/back/index-GAM.js";
import { loadBackendIBL } from "./src/back/index-IBL.js";
import { loadBackendPVS } from "./src/back/index-PVS.js";
import { handler } from "./src/front/build/handler.js";


const app = express();
const PORT = process.env.PORT || 16078;
const BASE_API= "/api/v1";

//app.use("/",express.static("./public"));
//app.use("/about",express.static("./public/about.html"));
app.use(express.json());
app.use(cors()); // Permite que no se bloquuen puertos (desarrollo y produccion)
console.log("C");
app.listen(PORT,()=>{
     console.log(`Server running on port ${PORT}...`);
});

// index-GAM.js

loadBackendGAM(app);

// index-PVS.js

loadBackendPVS(app);

// index-IBL.js

loadBackendIBL(app);

// Loads the front-end after the back-end.

app.use(handler);