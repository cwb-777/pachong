/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1_3306
Source Server Version : 80017
Source Host           : 127.0.0.1:3306
Source Database       : pachong

Target Server Type    : MYSQL
Target Server Version : 80017
File Encoding         : 65001

Date: 2020-07-07 10:37:27
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for job
-- ----------------------------
DROP TABLE IF EXISTS `job`;
CREATE TABLE `job` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `job_name` varchar(255) DEFAULT NULL COMMENT '任务名称',
  `job_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '任务类型(1分页2瀑布流带加载按钮3瀑布流不带加载按钮4瀑布流加分页0无分页)',
  `job_url` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '需抓取的任务地址',
  `job_content` varchar(5000) DEFAULT NULL COMMENT '需采集的内容(css元素选择器)',
  `job_next` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '下一页按钮(css选择器)',
  `job_page` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '任务进度(当前页数)',
  `job_status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '任务状态1准备就绪2采集成功0采集失败',
  `gmt_create` datetime DEFAULT NULL COMMENT '创建时间',
  `gmt_modified` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of job
-- ----------------------------
INSERT INTO `job` VALUES ('2', '1', '瓜子二手车爬取', null, 'http://vip.stock.finance.sina.com.cn/q/go.php/vInvestConsult/kind/dzjy/index.phtml?p=3026', null, 'body > div.wrap > div.content > div.content_right > div > div.list > div.pages > a:nth-child(8)', '99.56', '0', '2020-04-17 11:01:26', null);
INSERT INTO `job` VALUES ('3', '1', '爱奇艺电影爬取', null, 'http://vip.stock.finance.sina.com.cn/q/go.php/vInvestConsult/kind/dzjy/index.phtml?p=3026', null, 'body > div.wrap > div.content > div.content_right > div > div.list > div.pages > a:nth-child(8)', '100', '1', '2020-04-17 11:26:59', null);
INSERT INTO `job` VALUES ('7', '1', '哔哩哔哩', '0', 'wwww.list>tr', null, null, null, '0', null, null);
INSERT INTO `job` VALUES ('8', '1', '哔哩哔哩', '0', 'wwww.list>tr', null, null, null, '1', null, null);
INSERT INTO `job` VALUES ('9', '1', '哔哩哔哩', '0', 'wwww.list>tr', null, null, null, '1', null, null);
INSERT INTO `job` VALUES ('11', '1', '哔哩哔哩', '0', 'wwww.list>tr', null, null, null, '0', null, null);
INSERT INTO `job` VALUES ('12', '1', '哔哩哔哩', '0', 'wwww.list>tr', null, null, null, '0', null, null);
INSERT INTO `job` VALUES ('13', '1', '哔哩哔哩', '0', 'wwww.list>tr', null, null, null, '1', null, null);
INSERT INTO `job` VALUES ('14', '1', '哔哩哔哩', '0', 'wwww.list>tr', null, null, null, '0', null, null);
INSERT INTO `job` VALUES ('15', '1', '哔哩哔哩', '0', 'wwww.list>tr', null, null, null, '1', null, null);
INSERT INTO `job` VALUES ('16', '1', '哔哩哔哩', '0', 'wwww.list>tr', null, null, null, '0', null, null);
INSERT INTO `job` VALUES ('17', '1', '哔哩哔哩', '0', 'wwww.list>tr', null, null, null, '1', null, null);
INSERT INTO `job` VALUES ('18', '1', '哔哩哔哩', '0', 'wwww.list>tr', null, null, null, '1', null, null);
INSERT INTO `job` VALUES ('20', '1', '哔哩哔哩', '0', 'wwww.list>tr', null, null, null, '1', null, null);
INSERT INTO `job` VALUES ('22', '1', '哔哩哔哩', '3', 'https://list.suning.com/0-258004-0.html?safp=d488778a.homepage1.99345513004.84&safc=cate.0.0&safpn=10001', '#product-list > ul', null, null, '1', null, null);
INSERT INTO `job` VALUES ('23', '1', '1234', '3', 'https://weibo.com/mianyangdanshen?is_all=1', '#Pl_Official_MyProfileFeed__21 > div', null, null, '2', '2020-05-07 15:48:26', '2020-05-18 18:00:33');
INSERT INTO `job` VALUES ('24', '1', 'we', '3', 'https://weibo.com/mianyangdanshen?is_all=1', '#Pl_Official_MyProfileFeed__21 > div', null, null, '2', '2020-05-07 17:29:01', '2020-05-19 09:23:10');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gmt_create` datetime DEFAULT NULL,
  `vip` char(1) DEFAULT NULL COMMENT '是否VIP用户1是0否',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'zsan', 'http://vip.stock.finance.sina.com.cn/q/go.php/vInvestConsult/kind/dzjy/index.phtml?p=3026', null, '0');
