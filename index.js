const express = require("express");
const cool = require('cool-ascii-faces');
const app = express();
const PORT = process.env.PORT || 16078;

app.use("/",express.static("./public"));
app.use("/about",express.static("./public/about.html"));

app.get("/cool",(request,response)=>{
    response.send(cool());
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}...`);
});


// index-GAM.js

const array_data = [
    { autonomic_community: "Andalucía", year: 2021, between_20_24_yo: 3666, between_25_29_yo: 5409, between_30_34_yo: 5996 },
    { autonomic_community: "Andalucía", year: 2020, between_20_24_yo: 2156, between_25_29_yo: 3201, between_30_34_yo: 3690 },
    { autonomic_community: "Asturias", year: 2021, between_20_24_yo: 304, between_25_29_yo: 510, between_30_34_yo: 483 },
    { autonomic_community: "Islas Baleares", year: 2021, between_20_24_yo: 6320, between_25_29_yo: 1023, between_30_34_yo: 1239 },
    { autonomic_community: "Canarias", year: 2021, between_20_24_yo: 947, between_25_29_yo: 1625, between_30_34_yo: 1643 },
    { autonomic_community: "Madrid", year: 2021, between_20_24_yo: 6028, between_25_29_yo: 10836, between_30_34_yo: 10004 },
    { autonomic_community: "Castilla Y León", year: 2021, between_20_24_yo: 766, between_25_29_yo: 1171, between_30_34_yo: 1210 },
    { autonomic_community: "Castilla - La Mancha", year: 2021, between_20_24_yo: 984, between_25_29_yo: 1304, between_30_34_yo: 1512 },
    { autonomic_community: "Cataluña", year: 2021, between_20_24_yo: 7305, between_25_29_yo: 12960, between_30_34_yo: 13077 },
    { autonomic_community: "Cataluña", year: 2020, between_20_24_yo: 4469, between_25_29_yo: 8086, between_30_34_yo: 7808 },
    { autonomic_community: "Cataluña", year: 2019, between_20_24_yo: 6397, between_25_29_yo: 12400, between_30_34_yo: 12023 }
];

let array_between_30_34_yo_cat= array_data.slice(-3).map(obj=>
    obj.between_30_34_yo
);

function average(arr){
    let acc=0;
    if(arr.length===0){
        return 0;
    }
    arr.forEach(n =>{
        acc+= n;
    });

    return acc/arr.length;
}

app.get("/samples/GAM",(request,response)=>{
    response.json(average(array_between_30_34_yo_cat));
});