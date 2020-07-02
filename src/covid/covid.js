var args = require( "argsparser" ).parse();

const dt = args['-dt'];
if(!dt) {
	throw '请使用【-dt】指定数据日期';
}

const fs = require('fs');
const path = require('path');
const targetDir = path.join(process.cwd(), 'dist');

if(!fs.existsSync(targetDir)) {
	fs.mkdirSync(targetDir);
}

const items = require(`./${dt}/world_timeline.json`);
const codes = require('../../public/iso/iso_codes.json');
const local = require('../../public/iso/iso_china.json');

const CODE_MAPPING = {};
const LOCAL_MAPPING = {};

(codes || []).forEach((item) => {
	CODE_MAPPING[item['alpha-2'].toLowerCase()] = item;
});

(local || []).forEach((item) => {
	LOCAL_MAPPING[item['ISO 2'].toLowerCase()] = item;
});

const result = {};
const dts = new Set();

(items || []).forEach((item, i) => {
	(item.list || []).forEach((country) => {
        const id = country.id.toLowerCase();
        if(!result[id]) {
            const isoCountry = CODE_MAPPING[id] || '';
            const isoChinese = LOCAL_MAPPING[id] || {};
            result[id] = {
                'alpha-2': country.id,
                'alpha-3': isoCountry['alpha-3'] || '',
                'country': isoCountry['name'] || '',
                'country-name': isoChinese['Chinese Name'] || '',
                'flag-image': 'https://www.countryflags.io/' + id + '/flat/64.png'
            };
        }
        dts.add(item.date);
        result[id][item.date] = country.confirmed;   // 确诊 -> confirmed, 治愈 -> recovered, 死亡 -> deaths, 
	})
});

const { DataFrame } = require("dataframe-js");

const df = new DataFrame(Object.values(result), [
    'alpha-2', 'alpha-3', 'flag-image',
    'country', 'country-name',
    ...Array.from(dts).sort()
]);



df.toCSV(true, path.join(targetDir, `covid-${dt}.csv`));
// console.log('DEMO：', JSON.stringify(result[0], null, '\t'));
