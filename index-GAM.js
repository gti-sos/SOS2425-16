const array_data = [
    { autonomic_community: "Andalucía", year: 2021, between_20_24_yo: 3666, between_25_29_yo: 5409, between_30_34_yo: 5996 },
    { autonomic_community: "Andalucía", year: 2020, between_20_24_yo: 2156, between_25_29_yo: 3201, between_30_34_yo: 3690 },
    { autonomic_community: "Asturias", year: 2021, between_20_24_yo: 304, between_25_29_yo: 510, between_30_34_yo: 483 },
    { autonomic_community: "Islas Baleares", year: 2021, between_20_24_yo: 6320, between_25_29_yo: 1023, between_30_34_yo: 1239 },
    { autonomic_community: "Canarias", year: 2021, between_20_24_yo: 947, between_25_29_yo: 1625, between_30_34_yo: 1643 },
    { autonomic_community: "Madrid", year: 2021, between_20_24_yo: 6028, between_25_29_yo: 10836, between_30_34_yo: 10004 },
    { autonomic_community: "Castilla Y León", year: 2021, between_20_24_yo: 766, between_25_29_yo: 1171, between_30_34_yo: 1210 },
    { autonomic_community: "Castilla - La Mancha", year: 2021, between_20_24_yo: 984, between_25_29_yo: 1304, between_30_34_yo: 1512 },
    { autonomic_community: "Cataluña", year: 2021, between_20_24_yo: 7305, between_25_29_yo: 12960, between_30_34_yo: 13077 },
    { autonomic_community: "Cataluña", year: 2020, between_20_24_yo: 4469, between_25_29_yo: 8086, between_30_34_yo: 7808 },
    { autonomic_community: "Cataluña", year: 2019, between_20_24_yo: 6397, between_25_29_yo: 12400, between_30_34_yo: 12023 }
];

let array_between_30_34_yo_cat= array_data.slice(-3).map(obj=>
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

console.log(average());

autonomic_community	year	quarter	between_20_24_yo	between_25_29_yo	between_30_34_yo
Andalucía	2021	Q1	3666	5409	5996
Andalucía	2020	Q2	2156	3201	3690
Asturias	2021	Q3	304	510	483
Islas Baleares	2021	Q1	6320	1023	1239
Canarias	2021	Q2	947	1625	1643
Madrid	2021	Q3	6028	10836	10004
Castilla Y León	2021	Q1	766	1171	1210
Castilla - La Mancha	2021	Q2	984	1304	1512
Cataluña	2021	Q3	7305	12960	13077
Cataluña	2020	Q1	4469	8086	7808
Cataluña	2019	Q1	6397	12400	12023


const array_data = [
    { autonomic_community: "Andalucía", year: 2021, quarter: Q1, between_20_24_yo: 3666, between_25_29_yo: 5409, between_30_34_yo: 5996 },
    { autonomic_community: "Andalucía", year: 2020, quarter: Q1, between_20_24_yo: 2156, between_25_29_yo: 3201, between_30_34_yo: 3690 },
    { autonomic_community: "Asturias", year: 2021, quarter: Q3, between_20_24_yo: 304, between_25_29_yo: 510, between_30_34_yo: 483 },
    { autonomic_community: "Islas Baleares", year: 2021, quarter: Q1, between_20_24_yo: 6320, between_25_29_yo: 1023, between_30_34_yo: 1239 },
    { autonomic_community: "Canarias", year: 2021, quarter: Q2, between_20_24_yo: 947, between_25_29_yo: 1625, between_30_34_yo: 1643 },
    { autonomic_community: "Madrid", year: 2021, quarter: Q3, between_20_24_yo: 6028, between_25_29_yo: 10836, between_30_34_yo: 10004 },
    { autonomic_community: "Castilla Y León", year: 2021, quarter: Q1, between_20_24_yo: 766, between_25_29_yo: 1171, between_30_34_yo: 1210 },
    { autonomic_community: "Castilla - La Mancha", year: 2021, quarter: Q2, between_20_24_yo: 984, between_25_29_yo: 1304, between_30_34_yo: 1512 },
    { autonomic_community: "Cataluña", year: 2021, quarter: Q3, between_20_24_yo: 7305, between_25_29_yo: 12960, between_30_34_yo: 13077 },
    { autonomic_community: "Cataluña", year: 2020, quarter: Q1, between_20_24_yo: 4469, between_25_29_yo: 8086, between_30_34_yo: 7808 },
    { autonomic_community: "Cataluña", year: 2019, quarter: Q1, between_20_24_yo: 6397, between_25_29_yo: 12400, between_30_34_yo: 12023 }
];
