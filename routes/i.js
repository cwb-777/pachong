var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
const db = require('./db');
const elasticsearch = require('elasticsearch');
const logger = require('./logger');

var client=new elasticsearch.Client({
    host:"localhost:9200",
    //将日志信息显示在控制台，默认level:"console"
    log:"trace",
    //将日志信息写入文件中
    // log:{
    //     type:'file',
    //     level:"trace",
    //     path:"url"
    // }
    //设置不同等级输出到不同的地方
    // log:[
    //     {
    //         type:'console',
    //         level:"error",
    //     },
    //     {
    //         type:"file",
    //         level:"trace",
    //         path:"url" 
    //     }
    // ]
});

router.get("/",function (req,res,next){
    var table_name = req.query.table_name;
    var job_id = req.query.job_id;

    var job_url;
    var job_clickFlag;
    var getJob = (table_name, job_id) => {
    return new Promise((resolve, reject) => {
    let sql = 'select * from '+table_name+' where id = '+job_id+'';
    db.query(sql, (err, rows) => {
      if(err) {
        reject(err);
      }
        job_url = rows[0].job_url;
        job_clickFlag = rows[0].job_clickFlag;
        resolve(rows);
    })
  })
}//条件查询（传参)


async function run() {
    const browser = await puppeteer.launch({headless: false,args: ["--no-sandbox" , "--disable-setuid-sandbox"]});
    const page = await browser.newPage();
    await page.setViewport({width: 2000, height: 1000});
    await getJob(table_name,job_id);
    let url = job_url;
    
    await page.goto(''+url+'',{timeout:0,waitUntil:'domcontentloaded'}); 

    var clickFlag = job_clickFlag; 
    // async function isExistNext(){
        // var clickOutHtml = document.querySelector(clickFlag).outerHTML;
        var clickOutHtml = await page.$eval(''+clickFlag+'', el => el.outerHTML);
        var isExistNext = await clickOutHtml.indexOf('onclick="set_page_num');
    //     return isExistNext;
    // }
if (!(isExistNext == -1)) {
    while(!(isExistNext == -1)){

        var titles = await page.evaluate(getTitles);//获取当前页所有数据
        await bulkIndex('xlcj','_doc',titles);//数据持久化

        await page.evaluate(async(res) => document.querySelector(res).click(),clickFlag);
        await page.waitForNavigation();//等待跳转结束
            
        await sleep(2000);
        clickOutHtml = await page.$eval(clickFlag, el => el.outerHTML);
        isExistNext = await clickOutHtml.indexOf('onclick="set_page_num');
    }                                   
        var titles = await page.evaluate(getTitles);//获取当前页所有数据
        await bulkIndex('xlcj','_doc',titles);//持久化  "xl_dzjy"：新浪->大宗交易
        await browser.close();                                  
}else{
        var titles = await page.evaluate(getTitles);
        await bulkIndex('xlcj','_doc',titles);//数据持久化
        await browser.close();
}
};

async function getTitles() {
    let resultData = [];
    let d = {};
         let dataList = document.querySelectorAll('#dataTable > tbody > tr');
         let id = 0;
         for(var dataa of dataList){
             // for (var j = 0; j < dataa.cells.length; j++) {
                d["jyrq"] = dataa.cells[0].innerText;//交易日期
                d["zqdm"] = dataa.cells[1].innerText;//证券代码
                d["zqjc"] = dataa.cells[2].innerText;//证券简称
                d["cjjg"] = dataa.cells[3].innerText;//成交价格（元）
                d["cjl"] = dataa.cells[4].innerText;//成交量（万股）
                d["cjje"] = dataa.cells[5].innerText;//成交金额（万元）
                d["mfyyb_1"] = dataa.cells[6].innerText;//1:买方营业部0：卖方营业部
                d["mfyyb_0"] = dataa.cells[7].innerText;//1:买方营业部0：卖方营业部
                d["zqlx"] = dataa.cells[8].innerText;//证券类型
                resultData.push(d);
             // }
         }
    return resultData;
} 

async function sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

run();//启动爬取


//===========================================es===============================================

//批量操作
async function bulkIndex(index, type, data) {
  let bulkBody = [];

  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type    }
    });

    bulkBody.push(item);
  });

  
  client.bulk({body: bulkBody});
  
}

res.render("i",{html:"this my express"});
});

module.exports = router;
