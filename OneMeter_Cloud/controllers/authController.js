const User = require('../modules/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
path.resolve(__dirname, '../src/.env');

//funkce k ošetření chyb v HTTP
const handleErrors = (err) => {
    console.log(err.message, err.code);

    let errors = { email: '', password: '' };

    //incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'that email is not registered';
    }

    if (err.message === 'incorrect password') {
        errors.password = 'that password is incorrect';
    }
    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

//max age konstanty, importovanéé
const accessTokenMaxAge = process.env.ACCESS_TOKEN_MAX_AGE;
const refreshTokenMaxAge = process.env.REFRESH_TOKEN_MAX_AGE;

//vytvoří token
const createToken = (id, tokenAge) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: tokenAge
    });
}

//export pro použití jinde
module.exports = {
    createToken
};

//http login, běží na mongodb
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        const accesToken = createToken(user._id, accessTokenMaxAge);
        const refreshToken = createToken(user._id, refreshTokenMaxAge);

        //pošle http headers zpátky, a klient si to zpracuje pro další použití - k připojení k serveru přes websocket
        res.setHeader('jwt', accesToken);
        res.setHeader('jwt-refresh', refreshToken);

        res.status(200).json({ user: user._id, accesToken: accesToken, refreshToken: refreshToken });
    } catch (err) {
        res.status(400).json({});
    }

};

//http věci k nepoužití
module.exports.signup_get = (req, res) => {
    res.render('signup');
};
module.exports.login_get = (req, res) => {
    res.render('login');
};
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });

        const accesToken = createToken(user._id, accessTokenMaxAge);
        const refreshToken = createToken(user._id, refreshTokenMaxAge);

        res.setHeader('jwt', accesToken);
        res.setHeader('jwt-refresh', refreshToken);

        res.status(201).json({ user: user._id, accesToken: accesToken, refreshToken: refreshToken }); //201 = success
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};
module.exports.logout_get = (req, res) => { // Logout? 
    res.cookie('jwt', ''), { maxAge: 1 };
    res.cookie('jwt-refresh', ''), { maxAge: 1 };
    res.redirect('/index');
}

module.exports.refresh_get = (req, res) => {
    res.render('refresh');
}

module.exports.refresh_post = (req, res) => {
    const refreshToken = req.headers['jwt-refresh'];
    console.log('refreshToken:', refreshToken);
    if (!refreshToken) {
        return res.status(401).send('Access denied. No refresh token provided');
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET);

        console.log('vyprsel refresh token');
        console.log('decoded:', decoded._id);
        const accessToken = createToken(decoded._id, accessTokenMaxAge);
        console.log('New accessToken:', accessToken);
        res.setHeader('jwt', accessToken);
        res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });

    } catch (error) {
        return res.status(403).send('Access Denied. Token Expired.');
    }
}

