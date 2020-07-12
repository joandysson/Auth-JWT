const { Router } = require('express');
require('express-router-group');

const Auth = require('./services/auth');

const router = Router();


router.get('/', (request, response) => {
    response.send("API V1 | Auth JWT ");
});

// routes Auth
router.group('/api/v1', router => {
    router.post('/login', Auth.login)

    router.group(Auth.verifyToken, router => {
        router.post('/authentication', Auth.authentication);
        router.post('/token', Auth.refreshToken);
        router.get('/auth', Auth.getAuth);
        router.delete('/logout', Auth.logout);
    })
});

module.exports = router;