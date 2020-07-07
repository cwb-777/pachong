var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
const db = require('./db');
const ws = require('nodejs-websocket');
var redis = require('redis');
var redisClient = redis.createClient('6379', '127.0.0.1');

var yulanFlag = 1;//0:未知错误1:正常2:意外关闭或刷新5:手动取消3:网址无效或访问超时4:获取采集模块失败或子节点长度为零

var server = ws.createServer(function(conn){
  conn.on("text", function (str) {
  	yulanFlag = 1;
    console.log("message:====================="+str+'=====================');
    conn.sendText("=====================收到收到，over=====================");
  })
  conn.on("close", function (code, reason) {
  	yulanFlag = 2;
    console.log("=====================关闭连接=====================")
  });
  conn.on("error", function (code, reason) {
  	yulanFlag = 2;
    console.log("=====================异常关闭=====================")
  });
}).listen(8002)
console.log("=====================WebSocket建立完毕=====================");

// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM(`<!DOCTYPE html>`);
// const $ = require('jQuery')(window);

router.get('/',async function(req,res,next){
	var result = {};
	var job;
	if (req.query.id!=undefined) {
	var getJobById = (sql) => {
    	return new Promise((resolve, reject) => {
    		db.query(sql, (err, rows) => {
      			if(err) {
        			reject(err);
        			result['msg'] = 0;//1表示修改且查询失败
      			}else{
      				result['msg'] = 1;//0表示修改且查询成功
      				job = rows[0];
        			resolve(rows);
      			}
    		})
  		})
	}//条件查询（传参)
	let sql = "select * from job WHERE id = '"+req.query.id+"'";
	await getJobById(sql);
      	res.locals.result = result['msg'];
 		res.locals.job_id = job.id;
 		res.locals.job_name = job.job_name;
 		res.locals.job_type = job.job_type;
 		res.locals.job_url = job.job_url;
 		res.locals.job_content = job.job_content;
 		res.locals.job_next = job.job_next;
	}else{
		result['msg'] = 2;//表示新增
		res.locals.result = result['msg'];
	}
	res.render('addJob');
});

async function run(userId,url,forBody) {
	var msg = 1;//1执行成功,0未知原因导致执行失败,2意外关闭或刷新导致失败,3网址不正确或访问超时,4获取采集模块失败或模块子节点长度为0
	var browser;
	var tableDataMap = {};
	try{
    browser = await puppeteer.launch({headless: false,args: ["--no-sandbox" , "--disable-setuid-sandbox"]});
    const page = await browser.newPage();
    await page.setViewport({width: 2000, height: 1000});
    
    try{
    	await page.goto(''+url+'',{timeout:0,waitUntil:'domcontentloaded' }); 
    }catch(err){
    	console.log('网址无效或访问超时'+err);
    	clearInterval(intervalFunc);//清除定时器
        await browser.close(); 
        msg = 3;
        tableDataMap['msg'] = msg;
        return tableDataMap;
    }
    // await sleep(5000);

	var intervalFunc = await setInterval(async function(){
		if(yulanFlag == 2){
				await page.evaluate(() => {
					window.sessionStorage.setItem('yulanFlag',2);
				});
				clearInterval(intervalFunc);
			}
	},100)
	let resultData = [];
    var d = {};
    var result;
    try{
    result = await page.evaluate(async(msg,res,d,resultData,tableDataMap) => {
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
        			if(resultData.length > 10){
        				return;
        			}
        			if (window.sessionStorage.getItem('yulanFlag') == 2) {
        				msg = window.sessionStorage.getItem('yulanFlag');//意外关闭
        				return;
        			}
        			for (var i = 0; i < tmp.childNodes.length; i++) {
        				if (window.sessionStorage.getItem('yulanFlag') == 2) {
        					msg = window.sessionStorage.getItem('yulanFlag');//意外关闭
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

        	return tableDataMap;

         },msg,forBody,d,resultData,tableDataMap);
        
	}catch(err){
		console.log('获取采集模块失败或子节点长度为0'+err);
		clearInterval(intervalFunc);//清除定时器
        await browser.close(); 
    	msg = 4;//获取采集模块失败
    	tableDataMap['msg'] = msg;
        return tableDataMap;
	}
		await clearInterval(intervalFunc);//清除定时器
        // await sleep(2000);
        await browser.close(); 
        return result;      
        }catch(err){
        	console.log('出错了:'+err);
        	clearInterval(intervalFunc);//清除定时器
        	await browser.close(); 
        	msg = 0;
        	tableDataMap['msg'] = msg;
        	return tableDataMap;
        }                           
};

async function sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

router.post('/testJob',async function(req,res,next){
	var isRunning;
	var getRunningStatus = () => {
    	return new Promise((resolve, reject) => {
    		redisClient.hget('isRunning',req.body.userId,async function (err,v) {
    			if (err) {
    				 reject(err);
    			}else{
					isRunning = v;
    				 resolve(v);
    			}
			})
  		})
	}
	await getRunningStatus();
	
	if (isRunning == 1) {
		res.json(-1);//表示已经存在正在进行的任务
		return;
	}else{
		redisClient.hset('isRunning',req.body.userId,1);
	}
		let jobName = req.body.jobName;
		let jobType = req.body.jobType;
        let jobUrl = req.body.jobUrl;
        let jobContent = req.body.jobContent;
        let jobNext = req.body.jobNext;
        let jobTrueName = req.body.jobTrueName;
        let isUpdate = req.body.isUpdate;
	var jobNameExist;//1表示已存在，0表示不存在

		if ((isUpdate != 1) || (isUpdate ==1 && jobName != jobTrueName)) {
        var getJobCountByName = (job_name, user_id) => {
    		return new Promise((resolve, reject) => {
    	let sql = "select count(id) from job where user_id = "+user_id+" and job_name = '"+job_name+"'";
    		db.query(sql, (err, rows) => {
      			if(err) {
        			reject(err);
      			}else{
        		jobNameExist = rows[0]['count(id)'];
        		resolve(rows);
        		}
    		})
  		})
		}//条件查询（传参)
		await getJobCountByName(jobName,1);
		}else{
			jobNameExist = 0;
		}

	switch(req.body.jobType){
		case '1':
		res.json(await run(req.body.jobUrl,req.body.jobContent));
		break;
		case '2':
		break;
		case '3':
		break;
		case '0':
		if (jobNameExist != 0) {
			redisClient.hset('isRunning',req.body.userId,0);
			res.json(0);//任务已存在
			return;
		}else{
			var jobClose = await run(req.body.userId,req.body.jobUrl,req.body.jobContent);
			redisClient.hset('isRunning',req.body.userId,0);
			res.json(jobClose);
			return;
		}
		break;
	}
});

router.post('/addJob',async function(req,res,next){
		let jobName = req.body.jobName;
		let jobType = req.body.jobType;
        let jobUrl = req.body.jobUrl;
        let jobContent = req.body.jobContent;
        let jobNext = req.body.jobNext;
        var isUpdate = req.body.isUpdate;
        var jobId = req.body.jobId;
        var result = {};
        var insertOrUpdateJob = (sql) => {
    		return new Promise((resolve, reject) => {
    		db.query(sql, (err, rows) => {
      			if(err) {
        			reject(err);
        			result['msg'] = 1;//1表示插入失败
      			}else{
      				// console.log('----------->'+rows['insertId']);
      				// console.log('===========>'+JSON.stringify(rows));
      				result['msg'] = 0;//0表示插入成功
        			resolve(rows);
      			}
    		})
  		}) 
		}//条件查询（传参)

	switch(req.body.jobType){
		case '1':

			break;
		case '2':
			break;
		case '3':
			break;
		case '0': 
			let sql;
			if (isUpdate == 1) {
				 sql = "UPDATE job set job_name = '"+jobName+"',job_url = '"+jobUrl+"' ,job_content = '"+jobContent+"' ,gmt_modified = now() WHERE id = '"+jobId+"'";
			}else{
    			 sql = "INSERT INTO job (user_id,job_name,job_type,job_url,job_content,job_status,gmt_create) VALUES(1,'"+jobName+"',0,'"+jobUrl+"','"+jobContent+"',1,now())";
			}
			await insertOrUpdateJob(sql);
			res.json(result);
			break;
	}
});

router.post('/update',async function(req,res,next){
	var job_status = req.body.job_status;
	var id = req.body.id;
	var result = {};
	var updateJobStatus = (sql) => {
    	return new Promise((resolve, reject) => {
    		db.query(sql, (err, rows) => {
      			if(err) {
        			reject(err);
        			result['msg'] = 1;//1表示更新失败
      			}else{
      				result['msg'] = 0;//0表示更新成功
        			resolve(rows);
      			}
    		})
  		})
	}//条件查询（传参)
	let sql = "UPDATE job set job_status = '"+job_status+"' WHERE id = '"+id+"'";
	await updateJobStatus(sql);
	res.json(result);
});

router.post('/delete',async function(req,res,next){
	var id = req.body.id;
	var result = {};
	var deleteJob = (sql) => {
    	return new Promise((resolve, reject) => {
    		db.query(sql, (err, rows) => {
      			if(err) {
        			reject(err);
        			result['msg'] = 1;//1表示更新失败
      			}else{
      				result['msg'] = 0;//0表示更新成功
        			resolve(rows);
      			}
    		})
  		})
	}//条件查询（传参)
	let sql = "delete from job WHERE id = '"+id+"'";
	await deleteJob(sql);
	res.json(result);
});
module.exports = router;