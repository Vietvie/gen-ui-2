const express = require('express');
const cors = require('cors');
const mainRouter = require('./routes/mainRouter');
const replicateRouter = require('./routes/replicateRouter');

const app = express();
const port = 3232;

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use('/assets', express.static('resources'));
app.use('/', mainRouter);
app.use('/replicate', replicateRouter);

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});
