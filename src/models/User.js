const { Router } = require("express");

module.exports = {
    all(){
        return users;
    },
    find(email, password) {
        const user = users.filter((user)=> user.email == email && user.password == password);
        return user.shift();
    }
};

// test
const users = [
    {
        id: 1,
        name: 'Test One',
        email: 'testone@test.com.br',
        password: 'T12345678'
    },
    {
        id: 2,
        name: 'Test Two',
        email: 'testtwo@test.com.br',
        password: 'T12345678'
    },
];