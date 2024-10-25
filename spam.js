const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para recibir los parámetros
app.post('/startTest', (req, res) => {
    const { url, port, time, rps, threads } = req.body;

    if (!url || !port || !time || !rps || !threads) {
        return res.status(400).send('Todos los parámetros son necesarios');
    }

    const endTime = Date.now() + time * 1000; // Convertir tiempo a milisegundos

    // Función para enviar solicitudes
    const sendRequest = async () => {
        if (Date.now() > endTime) return;

        try {
            const response = await axios.get(`${url}:${port}`);
            console.log(`Respuesta recibida: ${response.status}`);
        } catch (error) {
            console.error(`Error en la solicitud: ${error.message}`);
        }
    };

    // Iniciar múltiples hilos para enviar solicitudes HTTP
    for (let i = 0; i < threads; i++) {
        setInterval(sendRequest, 1000 / rps);
    }

    res.send('Prueba iniciada');
});

// Ruta para detener la prueba
app.post('/stopTest', (req, res) => {
    // Aquí podrías implementar la lógica para detener la prueba
    res.send('Prueba detenida');
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
