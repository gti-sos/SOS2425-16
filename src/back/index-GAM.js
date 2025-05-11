import dataStore from "nedb";
import request from "request";

const BASE_API = "/api/v1";

let db = new dataStore();

// Initial data extracted from the propuse sheet

const initialEmigrationData = [
    { autonomic_community: "andalucia", year: 2021, quarter: "q1", between_20_24_yo: 3666, between_25_29_yo: 5409, between_30_34_yo: 5996 },
    { autonomic_community: "andalucia", year: 2020, quarter: "q2", between_20_24_yo: 2156, between_25_29_yo: 3201, between_30_34_yo: 3690 },
    { autonomic_community: "asturias", year: 2021, quarter: "q3", between_20_24_yo: 304, between_25_29_yo: 510, between_30_34_yo: 483 },
    { autonomic_community: "madrid", year: 2021, quarter: "q3", between_20_24_yo: 6028, between_25_29_yo: 10836, between_30_34_yo: 10004 },
    { autonomic_community: "castilla-y-leon", year: 2021, quarter: "q1", between_20_24_yo: 766, between_25_29_yo: 1171, between_30_34_yo: 1210 },
    { autonomic_community: "castilla-la-mancha", year: 2021, quarter: "q2", between_20_24_yo: 984, between_25_29_yo: 1304, between_30_34_yo: 1512 },
    { autonomic_community: "cataluña", year: 2021, quarter: "q3", between_20_24_yo: 7305, between_25_29_yo: 12960, between_30_34_yo: 13077 },
    { autonomic_community: "cataluña", year: 2020, quarter: "q1", between_20_24_yo: 4469, between_25_29_yo: 8086, between_30_34_yo: 7808 },
    { autonomic_community: "cataluña", year: 2019, quarter: "q1", between_20_24_yo: 6397, between_25_29_yo: 12400, between_30_34_yo: 12023 },
    { autonomic_community: "madrid", year: 2020, quarter: "q1", between_20_24_yo: 3981, between_25_29_yo: 6753, between_30_34_yo: 6239 },
    { autonomic_community: "valencia", year: 2020, quarter: "q1", between_20_24_yo: 4023, between_25_29_yo: 9012, between_30_34_yo: 10345 },
    { autonomic_community: "valencia", year: 2021, quarter: "q1", between_20_24_yo: 5060, between_25_29_yo: 9051, between_30_34_yo: 12343 },
    { autonomic_community: "valencia", year: 2019, quarter: "q1", between_20_24_yo: 3030, between_25_29_yo: 6014, between_30_34_yo: 9876 },
    { autonomic_community: "murcia", year: 2019, quarter: "q1", between_20_24_yo: 2000, between_25_29_yo: 4278, between_30_34_yo: 3287 },
    { autonomic_community: "murcia", year: 2020, quarter: "q1", between_20_24_yo: 3453, between_25_29_yo: 3251, between_30_34_yo: 4665 },
    { autonomic_community: "murcia", year: 2021, quarter: "q1", between_20_24_yo: 5234, between_25_29_yo: 1231, between_30_34_yo: 8965 },
    { autonomic_community: "aragon", year: 2019, quarter: "q1", between_20_24_yo: 123, between_25_29_yo: 4231, between_30_34_yo: 7243 },
    { autonomic_community: "aragon", year: 2020, quarter: "q1", between_20_24_yo: 3032, between_25_29_yo: 6124, between_30_34_yo: 7612 },
    { autonomic_community: "aragon", year: 2021, quarter: "q1", between_20_24_yo: 5124, between_25_29_yo: 8567, between_30_34_yo: 12432 },
    { autonomic_community: "andalucia", year: 2019, quarter: "q1", between_20_24_yo: 2345, between_25_29_yo: 5897, between_30_34_yo: 8234 },
    { autonomic_community: "asturias", year: 2019, quarter: "q1", between_20_24_yo: 3021, between_25_29_yo: 6213, between_30_34_yo: 1287 },
    { autonomic_community: "asturias", year: 2021, quarter: "q1", between_20_24_yo: 2134, between_25_29_yo: 3141, between_30_34_yo: 8423 },
    { autonomic_community: "galicia", year: 2019, quarter: "q1", between_20_24_yo: 538, between_25_29_yo: 1144, between_30_34_yo: 2341 },
    { autonomic_community: "galicia", year: 2020, quarter: "q1", between_20_24_yo: 478, between_25_29_yo: 2345, between_30_34_yo: 3981 },
    { autonomic_community: "galicia", year: 2021, quarter: "q1", between_20_24_yo: 487, between_25_29_yo: 3412, between_30_34_yo: 4832 },
    { autonomic_community: "castilla-y-leon", year: 2019, quarter: "q1", between_20_24_yo: 156, between_25_29_yo: 1298, between_30_34_yo: 1291 },
    { autonomic_community: "castilla-y-leon", year: 2020, quarter: "q1", between_20_24_yo: 231, between_25_29_yo: 2398, between_30_34_yo: 2384 },
    { autonomic_community: "castilla-la-mancha", year: 2019, quarter: "q1", between_20_24_yo: 165, between_25_29_yo: 5328, between_30_34_yo: 2398 },
    { autonomic_community: "castilla-la-mancha", year: 2020, quarter: "q1", between_20_24_yo: 387, between_25_29_yo: 1245, between_30_34_yo: 6781 },
    { autonomic_community: "extremadura", year: 2019, quarter: "q1", between_20_24_yo: 789, between_25_29_yo: 2345, between_30_34_yo: 6546 },
    { autonomic_community: "extremadura", year: 2020, quarter: "q1", between_20_24_yo: 1244, between_25_29_yo: 4667, between_30_34_yo: 7669 },
    { autonomic_community: "extremadura", year: 2021, quarter: "q1", between_20_24_yo: 8761, between_25_29_yo: 5435, between_30_34_yo: 23948 },
    { autonomic_community: "madrid", year: 2019, quarter: "q1", between_20_24_yo: 3155, between_25_29_yo: 6712, between_30_34_yo: 9164 }
];



// GET request that inserts to the database the initial data.

/*
db.find({},(err, data)=>{
    if (err){               
        console.error(`ERROR: ${err}`);
    }
    else if(data.length < 1){
        db.insert(initialEmigrationData);
    }
});
*/

// Function that contains all of the HTTP requests.

function loadBackendGAM(app) {

    app.get(BASE_API + "/emigration-stats/loadInitialData", (request, response) => {
        db.find({}, (err, data) => {
            if (err) {
                response
                    .status(500)
                    .send("Error code 01 (please contact admin)");
                console.error(`ERROR: ${err}`);
            } else if (data.length > 0) {
                response.sendStatus(200);
            } else if (data.length < 1) {
                db.insert(initialEmigrationData);
                response.sendStatus(200);
            }
        });
    });


    //Searches:

    // GET request that retrieves from de DB the current data loaded.

    // GET operation for a certain community and querying for year or/and quarter paginated
    app.get(BASE_API + "/emigration-stats", (request, response) => {
        let paramName = request.query.autonomic_community;
        let paramYear = parseInt(request.query.year);
        let paramQuarter = request.query.quarter;
        let paramBetween_20_24_yo = parseInt(request.query.between_20_24_yo);
        let paramBetween_25_29_yo = parseInt(request.query.between_25_29_yo);
        let paramBetween_30_34_yo = parseInt(request.query.between_30_34_yo);
        let paramOffset = request.query.offset;
        let paramLimit = request.query.limit;

        let query = {};
        let paramFields = request.query.fields;

        if (paramName) {
            query.autonomic_community = paramName;
        }
        if (paramYear) {
            query.year = paramYear;
        }
        if (paramQuarter) {
            query.quarter = paramQuarter;
        }
        if (paramBetween_20_24_yo) {
            query.between_20_24_yo = paramBetween_20_24_yo;
        }
        if (paramBetween_25_29_yo) {
            query.between_25_29_yo = paramBetween_25_29_yo;
        }
        if (paramBetween_30_34_yo) {
            query.between_30_34_yo = paramBetween_30_34_yo;
        }
        if (paramFields) {
            paramFields = paramFields.split(',');
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

        db.find(query).sort({ autonomic_community: 1 }).skip(paramOffset).limit(paramLimit).exec(function(err, docs) {
            if (!docs.length) {
                response.sendStatus(404);
                return;
            }
            else {
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

    app.post(BASE_API + "/emigration-stats", (request, response) => {
        console.log("New POST to /emigration-stats");
        console.log(`<${request.body}>`);

        const allowedFields = ["autonomic_community", "year", "quarter", "between_20_24_yo", "between_25_29_yo", "between_30_34_yo"];
        let newAutonomicCommunity = request.body;
        console.log(newAutonomicCommunity);
        let invalidFields = Object.keys(newAutonomicCommunity).filter(f => !allowedFields.includes(f));
        let invalidValues = Object.values(newAutonomicCommunity).filter((f) => ((f === "") || (f === null) || (f === undefined)));
        if (invalidFields.length > 0 || invalidValues.length > 0) {
            response.sendStatus(400);
            return;
        }
        db.findOne({
            autonomic_community: newAutonomicCommunity.autonomic_community,
            year: parseInt(newAutonomicCommunity.year),
            quarter: newAutonomicCommunity.quarter
        },
            (err, existingResource) => {
                if (err) {
                    response.status(500).send("Error code 01 (please contact admin)");
                    console.error(`ERROR: ${err}`);
                    return;
                }
                else if (existingResource) {
                    response.sendStatus(409);
                    return;
                }
                else {
                    db.insert(newAutonomicCommunity, (err, newDoc) => {
                        if (err) {
                            response.status(500).send("Error code 01 (please contact admin)");
                            console.error(`ERROR: ${err}`);
                            return;
                        }
                        else {
                            response.sendStatus(201);
                        }
                    });
                }
            }
        );
    });

    // PUT request that is not allowed.

    app.put(BASE_API + "/emigration-stats", (request, response) => {
        response.sendStatus(405);
    });

    //DELETE request that removes every item from the DB.

    app.delete(BASE_API + "/emigration-stats", (request, response) => {
        db.remove({}, { multi: true }, function(err, numRemoved) {
            if (err) {
                response.status(500).send("Error code 01 (please contact admin)");
                console.error(`ERROR: ${err}`);
                return;
            } else {
                response.sendStatus(200);

            }
        });
    });

    //Methods for a specific resource:

    // GET request that retrieves from de DB the item which parameters are the indacated in the request.

    app.get(BASE_API + "/emigration-stats/:name/:year/:quarter", (request, response) => {
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        console.log(`New GET to /emigration-stats/${paramName}/${paramYear}/${paramQuarter}`);

        db.findOne({ autonomic_community: paramName, year: parseInt(paramYear), quarter: paramQuarter }, { _id: 0 }, (err, emigrationData) => { //campo _id:0 le dice a nedb que no incluya el campo _id, solo sirve cuando se trata a un solo objeto, si fuera un array eliminarlo con map
            if (err) {
                response.status(500).send("Error code 01 (please contact admin)");
                console.error(`ERROR: ${err}`);
                return;
            }
            else if (!emigrationData) {
                response.sendStatus(404);
                return;
            }
            else {
                response.send(JSON.stringify(emigrationData, null, 2));
            }
        });
    });

    // POST request that is not allowed.

    app.post(BASE_API + "/emigration-stats/:name/:year/:quarter", (request, response) => {
        response.sendStatus(405);
    });


    // PUT request that updates from de DB the item which parameters are the indacated in the request.

    app.put(BASE_API + "/emigration-stats/:name/:year/:quarter", (request, response) => {
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        let putBody = request.body;
        let allowedFields = ["autonomic_community", "year", "quarter", "between_20_24_yo", "between_25_29_yo", "between_30_34_yo"];
        let invalidFields = Object.keys(putBody).filter(f => !allowedFields.includes(f));
        let invalidValues = Object.values(putBody).filter((f) => ((f === "") || (f === null) || (f === undefined)));

        if (invalidFields.length > 0 || invalidValues.length > 0) {
            response.sendStatus(400);
            return;
        }
        else if (!((putBody.autonomic_community === paramName) && (parseInt(putBody.year) === parseInt(paramYear)) && (putBody.quarter === paramQuarter))) {
            response.sendStatus(400);
            return;
        }

        db.update({ autonomic_community: paramName, year: parseInt(paramYear), quarter: paramQuarter }, { $set: putBody }, {}, (err, numReplaced) => {
            if (err) {
                response.status(500).send("Error code 01 (please contact admin)");
                console.error(`ERROR: ${err}`);
                return;
            }
            else {
                if ((numReplaced === 0)) {
                    response.sendStatus(404);
                    return;
                }
                else {
                    response.sendStatus(200);
                    return;
                }
            }

        });
    });

    // DELETE request that removes from de DB the item which parameters are the indacated in the request.


    app.delete(BASE_API + "/emigration-stats/:name/:year/:quarter", (request, response) => {
        let paramName = request.params.name;
        let paramYear = request.params.year;
        let paramQuarter = request.params.quarter;
        console.log(`New DELETE to /emigration-stats/${paramName}/${paramYear}/${paramQuarter}`);
        db.remove({ autonomic_community: paramName, year: parseInt(paramYear), quarter: paramQuarter }, {}, (err, numRemoved) => {
            if (err) {
                response.status(500).send("Error code 01 (please contact admin)");
                console.error(`ERROR: ${err}`);
                return;
            }
            else {
                if ((numRemoved === 0)) {
                    response.sendStatus(404);
                    return;
                }
                else {
                    response.sendStatus(200);
                    return;
                }
            }

        })
    });

    // GET request that navigates to my personal POSTMAN collection documentation.

    app.get(BASE_API + "/emigration-stats/docs", (request, response) => {
        response.redirect("https://documenter.getpostman.com/view/42116692/2sAYkLkc24");
    });

<<<<<<< HEAD
=======
    app.get(BASE_API + "/integrations/youtube", async (request, response) => {
        try {
            let res = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=id%2Csnippet%2CcontentDetails&id=UCV4xOVpbcV8SdueDCOxLXtQ&key=${YOUTUBE_API_KEY}`);
            let datos = await res.json();
            response.json(datos);
        } catch (error) {
            response.status(500).send('Error al obtener los datos');
        }
    });

    /*
    app.get(BASE_API+"/integrations/spotify",async (request,response)=>{
        try {
            //let canciones = [];
            let cancion = request.query.cancion;
            const url = `https://spotify23.p.rapidapi.com/search/?q=${encodeURIComponent(cancion)}&type=multi&offset=0&limit=10&numberOfTopResults=5`;
            console.log(encodeURIComponent(cancion));
            const res = await fetch(url, options_Spotify);
            let datos = await res.json();
            response.json(datos);
            console.log("respuestaback->"+res);
            console.log ("datoz-->"+datos);
            console.log("cosos canciones->"+datos.tracks.items);
            console.log(datos.tracks.items[0].data.albumOfTrack.coverArt.sources[0].url);
            console.log(datos.tracks.items[0].data.name);
            console.log(datos.tracks.items[0].data.uri);
        } catch (error) {
            response.status(500).send('Error al obtener los datos');
        }
    });
    */
    app.get(BASE_API + "/integrations/g20", async (request, response) => {
        try {
            let res = await fetch(`https://sos2425-20.onrender.com/api/v1/traffic-accidents`);
            let datos = await res.json();
            response.json(datos);
        } catch (error) {
            response.status(500).send('Error al obtener los datos');
        }
    });

    app.get(BASE_API + "/integrations/g12", async (request, response) => {
        try {
            let res = await fetch(`https://sos2425-12.onrender.com/api/v1/annual-consumptions`);
            let datos = await res.json();
            response.json(datos);
        } catch (error) {
            response.status(500).send('Error al obtener los datos');
        }
    });

>>>>>>> c1a0d5276b7f1def073dc0302c81c7da559b35c2
    // Integracion API YouTube mediante proxy
    var paths = '/api/yt';
    var apiServerHost = 'https://youtube.googleapis.com';
    app.use(paths, function(req, res) {
        var url = apiServerHost + req.url;
        console.log('piped: ' + req.url);
        req.pipe(request(url)).pipe(res);
    });

}

<<<<<<< HEAD
export { loadBackendGAM }
=======
export { loadBackendGAM }
>>>>>>> c1a0d5276b7f1def073dc0302c81c7da559b35c2
