var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
const db = require('./db');
var fs = require('fs');
const ws = require('nodejs-websocket');
var redis = require('redis');
var redisClient = redis.createClient('6379', '127.0.0.1');
// redisClient.auth("password");

var statusFlag = 1;//0:未知错误1:正常2:意外关闭或刷新5:手动取消3:网址无效或访问超时4:获取采集模块失败或子节点长度为零
// var jobControl = {};

var server = ws.createServer(function(conn){
  conn.on("text", function (str) {
  	statusFlag = 1;
    console.log("message:====================="+str+'=====================');
    conn.sendText("=====================收到收到，over=====================");
  })
  conn.on("close", function (code, reason) {
  	statusFlag = 2;
    console.log("=====================关闭连接=====================")
  });
  conn.on("error", function (code, reason) {
  	statusFlag = 2;
    console.log("=====================异常关闭=====================")
  });
}).listen(8001)
console.log("=====================WebSocket建立完毕=====================");

router.post('/stopJob',function(req,res,next){
	redisClient.hset('jobControl',req.body.id,5);
	res.json(0);
})


router.post('/',async function(req,res,next){
if (req.body.jobType == 3 || req.body.jobType == 0) {
	var runningCount;//当前用户正在执行的任务数量
	var getRunningCount = () => {
    	return new Promise((resolve, reject) => {
    		redisClient.hget('runningCount',1,async function (err,v) {
    			if (err) {
    				reject(err);
    			}else{
					runningCount = v;
    				resolve(v);
    			}
			})
  		})
	}
	await getRunningCount();

	if (runningCount == null) {//表示第一次执行任务
		redisClient.hset('runningCount',1,1);//在线任务数写进redis,直接开始采集
	}else{
	redisClient.hincrby('runningCount',1,1);//否则任务数加1,判断是否超限,再决定是否继续采集这一步
	var isVip;//判断用户是否是vip用户
	var getUserVipStatus = (sql) => {
    	return new Promise((resolve, reject) => {
    		db.query(sql, (err, rows) => {
      			if(err) {
        			reject(err);
      			}else{
      				isVip = rows[0]['vip'];
        			resolve(rows);
      			}
    		})
  		})
	}//条件查询（传参)
	let sql = "select vip from user WHERE id = 1";
	await getUserVipStatus(sql);

	if (isVip == 1) {
		if (runningCount >= 5) {
		let result = {};
		result['msg'] = 7;//7表示vip用户超过线程数
		redisClient.hincrby('runningCount',1,-1);//超出限制,退出采集,在线任务数减1
		res.json(result);
		return;
		}
	}else{
		if (runningCount >= 2) {
		let result = {};
		result['msg'] = 6;//6表示普通用户超过线程数
		redisClient.hincrby('runningCount',1,-1);//超出限制,退出采集,在线任务数减1
		res.json(result);
		return;
		}
	}
	}
	
	redisClient.hset('jobControl',req.body.id,1);
	// jobControl[req.body.id] = 1;
	var jobClose = await run_type_0(req.body.jobType,req.body.id,req.body.name,req.body.url,req.body.forBody);
	redisClient.hdel('jobControl',req.body.id);

	redisClient.hincrby('runningCount',1,-1);//采集完毕,在线任务数减1
	res.json(jobClose);	
	return;	

}else{
	var result= {};
	result['msg'] = 4;
	res.json(result);
	return;
}

})

//===========================================================无分页==========================================================
async function run_type_0(job_type,job_id,name,url,forBody) {
	var msg = 1;//1执行成功,0未知原因导致执行失败,2意外关闭或刷新导致失败,3网址不正确或访问超时,4获取采集模块失败或模块子节点长度为0
	var browser;
	var tableDataMap = {};
	try{
    browser = await puppeteer.launch({headless: false,args: ["--no-sandbox" , "--disable-setuid-sandbox"],timeout:10000});
    const page = await browser.newPage();
    await page.setViewport({width: 2000, height: 1000});
    
    try{
    	await page.goto(''+url+'',{timeout:10000,waitUntil:'domcontentloaded' }); 
    }catch(err){
    	console.log('网址无效或访问超时'+err);
    	clearInterval(intervalFunc);//清除定时器
        await browser.close(); 
        msg = 3;
        tableDataMap['msg'] = msg;
        tableDataMap['job_name'] = name;
        return tableDataMap;
    }
    // page.on('error', () => {})
    await sleep(5000);//等待5秒,尽量防止因网速过慢导致异常退出(抛出'msg'=4)。

//     await asyncio.wait([
// page.waitForNavigation(),
// page.click(’…’),
// ])

	var intervalFunc = await setInterval(async function(){
		await redisClient.hget('jobControl',job_id,async function (err,v) {
    		if(statusFlag == 2){
				await page.evaluate(() => {
					window.sessionStorage.setItem('statusFlag',2);
				});
				clearInterval(intervalFunc);
			}
			if(v == 5){
				await page.evaluate(() => {
					window.sessionStorage.setItem('statusFlag',5);
				});
				clearInterval(intervalFunc);
			}
		})
		
	},100)
	// await sleep(5000);
	let resultData = [];
    var d = {};
    var result;
    try{
    result = await page.evaluate(async(job_type,name,msg,res,d,resultData,tableDataMap) => {

    	if (job_type == 3) {//如果类型等于3为瀑布流不带加载按钮型,执行滚动操作
    		await new Promise((resolve, reject) => {
      			// 页面的当前高度
      			let totalHeight = 0;
      			// 每次向下滚动的距离
      			let distance = 100;
      			// 通过setInterval循环执行
      			let timer = setInterval(() => {
        			let scrollHeight = document.body.scrollHeight;

        			// 执行滚动操作
        			window.scrollBy(0, distance);

        			// 如果滚动的距离大于当前元素高度则停止执行
        			totalHeight += distance;
        			if (totalHeight >= scrollHeight) {
          		 		clearInterval(timer);
          				resolve();
        			}
      			}, 100);
      				
    		});
    	}
        	var	tmp = document.querySelector(''+res+'');
        	var nodeDataFlag = [];
        	var tmpArray = [];
        	for (var i = 0; i < tmp.childNodes.length; i++) {
        		tmpArray.push(tmp.childNodes[i]);
        	}
        	var forNum = 0;
        	var nodeNameFlag = '';
        	var keySet = new Set();
        	function getTable(tmp){
        		
        		[...tmp.children].forEach(v => {
        			if (window.sessionStorage.getItem('statusFlag') == 2 || window.sessionStorage.getItem('statusFlag') ==5) {
        				msg = window.sessionStorage.getItem('statusFlag');//意外关闭
        				return;
        			}
        			for (var i = 0; i < tmp.childNodes.length; i++) {
        				if (window.sessionStorage.getItem('statusFlag') == 2 || window.sessionStorage.getItem('statusFlag') ==5) {
        					msg = window.sessionStorage.getItem('statusFlag');//意外关闭
        					return;
        				}
        				if (tmpArray[i]==v) {
        					nodeNameFlag = v.nodeName;
        					resultData.push(d);
        					d = {};
        				}
        			}
        			if (v.nodeName == 'IMG'){
        				d[nodeNameFlag+='->'+v.nodeName] = v.src;
        				keySet.add(nodeNameFlag);
        			}
        			if (v.nodeName == 'A' && v.href != 'javascript:void(0);' && v.href != 'javascript:;' && v.href != '#'){
        				d[nodeNameFlag+='->'+v.nodeName] = v.href;
        				keySet.add(nodeNameFlag);
        			}
        			if (v.nodeName != 'SCRIPT'){
        				var tmpNode = v.childNodes;
        				for(var i = tmpNode.length - 1; i >= 0; i--){
        					if (tmpNode[i].nodeName == '#text' && tmpNode[i].data.trim().replace(/\s/g,"").length > 0){
        						d[nodeNameFlag+='->'+tmpNode[i].nodeName] = tmpNode[i].data.trim().replace(/\s/g,"");
        						keySet.add(nodeNameFlag);
        					}
        				}
        			}
        			getTable(v);
        		});
        	}
        	getTable(tmp);
        	resultData.push(d);
        	var keyArray = Array.from(keySet);

			tableDataMap['keyArray'] = keyArray;
			tableDataMap['resultData'] = resultData;
			tableDataMap['msg'] = msg;
			tableDataMap['job_name'] = name;

        	return tableDataMap;

         },job_type,name,msg,forBody,d,resultData,tableDataMap);
        
	}catch(err){
		console.log('获取采集模块失败或子节点长度为0'+err);
		clearInterval(intervalFunc);//清除定时器
        await browser.close(); 
    	msg = 4;//获取采集模块失败
    	tableDataMap['msg'] = msg;
    	tableDataMap['job_name'] = name;
        return tableDataMap;
	}
        console.log('4444'+result['keyArray'].length);
        console.log('8080'+result['resultData'].length);
		clearInterval(intervalFunc);//清除定时器
        // await sleep(2000);
        await browser.close(); 
        return result;      
        }catch(err){
        	console.log('出错了:'+err);
        	clearInterval(intervalFunc);//清除定时器
        	await browser.close(); 
        	msg = 0;
        	tableDataMap['msg'] = msg;
        	tableDataMap['job_name'] = name;
        	return tableDataMap;
        }                           
}

//===========================================================瀑布流不带加载按钮==========================================================

async function sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

module.exports = router;