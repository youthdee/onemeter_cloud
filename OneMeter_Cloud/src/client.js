var request = require('request');
const WebSocket = require('ws');
const OneMeter = require('../oneMeter.js');

let client;
var refreshToken = ' ';
var accessToken = ' ';
const oneMeterInstance = new OneMeter();

//HTTP Login
const Login = function (options) {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (response) {
                return resolve(response);
            }
            if (error) {
                console.log(error);
                return reject(error);
            }
        });
    });
};
const postLogin = async () => {
    const options = {
        url: 'http://localhost:8080/login',
        method: 'post',
        headers: {
        },
        json: {
            email: 'abc@abc.com',
            password: 'abcabcabc'
        }
    };
    let response = await Login(options);
    refreshToken = response.headers['jwt-refresh'];
    accessToken = response.headers['jwt'];
    console.log('[Login] úspěšné přihlášení')
    console.log('[Login] user._id:', response.body.user); // vrací user._id
    //console.log('[Login] prirazeni refreshTokenu: ', refreshToken);
    console.log('[Login] jwt access token:', response.headers['jwt']);
    console.log('[Login] jwt refresh token:', response.headers['jwt-refresh']);

};

//HTTP Refresh
const Refresh = function (options) {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (response) {
                return resolve(response);
            }
            if (error) {
                console.log(error);
                return reject(error);
            }
        });
    });
};
const getNewAccessToken = async () => {
    const options = {
        url: 'http://localhost:8080/refresh',
        method: 'post',
        headers: {
            'jwt-refresh': refreshToken
        },
    };
    console.log('[Refresh] refresh token variable gained from Login:', refreshToken);
    let response = await Refresh(options);

    if (response.statusCode === 200) {
        accessToken = response.headers['jwt']
        console.log('[Refresh] new jwt access token:', response.headers['jwt']);

        console.log('[Refresh] Refresh Tokenu Proběhl úspěšně, spouštím OneMeter_Get()')
        console.log(response.statusCode);
        return response.statusCode;
        //await OneMeter_Get(); v Mainu
    }
    else {
        console.log('[REFRESH] Refresh Token Expired, Please Login');
        return response.statusCode;
    }

};

//HTTP Get OneMeter Data
const oneMeter = function (options) {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {

            if (response) {
                return resolve(response);
            }
            if (error) {
                console.log(error);
                return reject(error);
            }
        });
    });
};
const OneMeter_Get = async () => {
    const options = {
        url: 'http://localhost:8080/onemeter',
        method: 'get',
        headers: {
            'jwt': accessToken
        },
    };
    console.log('[OneMeter_Get] Current Access Token: ', accessToken);
    let response = await oneMeter(options);
    console.log('[OneMeter_Get] Initial request Status Code: ', response.statusCode)

    if (response.statusCode === 200) {
        console.log('[OneMeter_Get] Access Token Sucess')
        return response.statusCode;
    } else {
        console.log('[OneMeter_Get] Access Token Failure')
        return response.statusCode;
    }
}

    /* DONE
    1. zkusí se dostat na protected routes s JWT 
    ->dostane = TODO uložit refresh token a access token do souboru a pak se zkusit přihlásit
    ->nedostane -> login
    2.posílá GET requesty na protected routes do té doby, než mu vyprší accessToken.
    ->pomocí refreshTokenu si zažádá POST request na /refresh -> získá nový access token
    ->s novým access tokenem dále zkouší GET requesty na protected routes.
    ->až mu vyprší access token, skočí na bod 2.

    *až mu vyprší refreshToken, musí se znovu přihlásit pomocí metody postLogin().
    */

    /*
    -klient se prihlasi pres http login a ziska access a refresh tokeny
    -posle na server request to connect (oba dva tokeny)
    -klient bude poslouchat zpravy od serveru (vyhradne OneMeter, refresh tokenu, expirace tokenu)
        ->kdyz vyprsi refresh token, a server ho uz neaktualizuje, server klienta odpoji  
    */

//Připojení přes websocket
function connect() {

    client = new WebSocket('ws://localhost:3000');

    //Otevření připojení
    client.on('open', async () => {
        await postLogin(); //přihlásí se přes http, získa JWT tokeny.
        console.log('connected');
        client.send(JSON.stringify({
            headers:
            {
                accessToken: accessToken,
                refreshToken: refreshToken
            },
            type: 'initial'
        })); //pošle JWTs z loginu.


        //aktualizuje si OneMeter Data, zatím každých 10 sekund
        setInterval(() => {
            const message = {
                type: 'onemeter-get',
                headers: {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                },
                message: {
                    //timestamp: new Date().toISOString(),
                }
            };
            client.send(JSON.stringify(message));
            // console.log('Client sent:', message);
        }, 10000);
    });

    //Client Message Handling
    client.on('message', async (data) => {
        try {
            const response = JSON.parse(data);
            console.log(response);
            
            //když příjde zprává typu info
            if (response.type === 'info') { 
                console.log('Mám chycenej typ zprávy');
            }
            //když příjde zpráva typu jwt-refresh (server pošle refreshovanej access token)
            if (response.type === 'jwt-refresh') {
                accessToken = response.headers.accessToken;
                console.log('Mám chycenej typ zprávy');
            }
            //když příjde zpráva typu onemeter - server posíla onemeter data
            //posílá je postupně, po objektech, protože přes websocket nelze poslat tak velkou zprávu
            //klient si je pak sám sestaví 
            if (response.type === 'onemeter')
                {
                    Object.assign(oneMeterInstance, response.data);
                    //postupně je přiřazuje do onemeter instance
                }
            //když příjde zpráva typu onemeterend, vypíšu si, jestli přiřazení proběhlo v pořádku
            if (response.type === 'onemeterend')
                {
                    console.log(oneMeterInstance);
                }

            //když se stane chyba v parsování zprávy od serveru
        } catch (error) {
            console.error('[Server] Error parsing JSON response: ', error);
        }
    })
    //když se stane chyba v konektivitě
    client.on('error', (error) => {
        console.log('coonection error: ', error);
    });
    //když se zavře spojení
    client.on('close', (error) => {
        console.log('WebSocket connection closed:', error);
        //když se jedná o chybu 1008 (policy violation) klient se zkusí znova přihlásit a připojit
        if (error === 1008) {
            try {
                console.log('TRYING TO RECONNECT...')
                reconnect();
            } catch (error) {
                //když se nejde přihlásit, klient se už nepokouší připojit k serveru
                console.log('LOGIN ERROR: ', error);
            }
        }
    })
}
//funkce k opětovnému připojení
async function reconnect() {
    try {
        // zkusí se přihlásit
        await postLogin();
        console.log('LOGIN SUCCESSFUL')
        // po přihlášení pouští hlavní connect funkci
        //kdyby se mu neělo přihlásit, tak mu to hodí chyby, které jsou napsané v login http (nahoře)
        connect();
    } catch (error) {
        //když se nepřihlásí
        console.log('LOGIN ERROR: ', error);
    }
}
//hlavní metoda
connect();
/*
- ? nechat routes pro autentizaci přes http klienta ?
- get onemeter data bude přes websocket.
- checkovat platné JWTs na serveru, pokud vyprší, ukončit konektivitu.
- a potom z klienta pustit http requesty na refresh, nebo login (pokud vypší refresh token)
*/
