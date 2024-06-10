const jwt = require('jsonwebtoken');
const { createToken } = require('../controllers/authController.js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
path.resolve(__dirname, '../src/.env');

//HTTP metoda na verifikaci JWT
const requireAuth = (req, res, next) => { 
    const token = req.headers['jwt'];
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decodedToken) => {
            if (error) {
                console.log('vyprsel token');
                return res.status(403).send('Access Denied. Token Expired.');
                //res.redirect('/login');
            }
            else {
                console.log('Token Authentification Sucessful', decodedToken);
                next();
            }
        });
    } else {
        return res.status(401).send('Access Denied. No token provided.');
    }
}

//WEBSOCKET metoda pro verifikaci, refreshuje access tokeny pokud vypší.
const verifyJWT = async (ws, accessToken, refreshToken) => { //WS
    console.log(accessToken);
    console.log(refreshToken);
    if (accessToken) {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decodedToken) => {
            if (error) {
                console.log('vyprsel token');
                ws.send(JSON.stringify({ type: 'verifyJWT_error', message: 'Access Denied. Token Expired.', errorcode: '4001' }));
                //vypršel token, proběhne pokus o refresh
                refreshToken_ws(ws, refreshToken);
            }
            else {
                //verifikace proběhla úspěšně
                console.log('Token Authentification Sucessful', decodedToken);
                ws.send(JSON.stringify({ type: 'info', message: 'JWT Token Verification was successful.' }));
            }
        });
    } else {
        //access token je neplatný (tzn. není starý, je neplatný) a tím pádem se spojení uzavře
        ws.send(JSON.stringify({ type: 'verifyJWT_error', message: 'Access Denied. No token provided.' }));
        ws.close(1008, 'Acess Token Is Not Valid'); //1008 policy violation, zavre connection
        
    }
}

//maxAge konstanty naimportované
const accessTokenMaxAge = process.env.ACCESS_TOKEN_MAX_AGE;
const refreshTokenMaxAge = process.env.REFRESH_TOKEN_MAX_AGE;

//WEBSOCKET metoda pro refresh access tokenu
const refreshToken_ws = (ws, refreshToken) => {
    if (!refreshToken) {
        //refresh token je null
        ws.send(JSON.stringify({ type: 'refreshToken_ws_error', message: 'Access denied. No refresh token provided.' }));
        return;
    }
    try {  
        const decoded = jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET); //dekoduje danný refreshtoken, získá user._id
        const accessToken = createToken(decoded._id, accessTokenMaxAge);//pomocí user_id a secretu vytvoří nový access token

        ws.send(JSON.stringify({ type: 'info', message: 'Access Token Refreshed' })); //info klientovi že JWT access token byl refreshován
        ws.send(JSON.stringify({ type: 'jwt-refresh', headers: { accessToken: accessToken } })); //pošle nový access token klientovi, ten si ho pak uloží a vkládá do nových zpráv

    } catch (error) {
        ws.send(JSON.stringify({ type: 'refreshToken_ws_error', message: 'Access denied. Refresh Token Is Not Valid.', errorcode: '1008' }));
        ws.close(1008, 'Acess Token Is Not Valid'); //1008 policy violation, zavre connection
    }
}

module.exports = {
    requireAuth,
    verifyJWT,
    refreshToken_ws
};