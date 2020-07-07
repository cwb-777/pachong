var express = require('express');
var router = express.Router();
const db = require('./db');


var sql = 'select * from job where user_id = 1 order by id desc';
var jobList ;
let show = () => {
  return new  Promise((resolve, reject) => {
    db.query(sql, (err, rows) => {
      if(err) {
        reject(err);
      }
      	jobList = rows;
      	resolve(rows);
    })
  })
}//显示全部 （select*）

/* GET home page. */
router.get('/', async (req, res, next) =>{
	await show();

  res.render('index', { jobList: jobList});

});


router.post('/getJobById', async (req, res, next) =>{
	var result = {};
	var getUserVipStatus = (sql) => {
    	return new Promise((resolve, reject) => {
    		db.query(sql, (err, rows) => {
      			if(err) {
        			reject(err);
        			result['msg'] = 0;//查询失败
      			}else{
        			result['job'] = rows[0];
      				result['msg'] = 1;//查询成功
        			resolve(rows);
      			}
    		})
  		})
	}//条件查询（传参)
	let sql = "select * from job WHERE id = "+req.body.id+"";
	await getUserVipStatus(sql);
	res.json(result);
	return;
});

router.get('/getJobListById', async (req, res, next) =>{
	var result = {};
	try{
		var jobs;
		var jobListById = (job_id) => {
    		return new Promise((resolve, reject) => {
    		let sql = "select * from job where id = "+job_id+"";
    		db.query(sql, (err, rows) => {
      			if(err) {
        			reject(err);
      			}else{
      			// console.log('----------->'+rows[0]['count(id)']);
        		jobs = rows;
        		resolve(rows);
        		}
    			})
  			})
		}//条件查询（传参)
		await jobListById(req.body.id);
		result['msg'] = 1;//查询成功
		result['jobList'] = jobs;
	}catch(err){
		result['msg'] = 0;//查询失败
	}
  res.json(result);

});

module.exports = router;
