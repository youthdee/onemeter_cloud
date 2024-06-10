const https = require('https');
const mongoose = require('mongoose');
const oneMeter = require('../oneMeter.js');
const WebSocket = require('ws');

const express = require('express');

var app = require('express')();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var bodyParser = require("body-parser");
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('../routes/authRoutes');
const { verifyJWT } = require('../middleware/authMiddleware.js');

const DeviceId = '50b5f86a-7dff-447e-9d1c-173813817183'; //device ID oneMeteru, pomocí kterého dělám http request
var oneMeterData = new oneMeter();
const connect = mongoose.connect('mongodb+srv://admin:admin@cluster0.zvasdgj.mongodb.net/');

dotenv.config();
const ws = new WebSocket.Server({ port: 3000 });

//options pro získání dat z onemeter cloudu
var options = {
    host: 'cloud.onemeter.com',
    port: 443,
    path: '/api/devices/' + DeviceId,
    headers:
    {
        'Authorization': 'Tyw7SkFPGRGHdoZBW-P-AcSUn-66Oek7LqPqvTSIydHEj8ejGFSN80MVNT7XzDP0StilEOLnSJ6Lb4T_rRh2aQ'

    },
    method: 'GET'
};
//funkce na http request onemeter cloud
const getOneMeterData = async () => {
    return new Promise((resolve, reject) => {
        https.get(options, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    const returnedTarget = Object.assign(oneMeter, jsonData);
                    resolve(returnedTarget);
                } catch (error) {
                    reject(error);
                }
            });
        })
            .on('error', (error) => {
                console.log(error);
                reject(error);
            });
    });
};

//<HTTP věci>

//Set view engine to ejs
app.set("view engine", "ejs");

//Tell Express where we keep our index.ejs
app.set('views', path.join(__dirname, '../views'));
//path.resolve(__dirname, '../.env');

//Use body-parser
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => { res.render('login.ejs') });

app.get('/signup', (req, res) => {
    res.render('signup.ejs');
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.get('/index', (req, res) => {
    res.render('index.ejs');
})
app.get('/refresh', (req, res) => {
    res.render('refresh.ejs');
})


app.get('/onemeter', (req, res) => {
    //TODO počka až se data načtou a pak je vypsat
    // getData();
    res.render("index.ejs", {
        data: oneMeterData,
    });
})


//</HTTP věci>

//připojení klienta přes websocket
ws.on('connection', (ws, req) => {
    /*
    - aby se mohl client připojit, musí poslat na server JWT token a ten musí být správný. DONE
        -> metoda na verifikování JWT už existuje, ale aktuálně nelze naimplementovat, protože se bych musel nejdřív přihlásit přes http, uložit JWT a pak poslat přes websocket.
        ->predelat tuto metodu tak, aby 
        ->login bude vzdy pres http
            ->tim padem ostatni requesty budou pres websocket
    - server bude automaticky posilat klientovi messages z onemeter serveru (jakmile bude mit fresh data, hned je posle) => stejne jako to bylo u mqtt serveru. 
    - komunikace musí být zabezpečená a pouze klienti s platnými JWTs mohou se serverem komunikovat.
    - server bude klientovi refreshovat jeho tokeny automaticky, při každé zprávě.
    - pokud dostane client 401, přeruší se spojení.
    */

    //message handling od klienta (zatím server posílá zprávy pouze když nějakou dostane od klienta)
    ws.on('message', async (message) => { 
        const data = JSON.parse(message);
        const accessToken = data.headers.accessToken;
        const refreshToken = data.headers.refreshToken;

        //ověří, zda JWT access token je platný, a pokud ne, refreshne ho pomocí refresh tokenu. Pokud ani ten není platný, uzavře spojení.
        verifyJWT(ws, accessToken, refreshToken);

        //ověří jestli je JWT token platný, když ne, zavře connection
        //refreshToken_ws(ws, accessToken);
        //server automaticky refreshne klientovi accessToken pouze když mu pošle OneMeter zprávu!
        //zatim to funguje tak, ze server posle klientovi OneMeterData() pokazdy, co mu klient posle zpravu

        //checkuje, jestli mu nepříjde on klienta zpráva že klient chce oneMeterdata.

        //čeká na zprávu typu onemeter-get, aby mohl klientovi poslat onemeter data
        if (data.type === 'onemeter-get') {
            console.log('OneMeter Get Request Zachycen...')
            try {
                const result = await getOneMeterData();
               
                //když je klient furt připojený a data z http requestu něco obsahují, začne je postupně posílat klientovi
                if (result != null && ws.readyState === WebSocket.OPEN) {
                    //console.log(result);


                    //nutnost to posílat po částech, protože JSON je moc velký
                    //klient si oneMeter objekt sám sestaví
                    //zprávy se posílají přesně v pořadí, jako je nadefinovaná třída
                    //jelikož je metoda na get request async, nestane se, že by se neposlalo to, co se dostalo z http reqestu.

                    //OneMeter Properties
                    ws.send(JSON.stringify({ type: 'onemeter', data: { _id: result._id } })); 
                    ws.send(JSON.stringify({ type: 'onemeter', data: { SN: result.SN } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { MAC: result.MAC } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { type: result.type } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { disabled: result.disabled } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { negativeEnergyExists: result.negativeEnergyExists } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { own: result.own } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { public: result['public'] } }));

                    //OneMeter Classes
                    ws.send(JSON.stringify({ type: 'onemeter', data: { info: result.info } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { meteringPoint: result.meteringPoint } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { config: result.config } }));

                    //readings
                    ws.send(JSON.stringify({ type: 'onemeter', data: { firstReading: result.firstReading } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { lastReading: result.lastReading } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { initialReading: result.initialReading } }));

                    //other
                    ws.send(JSON.stringify({ type: 'onemeter', data: { timezone: result.timezone } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { hardware: result.hardware } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { branding: result.branding } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { usage: result.usage } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { production: result.production } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { meta: result.meta } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { metadata: result.metadata } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { users: result.users } }));
                    ws.send(JSON.stringify({ type: 'onemeter', data: { owner: result.owner } }));

                    //pak zašle server zprávu, že už věe poslal. (bude to fungovat i bez ní, udělal jsem to jen kvůli tomu, abych věděl, kdy posílání dat skončí a já si to můžu na klientovi debugnout do konzole)
                    ws.send(JSON.stringify({ type: 'onemeterend' }));

                }
                //když se stane chyba v posílání onemeter dat klientovi
            } catch (error) {
                // Handle errors
                console.error(error);
                ws.send(JSON.stringify({error})); //1002 nebo 1003
                //TODO vrátit klientovi chybu
            }
        }

        console.log(data);

    });


});
//chyba ve spojení
ws.on('error', (error) => {
    console.log('coonection error: ', error);
});
//po uzavření spojení
ws.on('close', (error) => {
    console.log('connection closed: ', error);
});

app.use(authRoutes); //endpointy http

app.listen(8080, () => { console.log("Server online on http://localhost:8080"); });
