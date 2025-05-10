import dataStore from "nedb";
import express from "express";
import request from "request";

const BASE_API = "/api/v1";
let db = new dataStore();

import initialTaxesData from "./taxesData.json" with { type: "json" };

/**
 * Handles the backend operations
 * @param { import('express').Express} app
 */

function loadBackendIBL(app) {

    // Parameters
    // You can use a shorthand for multiple API endpoints: /api|/other_api
    var paths = '/api';
    var apiServerHost = 'https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2025-03';

    app.use(paths, function(req, res) {
        var url = apiServerHost + req.baseUrl + req.url;
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });

    app.use(express.static('.'));

    // app.listen(process.env.PORT || 8080);

    // GET operation that inits the data on taxesData from initialTaxesData
    app.get(BASE_API + "/taxes-stats/loadInitialData", (request, response) => {
        db.find({}, (err, data) => {
            if (err) {
                response
                    .status(500)
                    .send("Error code 01 (please contact admin)");
                console.error(`ERROR: ${err}`);
            } else if (data.length > 0) {
                response.sendStatus(200);
            } else if (data.length < 1) {
                db.insert(initialTaxesData);
                response.sendStatus(200);
            }
        });
    });

    app.use('/api/worldbank', async (req, res) => {
        let path = req.originalUrl.replace('/api/worldbank', '');

        // Añadir ? o & según sea necesario
        const connector = path.includes('?') ? '&' : '?';
        const fullUrl = `${API_HOST}${path}${connector}appid=${API_KEY}`;

        console.log('Proxying to:', fullUrl);

        const response = await fetch(fullUrl);
        const data = await response.json();

        res.status(response.status).json(data);
    });

    // GET operation for a certain community and querying for year or/and quarter paginated
    app.get(BASE_API + "/taxes-stats", (request, response) => {
        let paramName = request.query.autonomic_community;
        let paramYear = parseInt(request.query.year);
        let paramQuarter = request.query.quarter;
        let paramOffset = request.query.offset;
        let paramLimit = request.query.limit;
        let paramIVA = parseFloat(request.query.atr_iva);
        let paramIRPF = parseFloat(request.query.atr_irpf);
        let paramSOC = parseFloat(request.query.atr_soc_no_consolidadas);

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
        if (paramIVA) {
            query.atr_iva = paramIVA;
        }
        if (paramIRPF) {
            query.atr_irpf = paramIRPF;
        }
        if (paramSOC) {
            query.atr_soc_no_consolidadas = paramSOC;
        }
        if (paramFields) {
            paramFields = paramFields.split(",");
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

        db.find(query)
            .sort({ autonomic_community: 1 })
            .skip(paramOffset)
            .limit(paramLimit)
            .exec(function(err, docs) {
                if (!docs.length) {
                    response.sendStatus(404);
                } else if (err) {
                    response.sendStatus(500);
                } else {
                    response.send(
                        JSON.stringify(
                            docs.map((c) => {
                                delete c._id;
                                Object.keys(c).forEach((field) => {
                                    if (
                                        paramFields != undefined &&
                                        !paramFields.includes(field)
                                    ) {
                                        delete c[field];
                                    }
                                });
                                return c;
                            }),
                            null,
                            2,
                        ),
                    );
                }
            });
    });

    // GET operation for a certain community
    app.get(
        BASE_API + "/taxes-stats/:name/:year/:quarter",
        (request, response) => {
            let paramName = request.params.name;
            let paramYear = request.params.year;
            let paramQuarter = request.params.quarter;
            db.findOne(
                {
                    autonomic_community: paramName,
                    year: parseInt(paramYear),
                    quarter: paramQuarter,
                },
                function(err, docs) {
                    if (!docs) {
                        response.sendStatus(404);
                    } else {
                        delete docs._id;
                        response.send(JSON.stringify(docs, null, 2));
                    }
                },
            );
        },
    );

    // DELETE operation for all
    app.delete(BASE_API + "/taxes-stats/", (request, response) => {
        db.remove({}, { multi: true }, function(err, numRemoved) {
            response.sendStatus(200);
        });
    });

    // DELETE operation for a certain community
    app.delete(
        BASE_API + "/taxes-stats/:name/:year/:quarter",
        (request, response) => {
            let paramName = request.params.name;
            let paramYear = request.params.year;
            let paramQuarter = request.params.quarter;
            db.remove(
                {
                    autonomic_community: paramName,
                    year: parseInt(paramYear),
                    quarter: paramQuarter,
                },
                function(err, numRemoved) {
                    if (err) {
                        response.sendStatus(500);
                    } else {
                        if (numRemoved === 0) {
                            response.sendStatus(404);
                        } else {
                            response.sendStatus(200);
                        }
                    }
                },
            );
        },
    );

    // POST operation for creating community data (name, year and quarter)
    app.post(BASE_API + "/taxes-stats", (request, response) => {
        let postBody = request.body;
        let allowedFields = [
            "autonomic_community",
            "year",
            "quarter",
            "atr_irpf",
            "atr_soc_no_consolidadas",
            "atr_iva",
        ];
        let invalidFields = Object.keys(postBody).filter(
            (f) => !allowedFields.includes(f)
        );
        let invalidValues = Object.values(postBody).filter(
            (f) => ((f === "") || (f === null) || (f === undefined))
        );
        console.log(invalidValues)

        if (invalidFields.length > 0 || invalidValues.length > 0) {
            response.sendStatus(400);
        }
        else {
            db.find(
                {
                    autonomic_community: postBody.autonomic_community,
                    year: parseInt(postBody.year),
                    quarter: postBody.quarter,
                },
                function(err, docs) {
                    if (docs.length > 0) {
                        response.sendStatus(409);
                    } else {
                        db.insert(postBody);
                        response.sendStatus(201);
                    }
                },
            );
        }
    });

    // POST operation cannot be sent to /taxes-stats/:name/:year/:quarter
    app.post(
        BASE_API + "/taxes-stats/:name/:year/:quarter",
        (request, response) => {
            // método incorrecto
            response.sendStatus(405);
        },
    );

    // PUT operation cannot be sent to /taxes-stats
    app.put(BASE_API + "/taxes-stats", (request, response) => {
        // método incorrecto
        response.sendStatus(405);
    });

    // PUT operation for updating data (name, year, quarter, irpf, iva and societies data)
    app.put(
        BASE_API + "/taxes-stats/:name/:year/:quarter",
        (request, response) => {
            let paramName = request.params.name;
            let paramYear = request.params.year;
            let paramQuarter = request.params.quarter;
            let postBody = request.body;
            let allowedFields = [
                "autonomic_community",
                "year",
                "quarter",
                "atr_irpf",
                "atr_soc_no_consolidadas",
                "atr_iva",
            ];
            let invalidFields = Object.keys(postBody).filter(
                (f) => !allowedFields.includes(f),
            );

            let invalidValues = Object.values(postBody).filter(
                (f) => ((f === "") || (f === null) || (f === undefined) || (f === "null"))
            );
            console.log(typeof Object.values(postBody)[3])
            console.log(invalidValues)

            if (invalidFields.length > 0 || invalidValues.length > 0) {
                response.sendStatus(400);
            } else if (
                !(
                    postBody.autonomic_community === paramName &&
                    parseInt(postBody.year) === parseInt(paramYear) &&
                    postBody.quarter === paramQuarter
                )
            ) {
                response.sendStatus(400);
            } else {
                db.find(
                    {
                        autonomic_community: paramName,
                        year: parseInt(paramYear),
                        quarter: paramQuarter,
                    },
                    function(err, docs) {
                        if (docs.length === 0) {
                            response.sendStatus(404);
                        } else {
                            db.update(
                                { _id: docs[0]._id },
                                {
                                    $set: {
                                        atr_irpf: parseInt(postBody.atr_irpf),
                                        atr_soc_no_consolidadas: parseInt(
                                            postBody.atr_soc_no_consolidadas,
                                        ),
                                        atr_iva: parseInt(postBody.atr_iva),
                                    },
                                },
                                {},
                                function(err) {
                                    if (err) {
                                        response.sendStatus(500);
                                    } else {
                                        response.sendStatus(200);
                                    }
                                },
                            );
                        }
                    },
                );
            }
        },
    );

    app.get(BASE_API + "/taxes-stats/docs", (request, response) => {
        response.redirect(
            "https://documenter.getpostman.com/view/42371471/2sB2cSiPzP",
        );
    });
}

export { loadBackendIBL };
