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
    { autonomic_community: "islas-baleares", year: 2020, quarter: "q4", unemployment_rate: 17.3, previous_quarter_var: 4.06, previous_year_quarter_var: 7.43 }  
];

db.find({},(err, data)=>{
    if (err){               
        console.error(`ERROR: ${err}`);
    }
    else if(data.length < 1){
        db.insert(initialUnemploymentData);
    }
});

function loadBackendPVS(app) {
<<<<<<< HEAD
    
=======
>>>>>>> f371ec1 (load de pablo arreglado)
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

}

export { loadBackendPVS };
