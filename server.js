const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/ArogyaAI', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    User.create({ username, password })
    .then(newUser => {
        res.redirect('/login.html'); 
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error signing in');
    });

});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username, password })
        .then(user => {
            if (!user) {
                res.status(404).send('User not found');
            } else {
                res.redirect('/'); 
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error logging in');
        });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

