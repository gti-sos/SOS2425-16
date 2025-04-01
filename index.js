import express from "express";
import {loadBackendGAM} from "./src/back/index-GAM.js";
import { loadBackendIBL } from "./src/back/index-IBL.js";
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

const initialUnemploymentData = [
    { autonomic_community: "andalucia", year: 2021, quarter: "q1", unemployment_rate: 22.80, previous_quarter_var: 0.01, previous_year_quarter_var: 1.54 },
    { autonomic_community: "aragon", year: 2021, quarter: "q1", unemployment_rate: 12.4, previous_quarter_var: -0.13, previous_year_quarter_var: 1.72 },
    { autonomic_community: "extremadura", year: 2021, quarter: "q1", unemployment_rate: 23.3, previous_quarter_var: 2.01, previous_year_quarter_var: -0.26 },
    { autonomic_community: "galicia", year: 2021, quarter: "q1", unemployment_rate: 12.8, previous_quarter_var: 1.17, previous_year_quarter_var: 0.18 },
    { autonomic_community: "andalucia", year: 2021, quarter: "q2", unemployment_rate: 21.8, previous_quarter_var: -0.98, previous_year_quarter_var: 0.45 },
    { autonomic_community: "castilla-la-mancha", year: 2021, quarter: "q2", unemployment_rate: 16.7, previous_quarter_var: -0.84, previous_year_quarter_var: -0.17 },
    { autonomic_community: "catalunya", year: 2021, quarter: "q2", unemployment_rate: 12.4, previous_quarter_var: -0.65, previous_year_quarter_var: -0.34 },
    { autonomic_community: "canarias", year: 2021, quarter: "q3", unemployment_rate: 24.5, previous_quarter_var: -0.28, previous_year_quarter_var: -0.55 },
    { autonomic_community: "islas-baleares", year: 2021, quarter: "q3", unemployment_rate: 10.0, previous_quarter_var: -4.72, previous_year_quarter_var: -3.26 },
    { autonomic_community: "comunidad-de-madrid", year: 2021, quarter: "q4", unemployment_rate: 10.2, previous_quarter_var: -1.95, previous_year_quarter_var: -3.35 },
    { autonomic_community: "extremadura", year: 2020, quarter: "q1", unemployment_rate: 23.6, previous_quarter_var: 0.11, previous_year_quarter_var: 1.07 },
    { autonomic_community: "andalucia", year: 2020, quarter: "q1", unemployment_rate: 21.2, previous_quarter_var: 0.41, previous_year_quarter_var: 0.13 },
    { autonomic_community: "aragon", year: 2020, quarter: "q1", unemployment_rate: 10.6, previous_quarter_var: 0.71, previous_year_quarter_var: 0.14 },
    { autonomic_community: "asturias", year: 2020, quarter: "q1", unemployment_rate: 14.4, previous_quarter_var: 1.23, previous_year_quarter_var: -0.66 },
    { autonomic_community: "cantabria", year: 2020, quarter: "q1", unemployment_rate: 11.1, previous_quarter_var: -0.09, previous_year_quarter_var: -1.11 },
    { autonomic_community: "ceuta", year: 2020, quarter: "q1", unemployment_rate: 23.9, previous_quarter_var: -3.69, previous_year_quarter_var: 1.58 },
    { autonomic_community: "castilla-y-leon", year: 2020, quarter: "q2", unemployment_rate: 12.4, previous_quarter_var: 0.53, previous_year_quarter_var: 0.59 },
    { autonomic_community: "castilla-la-mancha", year: 2020, quarter: "q2", unemployment_rate: 16.8, previous_quarter_var: -1.27, previous_year_quarter_var: 0.42 },
    { autonomic_community: "canarias", year: 2020, quarter: "q2", unemployment_rate: 21.6, previous_quarter_var: 2.76, previous_year_quarter_var: 0.55 },
    { autonomic_community: "catalunya", year: 2020, quarter: "q2", unemployment_rate: 12.8, previous_quarter_var: 2.12, previous_year_quarter_var: 1.61 },
    { autonomic_community: "andalucia", year: 2020, quarter: "q3", unemployment_rate: 23.8, previous_quarter_var: 2.48, previous_year_quarter_var: 1.97 },
    { autonomic_community: "comunidad-de-madrid", year: 2020, quarter: "q3", unemployment_rate: 13.3, previous_quarter_var: 0.64, previous_year_quarter_var: 2.99 },
    { autonomic_community: "canarias", year: 2020, quarter: "q4", unemployment_rate: 25.2, previous_quarter_var: 0.18, previous_year_quarter_var: 6.44 },
    { autonomic_community: "islas-baleares", year: 2020, quarter: "q4", unemployment_rate: 17.3, previous_quarter_var: 4.06, previous_year_quarter_var: 7.43 }
];

//Parametros en reduce:  .reduce(acc, currentValue, currentIndex, array)

const unemploymentData = new Array();

function averageRateAndalucia(arrayData) {
    let averageRate = 
    arrayData
    .filter((v) => {return (v.autonomic_community === "andalucia")})
    .map((v) => {return v.unemployment_rate})
    .reduce((acc, rate, _, arr) => {
        return acc + (rate / arr.length);
    }, 0);
    return averageRate
}

app.get("/samples/PVS",(request,response)=>{
    response.send(averageRateAndalucia(unemploymentData).toString());
});

app.get(BASE_API+"/unemployment-stats",(request,response)=>{
    let res= unemploymentData;
    response.send(JSON.stringify(res,null,2));
});

app.get(BASE_API + "/unemployment-stats/loadInitialData", (request,response) =>{  //loadInitialData corregido
    if(!unemploymentData.length){
        unemploymentData.push(...initialUnemploymentData);
    }
    response.send(unemploymentData);
})

app.get(BASE_API+"/unemployment-stats/:ccaa/:year/:quarter", (request, response) => { //****BIEN HECHO  ******/

    let paramCCAA = request.params.ccaa;
    let paramYear = parseInt(request.params.year); // Convertir a número
    let paramQuarter = request.params.quarter;

    console.log(`New GET to /unemployment-stats/${paramCCAA}/${paramYear}/${paramQuarter}`);

    let res = unemploymentData.filter(v => 
        v.autonomic_community === paramCCAA && 
        parseInt(v.year) === paramYear && 
        v.quarter === paramQuarter
    );

    if (res.length === 0) {
        return response.sendStatus(404); // Devuelve 404 si no se encontraron datos
    }

    response.send(JSON.stringify(res, null, 2));
});


app.post(BASE_API+"/unemployment-stats", (request, response) => { //****BIEN HECHO  ******/
    console.log("New POST to /unemployment-stats");

    if (!request.body || Object.keys(request.body).length === 0) {
        return response.sendStatus(400); // Bad Request si el body está vacío
    }

    let allowedFields = ["autonomic_community", "year", "quarter", "unemployment_rate", "previous_quarter_var", "previous_year_quarter_var"];
    let newAutonomicCommunity = request.body;

    // Validación de campos permitidos
    let invalidFields = Object.keys(newAutonomicCommunity).filter(f => !allowedFields.includes(f));
    if (invalidFields.length > 0) {
        return response.sendStatus(400); // Bad Request si hay campos no permitidos
    }

    // Verificar si ya existe un registro con los mismos valores clave
    let exists = unemploymentData.some(i => 
        i.autonomic_community === newAutonomicCommunity.autonomic_community &&
        parseInt(i.year) === parseInt(newAutonomicCommunity.year) &&
        i.quarter === newAutonomicCommunity.quarter
    );

    if (exists) {
        return response.sendStatus(409); // Conflicto si el registro ya existe
    }

    // Agregar el nuevo dato
    unemploymentData.push(newAutonomicCommunity);
    response.sendStatus(201); // Created
});

app.post(BASE_API+"/unemployment-stats/:ccaa/:year/:quarter",(request,response)=>{
    response.sendStatus(405);
});

app.put(BASE_API+"/unemployment-stats",(request,response)=>{ // método incorrecto
    response.sendStatus(405);
});

app.put(BASE_API+"/unemployment-stats/:ccaa/:year/:quarter", (request, response) => { //****BIEN HECHO  ******/
    let paramCCAA = request.params.ccaa;
    let paramYear = request.params.year;
    let paramQuarter = request.params.quarter;
    let { autonomic_community: bodyName, ...updatedData } = request.body;

    let allowedFields = ["autonomic_community", "year", "quarter", "unemployment_rate", "previous_quarter_var", "previous_year_quarter_var"];
    let invalidFields = Object.keys(request.body).filter(f => !allowedFields.includes(f));

    if (invalidFields.length > 0) {
        return response.sendStatus(400); // Devolver aquí para evitar múltiples respuestas
    } else if (!(request.body.autonomic_community === paramCCAA && parseInt(request.body.year) === parseInt(paramYear) && 
                request.body.quarter === paramQuarter)) {
                response.sendStatus(400);
    }

    let record = unemploymentData.find(element => 
        element.autonomic_community === paramCCAA &&
        parseInt(element.year) === parseInt(paramYear) &&
        element.quarter === paramQuarter
    );

    if (!record) {
        return response.sendStatus(404); // 404 si no se encuentra el registro
    }

    // Actualizar los valores
    Object.assign(record, updatedData);
    response.sendStatus(200);
});


app.delete(BASE_API + "/unemployment-stats/", (request, response) => {
    unemploymentData.length = 0;
    response.sendStatus(200);
})

app.delete(BASE_API+"/unemployment-stats/:ccaa/:year/:quarter", (request, response) => { //****BIEN HECHO  ******/

    let paramCCAA = request.params.ccaa;
    let paramYear = parseInt(request.params.year); // Convertir a número
    let paramQuarter = request.params.quarter;

    console.log(`New DELETE to /unemployment-stats/${paramCCAA}/${paramYear}/${paramQuarter}`);

    // Filtrar los datos a eliminar
    let res = unemploymentData.filter(v => 
        v.autonomic_community === paramCCAA && 
        parseInt(v.year) === paramYear && 
        v.quarter === paramQuarter
    );

    if (res.length === 0) {
        return response.sendStatus(404); // Devuelve 404 si no se encontraron datos
    }

    // Filtrar unemploymentData para eliminar las coincidencias
    unemploymentData.filter(v => v.autonomic_community === paramCCAA && parseInt(v.year) === parseInt(paramYear) && 
        v.quarter === paramQuarter)
        .forEach((item) => unemploymentData.splice(unemploymentData.indexOf(item), 1));

    response.sendStatus(200); // Eliminación exitosa
});




// index-IBL.js

loadBackendIBL(app);
