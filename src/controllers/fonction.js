const arthuRoute = (req, res) => {
    res.send('Koko Kouadio Guy Arthur');
}

const registRoute = (req, res) => {
    res.send('Konan Kouacou Jean Regist Junior');
}

const kevinRoute = (req, res) => {
    res.send('Konan Arnaud Kevin');
}

const frediRoute = (req, res) => {
    res.send('Youan-Bi Frederic');
}

const tapeRoute = (req, res) => {
    res.send('Taper Charle Patrice')
}


module.exports = {
    arthuRoute,
    kevinRoute,
    registRoute,
    frediRoute,
    tapeRoute
}