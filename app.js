// app.js

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const app = express();
const port = 3040;

app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const dbConfig = {
    host: '192.168.1.225',
    user: 'andrei',
    password: 'andrei1234',
    database: 'M16_andrei'
};

async function getUserByUsername(username) {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM usuari WHERE nombre_usuario = ?', [username]);
        await connection.end();
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error al obtener usuario de la base de datos:', error);
        return null;
    }
}


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/registre', (req, res) => {
 res.render('registre');
});


app.get('/cicles', (req, res) => {
    res.render('cicles');
});

app.get('/opcions', (req, res) => {
        res.render('opcions');
});


app.get('/activitats', (req, res) => {
    res.render('activitats');
});


app.get('/activitat1', (req, res) => {
    res.render('activitats1');
});

app.get('/prova_carie', (req, res) => {
    res.render('prova_carie');
});

app.get('/prova_carie2', (req, res) => {
    res.render('prova_carie2');
});

app.get('/prova_carie3', (req, res) => {
    res.render('prova_carie3');
});

app.get('/prova_carie4', (req, res) => {
    res.render('prova_carie4');
});

app.get('/prova_carie5', (req, res) => {
    res.render('prova_carie5');
});

app.get('/prova_carie6', (req, res) => {
    res.render('prova_carie6');
});

app.get('/cronologia1', (req, res) => {
    res.render('cronologia1');
});
app.get('/cronologia2', (req, res) => {
    res.render('cronologia2');
});
app.get('/cronologia3', (req, res) => {
    res.render('cronologia3');
});
app.get('/cronologia4', (req, res) => {
    res.render('cronologia4');
});
app.get('/cronologia5', (req, res) => {
    res.render('cronologia5');
});
app.get('/cronologia6', (req, res) => {
    res.render('cronologia6');
});








app.post('/registro', async (req, res) => {
    const { nombre_usuario, contrasenya } = req.body;

    const existingUser = await getUserByUsername(nombre_usuario);
    if (existingUser) {
        res.status(400).json({ success: false, message: 'El usuario ya existe' });
        return;
    }

    const hashedPassword = await bcrypt.hash(contrasenya, 10);

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO usuari (nombre_usuario, contrasenya) VALUES (?, ?)', [nombre_usuario, hashedPassword]);
        await connection.end();
        res.json({ success: true, message: 'Registro exitoso' });
    } catch (error) {
        console.error('Error al registrar el usuario en la base de datos:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});


app.post('/login', async (req, res) => {
    const { nombre_usuario, contrasenya } = req.body;
    const user = await getUserByUsername(nombre_usuario);

    if (user) {
        const match = await bcrypt.compare(contrasenya, user.contrasenya);

        if (match) {
            res.json({ success: true, message: 'Inicio de sesión exitoso' });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
});


app.listen(port, () => {
    console.log(`La aplicación web está escuchando en el puerto ${port}`);
});
