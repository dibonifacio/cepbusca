import { format } from 'date-fns';
import * as dateFnsTz from 'date-fns-tz'; // Importa todo o módulo de 'date-fns-tz'


function formatZip(zip) {
    // Garantir que o CEP é uma string
    zip = zip.toString();

    // Verificar se o CEP tem 8 dígitos, senão retorna como está
    if (zip.length !== 8) {
        return zip;
    }

    // Inserir o hífen entre o quinto e o sexto dígito
    return zip.slice(0, 5) + '-' + zip.slice(5);
}

function convertCoordToDMS(coord) {
    const direction = coord >= 0 ? "N" : "S"; // Se a latitude for positiva, direção é Norte (N), caso contrário, Sul (S)
    const absoluteLat = Math.abs(coord); // Pega o valor absoluto da latitude para simplificar a conversão
    
    const degrees = Math.floor(absoluteLat); // Parte inteira é o valor dos graus
    const minutesDecimal = (absoluteLat - degrees) * 60; // Multiplica a parte decimal por 60 para obter os minutos
    const minutes = Math.floor(minutesDecimal); // Parte inteira é o valor dos minutos
    const seconds = (minutesDecimal - minutes) * 60; // Multiplica a parte decimal por 60 para obter os segundos

    return `${degrees}° ${minutes}' ${seconds.toFixed(3)}'' ${direction}`;
}

function getCurrentTimeInTimeZone(timeZone) {
    // Obtém a data/hora atual no fuso horário desejado
    const now = new Date();

    // Usa Intl.DateTimeFormat para formatar a data/hora no fuso horário correto
    const formatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone: timeZone,
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return formatter.format(now);
}

function haversineDistance(lat1, lon1, lat2, lon2, unit = 'km') {
    // Converte graus para radianos
    function toRadians(degree) {
        return degree * (Math.PI / 180);
    }

    // Raio da Terra em quilômetros
    const R = 6371;

    // Diferença entre as latitudes e longitudes
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    // Latitudes em radianos
    const radLat1 = toRadians(lat1);
    const radLat2 = toRadians(lat2);

    // Fórmula de Haversine
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(radLat1) * Math.cos(radLat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distância final em quilômetros
    let distance = R * c;

    // Se a unidade for milhas, converte quilômetros para milhas
    if (unit === 'mi') {
        distance *= 0.621371; // 1 km = 0.621371 milhas
    }

    return distance;
}

// Exportação default das funções
export default {
    formatZip,
    convertCoordToDMS,
    getCurrentTimeInTimeZone,
    haversineDistance
};

