const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Add model
require('dotenv').config();

const { JWT_TOKEN } = process.env;

let refreshTokens = [];

module.exports = {
    authentication(request, response){
        return response.json({
            info: 'created..',
            data: request.data
        });
    },
    login(request, response) {
        const { email, password } = request.body;

        const user = User.find(email, password);
        if (!user) return response.status(404).send('user not found');

        const token = generateAccessToken(user);

        // This data in refreshTokens will be stored in database
        refreshTokens.push(token);

        return response.json({user, token});
    },
    verifyToken(request, response, next){
        const bearerHeader = getToken(request);

        if(typeof bearerHeader === 'undefined') return response.sendStatus(403);

        const bearerToken = bearerHeader.split(' ')[1];

        jwt.verify(bearerToken, JWT_TOKEN, (err, data) => {
            if(err) return response.sendStatus(403);

            request.data = data;
        });

        next();
    },
    refreshToken(request, response) {

        const authorization = getToken(request);
        if(typeof authorization ===  'undefined') return response.sendStatus(401);

        const token = authorization.split(' ')[1];

        if(!refreshTokens.includes(token)) return response.sendStatus(403);

        jwt.verify(token, JWT_TOKEN, (err, data) => {
            if(err) return response.sendStatus(403);
            const acecssToken = generateAccessToken({user: data});
            refreshTokens.push(acecssToken);
            return response.json({user: data, token: acecssToken});
        });
    },
    logout(request, response) {
        const removeToken = getToken(request);

        refreshTokens = refreshTokens.filter(token => token !== removeToken.split(' ')[1]);
        return response.sendStatus(204);
    },
    getAuth(request, response) {
        const token = getToken(request);
        const auth = jwt.decode(token.split(' ')[1], {complete: true});

        return response.json({auth});
    }
};

function generateAccessToken(user){
    return jwt.sign(user, JWT_TOKEN, {expiresIn: '1d'});
}


// Get token
const getToken = (request) => {
    return request.body.token || request.query.token || request.headers['authorization'];
}
