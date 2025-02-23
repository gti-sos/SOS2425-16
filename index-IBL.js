const taxesData = [
    { autonomic_community: "Andalucía", year: 2021, ine_irpf: 3916659, ine_soc_no_consolidadas: 2826482, ine_iva: 24136288 },
    { autonomic_community: "Aragón", year: 2021, ine_irpf: 73006, ine_soc_no_consolidadas: 937242, ine_iva: 9372455 },
    { autonomic_community: "Asturias, Principado de", year: 2021, ine_irpf: 53477, ine_soc_no_consolidadas: 419513, ine_iva: 5104967 },
    { autonomic_community: "Balears,Illes", year: 2021, ine_irpf: 571182, ine_soc_no_consolidadas: 838753, ine_iva: 4119440 },
    { autonomic_community: "Cantabria", year: 2021, ine_irpf: 30049, ine_soc_no_consolidadas: 356759, ine_iva: 3382981 },
    { autonomic_community: "Castilla y León", year: 2021, ine_irpf: 1285544, ine_soc_no_consolidadas: 1001814, ine_iva: 10195560 },
    { autonomic_community: "Castilla - La Mancha", year: 2021, ine_irpf: 988287, ine_soc_no_consolidadas: 699208, ine_iva: 7078642 },
    { autonomic_community: "Cataluña", year: 2021, ine_irpf: 3880364, ine_soc_no_consolidadas: 6975928, ine_iva: 64849291 },
    { autonomic_community: "Comunitat Valenciana", year: 2021, ine_irpf: 2467168, ine_soc_no_consolidadas: 2833549, ine_iva: 26538375 },
    { autonomic_community: "Extremadura", year: 2021, ine_irpf: 509167, ine_soc_no_consolidadas: 259255, ine_iva: 2844182 },
    { autonomic_community: "Galicia", year: 2021, ine_irpf: 1378027, ine_soc_no_consolidadas: 1647520, ine_iva: 15803448 },
    { autonomic_community: "Madrid, Comunidad de", year: 2021, ine_irpf: 3572326, ine_soc_no_consolidadas: 15509272, ine_iva: 123096234 },
    { autonomic_community: "Murcia, Región de", year: 2021, ine_irpf: 694035, ine_soc_no_consolidadas: 749846, ine_iva: 7277119 },
    { autonomic_community: "Rioja, La", year: 2021, ine_irpf: 175378, ine_soc_no_consolidadas: 213559, ine_iva: 1523642 },
    { autonomic_community: "Andalucía", year: 2020, ine_irpf: 3797932, ine_soc_no_consolidadas: 2045255, ine_iva: 19655675 },
    { autonomic_community: "Aragón", year: 2020, ine_irpf: 725392, ine_soc_no_consolidadas: 823261, ine_iva: 8257375 },
    { autonomic_community: "Asturias, Principado de", year: 2020, ine_irpf: 525355, ine_soc_no_consolidadas: 287938, ine_iva: 3548610 },
    { autonomic_community: "Cantabria", year: 2020, ine_irpf: 294038, ine_soc_no_consolidadas: 172383, ine_iva: 2829442 },
    { autonomic_community: "Castilla y León", year: 2020, ine_irpf: 1278006, ine_soc_no_consolidadas: 760391, ine_iva: 8880282 },
    { autonomic_community: "Castilla - La Mancha", year: 2020, ine_irpf: 965897, ine_soc_no_consolidadas: 585027, ine_iva: 5786846 },
    { autonomic_community: "Cataluña", year: 2020, ine_irpf: 3839962, ine_soc_no_consolidadas: 6136336, ine_iva: 56706888 },
    { autonomic_community: "Comunitat Valenciana", year: 2020, ine_irpf: 2409920, ine_soc_no_consolidadas: 2251326, ine_iva: 22543255 },
    { autonomic_community: "Extremadura", year: 2020, ine_irpf: 497511, ine_soc_no_consolidadas: 225552, ine_iva: 2311629 },
    { autonomic_community: "Galicia", year: 2020, ine_irpf: 1358533, ine_soc_no_consolidadas: 1138038, ine_iva: 13110283 },
    { autonomic_community: "Balears,Illes", year: 2020, ine_irpf: 555447, ine_soc_no_consolidadas: 464026, ine_iva: 3534163 },
    { autonomic_community: "Madrid, Comunidad de", year: 2020, ine_irpf: 3522254, ine_soc_no_consolidadas: 12702500, ine_iva: 93863668 },
    { autonomic_community: "Murcia, Región de", year: 2020, ine_irpf: 672009, ine_soc_no_consolidadas: 649349, ine_iva: 93863668 },
    { autonomic_community: "Rioja, La", year: 2020, ine_irpf: 173428, ine_soc_no_consolidadas: 152021, ine_iva: 1353261 },
    { autonomic_community: "Madrid, Comunidad de", year: 2019, ine_irpf: 2323123, ine_soc_no_consolidadas: 9312321, ine_iva: 80221221 } 
];

//Parametros en reduce:  .reduce(acc, currentValue, currentIndex, array)

let averageRateIVAMadrid = 
    taxesData
    .filter((v) => {return (v.autonomic_community === "Madrid, Comunidad de")})
    .map((v) => {return v.ine_iva})
    .reduce((acc, rate, _, arr) => {
        return acc + (rate / arr.length);
    }, 0);

console.log(`Promedio de la tasa de IVA en Madrid: ${averageRateIVAMadrid}`)
