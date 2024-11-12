function randomInt(min, max) {
    return Math.floor((Math.random()) * (max - min)) + min;
}

function randomString(length) {
    value = ''
    for (let i = 0; i < length; i++)
        value += '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'[randomInt(0, 64)];
    return value;
}

module.exports = {randomInt, randomString};