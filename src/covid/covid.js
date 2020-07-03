const path = require('path');
const { readISO3316 } = require('../utils/public_data_utils.js');
const { fromJSON } = require('../utils/dataframe_utils.js');

const source = require('./20200701/world_timeline.json');

const covid = {};
const columns = new Set(['alpha2']);

for(let key in source) {
    let { list, date } = source[key];
    (list || []).forEach((item) => {
        if(!covid[item.id]) {
            covid[item.id] = { 
                alpha2: item.id.toUpperCase() 
            };
        }
        columns.add(date);
        Object.assign(covid[item.id], { 
            [date]: item['confirmed'] 
        });
    });
}

const resolve = async () => {
    const countries = (await readISO3316())
        .rename('ISO-alpha2 Code', 'alpha2')
        .rename('Country or Area', 'country')
        .select('alpha2', 'country');
    const df = fromJSON(Object.values(covid), Array.from(columns));
    return countries.rightJoin(df, 'alpha2');
};

resolve().then((df) => {
    df.toCSV(true, 'a.csv');
}).catch(e => {
    console.log('出错了：', e)
})