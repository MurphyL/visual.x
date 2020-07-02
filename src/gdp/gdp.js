const path = require('path');
const args = require('argsparser').parse();

if(!args['-dt']) {
	throw '请使用【-dt】指定数据日期';
}

const { DataFrame } = require("dataframe-js");

const META_FILE = `metadata.${args['-dt']}.csv`;
const DATA_FILE = `region.gdp.${args['-dt']}.csv`;

const readCSV = async (filename) => {
    return await DataFrame.fromCSV(path.resolve(__dirname, './world_bank', filename));
}

const readMeta = async () => {
    const meta = await readCSV(META_FILE);
    const df = meta.where(row => row.get('Income_Group').indexOf('国家') > -1)
                    .rename('﻿"Country Name"', '﻿Country Name')
                    .select('﻿Country Name', 'Country Code');
    const columns = df.listColumns();
    const mapping = {};
    const local = JSON.parse(df.toJSON());
    const items = local[columns[0]];
    (local[columns[1]] || []).forEach((alpha3, i) => {
        mapping[alpha3] = items[i];
    })
    return mapping;
};

const mergeData = async () => {
    const countries = readMeta();
    const data = await readCSV(DATA_FILE);
    const df = data.where(row => !countries[row.get('Country Code')]);
    const columns = df.listColumns();
    df.rename(columns[columns.length - 4], 'Country Name')
    df.map((row, i) => {
        const dict = row.toDict();
        console.log(dict[columns[columns.length - 4]]);
    })
    return df.toJSON();
};


mergeData().then((result) => {
    return result;
}).catch(e => {
    console.error(e);
})
