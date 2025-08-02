// backend/server.js

// Importamos las librerías que instalamos.
const express = require('express');
const cors = require('cors');
const Excel = require('exceljs');
const path = require('path');
const fs = require('fs'); // Este módulo nos permite verificar si un archivo existe.

// Creamos una instancia de nuestra aplicación de servidor.
const app = express();

// Definimos el puerto en el que correrá el servidor.
const PORT = process.env.PORT || 5000;

// Definimos la ruta donde se guardará nuestro archivo de Excel.
const excelFilePath = path.join(__dirname, 'data.xlsx');

// Configuramos los "middlewares" (programas intermedios).
// `express.json()` le dice a nuestro servidor que acepte datos en formato JSON.
app.use(express.json());
// `cors()` es crucial para permitir que nuestro frontend (en el puerto 3000)
// pueda hablar con nuestro backend (en el puerto 5000).
app.use(cors());

// Esta es una función que se encarga de crear el archivo de Excel si no existe,
// y de asegurarse de que tenga las columnas correctas.
const initializeExcel = async (workbook) => {
    // Comprobamos si el archivo `data.xlsx` ya existe en la carpeta.
    if (!fs.existsSync(excelFilePath)) {
        console.log('El archivo data.xlsx no existe. Creando uno nuevo...');
        
        // Creamos una nueva hoja de trabajo en el libro de Excel.
        const worksheet = workbook.addWorksheet('Formulario de Usuarios');
        
        // Definimos las columnas que tendrá nuestra tabla de Excel.
        worksheet.columns = [
            { header: 'First Name', key: 'firstName', width: 20 },
            { header: 'Last Name', key: 'lastName', width: 20 },
            { header: 'Favorite Sport', key: 'favoriteSport', width: 20 },
            { header: 'Gender', key: 'gender', width: 15 },
            { header: 'State Resident', key: 'stateResident', width: 20 },
            { header: '21 or Older', key: 'is21orOlder', width: 15 },
            { header: 'Car Models Owned', key: 'carModels', width: 40 }
        ];
        
        // Guardamos el nuevo archivo de Excel en el disco.
        await workbook.xlsx.writeFile(excelFilePath);
        console.log('Archivo data.xlsx creado con éxito.');
    } else {
        console.log('El archivo data.xlsx ya existe. Leyendo el archivo...');
        // Si el archivo ya existe, simplemente lo leemos para poder agregarle más filas.
        await workbook.xlsx.readFile(excelFilePath);
    }
};

// Esta es la "ruta" o "dirección" a la que el frontend enviará los datos.
// Es una ruta de tipo POST, ya que estamos enviando nueva información.
app.post('/api/save-data', async (req, res) => {
    // Los datos del formulario llegan aquí dentro de `req.body`.
    const data = req.body;
    console.log('Datos recibidos del formulario:', data);

    try {
        const workbook = new Excel.Workbook();

        // Llamamos a nuestra función para asegurarnos de que el archivo de Excel esté listo.
        await initializeExcel(workbook);

        // Obtenemos la primera hoja de trabajo del libro.
        const worksheet = workbook.getWorksheet(1);
        
        // Formateamos los datos de los autos para que se vean bien en una celda de Excel.
        const carModelsString = Object.keys(data.carModels)
            .filter(key => data.carModels[key]) // Filtramos solo los autos seleccionados
            .join(', '); // Unimos los nombres con una coma

        // Agregamos una nueva fila a la hoja de Excel con los datos del formulario.
        worksheet.addRow([
            data.firstName,
            data.lastName,
            data.favoriteSport,
            data.gender,
            data.stateResident,
            data.is21orOlder ? 'Yes' : 'No', // Convertimos el booleano a un texto legible
            carModelsString
        ]);

        // Guardamos los cambios en el archivo de Excel.
        await workbook.xlsx.writeFile(excelFilePath);

        // Enviamos una respuesta de éxito al frontend para que sepa que todo salió bien.
        res.status(200).json({ message: 'Datos guardados correctamente.' });

    } catch (error) {
        // Si algo sale mal, enviamos un mensaje de error.
        console.error('Error al guardar los datos:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// Este es el último paso: hacer que el servidor se "escuche" en el puerto 5000.
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});