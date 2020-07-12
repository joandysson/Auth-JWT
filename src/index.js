const express = require('express');
const routes  = require('./routes');
const cors    = require('cors');
require('dotenv').config();

const { PORT, HOST } = process.env;

const app = express();

// Add URL of resquest and response in cors

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`${HOST}:${PORT}`);
});