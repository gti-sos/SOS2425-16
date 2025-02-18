let array_between_30_34_yo_cat=[13077,7808,12023];

function promedio(lista){
    let sum=0;
    if(lista.length===0){
        return 0;
    }
    lista.forEach(n =>{
        sum+= n;
    });

    return sum/lista.length;
}

console.log(promedio(array_between_30_34_yo_cat))
