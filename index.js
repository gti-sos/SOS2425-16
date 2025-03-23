const express = require("express");
const cool = require('cool-ascii-faces');
const app = express();
const PORT = process.env.PORT || 16078;
const BASE_API= "/api/v1";

app.use("/",express.static("./public"));
app.use("/about",express.static("./public/about.html"));
app.use(express.json());

app.get("/cool",(request,response)=>{
    response.send(cool());
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}...`);
});


// index-GAM.js

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

app.get("/samples/GAM",(request,response)=>{
    let res= average();
    response.send(res.toString());
});

//11.

app.get(BASE_API+"/emigration-stats",(request,response)=>{
    let res= emigrationData;
    response.send(JSON.stringify(res,null,2));
});

//13.

app.get(BASE_API + "/emigration-stats/loadInitialData", (request,response) =>{
    if(!emigrationData.length){
        emigrationData.push(...initialEmigrationData);
    }
    response.send(initialEmigrationData);
})


//16.a.1
app.get(BASE_API+"/emigration-stats/:name",(request,response)=>{
    let paramName = request.params.name;
    console.log(`New GET to /emigration-stats/${paramName}`);
    //let id= Number(request.query.id);
    /*if (id){
        let res= emigrationData.filter(obj => obj.id === id); // busca por id
        response.send(JSON.stringify(res,null,2));
    }*/
    let res= emigrationData.filter(obj => obj.autonomic_community === paramName);
    if(res.length === 0){
        response.sendStatus(404);
    }
    response.send(JSON.stringify(res,null,2));
});

//duda : nose si el /towns ponerlo por /comunidad_autonoma o dejarlo con todas y luego el especifico la verdad xd

app.post(BASE_API+"/emigration-stats",(request,response)=>{ 
    console.log("New POST to /emigration-stats");
    console.log(`<${request.body}>`); // <> para saber si esta vacio

    const allowedFields = ["autonomic_community", "year", "quarter", "between_20_24_yo", "between_25_29_yo", "between_30_34_yo"];
    let newAutonomicCommunity=request.body;
    let invalidFields= Object.keys(newAutonomicCommunity).filter(f => !allowedFields.includes(f))
    if(invalidFields.length>0){ // si funca
        response.sendStatus(400);
    }
    //let emigrationDataWithoutId=emigrationData.map(({id, ...resto}) => resto );
    else if(emigrationData.some(i => JSON.stringify(i) === JSON.stringify(newAutonomicCommunity))){ // veo si ya existe por el nuevoId (mala idea, el id se autoincrementa), el some devuelve booleano, no funca
        response.sendStatus(409); // copiar la primera haceiendo un slice sin el id o borrar el id
    }
    else{
        response.sendStatus(201);
        emigrationData.push(newAutonomicCommunity);
    }

    //let lastId=emigrationData[emigrationData.length -1].id;
    //let newId=lastId+1;
    //newAutonomicCommunity= {id: newId, ...newAutonomicCommunity};
});

app.put(BASE_API+"/emigration-stats",(request,response)=>{ // método incorrecto
    response.sendStatus(405);
});

app.delete(BASE_API+"/emigration-stats",(request,response)=>{ // dudas, dejarlo asi y cambiarlo el dia del feedback
    let res= emigrationData.slice(); // la copio
    res.length=0; // la vacio
    //response.sendStatus(401); // porque no quiero que se borren todos los pueblos
    response.send(200);
});

//16.a.2

app.get(BASE_API+"/emigration-stats/:name/:year/:quarter",(request,response)=>{

    //let id= Number(request.query.id);
    // if (id){
    //     let res= emigrationData.filter(obj => obj.id === id); // busca por id
    //     response.send(JSON.stringify(res,null,2));
    // }
    let paramName = request.params.name;
    let paramYear = request.params.year;
    let paramQuarter = request.params.quarter;
    console.log(`New GET to /emigration-stats/${paramName}/${paramYear}/${paramQuarter}`);
    let res = emigrationData.filter(v => v.autonomic_community === paramName && parseInt(v.year)===parseInt(paramYear) && v.quarter === paramQuarter);
    if(res.length===0){
        response.sendStatus(404);
    }
    response.send(JSON.stringify(res,null,2));
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
    }else if (emigrationData.filter(v => v.autonomic_community === paramName && parseInt(v.year)===parseInt(paramYear) && v.quarter === paramQuarter).length == 0){
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
    let res = emigrationData.filter(v => (v.autonomic_community === paramName) && (v.year === paramYear) && (v.quarter === paramQuarter));
    if(request.length===0){
        response.sendStatus(404);
    }else{
        res.forEach((item) => emigrationData.splice(emigrationData.indexOf(item), 1));
    }
    response.sendStatus(200);
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


app.delete(BASE_API+"/unemployment-stats",(request,response)=>{  //****BIEN HECHO  ******/
    //response.sendStatus(401); // Al intentar eliminarlo todo, le avisamos que no tiene permisos.
    response.sendStatus(405);
});

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

// Sample get  operation for the averageRateIVAMadrid function
app.get("/samples/IBL",(request,response)=>{
        response.send(averageRateIVAMadrid(taxesData).toString());
});

// 11

// GET operation for all the data in taxesData
app.get(BASE_API + "/taxes-stats", (request,response) =>{
    let res = taxesData;
    response.send(JSON.stringify(res, null, 2));
});

// 13

// GET operation that inits the data on taxesData from initialTaxesData
app.get(BASE_API + "/taxes-stats/loadInitialData", (request,response) =>{
    if(!taxesData.length){
       taxesData.push(...initialTaxesData);
    }
    response.send(taxesData);
})

// 14

// GET operation for all communities
app.get(BASE_API + "/taxes-stats/", (request,response) =>{
    let res = taxesData.map(v => v.autonomic_community);
    response.send(JSON.stringify(res, null, 2));
});

// GET operation for a certain community
app.get(BASE_API + "/taxes-stats/:name/:year/:quarter", (request, response) => {
    let paramName = request.params.name;
    let paramYear = request.params.year;
    let paramQuarter = request.params.quarter;
    let res = taxesData.filter(v => v.autonomic_community === paramName 
        && parseInt(v.year)===parseInt(paramYear) && v.quarter === paramQuarter);
    response.send(JSON.stringify(res, null, 2));

});

// GET operation for a certain community on a certain year
// app.get(BASE_API + "/taxes-stats/:name?year=:yearNum", (request, response) => {
//     let paramName = request.params.name;
//     let paramYear = request.params.yearNum;
//     let res = taxesData.filter(v => (v.autonomic_community === paramName) && (v.year == paramYear));
//     response.send(JSON.stringify(res, null, 2));
//
// });

// GET operation for a certain community on a certain year on a certain quarter
// app.get(BASE_API + "/taxes-stats/:name/:year/:quarter", (request, response) => {
//     let paramName = request.params.name;
//     let paramYear = request.params.year;
//     let paramQuarter = request.params.quarter;
//     let res = taxesData.filter(v => (v.autonomic_community === paramName) && (v.year === paramYear) && (v.quarter === paramQuarter));
//     response.send(JSON.stringify(res, null, 2));
//
// });

// DELETE operation for all
app.delete(BASE_API + "/taxes-stats/", (request, response) => {
    // taxesData.length = 0;
    // response.sendStatus(200);
    response.sendStatus(401); // porque no quiero que se borren todos los pueblos
})

// DELETE operation for a certain community
app.delete(BASE_API + "/taxes-stats/:name/:year/:quarter", (request, response) => {
    let paramName = request.params.name;
    let paramYear = request.params.year;
    let paramQuarter = request.params.quarter;
    taxesData.filter(v => v.autonomic_community === paramName && parseInt(v.year) === parseInt(paramYear) && v.quarter === paramQuarter)
        .forEach((item) => taxesData.splice(taxesData.indexOf(item), 1));
    response.sendStatus(200);
})

// POST operation for creating community data (name, year and quarter)
app.post(BASE_API + "/taxes-stats", (request, response) => {
    let postBody = request.body;
    let allowedFields = ["autonomic_community", "year", "quarter", "atr_irpf", "atr_soc_no_consolidadas", "atr_iva"];
    let invalidFields = Object.keys(postBody).filter(f => !allowedFields.includes(f));

    if (invalidFields.length > 0){
        response.sendStatus(400);
    }
    else if (taxesData.some(j => JSON.stringify(postBody) === JSON.stringify(j))) {
        response.sendStatus(409);
    }
    else{
        response.sendStatus(201);
        taxesData.push(postBody);
    }
});

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
    else if(taxesData.filter(v => v.autonomic_community === paramName 
        && parseInt(v.year)===parseInt(paramYear) && v.quarter === paramQuarter).length == 0){
        response.sendStatus(404);
    }
    else{
        taxesData.forEach(element => {
            if((element.autonomic_community === paramName && parseInt(element.year) === parseInt(paramYear) 
                && element.quarter === paramQuarter)){
                element.atr_irpf = postBody.atr_irpf;
                element.atr_soc_no_consolidadas = postBody.atr_soc_no_consolidadas;
                element.atr_iva = postBody.atr_iva;
            }
        
        })
        response.sendStatus(200);
    }


})

