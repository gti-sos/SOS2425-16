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

const emigrationData=new Array();

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

function loadBackendGAM(app){
    
    app.get("/samples/GAM",(request,response)=>{
        let res= average();
        response.send(res.toString());
    });


    //13.

    db.find({},(err,emigrationData)=>{ // esto es una puta mierda, si lo saco fuera si funciona (explicacion?)
        if(emigrationData.length < 1){
            db.insert(initialEmigrationData);
        }
    });
    
    app.get(BASE_API + "/emigration-stats/loadInitialData", (request,response) =>{
        if(!emigrationData.length){
            emigrationData.push(...initialEmigrationData);
         }
        response.send(emigrationData);
    });
    
    //11.
    
    app.get(BASE_API+"/emigration-stats",(request,response)=>{
        db.find({},(err,emigrationData)=>{
            response.send(JSON.stringify(emigrationData.map((c)=>{
                delete c._id;
                return c;
            }),null,2));
        });
    });
    

    
    
    // //16.a.1 método inutil de momento
    // app.get(BASE_API+"/emigration-stats/:name",(request,response)=>{
    //     let paramName = request.params.name;
    //     console.log(`New GET to /emigration-stats/${paramName}`);
    //     //let id= Number(request.query.id);
    //     /*if (id){
    //         let res= emigrationData.filter(obj => obj.id === id); // busca por id
    //         response.send(JSON.stringify(res,null,2));
    //     }*/
    //     let res= emigrationData.filter(obj => obj.autonomic_community === paramName);
    //     if(res.length === 0){
    //         response.sendStatus(404);
    //     }
    //     response.send(JSON.stringify(res,null,2));
    // });
        
    app.post(BASE_API+"/emigration-stats",(request,response)=>{ 
        console.log("New POST to /emigration-stats");
        console.log(`<${request.body}>`); // <> para saber si esta vacio
    
        const allowedFields = ["autonomic_community", "year", "quarter", "between_20_24_yo", "between_25_29_yo", "between_30_34_yo"];
        let newAutonomicCommunity=request.body;
        let invalidFields= Object.keys(newAutonomicCommunity).filter(f => !allowedFields.includes(f))
        if(invalidFields.length>0){
            response.sendStatus(400);
        }
        else if(emigrationData.some(i => JSON.stringify(i) === JSON.stringify(newAutonomicCommunity))){
            response.sendStatus(409);
        }
        else{
            response.sendStatus(201);
            db.insert(newAutonomicCommunity);
        }
    });
    
    app.put(BASE_API+"/emigration-stats",(request,response)=>{ 
        response.sendStatus(405);
    });
    
    app.delete(BASE_API+"/emigration-stats",(request,response)=>{ 
        db.remove({},{multi: true},function(err,numRemoved){
            
        });
        response.send(200);
    });
    
    //Métodos para un recurso en específico

    
    app.get(BASE_API+"/emigration-stats/:name/:year/:quarter",(request,response)=>{
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        console.log(`New GET to /emigration-stats/${paramName}/${paramYear}/${paramQuarter}`);
        db.findOne({autonomic_community: paramName, year: parseInt(paramYear), quarter:paramQuarter},{_id: 0 },(err,emigrationData)=>{ //campo _id:0 le dice a nedb que no incluya el campo _id, solo sirve cuando se trata a un solo objeto, si fuera un array eliminarlo con map
            if(err){
                response.status(500).send("Error code 01 (please contact admin)");                
                console.error(`ERROR: ${err}`);
            }
            else{ 
                if(!emigrationData){
                    response.sendStatus(404);
                }
                else{
                    response.send(JSON.stringify(emigrationData,null,2));
                }
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
    
    app.put(BASE_API+"/emigration-stats/:name/:year/:quarter",(request,response)=>{ // dudas, actualizo todas las de cataluña? o solo una en especifico (id ?)
        //let id= Number(request.query.id); // de la URL, hay que parsearlo aqui o despues porque sale como String de la URL
        //let {id :bodyId, ...updatedData } = request.body; // del Body
        let paramName = request.params.name; // comprobar que es igual al del body, decido que es ese el identifiacador (parametro obligatorio en el body)
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        let putBody= request.body;
        //let {autonomic_community:bodyName, ...updatedData} = request.body;
        let allowedFields = ["autonomic_community", "year", "quarter", "between_20_24_yo", "between_25_29_yo", "between_30_34_yo"];
        let invalidFields = Object.keys(putBody).filter(f => !allowedFields.includes(f));
        //let ind=emigrationData.findIndex(i => i.autonomic_community === paramName && i.year === paramYear && i.quarter===paramQuarter );
        if(invalidFields.length>0){
            response.sendStatus(400);
        }
        else if(!((putBody.autonomic_community === paramName) && (parseInt(putBody.year) === parseInt(paramYear)) && (putBody.quarter === paramQuarter))){
            response.sendStatus(400);
        }
        else if (emigrationData.filter(v => v.autonomic_community === paramName && parseInt(v.year)===parseInt(paramYear) && v.quarter === paramQuarter).length == 0){
            response.sendStatus(404);
        }
        else{
            emigrationData.forEach(v => {
                if((v.autonomic_community === paramName && parseInt(v.year)===parseInt(paramYear) && v.quarter === paramQuarter)){
                    v.between_20_24_yo = putBody.between_20_24_yo;
                    v.between_25_29_yo = putBody.between_25_29_yo;
                    v.between_30_34_yo = putBody.between_30_34_yo;
                }
            })
            response.sendStatus(200);
    
        }
    
        // if(Number(bodyId) != id){ 
        //     response.sendStatus(400); // que debe aparecer el id en el body de la peticion, pero tambien asegurarme de que parazca en la peticion?
        // }
        // let ind=emigrationData.findIndex(i => i.id === id); // devuelve la posicion del array en la que se encuentra el id
        // if( ind === -1){
        //     response.sendStatus(404); // igual hay que chequear que esta dentro de los id que contienen a cataluña o hacer un slice, que los reenumere con id del 0 al ultimo tambien
        // }
        // emigrationData[ind] = {...emigrationData[ind], ...updatedData};
        // response.sendStatus(200);
    });
    
    app.delete(BASE_API+"/emigration-stats/:name/:year/:quarter",(request,response)=>{ // dudas, borro todas las de cataluña? o solo una en especifico (id ?)
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        console.log(`New DELETE to /emigration-stats/${paramName}/${paramYear}/${paramQuarter}`);
        let res = emigrationData.filter(v => v.autonomic_community === paramName && parseInt(v.year) === parseInt(paramYear) && v.quarter === paramQuarter);
    
        if(request.length===0){
            response.sendStatus(404);
        } else{
            console.log(res)
            res.forEach((item) => emigrationData.splice(emigrationData.indexOf(item), 1));
        }
    
        response.sendStatus(200);
    });
}

export {loadBackendGAM}








