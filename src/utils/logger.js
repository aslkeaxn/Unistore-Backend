function info(...message) {
    console.log(...message);
}

function error(...message) {
    console.log("\n");
    console.error(...message);
    console.log("\n");
}

module.exports = {
    info,
    error,
};
