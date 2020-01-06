const express = require('express');
const graphqlHttp = require('express-graphql');
const schema = require('./graphql/graphqlschema');
const path = require('path');
var cors = require('cors');
const request = require('request');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var mailer = require("nodemailer");
const app = express();

app.use(express.static(path.join(__dirname, 'frontend')));
app.use(cors());
app.use(bodyParser.json());
request.post = Promise.promisify(request.post);

app.use(
    '/graphql',
    graphqlHttp({
        schema,
        graphiql: true
    })
);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});


app.post('/api/SendMail', function (req, res) {
    // console.log("request: send mail ", req.body);
    let dataPr = req.body;

    var smtpTransport = mailer.createTransport({
        host: 'mail.unicarm.ro',
        port: 465,
        secure: true,  //true for 465 port, false for other ports
        auth: {
            user: 'comenzi.birotica@unicarm.ro',
            pass: 'Aprilie2015'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mail = {
        from: "Comenzi Birotica <comenzi.birotica@unicarm.ro>",
        to: dataPr.emailToAddress,
        subject: dataPr.emailSubject,
        text: dataPr.emailMsg,
        html: dataPr.emailMsg
    }

    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            res.send(JSON.stringify(error));
            console.log(error);
        } else {
            res.send(JSON.stringify("Message sent: " + response.message));
            // console.log("Message sent: " + response.message);
        }
        smtpTransport.close();
    });
});

const port = 3001;
app.listen(port, () => {
    console.log("listening to port: ", port);
});