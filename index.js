const express = require("express");
const cool = require('cool-ascii-faces');
const app = express();
const PORT = process.env.PORT || 16078;

app.use("/",express.static("./public"));

app.get("/cool",(request,response)=>{
    response.send(cool());
});

app.get("/about",(request,response)=>{
    app.use("/",express.static("./public/about.html"));
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}...`);
});