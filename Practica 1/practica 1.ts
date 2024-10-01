function torreHanoi(numDiscos: number, torreInicial: string, torreFinal: string, torreAuxiliar: string): number{
    if(numDiscos === 1){
        console.log(`Muevo el disco ${numDiscos} de la ${torreInicial} a la ${torreFinal}`);
    }else{
        torreHanoi(numDiscos - 1, torreInicial, torreAuxiliar, torreFinal);
        console.log(`Muevo el disco ${numDiscos} de la ${torreInicial} a la ${torreFinal}`);
        torreHanoi(numDiscos - 1, torreAuxiliar, torreFinal, torreInicial);
    }

    return numDiscos;
}

torreHanoi(3, "Torre inicial", "Torre final", "Torre auxiliar");