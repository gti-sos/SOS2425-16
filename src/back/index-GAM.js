import dataStore from "nedb";

const BASE_API= "/api/v1";

let db = new dataStore();

// Initial data extracted form the propuse sheet

const initialEmigrationData = [
    {autonomic_community: "andalucia", year: 2021, quarter: "q1", between_20_24_yo: 3666, between_25_29_yo: 5409, between_30_34_yo: 5996 },
    { autonomic_community: "andalucia", year: 2020, quarter: "q2", between_20_24_yo: 2156, between_25_29_yo: 3201, between_30_34_yo: 3690 },
    {autonomic_community: "asturias", year: 2021, quarter: "q3", between_20_24_yo: 304, between_25_29_yo: 510, between_30_34_yo: 483 },
    { autonomic_community: "islas-baleares", year: 2021, quarter: "q1", between_20_24_yo: 6320, between_25_29_yo: 1023, between_30_34_yo: 1239 },
    { autonomic_community: "canarias", year: 2021, quarter: "q2", between_20_24_yo: 947, between_25_29_yo: 1625, between_30_34_yo: 1643 },
    { autonomic_community: "madrid", year: 2021, quarter: "q3", between_20_24_yo: 6028, between_25_29_yo: 10836, between_30_34_yo: 10004 },
    { autonomic_community: "castilla-y-leon", year: 2021, quarter: "q1", between_20_24_yo: 766, between_25_29_yo: 1171, between_30_34_yo: 1210 },
    { autonomic_community: "castilla-la-mancha", year: 2021, quarter: "q2", between_20_24_yo: 984, between_25_29_yo: 1304, between_30_34_yo: 1512 },
    { autonomic_community: "cataluña", year: 2021, quarter: "q3", between_20_24_yo: 7305, between_25_29_yo: 12960, between_30_34_yo: 13077 },
    { autonomic_community: "cataluña", year: 2020, quarter: "q1", between_20_24_yo: 4469, between_25_29_yo: 8086, between_30_34_yo: 7808 },
    { autonomic_community: "cataluña", year: 2019, quarter: "q1", between_20_24_yo: 6397, between_25_29_yo: 12400, between_30_34_yo: 12023 },
    { autonomic_community: "madrid", year: 2020, quarter: "q1", between_20_24_yo: 3981, between_25_29_yo: 6753, between_30_34_yo: 6239 }
];


    // GET request that inserts to the database the initial data.

        db.find({},(err, data)=>{
            if (err){               
                console.error(`ERROR: ${err}`);
            }
            else if(data.length < 1){
                db.insert(initialEmigrationData);
            }
        });

// Function that contains all of the HTTP requests.

function loadBackendGAM(app){

    

    //Searches:

    // GET request that retrieves from de DB the current data loaded.

     // GET operation for a certain community and querying for year or/and quarter paginated
     app.get(BASE_API + "/emigration-stats", (request, response) => {
        let paramName = request.query.autonomic_community;
        let paramYear = parseInt(request.query.year);
        let paramQuarter = request.query.quarter;
        let paramOffset = request.query.offset;
        let paramLimit = request.query.limit;

        let query = {};
        let paramFields = request.query.fields;
    
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

        paramOffset? parseInt(paramOffset): 0;
        paramLimit? parseInt(paramLimit): -1;

        db.find(query).sort({ autonomic_community: 1 }).skip(paramOffset).limit(paramLimit).exec(function(err, docs){
            if(!docs.length){
                response.sendStatus(404);
                return;
            }
            else{
                response.send(JSON.stringify(docs.map((c) => {
                    delete c._id;
                    Object.keys(c).forEach(field => {
                        if (paramFields != undefined && !paramFields.includes(field)) {
                            delete c[field];
                        }
                    });
                    return c;
                }), null, 2));
            }
        })
    });

    
    // POST request that inserts one item to the DB.

    app.post(BASE_API+"/emigration-stats",(request,response)=>{ 
        console.log("New POST to /emigration-stats");
        console.log(`<${request.body}>`); 
    
        const allowedFields = ["autonomic_community", "year", "quarter", "between_20_24_yo", "between_25_29_yo", "between_30_34_yo"];
        let newAutonomicCommunity=request.body;
        console.log(newAutonomicCommunity);
        let invalidFields= Object.keys(newAutonomicCommunity).filter(f => !allowedFields.includes(f));
        if(invalidFields.length>0){ 
            response.sendStatus(400);
            return;
        }
        db.findOne({
            autonomic_community: newAutonomicCommunity.autonomic_community,
            year: parseInt(newAutonomicCommunity.year),
            quarter: newAutonomicCommunity.quarter
        },
        (err,existingResource)=>{
            if (err){
                response.status(500).send("Error code 01 (please contact admin)");                
                console.error(`ERROR: ${err}`);
                return;
            }
            else if (existingResource){
                response.sendStatus(409);
                return;
            }
            else{
                db.insert(newAutonomicCommunity,(err,newDoc)=>{
                    if (err){
                        response.status(500).send("Error code 01 (please contact admin)");                
                        console.error(`ERROR: ${err}`);
                        return;
                    }
                    else{
                        response.sendStatus(201);
                    }
                });
            }
        }
        );        
    });

    // PUT request that is not allowed.
    
    app.put(BASE_API+"/emigration-stats",(request,response)=>{ 
        response.sendStatus(405);
    });
    
    //DELETE request that removes every item from the DB.

    app.delete(BASE_API+"/emigration-stats",(request,response)=>{ 
        db.remove({},{multi: true},function(err,numRemoved){
            if (err){
                response.status(500).send("Error code 01 (please contact admin)");                
                console.error(`ERROR: ${err}`);
                return;
            }else{
                response.sendStatus(200);
    
            }
        });
    });

    //Methods for a specific resource:

    // GET request that retrieves from de DB the item which parameters are the indacated in the request.
    
    app.get(BASE_API+"/emigration-stats/:name/:year/:quarter",(request,response)=>{
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        console.log(`New GET to /emigration-stats/${paramName}/${paramYear}/${paramQuarter}`);

        db.findOne({autonomic_community: paramName, year: parseInt(paramYear), quarter:paramQuarter},{_id: 0 },(err,emigrationData)=>{ //campo _id:0 le dice a nedb que no incluya el campo _id, solo sirve cuando se trata a un solo objeto, si fuera un array eliminarlo con map
            if(err){
                response.status(500).send("Error code 01 (please contact admin)");                
                console.error(`ERROR: ${err}`);
                return;
            }
            else if (!emigrationData){
                response.sendStatus(404);
                return;
            }
            else{ 
                response.send(JSON.stringify(emigrationData,null,2));
            }
        });
    });

    // POST request that is not allowed.
    
    app.post(BASE_API+"/emigration-stats/:name/:year/:quarter",(request,response)=>{
        response.sendStatus(405);
    });
    

    // PUT request that updates from de DB the item which parameters are the indacated in the request.

    app.put(BASE_API+"/emigration-stats/:name/:year/:quarter",(request,response)=>{
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        let putBody= request.body;
        let allowedFields = ["autonomic_community", "year", "quarter", "between_20_24_yo", "between_25_29_yo", "between_30_34_yo"];
        let invalidFields = Object.keys(putBody).filter(f => !allowedFields.includes(f));

        if(invalidFields.length>0){
            response.sendStatus(400);
            return;
        }
        else if(!((putBody.autonomic_community === paramName) && (parseInt(putBody.year) === parseInt(paramYear)) && (putBody.quarter === paramQuarter))){
            response.sendStatus(400);
            return; 
        }

        db.update({autonomic_community: paramName, year: parseInt(paramYear), quarter:paramQuarter},{$set: putBody},{},(err,numReplaced)=>{
            if(err){
                response.status(500).send("Error code 01 (please contact admin)");                
                console.error(`ERROR: ${err}`);
                return;
            }
            else{
                if((numReplaced === 0)){
                    response.sendStatus(404);
                    return;
                }
                else{
                    response.sendStatus(200);
                    return;
                }
            } 

        });
    });
    
    // DELETE request that removes from de DB the item which parameters are the indacated in the request.


    app.delete(BASE_API+"/emigration-stats/:name/:year/:quarter",(request,response)=>{ 
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        console.log(`New DELETE to /emigration-stats/${paramName}/${paramYear}/${paramQuarter}`);
        db.remove({autonomic_community: paramName, year: parseInt(paramYear), quarter:paramQuarter},{},(err,numRemoved)=>{ 
            if(err){
                response.status(500).send("Error code 01 (please contact admin)");                
                console.error(`ERROR: ${err}`);
                return;
            }
            else{
                if((numRemoved === 0)){
                    response.sendStatus(404);
                    return;
                }
                else{
                    response.sendStatus(200);
                    return;
                }
            } 

        })
    });

    // GET request that navigates to my personal POSTMAN collection documentation.

    app.get(BASE_API+"/emigration-stats/docs",(request,response)=>{
        response.redirect("https://documenter.getpostman.com/view/42116692/2sAYkLkc24");
    });
}

export {loadBackendGAM}








