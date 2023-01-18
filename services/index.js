const express = require('express');
const cors = require('cors');
require('./db');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const baseURI = process.env.BASE_URI || '/';

app.use(baseURI, require('./api'));

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
