const fs = require('fs');
const path = require('path');
const { readCSV } = require('./dataframe_utils.js');

const ISO_3166_FILE = '../../data/iso/iso-3166-unsd.csv';

const readISO3316 = async () => {
    return readCSV(path.resolve(__dirname, ISO_3166_FILE));
};

module.exports = {
    readISO3316,
};

