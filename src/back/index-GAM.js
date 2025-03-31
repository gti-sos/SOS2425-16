import dataStore from "nedb";

const BASE_API= "/api/v1";

let db = new dataStore();

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

//const emigrationData=new Array();

/*
let array_between_30_34_yo_cat= initialEmigrationData.slice(-3).map(obj=>
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
*/
function loadBackendGAM(app){
    
    /*
    app.get("/samples/GAM",(request,response)=>{
        let res= average();
        response.send(res.toString());
    });
    */

    //13.



    app.get(BASE_API + "/emigration-stats/loadInitialData", (request,response) =>{

        db.count({},(err,cont)=>{ 
            if (err){
                response.status(500).send("Error code 01 (please contact admin)");                
                console.error(`ERROR: ${err}`);
                return;
            }
            else if(cont >0){
                response.sendStatus(409);
                return;
            }
            else{
                db.insert(initialEmigrationData, (err,emigrationData)=>{
                    if (err){
                        response.status(500).send("Error code 01 (please contact admin)");                
                        console.error(`ERROR: ${err}`);
                    }else{
                        response.send(JSON.stringify(emigrationData.map((c)=>{
                            delete c._id;
                            return c;
                        }),null,2));
                    }
                });
            }
        });
    });
    

    //BÚSQUEDAS:


    // solo se puede tener una activa a la vez, misma url no se puede diferenciar (?)

    //11.

    
    app.get(BASE_API+"/emigration-stats",(request,response)=>{
        db.find({},(err,emigrationData)=>{
            if (err){
                response.status(500).send("Error code 01 (please contact admin)");                
                console.error(`ERROR: ${err}`);
                return;
            }else{
                response.send(JSON.stringify(emigrationData.map((c)=>{
                    delete c._id;
                    return c;
                }),null,2));
            }
        });
    });
    

    
    /*
    // busqueda por nombre rollo query de un objeto en concreto ? solo se puede hacer esta o la de arriba, las dos a la vez no
     app.get(BASE_API+"/emigration-stats",(request,response)=>{
        let paramName= request.query.autonomic_community;
        let paramYear= request.query.year;
        let paramQuarter= request.query.quarter;
        console.log(`New GET to /emigration-stats/${paramName}`);
        if(emigrationData.filter(v => v.autonomic_community === paramName && Number(v.year)===Number(paramYear) && v.quarter === paramQuarter).length===0){
            response.sendStatus(404);
        }
        db.findOne({autonomic_community: paramName, year: Number(paramYear), quarter:paramQuarter},{_id: 0 },(err,emigrationData)=>{ //campo _id:0 le dice a nedb que no incluya el campo _id, solo sirve cuando se trata a un solo objeto, si fuera un array eliminarlo con map
                if(err){
                    response.status(500).send("Error code 01 (please contact admin)");                
                    console.error(`ERROR: ${err}`);
                }
                else{ 
                response.send(JSON.stringify(emigrationData,null,2));
                }
            });
        });
    */

    /*
    // busqueda por nombre rollo query de una comunidad en un año
      app.get(BASE_API+"/emigration-stats",(request,response)=>{
        let paramName= request.query.autonomic_community;
        let paramYear= request.query.year;
        console.log(`New GET to /emigration-stats/${paramName}`);
        if(emigrationData.filter(v => v.autonomic_community === paramName && Number(v.year)===Number(paramYear)).length===0){
            response.sendStatus(404);
        }
        db.find({autonomic_community: paramName, year: Number(paramYear)},{_id: 0 },(err,emigrationData)=>{ //campo _id:0 le dice a nedb que no incluya el campo _id, solo sirve cuando se trata a un solo objeto, si fuera un array eliminarlo con map
                if(err){
                    response.status(500).send("Error code 01 (please contact admin)");                
                    console.error(`ERROR: ${err}`);
                }
                else{ 
                response.send(JSON.stringify(emigrationData,null,2));
                }
            });
        });
    */
   /*
    // busqueda por nombre rollo query de una comunidad
      app.get(BASE_API+"/emigration-stats",(request,response)=>{
        let paramName= request.query.autonomic_community;
        console.log(`New GET to /emigration-stats/${paramName}`);
        if(emigrationData.filter(v => v.autonomic_community === paramName).length===0){
            response.sendStatus(404);
        }
        db.find({autonomic_community: paramName},{_id: 0 },(err,emigrationData)=>{ //campo _id:0 le dice a nedb que no incluya el campo _id, solo sirve cuando se trata a un solo objeto, si fuera un array eliminarlo con map
                if(err){
                    response.status(500).send("Error code 01 (please contact admin)");                
                    console.error(`ERROR: ${err}`);
                }
                else{ 
                response.send(JSON.stringify(emigrationData,null,2));
                }
            });
        });
    */

    /*
    //PAGINACIÓN (sobre todos los objetos):

    app.get(BASE_API+"/emigration-stats",(request,response)=>{
        let limit= request.query.limit;
        let offset=request.query.offset;
        limit= parseInt(limit) || 5; // valor por defecto 5
        offset= parseInt(offset) || 0; //valor por defecto 0

        db.count({}, (err, total) => {
            if(err){
                response.status(500).send("Error code 01 (please contact admin)");                
                console.error(`ERROR: ${err}`);
            }
            else{
                db.find({}, { _id: 0 }).skip(offset).limit(limit).exec((err, docs) => {
                    if(err){
                        response.status(500).send("Error code 01 (please contact admin)");                
                        console.error(`ERROR: ${err}`);
                    }
                    else{
                        response.json({
                            offset,
                            limit,
                            total,
                            hasMore: offset + limit < total, // Indica si hay más datos
                            data: docs
                        });
                    }
                });
            }
        });
    });
    
    */

    
        
    app.post(BASE_API+"/emigration-stats",(request,response)=>{ 
        console.log("New POST to /emigration-stats");
        console.log(`<${request.body}>`); // <> para saber si esta vacio
    
        const allowedFields = ["autonomic_community", "year", "quarter", "between_20_24_yo", "between_25_29_yo", "between_30_34_yo"];
        let newAutonomicCommunity=request.body;
        console.log(newAutonomicCommunity);
        let invalidFields= Object.keys(newAutonomicCommunity).filter(f => !allowedFields.includes(f));
        if(invalidFields.length>0){ // aqui si entra
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
    
    app.put(BASE_API+"/emigration-stats",(request,response)=>{ 
        response.sendStatus(405);
    });
    
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
    
    //Métodos para un recurso en específico

    
    app.get(BASE_API+"/emigration-stats/:name/:year/:quarter",(request,response)=>{
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        console.log(`New GET to /emigration-stats/${paramName}/${paramYear}/${paramQuarter}`);
        //let recurso=emigrationData.filter(v => v.autonomic_community === paramName && parseInt(v.year)===parseInt(paramYear) && v.quarter === paramQuarter); // hay que ver como meterlo dentro
        //if(recurso.length===0 || !recurso){
        //    response.sendStatus(404);
        //}
        db.findOne({autonomic_community: paramName, year: parseInt(paramYear), quarter:paramQuarter},{_id: 0 },(err,emigrationData)=>{ //campo _id:0 le dice a nedb que no incluya el campo _id, solo sirve cuando se trata a un solo objeto, si fuera un array eliminarlo con map
            if(err){
                response.status(500).send("Error code 01 (please contact admin)");                
                console.error(`ERROR: ${err}`);
                return;
            }
            else if (!emigrationData){ // se caga encima
                response.sendStatus(404);
                return;
            }
            else{ 
                // if(!emigrationData){
                //     response.sendStatus(404); // a veces no lo encuentra por la carisima,sacar afuera
                // }
                response.send(JSON.stringify(emigrationData,null,2));
            }
        });
        // let res = emigrationData.filter(v => v.autonomic_community === paramName && parseInt(v.year)===parseInt(paramYear) && v.quarter === paramQuarter);
        // if(res.length===0){
        //     response.sendStatus(404);
        // }
        // response.send(JSON.stringify(res,null,2));
    });
    
    app.post(BASE_API+"/emigration-stats/:name/:year/:quarter",(request,response)=>{
        response.sendStatus(405);
    });
    
    app.put(BASE_API+"/emigration-stats/:name/:year/:quarter",(request,response)=>{
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        let putBody= request.body;
        let allowedFields = ["autonomic_community", "year", "quarter", "between_20_24_yo", "between_25_29_yo", "between_30_34_yo"];
        let invalidFields = Object.keys(putBody).filter(f => !allowedFields.includes(f));

        if(invalidFields.length>0){ // este error no se lanza, se aborta el despliegue del tiron (al menos en local)
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

        // if(invalidFields.length>0){
        //     response.sendStatus(400);
        // }
        // else if(!((putBody.autonomic_community === paramName) && (parseInt(putBody.year) === parseInt(paramYear)) && (putBody.quarter === paramQuarter))){
        //     response.sendStatus(400);
        // }
        // else if (emigrationData.filter(v => v.autonomic_community === paramName && parseInt(v.year)===parseInt(paramYear) && v.quarter === paramQuarter).length == 0){
        //     response.sendStatus(404);
        // }
        // else{
        //     emigrationData.forEach(v => {
        //         if((v.autonomic_community === paramName && parseInt(v.year)===parseInt(paramYear) && v.quarter === paramQuarter)){
        //             v.between_20_24_yo = putBody.between_20_24_yo;
        //             v.between_25_29_yo = putBody.between_25_29_yo;
        //             v.between_30_34_yo = putBody.between_30_34_yo;
        //         }
        //     })
        //     response.sendStatus(200);
    
        // }
    });
    
    app.delete(BASE_API+"/emigration-stats/:name/:year/:quarter",(request,response)=>{ // dudas, borro todas las de cataluña? o solo una en especifico (id ?)
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        console.log(`New DELETE to /emigration-stats/${paramName}/${paramYear}/${paramQuarter}`);
        db.remove({autonomic_community: paramName, year: parseInt(paramYear), quarter:paramQuarter},{},(err,numRemoved)=>{ // cuando solo borra un objeto devuelve null
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
    
        // if(request.length===0){
        //     response.sendStatus(404);
        // } else{
        //     console.log(res)
        //     res.forEach((item) => emigrationData.splice(emigrationData.indexOf(item), 1));
        // }
        //response.sendStatus(200);
    });

    app.get(BASE_API+"/emigration-stats/docs",(request,response)=>{
        response.redirect("https://documenter.getpostman.com/view/42116692/2sAYkLkc24");
    });
}

export {loadBackendGAM}








