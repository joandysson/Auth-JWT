const User = require('../models/User');

module.exports = {
    index (request, response) {
        return response.send(User.all);
    }
}