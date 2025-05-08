import dataStore from "nedb";

const BASE_API= "/api/v1";

let db = new dataStore();


const initialUnemploymentData = [
    { autonomic_community: "andalucia", year: 2021, quarter: "q1", unemployment_rate: 22.8, previous_quarter_var: 0.01, previous_year_quarter_var: 1.54 },
    { autonomic_community: "aragon", year: 2021, quarter: "q1", unemployment_rate: 12.4, previous_quarter_var: -0.13, previous_year_quarter_var: 1.72 },
    { autonomic_community: "extremadura", year: 2021, quarter: "q1", unemployment_rate: 23.3, previous_quarter_var: 2.01, previous_year_quarter_var: -0.26 },
    { autonomic_community: "galicia", year: 2021, quarter: "q1", unemployment_rate: 12.8, previous_quarter_var: 1.17, previous_year_quarter_var: 0.18 },
    { autonomic_community: "andalucia", year: 2021, quarter: "q2", unemployment_rate: 21.8, previous_quarter_var: -0.98, previous_year_quarter_var: 0.45 },
    { autonomic_community: "castilla-la-mancha", year: 2021, quarter: "q2", unemployment_rate: 16.7, previous_quarter_var: -0.84, previous_year_quarter_var: -0.17 },
    { autonomic_community: "cataluna", year: 2021, quarter: "q2", unemployment_rate: 12.4, previous_quarter_var: -0.65, previous_year_quarter_var: -0.34 },
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
    { autonomic_community: "cataluna", year: 2020, quarter: "q2", unemployment_rate: 12.8, previous_quarter_var: 2.12, previous_year_quarter_var: 1.61 },
    { autonomic_community: "andalucia", year: 2020, quarter: "q3", unemployment_rate: 23.8, previous_quarter_var: 2.48, previous_year_quarter_var: 1.97 },
    { autonomic_community: "comunidad-de-madrid", year: 2020, quarter: "q3", unemployment_rate: 13.3, previous_quarter_var: 0.64, previous_year_quarter_var: 2.99 },
    { autonomic_community: "canarias", year: 2020, quarter: "q4", unemployment_rate: 25.2, previous_quarter_var: 0.18, previous_year_quarter_var: 6.44 },
    { autonomic_community: "islas-baleares", year: 2020, quarter: "q4", unemployment_rate: 17.3, previous_quarter_var: 4.06, previous_year_quarter_var: 7.43 },
    { autonomic_community: "comunidad-de-madrid", year: 2021, quarter: "q1", unemployment_rate: 11.1, previous_quarter_var: 0.3, previous_year_quarter_var: -0.5 },
    { autonomic_community: "comunidad-de-madrid", year: 2021, quarter: "q2", unemployment_rate: 10.8, previous_quarter_var: -0.3, previous_year_quarter_var: -0.6 },
    { autonomic_community: "comunidad-de-madrid", year: 2021, quarter: "q3", unemployment_rate: 10.5, previous_quarter_var: -0.3, previous_year_quarter_var: -0.7 },
    { autonomic_community: "comunidad-de-madrid", year: 2021, quarter: "q4", unemployment_rate: 10.2, previous_quarter_var: -0.3, previous_year_quarter_var: -0.8 },
    { autonomic_community: "cataluna", year: 2021, quarter: "q1", unemployment_rate: 13.5, previous_quarter_var: 0.2, previous_year_quarter_var: -0.4 },
    { autonomic_community: "cataluna", year: 2021, quarter: "q3", unemployment_rate: 12.0, previous_quarter_var: -0.5, previous_year_quarter_var: -0.6 },
    { autonomic_community: "cataluna", year: 2021, quarter: "q4", unemployment_rate: 11.5, previous_quarter_var: -0.5, previous_year_quarter_var: -0.7 },
    { autonomic_community: "castilla-la-mancha", year: 2021, quarter: "q1", unemployment_rate: 17.5, previous_quarter_var: 0.3, previous_year_quarter_var: -0.2 },
    { autonomic_community: "castilla-la-mancha", year: 2021, quarter: "q3", unemployment_rate: 16.0, previous_quarter_var: -0.4, previous_year_quarter_var: -0.3 },
    { autonomic_community: "castilla-la-mancha", year: 2021, quarter: "q4", unemployment_rate: 15.5, previous_quarter_var: -0.5, previous_year_quarter_var: -0.4 },
    { autonomic_community: "galicia", year: 2021, quarter: "q2", unemployment_rate: 12.0, previous_quarter_var: -0.4, previous_year_quarter_var: -0.5 },
    { autonomic_community: "galicia", year: 2021, quarter: "q3", unemployment_rate: 11.5, previous_quarter_var: -0.5, previous_year_quarter_var: -0.6 },
    { autonomic_community: "galicia", year: 2021, quarter: "q4", unemployment_rate: 11.0, previous_quarter_var: -0.5, previous_year_quarter_var: -0.7 },
    { autonomic_community: "aragon", year: 2021, quarter: "q2", unemployment_rate: 11.8, previous_quarter_var: -0.6, previous_year_quarter_var: -0.7 },
    { autonomic_community: "aragon", year: 2021, quarter: "q3", unemployment_rate: 11.2, previous_quarter_var: -0.6, previous_year_quarter_var: -0.8 },
    { autonomic_community: "aragon", year: 2021, quarter: "q4", unemployment_rate: 10.6, previous_quarter_var: -0.6, previous_year_quarter_var: -0.9 },
    { autonomic_community: "extremadura", year: 2021, quarter: "q2", unemployment_rate: 22.5, previous_quarter_var: -0.8, previous_year_quarter_var: -0.9 },
    { autonomic_community: "extremadura", year: 2021, quarter: "q3", unemployment_rate: 21.8, previous_quarter_var: -0.7, previous_year_quarter_var: -1.0 },
    { autonomic_community: "extremadura", year: 2021, quarter: "q4", unemployment_rate: 21.0, previous_quarter_var: -0.8, previous_year_quarter_var: -1.1 },
    { autonomic_community: "islas-baleares", year: 2021, quarter: "q1", unemployment_rate: 12.0, previous_quarter_var: 0.5, previous_year_quarter_var: -0.3 },
    { autonomic_community: "islas-baleares", year: 2021, quarter: "q2", unemployment_rate: 11.0, previous_quarter_var: -1.0, previous_year_quarter_var: -0.4 },
    { autonomic_community: "islas-baleares", year: 2021, quarter: "q4", unemployment_rate: 9.5, previous_quarter_var: -0.5, previous_year_quarter_var: -0.5 },
    { autonomic_community: "canarias", year: 2021, quarter: "q1", unemployment_rate: 25.0, previous_quarter_var: 0.5, previous_year_quarter_var: -0.3 },
    { autonomic_community: "canarias", year: 2021, quarter: "q2", unemployment_rate: 24.0, previous_quarter_var: -1.0, previous_year_quarter_var: -0.4 },
    { autonomic_community: "canarias", year: 2021, quarter: "q4", unemployment_rate: 23.0, previous_quarter_var: -1.0, previous_year_quarter_var: -0.5 },
    { autonomic_community: "canarias", year: 2020, quarter: "q1", unemployment_rate: 18.8, previous_quarter_var: 0.01, previous_year_quarter_var: -2.24 },
    { autonomic_community: "castilla-la-mancha", year: 2020, quarter: "q1", unemployment_rate: 18.1, previous_quarter_var: 1.55, previous_year_quarter_var: 2.37 },
    { autonomic_community: "castilla-y-leon", year: 2020, quarter: "q1", unemployment_rate: 11.8, previous_quarter_var: 0.62, previous_year_quarter_var: -0.60 },
    { autonomic_community: "cataluna", year: 2020, quarter: "q1", unemployment_rate: 10.7, previous_quarter_var: 0.21, previous_year_quarter_var: -0.98 },
    { autonomic_community: "comunidad-de-madrid", year: 2020, quarter: "q1", unemployment_rate: 10.6, previous_quarter_var: 0.61, previous_year_quarter_var: -1.10 },
    { autonomic_community: "islas-baleares", year: 2020, quarter: "q1", unemployment_rate: 18.2, previous_quarter_var: 8.29, previous_year_quarter_var: 1.14 },
    { autonomic_community: "galicia", year: 2020, quarter: "q1", unemployment_rate: 12.7, previous_quarter_var: 0.91, previous_year_quarter_var: 0.18 },
    { autonomic_community: "andalucia", year: 2020, quarter: "q2", unemployment_rate: 21.3, previous_quarter_var: 0.11, previous_year_quarter_var: 0.28 },
    { autonomic_community: "aragon", year: 2020, quarter: "q2", unemployment_rate: 11.8, previous_quarter_var: 1.14, previous_year_quarter_var: 1.80 },
    { autonomic_community: "asturias", year: 2020, quarter: "q2", unemployment_rate: 14.5, previous_quarter_var: 0.08, previous_year_quarter_var: 0.28 },
    { autonomic_community: "cantabria", year: 2020, quarter: "q2", unemployment_rate: 13.8, previous_quarter_var: 2.67, previous_year_quarter_var: 4.75 },
    { autonomic_community: "ceuta", year: 2020, quarter: "q2", unemployment_rate: 20.3, previous_quarter_var: -3.59, previous_year_quarter_var: -4.31 },
    { autonomic_community: "extremadura", year: 2020, quarter: "q2", unemployment_rate: 21.4, previous_quarter_var: -2.20, previous_year_quarter_var: 0.93 },
    { autonomic_community: "comunidad-de-madrid", year: 2020, quarter: "q2", unemployment_rate: 12.6, previous_quarter_var: 2.01, previous_year_quarter_var: 2.07 },
    { autonomic_community: "islas-baleares", year: 2020, quarter: "q2", unemployment_rate: 15.9, previous_quarter_var: -2.27, previous_year_quarter_var: 3.80 },
    { autonomic_community: "galicia", year: 2020, quarter: "q2", unemployment_rate: 12.0, previous_quarter_var: -0.70, previous_year_quarter_var: 0.62 },
    { autonomic_community: "aragon", year: 2020, quarter: "q3", unemployment_rate: 11.9, previous_quarter_var: 0.12, previous_year_quarter_var: 2.21 },
    { autonomic_community: "asturias", year: 2020, quarter: "q3", unemployment_rate: 14.2, previous_quarter_var: -0.29, previous_year_quarter_var: -0.27 },
    { autonomic_community: "cantabria", year: 2020, quarter: "q3", unemployment_rate: 12.0, previous_quarter_var: -1.74, previous_year_quarter_var: 3.29 },
    { autonomic_community: "ceuta", year: 2020, quarter: "q3", unemployment_rate: 27.1, previous_quarter_var: 6.84, previous_year_quarter_var: -1.62 },
    { autonomic_community: "extremadura", year: 2020, quarter: "q3", unemployment_rate: 20.9, previous_quarter_var: -0.51, previous_year_quarter_var: 1.20 },
    { autonomic_community: "canarias", year: 2020, quarter: "q3", unemployment_rate: 25.0, previous_quarter_var: 3.49, previous_year_quarter_var: 3.85 },
    { autonomic_community: "castilla-la-mancha", year: 2020, quarter: "q3", unemployment_rate: 18.3, previous_quarter_var: 1.50, previous_year_quarter_var: 2.24 },
    { autonomic_community: "castilla-y-leon", year: 2020, quarter: "q3", unemployment_rate: 12.5, previous_quarter_var: 0.14, previous_year_quarter_var: 1.31 },
    { autonomic_community: "cataluna", year: 2020, quarter: "q3", unemployment_rate: 13.2, previous_quarter_var: 0.45, previous_year_quarter_var: 2.36 },
    { autonomic_community: "islas-baleares", year: 2020, quarter: "q3", unemployment_rate: 13.3, previous_quarter_var: -2.65, previous_year_quarter_var: 5.10 },
    { autonomic_community: "galicia", year: 2020, quarter: "q3", unemployment_rate: 11.8, previous_quarter_var: -0.15, previous_year_quarter_var: 0.31 },
    { autonomic_community: "andalucia", year: 2020, quarter: "q4", unemployment_rate: 22.7, previous_quarter_var: -1.06, previous_year_quarter_var: 1.94 },
    { autonomic_community: "aragon", year: 2020, quarter: "q4", unemployment_rate: 12.5, previous_quarter_var: 0.59, previous_year_quarter_var: 2.56 },
    { autonomic_community: "asturias", year: 2020, quarter: "q4", unemployment_rate: 13.5, previous_quarter_var: -0.66, previous_year_quarter_var: 0.36 },
    { autonomic_community: "cantabria", year: 2020, quarter: "q4", unemployment_rate: 11.8, previous_quarter_var: -0.23, previous_year_quarter_var: 0.61 },
    { autonomic_community: "ceuta", year: 2020, quarter: "q4", unemployment_rate: 26.7, previous_quarter_var: -0.40, previous_year_quarter_var: -0.84 },
    { autonomic_community: "extremadura", year: 2020, quarter: "q4", unemployment_rate: 21.3, previous_quarter_var: 0.44, previous_year_quarter_var: -2.16 },
    { autonomic_community: "castilla-la-mancha", year: 2020, quarter: "q4", unemployment_rate: 17.4, previous_quarter_var: -0.95, previous_year_quarter_var: 0.83 },
    { autonomic_community: "castilla-y-leon", year: 2020, quarter: "q4", unemployment_rate: 11.6, previous_quarter_var: -0.88, previous_year_quarter_var: 0.41 },
    { autonomic_community: "cataluna", year: 2020, quarter: "q4", unemployment_rate: 13.9, previous_quarter_var: 0.64, previous_year_quarter_var: 3.42 },
    { autonomic_community: "galicia", year: 2020, quarter: "q4", unemployment_rate: 11.7, previous_quarter_var: -0.14, previous_year_quarter_var: -0.08 },
    { autonomic_community: "asturias", year: 2021, quarter: "q1", unemployment_rate: 13.7, previous_quarter_var: 0.23, previous_year_quarter_var: -0.64 },
    { autonomic_community: "cantabria", year: 2021, quarter: "q1", unemployment_rate: 11.6, previous_quarter_var: -0.20, previous_year_quarter_var: 0.50 },
    { autonomic_community: "ceuta", year: 2021, quarter: "q1", unemployment_rate: 30.5, previous_quarter_var: 3.80, previous_year_quarter_var: 6.65 },
    { autonomic_community: "castilla-y-leon", year: 2021, quarter: "q1", unemployment_rate: 13.2, previous_quarter_var: 1.55, previous_year_quarter_var: 1.34 },
    { autonomic_community: "asturias", year: 2021, quarter: "q2", unemployment_rate: 13.4, previous_quarter_var: -0.31, previous_year_quarter_var: -1.03 },
    { autonomic_community: "cantabria", year: 2021, quarter: "q2", unemployment_rate: 12.2, previous_quarter_var: 0.56, previous_year_quarter_var: -1.61 },
    { autonomic_community: "ceuta", year: 2021, quarter: "q2", unemployment_rate: 28.1, previous_quarter_var: -2.44, previous_year_quarter_var: 7.80 },
    { autonomic_community: "castilla-y-leon", year: 2021, quarter: "q2", unemployment_rate: 12.9, previous_quarter_var: -0.23, previous_year_quarter_var: 0.58 },
    { autonomic_community: "andalucia", year: 2021, quarter: "q3", unemployment_rate: 22.6, previous_quarter_var: 0.84, previous_year_quarter_var: -1.19 },
    { autonomic_community: "asturias", year: 2021, quarter: "q3", unemployment_rate: 12.1, previous_quarter_var: -1.33, previous_year_quarter_var: -2.07 },
    { autonomic_community: "cantabria", year: 2021, quarter: "q3", unemployment_rate: 9.7, previous_quarter_var: -2.41, previous_year_quarter_var: -2.28 },
    { autonomic_community: "ceuta", year: 2021, quarter: "q3", unemployment_rate: 33.6, previous_quarter_var: 5.49, previous_year_quarter_var: 6.45 },
    { autonomic_community: "castilla-y-leon", year: 2021, quarter: "q3", unemployment_rate: 9.9, previous_quarter_var: -3.00, previous_year_quarter_var: -2.56 },
    { autonomic_community: "andalucia", year: 2021, quarter: "q4", unemployment_rate: 20.3, previous_quarter_var: -2.30, previous_year_quarter_var: -2.43 },
    { autonomic_community: "asturias", year: 2021, quarter: "q4", unemployment_rate: 10.1, previous_quarter_var: -1.99, previous_year_quarter_var: -3.40 },
    { autonomic_community: "cantabria", year: 2021, quarter: "q4", unemployment_rate: 11.6, previous_quarter_var: 1.84, previous_year_quarter_var: -0.21 },
    { autonomic_community: "ceuta", year: 2021, quarter: "q4", unemployment_rate: 31.2, previous_quarter_var: -2.42, previous_year_quarter_var: 4.43 },
    { autonomic_community: "castilla-y-leon", year: 2021, quarter: "q4", unemployment_rate: 10.5, previous_quarter_var: 0.53, previous_year_quarter_var: -1.15 },
    { autonomic_community: "comunidad-de-madrid", year: 2020, quarter: "q4", unemployment_rate: 13.5, previous_quarter_var: 0.28, previous_year_quarter_var: 3.54 }
];

const API_HOST = 'https://api.openweathermap.org';
const API_KEY = '296947fd053082133be207bb92ff3879';

db.find({},(err, data)=>{
    if (err){               
        console.error(`ERROR: ${err}`);
    }
    else if(data.length < 1){
        db.insert(initialUnemploymentData);
    }
});

function loadBackendPVS(app) {
    
    app.get(BASE_API + "/unemployment-stats/loadInitialData", (request,response) =>{
        db.find({},(err, unemploymentData)=>{
            if (err){
                response.status(500).send("Error code 01 (please contact admin)");                
                console.error(`ERROR: ${err}`);
            }
            else if(unemploymentData.length > 0){
                response.sendStatus(200);
            }
            else if(unemploymentData.length < 1){
                db.insert(initialUnemploymentData);
                response.sendStatus(200);
            }
        });
    })
    
    app.get(BASE_API + "/unemployment-stats", (request, response) => {
        let paramName = request.query.autonomic_community;
        //Parametros opcionales
        let paramYear = parseInt(request.query.year);
        let paramQuarter = request.query.quarter;
        let paramOffset = request.query.offset;
        let paramLimit = request.query.limit;
        let paramUR = parseFloat(request.query.unemployment_rate);
        let paramPQV =  parseFloat(request.query.previous_quarter_var);
        let paramPYQV =  parseFloat(request.query.previous_year_quarter_var);
        let paramFields = request.query.fields;

        let query = {};  //Creamos la variable donde iremos almacenando los filtros.
    
        if(paramName){
            query.autonomic_community = paramName;
        }
        if(paramYear){
            query.year = paramYear;
        }
        if(paramQuarter){
            query.quarter = paramQuarter;
        }
        if(paramFields){
            paramFields = paramFields.split(',');
        }
        if(paramUR){
            query.unemployment_rate = paramUR;
        }
        if(paramPQV){
            query.previous_quarter_var = paramPQV;
        }
        if(paramPYQV){
            query.previous_year_quarter_var = paramPYQV;
        }
        if (paramOffset) {
            paramOffset = parseInt(paramOffset);
        } else {
            paramOffset = 0;
        }
        if (paramLimit) {
            paramLimit = parseInt(paramLimit);
        } else {
            paramLimit = 0;
        }

        db.find(query).sort({ autonomic_community: 1 }).skip(paramOffset).limit(paramLimit).exec(function(err, docs){
            if (err) {
                response.status(500).send("Error code 01 (please contact admin)");
                console.error(`ERROR: ${err}`);
            }
            else if(!docs.length){  //Si no existen 404
                return response.sendStatus(404);
            }
            else{
                response.send(JSON.stringify(docs.map((c) => {
                    delete c._id;
                    Object.keys(c).forEach(field => {  //Eliminamos los campos que no se incluyen en fields
                        if (paramFields != undefined && !paramFields.includes(field)) {
                            delete c[field];
                        }
                    });
                    return c;
                }), null, 2));
            }
        })
    });

    app.get(BASE_API + "/unemployment-stats/:name/:year/:quarter", (request, response) => {
        let paramName = request.params.name;
        let paramYear = parseInt(request.params.year);
        let paramQuarter = request.params.quarter;
        db.findOne({ autonomic_community: paramName, year: paramYear, quarter: paramQuarter}, function(err, docs){
            if (err) {
                response.status(500).send("Error code 01 (please contact admin)");
                console.error(`ERROR: ${err}`);
            }
            else if(!docs){
                return response.sendStatus(404);
            }
            else{
                delete docs._id;
                response.send(JSON.stringify(docs, null, 2))
            }
        });
    });

    app.delete(BASE_API + "/unemployment-stats/", (request, response) => {
        db.remove({}, { multi: true }, function (err, numRemoved) {
            if (err) {
               response.status(500).send("Error code 01 (please contact admin)");
               console.error(`ERROR: ${err}`);
            } else if (numRemoved === 0) {
               return response.status(404).send("No hay datos para eliminar.");
            } else {
                response.sendStatus(200);
            }
        });
             
    });

    app.delete(BASE_API + "/unemployment-stats/:name/:year/:quarter", (request, response) => {
        let paramName = request.params.name;
        let paramYear = parseInt(request.params.year);
        let paramQuarter = request.params.quarter;
        db.remove({ autonomic_community: paramName, year: paramYear, quarter: paramQuarter}, function(err, numRemoved){
            if(err){
                response.sendStatus(500).send("Error code 01 (please contact admin)");
                console.error(`ERROR: ${err}`);
            }else if (numRemoved === 0) {
                return response.status(404).send("Ese dato no existe.");
            } else {
                response.sendStatus(200);
            }
        });
    });

    app.post(BASE_API + "/unemployment-stats", (request, response) => {
        let postBody = request.body;
        let allowedFields = ["autonomic_community", "year", "quarter", "unemployment_rate", "previous_quarter_var", "previous_year_quarter_var"];
        let invalidFields = Object.keys(postBody).filter(f => !allowedFields.includes(f));
        let invalidValues = Object.values(postBody).filter(
            f => ((f === "") || (f === null) || (f === undefined))
        );
        
        if (invalidFields.length > 0 || invalidValues.length > 0){
            return response.sendStatus(400);
        }
        db.find({ autonomic_community: postBody.autonomic_community, year: parseInt(postBody.year),
            quarter: postBody.quarter}, function(err, docs){
                if (err) {
                    response.sendStatus(500).send("Error code 01 (please contact admin)");
                    console.error(`ERROR: ${err}`);
                }
                else if(docs.length > 0){
                   return response.sendStatus(409); //El dato ya existe, hay conflicto
                }
                else{
                    db.insert(postBody);
                    response.sendStatus(201);
                }
                });
                    });
    
    app.post(BASE_API+"/unemployment-stats/:name/:year/:quarter",(request,response)=>{ // método incorrecto
        response.sendStatus(405);
    });

    app.put(BASE_API+"/unemployment-stats",(request,response)=>{ // método incorrecto
        response.sendStatus(405);
    });

    app.put(BASE_API + "/unemployment-stats/:name/:year/:quarter", (request, response) => {
        let paramName = request.params.name;
        let paramYear = parseInt(request.params.year);
        let paramQuarter = request.params.quarter;
        let postBody = request.body;

        let unemployment_rate = parseFloat(postBody.unemployment_rate);
        let previous_quarter_var = parseFloat(postBody.previous_quarter_var);
        let previous_year_quarter_var = parseFloat(postBody.previous_year_quarter_var);

        let allowedFields = ["autonomic_community", "year", "quarter", "unemployment_rate", "previous_quarter_var", "previous_year_quarter_var"];
        let invalidFields = Object.keys(postBody).filter(f => !allowedFields.includes(f));
        let invalidValues = Object.values(postBody).filter(
            (f) => ((f === "") || (f === null) || (f === undefined) || (f === "null"))
        );

        if (invalidFields.length > 0 || invalidValues.length > 0){
            return response.sendStatus(400);
        }
        else if(!((postBody.autonomic_community === paramName) && (parseInt(postBody.year) === paramYear) && (postBody.quarter === paramQuarter))){
            return response.sendStatus(400);
        }
        else{
            db.find({ autonomic_community: paramName, year: paramYear, quarter: paramQuarter}, function(err, docs){
                if (err) {
                   response.sendStatus(500).send("Error code 01 (please contact admin)");
                   console.error(`ERROR: ${err}`);
                }
                else if(docs.length === 0){
                   return response.sendStatus(404); //Dato a modificar no encontrado
                } 
                else{
                    db.update({ _id: docs[0]._id}, //Buscamos el id en la base de datos
                        { //Indicamos los campos a modificar con $set
                            $set: {
                                unemployment_rate: unemployment_rate, 
                                previous_quarter_var: previous_quarter_var, 
                                previous_year_quarter_var: previous_year_quarter_var
                            }
                        }, 
                        {}, 
                        function(err, numReplaced){
                            if(err){
                               response.sendStatus(500);
                               console.error(`ERROR: ${err}`);
                            }
                            else{
                                response.sendStatus(200);
                            }
                        });
                }
            })
        }
    });

    app.get(BASE_API+"/unemployment-stats/docs",(request,response)=>{
        response.redirect("https://documenter.getpostman.com/view/42345307/2sB2cUCP3a");
    });


    app.use('/api/openweather', async (req, res) => {
        let path = req.originalUrl.replace('/api/openweather', '');
    
        // Añadir ? o & según sea necesario
        const connector = path.includes('?') ? '&' : '?';
        const fullUrl = `${API_HOST}${path}${connector}appid=${API_KEY}`;

        console.log('Proxying to:', fullUrl);

        const response = await fetch(fullUrl);
        const data = await response.json();

        res.status(response.status).json(data);
    });

}

export { loadBackendPVS };
