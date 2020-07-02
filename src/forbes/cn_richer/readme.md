## 中国富豪排行榜

* 2020 - https://www.forbeschina.com/lists/1734
* 2019 - https://www.forbeschina.com/lists/1728
* 2018 - https://www.forbeschina.com/lists/1162


```js
// 表头
const header = Array.from(document.querySelectorAll('#data-view thead tr th')).map((item) => {
    return item.innerText;
});

// 数据
Array.from(document.querySelectorAll('#data-view tbody tr')).map((row) => { 
    const result = {}; 
    header.forEach((key, i) => {
        var temp = row.cells.item(i); 
        result[key] = (temp ? temp.innerText : '').replace(/,/g, ''); 
    });  
    return result; 
}).filter((row) => (row['排名'] * 1 > 0));
```