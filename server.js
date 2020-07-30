const express = require('express');
const app = express();
const cors = require('cors');

//Database connection
const mongoConnect = require('./database/db');
mongoConnect();

// Middlewares
app.use(cors());
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

app.use('/', require('./routes/url'));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
