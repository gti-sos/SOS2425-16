const express = require("express");
const cool = require('cool-ascii-faces');
const app = express();
const PORT = process.env.PORT || 16078;
const BASE_API= "/api/v1/";

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
    { autonomic_community: "Andalucía", year: 2021, quarter: "Q1", between_20_24_yo: 3666, between_25_29_yo: 5409, between_30_34_yo: 5996 },
    { autonomic_community: "Andalucía", year: 2020, quarter: "Q2", between_20_24_yo: 2156, between_25_29_yo: 3201, between_30_34_yo: 3690 },
    { autonomic_community: "Asturias", year: 2021, quarter: "Q3", between_20_24_yo: 304, between_25_29_yo: 510, between_30_34_yo: 483 },
    { autonomic_community: "Islas Baleares", year: 2021, quarter: "Q1", between_20_24_yo: 6320, between_25_29_yo: 1023, between_30_34_yo: 1239 },
    { autonomic_community: "Canarias", year: 2021, quarter: "Q2", between_20_24_yo: 947, between_25_29_yo: 1625, between_30_34_yo: 1643 },
    { autonomic_community: "Madrid", year: 2021, quarter: "Q3", between_20_24_yo: 6028, between_25_29_yo: 10836, between_30_34_yo: 10004 },
    { autonomic_community: "Castilla Y León", year: 2021, quarter: "Q1", between_20_24_yo: 766, between_25_29_yo: 1171, between_30_34_yo: 1210 },
    { autonomic_community: "Castilla - La Mancha", year: 2021, quarter: "Q2", between_20_24_yo: 984, between_25_29_yo: 1304, between_30_34_yo: 1512 },
    { autonomic_community: "Cataluña", year: 2021, quarter: "Q3", between_20_24_yo: 7305, between_25_29_yo: 12960, between_30_34_yo: 13077 },
    { autonomic_community: "Cataluña", year: 2020, quarter: "Q1", between_20_24_yo: 4469, between_25_29_yo: 8086, between_30_34_yo: 7808 },
    { autonomic_community: "Cataluña", year: 2019, quarter: "Q1", between_20_24_yo: 6397, between_25_29_yo: 12400, between_30_34_yo: 12023 }
];

let array_between_30_34_yo_cat= array_data.slice(-3).map(obj=>
    obj.between_30_34_yo
);

function average(){
    let acc=0;
    if(array_between_30_34_yo_cat.length===0){
        return 0;
    }
    array_between_30_34_yo_cat.forEach(n =>{
        acc+= n;
    });

    return acc/array_between_30_34_yo_cat.length;
}

app.get("/samples/GAM",(request,response)=>{
    let res= average();
    response.send(res.toString());
});

//11.

app.get(BASE_API+"/emigration-stats",(request,response)=>{
    let res= array_data;
    response.send(res.toString());
});

//13.

app.get(BASE_API+"/emigration-stats/loadInitialData",(request,response)=>{
    let res= array_data;
    console.log("New GET to /emigration-stats"); // hacer slice
    response.send( JSON.stringify(res,null,2));
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

// index-IBL.js


const taxesData = [
    { autonomic_community: "Andalucía", year: 2021, quarter: "Q1", ine_irpf: 3916659, ine_soc_no_consolidadas: 2826482, ine_iva: 24136288 },
    { autonomic_community: "Aragón", year: 2021, quarter: "Q2", ine_irpf: 73006, ine_soc_no_consolidadas: 937242, ine_iva: 9372455 },
    { autonomic_community: "Asturias, Principado de", year: 2021, quarter: "Q3", ine_irpf: 53477, ine_soc_no_consolidadas: 419513, ine_iva: 5104967 },
    { autonomic_community: "Balears,Illes", year: 2021, quarter: "Q1", ine_irpf: 571182, ine_soc_no_consolidadas: 838753, ine_iva: 4119440 },
    { autonomic_community: "Cantabria", year: 2021, quarter: "Q2", ine_irpf: 30049, ine_soc_no_consolidadas: 356759, ine_iva: 3382981 },
    { autonomic_community: "Castilla y León", year: 2021, quarter: "Q3", ine_irpf: 1285544, ine_soc_no_consolidadas: 1001814, ine_iva: 10195560 },
    { autonomic_community: "Castilla - La Mancha", year: 2021, quarter: "Q1", ine_irpf: 988287, ine_soc_no_consolidadas: 699208, ine_iva: 7078642 },
    { autonomic_community: "Cataluña", year: 2021, quarter: "Q2", ine_irpf: 3880364, ine_soc_no_consolidadas: 6975928, ine_iva: 64849291 },
    { autonomic_community: "Comunitat Valenciana", year: 2021, quarter: "Q1", ine_irpf: 2467168, ine_soc_no_consolidadas: 2833549, ine_iva: 26538375 },
    { autonomic_community: "Extremadura", year: 2021, quarter: "Q1", ine_irpf: 509167, ine_soc_no_consolidadas: 259255, ine_iva: 2844182 },
    { autonomic_community: "Galicia", year: 2021, quarter: "Q1", ine_irpf: 1378027, ine_soc_no_consolidadas: 1647520, ine_iva: 15803448 },
    { autonomic_community: "Madrid, Comunidad de", year: 2021, quarter: "Q1", ine_irpf: 3572326, ine_soc_no_consolidadas: 15509272, ine_iva: 123096234 },
    { autonomic_community: "Murcia, Región de", year: 2021, quarter: "Q2", ine_irpf: 694035, ine_soc_no_consolidadas: 749846, ine_iva: 7277119 },
    { autonomic_community: "Rioja, La", year: 2021, quarter: "Q3", ine_irpf: 175378, ine_soc_no_consolidadas: 213559, ine_iva: 1523642 },
    { autonomic_community: "Andalucía", year: 2020, quarter: "Q1", ine_irpf: 3797932, ine_soc_no_consolidadas: 2045255, ine_iva: 19655675 },
    { autonomic_community: "Aragón", year: 2020, quarter: "Q1", ine_irpf: 725392, ine_soc_no_consolidadas: 823261, ine_iva: 8257375 },
    { autonomic_community: "Asturias, Principado de", year: 2020, quarter: "Q1", ine_irpf: 525355, ine_soc_no_consolidadas: 287938, ine_iva: 3548610 },
    { autonomic_community: "Cantabria", year: 2020, quarter: "Q2", ine_irpf: 294038, ine_soc_no_consolidadas: 172383, ine_iva: 2829442 },
    { autonomic_community: "Castilla y León", year: 2020, quarter: "Q3", ine_irpf: 1278006, ine_soc_no_consolidadas: 760391, ine_iva: 8880282 },
    { autonomic_community: "Castilla - La Mancha", year: 2020, quarter: "Q1", ine_irpf: 965897, ine_soc_no_consolidadas: 585027, ine_iva: 5786846 },
    { autonomic_community: "Cataluña", year: 2020, quarter: "Q1", ine_irpf: 3839962, ine_soc_no_consolidadas: 6136336, ine_iva: 56706888 },
    { autonomic_community: "Comunitat Valenciana", year: 2020, quarter: "Q2", ine_irpf: 2409920, ine_soc_no_consolidadas: 2251326, ine_iva: 22543255 },
    { autonomic_community: "Extremadura", year: 2020, quarter: "Q3", ine_irpf: 497511, ine_soc_no_consolidadas: 225552, ine_iva: 2311629 },
    { autonomic_community: "Galicia", year: 2020, quarter: "Q1", ine_irpf: 1358533, ine_soc_no_consolidadas: 1138038, ine_iva: 13110283 },
    { autonomic_community: "Balears,Illes", year: 2020, quarter: "Q1", ine_irpf: 555447, ine_soc_no_consolidadas: 464026, ine_iva: 3534163 },
    { autonomic_community: "Madrid, Comunidad de", year: 2020, quarter: "Q2", ine_irpf: 3522254, ine_soc_no_consolidadas: 12702500, ine_iva: 93863668 },
    { autonomic_community: "Murcia, Región de", year: 2020, quarter: "Q3", ine_irpf: 672009, ine_soc_no_consolidadas: 649349, ine_iva: 93863668 },
    { autonomic_community: "Rioja, La", year: 2020, quarter: "Q1", ine_irpf: 173428, ine_soc_no_consolidadas: 152021, ine_iva: 1353261 },
    { autonomic_community: "Madrid, Comunidad de", year: 2019, quarter: "Q1", ine_irpf: 2323123, ine_soc_no_consolidadas: 9312321, ine_iva: 80221221 } 
];

//Parametros en reduce:  .reduce(acc, currentValue, currentIndex, array)

let averageRateIVAMadrid = 
    taxesData
    .filter((v) => {return (v.autonomic_community === "Madrid, Comunidad de")})
    .map((v) => {return v.ine_iva})
    .reduce((acc, rate, _, arr) => {
        return acc + (rate / arr.length);
    }, 0);

app.get("/samples/IBl",(request,response)=>{
        response.send(averageRateIVAMadrid.toString());
});
