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

import * as datos from './index-GAM.js';


// let array_between_30_34_yo_cat= datos.array_data.slice(-3).map(obj=>
//     obj.between_30_34_yo
// );

// function average(){
//     let acc=0;
//     if(array_between_30_34_yo_cat.length===0){
//         return 0;
//     }
//     array_between_30_34_yo_cat.forEach(n =>{
//         acc+= n;
//     });

//     return acc/array_between_30_34_yo_cat.length;
// }

app.get("/samples/GAM",(request,response)=>{
    let res= datos.average();
    response.send(res.toString());
});

// index-PVS.js

const unemploymentData = [
    { autonomic_community: "Andalucía", year: 2021, quarter: "T1", unemployment_rate: 22.8, previous_quarter_var: 0.01, previous_year_quarter_var: 1.54 },
    { autonomic_community: "Aragón", year: 2021, quarter: "T1", unemployment_rate: 12.4, previous_quarter_var: -0.13, previous_year_quarter_var: 1.72 },
    { autonomic_community: "Extremadura", year: 2021, quarter: "T1", unemployment_rate: 23.3, previous_quarter_var: 2.01, previous_year_quarter_var: -0.26 },
    { autonomic_community: "Galicia", year: 2021, quarter: "T1", unemployment_rate: 12.8, previous_quarter_var: 1.17, previous_year_quarter_var: 0.18 },
    { autonomic_community: "Andalucía", year: 2021, quarter: "T2", unemployment_rate: 21.8, previous_quarter_var: -0.98, previous_year_quarter_var: 0.45 },
    { autonomic_community: "Castilla-La Mancha", year: 2021, quarter: "T2", unemployment_rate: 16.7, previous_quarter_var: -0.84, previous_year_quarter_var: -0.17 },
    { autonomic_community: "Cataluña", year: 2021, quarter: "T2", unemployment_rate: 12.4, previous_quarter_var: -0.65, previous_year_quarter_var: -0.34 },
    { autonomic_community: "Canarias", year: 2021, quarter: "T3", unemployment_rate: 24.5, previous_quarter_var: -0.28, previous_year_quarter_var: -0.55 },
    { autonomic_community: "Islas Baleares", year: 2021, quarter: "T3", unemployment_rate: 10.0, previous_quarter_var: -4.72, previous_year_quarter_var: -3.26 },
    { autonomic_community: "Comunidad de Madrid", year: 2021, quarter: "T4", unemployment_rate: 10.2, previous_quarter_var: -1.95, previous_year_quarter_var: -3.35 },
    { autonomic_community: "Extremadura", year: 2020, quarter: "T1", unemployment_rate: 23.6, previous_quarter_var: 0.11, previous_year_quarter_var: 1.07 },
    { autonomic_community: "Andalucía", year: 2020, quarter: "T1", unemployment_rate: 21.2, previous_quarter_var: 0.41, previous_year_quarter_var: 0.13 },
    { autonomic_community: "Aragón", year: 2020, quarter: "T1", unemployment_rate: 10.6, previous_quarter_var: 0.71, previous_year_quarter_var: 0.14 },
    { autonomic_community: "Asturias", year: 2020, quarter: "T1", unemployment_rate: 14.4, previous_quarter_var: 1.23, previous_year_quarter_var: -0.66 },
    { autonomic_community: "Cantabria", year: 2020, quarter: "T1", unemployment_rate: 11.1, previous_quarter_var: -0.09, previous_year_quarter_var: -1.11 },
    { autonomic_community: "Ceuta", year: 2020, quarter: "T1", unemployment_rate: 23.9, previous_quarter_var: -3.69, previous_year_quarter_var: 1.58 },
    { autonomic_community: "Castilla y León", year: 2020, quarter: "T2", unemployment_rate: 12.4, previous_quarter_var: 0.53, previous_year_quarter_var: 0.59 },
    { autonomic_community: "Castilla-La Mancha", year: 2020, quarter: "T2", unemployment_rate: 16.8, previous_quarter_var: -1.27, previous_year_quarter_var: 0.42 },
    { autonomic_community: "Canarias", year: 2020, quarter: "T2", unemployment_rate: 21.6, previous_quarter_var: 2.76, previous_year_quarter_var: 0.55 },
    { autonomic_community: "Cataluña", year: 2020, quarter: "T2", unemployment_rate: 12.8, previous_quarter_var: 2.12, previous_year_quarter_var: 1.61 },
    { autonomic_community: "Andalucía", year: 2020, quarter: "T3", unemployment_rate: 23.8, previous_quarter_var: 2.48, previous_year_quarter_var: 1.97 },
    { autonomic_community: "Comunidad de Madrid", year: 2020, quarter: "T3", unemployment_rate: 13.3, previous_quarter_var: 0.64, previous_year_quarter_var: 2.99 },
    { autonomic_community: "Canarias", year: 2020, quarter: "T4", unemployment_rate: 25.2, previous_quarter_var: 0.18, previous_year_quarter_var: 6.44 },
    { autonomic_community: "Islas Baleares", year: 2020, quarter: "T4", unemployment_rate: 17.3, previous_quarter_var: 4.06, previous_year_quarter_var: 7.43 }
];

//Parametros en reduce:  .reduce(acc, currentValue, currentIndex, array)

let averageRateAndalucia = 
    unemploymentData
    .filter((v) => {return (v.autonomic_community === "Andalucía")})
    .map((v) => {return v.unemployment_rate})
    .reduce((acc, rate, _, arr) => {
        return acc + (rate / arr.length);
    }, 0);


app.get("/samples/PVS",(request,response)=>{
        response.send(averageRateAndalucia.toString());
});
