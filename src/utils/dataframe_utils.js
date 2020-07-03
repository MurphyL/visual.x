const { DataFrame } = require("dataframe-js");

const readCSV = async (filepath) => {
    return DataFrame.fromCSV(filepath);
};

const readJSON = async (filepath) => {
    return DataFrame.fromJSON(filepath);
};

const fromJSON = (values, columns) => {
    return new DataFrame(values, columns);
};

module.exports = {
    readCSV,
    fromJSON,
    readJSON,
};

