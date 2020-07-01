var args = require( "argsparser" ).parse();

if(!args['-dt']) {
	throw '请使用【-dt】指定数据日期';
}


const items = require(`./${args['-dt']}/world_timeline.json`);
const codes = require('../../public/iso/iso_codes.json');
const local = require('../../public/iso/iso_china.json');

const CODE_MAPPING = {};
const DATE_MAPPING = {};
const LOCAL_MAPPING = {};

(codes || []).forEach((item) => {
	CODE_MAPPING[item['alpha-2']] = item;
});

(local || []).forEach((item) => {
	LOCAL_MAPPING[item['ISO 2']] = item;
});

console.log(CODE_MAPPING);

const result = {};

(items || []).forEach((item, i) => {
	let temp = [];
	(item.list || []).forEach((country) => {
		let x = Object.assign(country, CODE_MAPPING[country.id]);
		if(LOCAL_MAPPING[country.id]) {
			x['_local'] = LOCAL_MAPPING[country.id]['Chinese Name'];
		}
		temp.push(x);
	})
	result[item.date] = temp;
	if(i === 0){
		console.log(temp);
	}
});