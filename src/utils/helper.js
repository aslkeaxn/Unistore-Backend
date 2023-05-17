function isAlphabetic(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}

function raiseError(status, message, custom) {
    const error = new Error(message);
    raiseCustomError(status, error, custom);
}

function raiseCustomError(status, error, custom) {
    error.status = status;
    error.custom = custom;
    throw error;
}

module.exports = { isAlphabetic, isAlphanumeric, raiseError, raiseCustomError };
