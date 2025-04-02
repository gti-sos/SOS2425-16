import dataStore from "nedb";

const BASE_API= "/api/v1";
let db = new dataStore();


// Initial data for the array
const initialTaxesData = [
    {autonomic_community: "Andalucía", year: 2021, quarter: "Q1", atr_irpf: 3916659, atr_soc_no_consolidadas: 2826482, atr_iva: 24136288 },
    {autonomic_community: "Aragón", year: 2021, quarter: "Q2", atr_irpf: 73006, atr_soc_no_consolidadas: 937242, atr_iva: 9372455 },
    {autonomic_community: "Asturias, Principado de", year: 2021, quarter: "Q3", atr_irpf: 53477, atr_soc_no_consolidadas: 419513, atr_iva: 5104967 },
    {autonomic_community: "Balears,Illes", year: 2021, quarter: "Q1", atr_irpf: 571182, atr_soc_no_consolidadas: 838753, atr_iva: 4119440 },
    {autonomic_community: "Cantabria", year: 2021, quarter: "Q2", atr_irpf: 30049, atr_soc_no_consolidadas: 356759, atr_iva: 3382981 },
    {autonomic_community: "Castilla y León", year: 2021, quarter: "Q3", atr_irpf: 1285544, atr_soc_no_consolidadas: 1001814, atr_iva: 10195560 },
    {autonomic_community: "Castilla - La Mancha", year: 2021, quarter: "Q1", atr_irpf: 988287, atr_soc_no_consolidadas: 699208, atr_iva: 7078642 },
    {autonomic_community: "Cataluña", year: 2021, quarter: "Q2", atr_irpf: 3880364, atr_soc_no_consolidadas: 6975928, atr_iva: 64849291 },
    {autonomic_community: "Comunitat Valenciana", year: 2021, quarter: "Q1", atr_irpf: 2467168, atr_soc_no_consolidadas: 2833549, atr_iva: 26538375 },
    {autonomic_community: "Extremadura", year: 2021, quarter: "Q1", atr_irpf: 509167, atr_soc_no_consolidadas: 259255, atr_iva: 2844182 },
    {autonomic_community: "Galicia", year: 2021, quarter: "Q1", atr_irpf: 1378027, atr_soc_no_consolidadas: 1647520, atr_iva: 15803448 },
    {autonomic_community: "Madrid, Comunidad de", year: 2021, quarter: "Q1", atr_irpf: 3572326, atr_soc_no_consolidadas: 15509272, atr_iva: 123096234 },
    {autonomic_community: "Murcia, Región de", year: 2021, quarter: "Q2", atr_irpf: 694035, atr_soc_no_consolidadas: 749846, atr_iva: 7277119 },
    {autonomic_community: "Rioja, La", year: 2021, quarter: "Q3", atr_irpf: 175378, atr_soc_no_consolidadas: 213559, atr_iva: 1523642 },
    {autonomic_community: "Andalucía", year: 2020, quarter: "Q1", atr_irpf: 3797932, atr_soc_no_consolidadas: 2045255, atr_iva: 19655675 },
    {autonomic_community: "Aragón", year: 2020, quarter: "Q1", atr_irpf: 725392, atr_soc_no_consolidadas: 823261, atr_iva: 8257375 },
    {autonomic_community: "Asturias, Principado de", year: 2020, quarter: "Q1", atr_irpf: 525355, atr_soc_no_consolidadas: 287938, atr_iva: 3548610 },
    {autonomic_community: "Cantabria", year: 2020, quarter: "Q2", atr_irpf: 294038, atr_soc_no_consolidadas: 172383, atr_iva: 2829442 },
    {autonomic_community: "Castilla y León", year: 2020, quarter: "Q3", atr_irpf: 1278006, atr_soc_no_consolidadas: 760391, atr_iva: 8880282 },
    {autonomic_community: "Castilla - La Mancha", year: 2020, quarter: "Q1", atr_irpf: 965897, atr_soc_no_consolidadas: 585027, atr_iva: 5786846 },
    {autonomic_community: "Cataluña", year: 2020, quarter: "Q1", atr_irpf: 3839962, atr_soc_no_consolidadas: 6136336, atr_iva: 56706888 },
    {autonomic_community: "Comunitat Valenciana", year: 2020, quarter: "Q2", atr_irpf: 2409920, atr_soc_no_consolidadas: 2251326, atr_iva: 22543255 },
    {autonomic_community: "Extremadura", year: 2020, quarter: "Q3", atr_irpf: 497511, atr_soc_no_consolidadas: 225552, atr_iva: 2311629 },
    {autonomic_community: "Galicia", year: 2020, quarter: "Q1", atr_irpf: 1358533, atr_soc_no_consolidadas: 1138038, atr_iva: 13110283 },
    {autonomic_community: "Balears,Illes", year: 2020, quarter: "Q1", atr_irpf: 555447, atr_soc_no_consolidadas: 464026, atr_iva: 3534163 },
    {autonomic_community: "Madrid, Comunidad de", year: 2020, quarter: "Q2", atr_irpf: 3522254, atr_soc_no_consolidadas: 12702500, atr_iva: 93863668 },
    {autonomic_community: "Murcia, Región de", year: 2020, quarter: "Q3", atr_irpf: 672009, atr_soc_no_consolidadas: 649349, atr_iva: 93863668 },
    {autonomic_community: "Rioja, La", year: 2020, quarter: "Q1", atr_irpf: 173428, atr_soc_no_consolidadas: 152021, atr_iva: 1353261 },
    {autonomic_community: "Madrid, Comunidad de", year: 2019, quarter: "Q1", atr_irpf: 2323123, atr_soc_no_consolidadas: 9312321, atr_iva: 80221221 } 
];

// Array that will contain all data about taxes
const taxesData = new Array();

// Parameters in reduce:  .reduce(acc, currentValue, currentIndex, array)
// Averages all the values of IVA in Madrid
function averageRateIVAMadrid(arrayData) {
    let average = arrayData
        .filter((v) => {return (v.autonomic_community === "Madrid, Comunidad de")})
        .map((v) => {return v.atr_iva})
        .reduce((acc, rate, _, arr) => {
            return acc + (rate / arr.length);
        }, 0);
    return average;
}

function loadBackendIBL(app){
    // Sample get  operation for the averageRateIVAMadrid function
    app.get("/samples/IBL",(request,response)=>{
            response.send(averageRateIVAMadrid(taxesData).toString());
    });

    // 11

    // GET operation for all the data in taxesData
    app.get(BASE_API + "/taxes-stats", (request,response) =>{
        db.find({},(err,data)=>{
            response.send(JSON.stringify(data.map((c)=>{
                delete c._id;
                return c;
            }),null,2));
        });

    });

    // 13

    // GET operation that inits the data on taxesData from initialTaxesData
    app.get(BASE_API + "/taxes-stats/loadInitialData", (request,response) =>{
        db.find({},(err, data)=>{
            if (err){
                response.status(500).send("Error code 01 (please contact admin)");                
                console.error(`ERROR: ${err}`);
            }
            else if(data.length < 1){
                db.insert(initialTaxesData);
                response.sendStatus(200);
            }
        });
    })

    // GET operation for a certain community and querying for year or/and quarter
    app.get(BASE_API + "/taxes-stats/:name", (request, response) => {
        let paramName = request.params.name;
        let paramYear = request.query.year;
        let paramQuarter = request.query.quarter;
        let query = { autonomic_community: paramName};

        if(paramYear){
            query.year = parseInt(paramYear);
        }
        if(paramQuarter){
            query.quarter = paramQuarter;
        }

        db.find(query, function(err, docs){
            if(!docs.length){
                response.sendStatus(404);
            }
            else{
                response.send(JSON.stringify(docs.map((c)=>{
                    delete c._id;
                    return c;
                }),null,2));
            }
        });
    });

    // GET operation for a certain community
    app.get(BASE_API + "/taxes-stats/:name/:year/:quarter", (request, response) => {
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        db.find({ autonomic_community: paramName, year: parseInt(paramYear), quarter: paramQuarter}, function(err, docs){
            if(!docs.length){
                response.sendStatus(404);
            }
            else{
                response.send(JSON.stringify(docs.map((c)=>{
                    delete c._id;
                    return c;
                }),null,2));
            }
        });
    });



    // DELETE operation for all
    app.delete(BASE_API + "/taxes-stats/", (request, response) => {
        db.remove({}, { multi: true }, function (err, numRemoved) {
            response.sendStatus(200);
        });     
    })

    // DELETE operation for a certain community
    app.delete(BASE_API + "/taxes-stats/:name/:year/:quarter", (request, response) => {
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        db.remove({ autonomic_community: paramName, year: parseInt(paramYear), quarter: paramQuarter}, function(err, numRemoved){
            if(err){
                response.sendStatus(500);
            }
            else{
                if(numRemoved === 0){
                    response.sendStatus(404);
                }
                else{
                    response.sendStatus(200);
                }
            }
        });
        // taxesData.filter(v => v.autonomic_community === paramName && parseInt(v.year) === parseInt(paramYear) && v.quarter === paramQuarter)
        //     .forEach((item) => taxesData.splice(taxesData.indexOf(item), 1));
    })

    // POST operation for creating community data (name, year and quarter)
    app.post(BASE_API + "/taxes-stats", (request, response) => {
        let postBody = request.body;
        let allowedFields = ["autonomic_community", "year", "quarter", "atr_irpf", "atr_soc_no_consolidadas", "atr_iva"];
        let invalidFields = Object.keys(postBody).filter(f => !allowedFields.includes(f));

        if (invalidFields.length > 0){
            response.sendStatus(400);
        }
        db.find({ autonomic_community: postBody.autonomic_community, year: parseInt(postBody.year),
            quarter: postBody.quarter}, function(err, docs){
                if(docs.length > 0){
                    response.sendStatus(409);
                }
                else{
                    db.insert(postBody);
                    response.sendStatus(201);
                }
        });
    });

    // POST operation cannot be sent to /taxes-stats/:name/:year/:quarter
    app.post(BASE_API+"/taxes-stats/:name/:year/:quarter",(request,response)=>{ // método incorrecto
        response.sendStatus(405);
    });

    // PUT operation cannot be sent to /taxes-stats
    app.put(BASE_API+"/taxes-stats",(request,response)=>{ // método incorrecto
        response.sendStatus(405);
    });

    // PUT operation for updating data (name, year, quarter, irpf, iva and societies data)
    app.put(BASE_API + "/taxes-stats/:name/:year/:quarter", (request, response) => {
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        let postBody = request.body;
        let allowedFields = ["autonomic_community", "year", "quarter", "atr_irpf", "atr_soc_no_consolidadas", "atr_iva"];
        let invalidFields = Object.keys(postBody).filter(f => !allowedFields.includes(f));

        if (invalidFields.length > 0){
            response.sendStatus(400);
        }
        else if(!((postBody.autonomic_community === paramName) && (parseInt(postBody.year) === parseInt(paramYear)) && (postBody.quarter === paramQuarter))){
            response.sendStatus(400);
        }
        else{
            db.find({ autonomic_community: paramName, year: parseInt(paramYear), quarter: paramQuarter}, function(err, docs){
                if(docs.length === 0){
                    response.sendStatus(404);
                } 
                else{
                    db.update({ _id: docs[0]._id}, { $set: {atr_irpf: parseInt(postBody.atr_irpf), 
                        atr_soc_no_consolidadas: parseInt(postBody.atr_soc_no_consolidadas), 
                        atr_iva: parseInt(postBody.atr_iva)}}, {}, function(err, numReplaced){
                            if(err){
                                response.sendStatus(500);
                            }
                            else{
                                response.sendStatus(200);
                            }
                    });
                }
            })
        }
    })
}

export {loadBackendIBL}
