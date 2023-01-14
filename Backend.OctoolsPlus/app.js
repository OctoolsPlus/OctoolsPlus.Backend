const express = require('express');
const app = express();
var cors = require('cors')

app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const usersController = require('./controllers/video');

app.post('/details-video/', usersController.getDetailsVideo);
app.get('/download-video/', usersController.downloadVideo);
app.listen(3000, () => {
    console.log('API listening on port 3000');
});