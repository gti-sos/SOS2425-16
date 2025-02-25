const express = require("express");
const cool = require('cool-ascii-faces');
const app = express();
const PORT = process.env.PORT || 16078; // port por defecto si no el 16078

app.use("/",express.static("./public"));

app.get("/cool",(request,response)=>{
    response.send(cool());
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}...`); // cuando el server este listo, metodo asincrono
});