;(function(root,factory){if(typeof define==='function'&&define.amd){define(factory);}else if(typeof exports==='object'){module.exports=factory();}else{root.NProgress=factory();}})(this,function(){var NProgress={};NProgress.version='0.2.0';var Settings=NProgress.settings={minimum:0.08,easing:'linear',positionUsing:'',speed:200,trickle:true,trickleSpeed:200,showSpinner:true,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:'body',template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};NProgress.configure=function(options){var key,value;for(key in options){value=options[key];if(value!==undefined&&options.hasOwnProperty(key))Settings[key]=value;}
return this;};NProgress.status=null;NProgress.set=function(n){var started=NProgress.isStarted();n=clamp(n,Settings.minimum,1);NProgress.status=(n===1?null:n);var progress=NProgress.render(!started),bar=progress.querySelector(Settings.barSelector),speed=Settings.speed,ease=Settings.easing;progress.offsetWidth;queue(function(next){if(Settings.positionUsing==='')Settings.positionUsing=NProgress.getPositioningCSS();css(bar,barPositionCSS(n,speed,ease));if(n===1){css(progress,{transition:'none',opacity:1});progress.offsetWidth;setTimeout(function(){css(progress,{transition:'all '+speed+'ms linear',opacity:0});setTimeout(function(){NProgress.remove();next();},speed);},speed);}else{setTimeout(next,speed);}});return this;};NProgress.isStarted=function(){return typeof NProgress.status==='number';};NProgress.start=function(){if(!NProgress.status)NProgress.set(0);var work=function(){setTimeout(function(){if(!NProgress.status)return;NProgress.trickle();work();},Settings.trickleSpeed);};if(Settings.trickle)work();return this;};NProgress.done=function(force){if(!force&&!NProgress.status)return this;return NProgress.inc(0.3+0.5*Math.random()).set(1);};NProgress.inc=function(amount){var n=NProgress.status;if(!n){return NProgress.start();}else if(n>1){return;}else{if(typeof amount!=='number'){if(n>=0&&n<0.2){amount=0.1;}
else if(n>=0.2&&n<0.5){amount=0.04;}
else if(n>=0.5&&n<0.8){amount=0.02;}
else if(n>=0.8&&n<0.99){amount=0.005;}
else{amount=0;}}
n=clamp(n+amount,0,0.994);return NProgress.set(n);}};NProgress.trickle=function(){return NProgress.inc();};(function(){var initial=0,current=0;NProgress.promise=function($promise){if(!$promise||$promise.state()==="resolved"){return this;}
if(current===0){NProgress.start();}
initial++;current++;$promise.always(function(){current--;if(current===0){initial=0;NProgress.done();}else{NProgress.set((initial-current)/initial);}});return this;};})();NProgress.render=function(fromStart){if(NProgress.isRendered())return document.getElementById('nprogress');addClass(document.documentElement,'nprogress-busy');var progress=document.createElement('div');progress.id='nprogress';progress.innerHTML=Settings.template;var bar=progress.querySelector(Settings.barSelector),perc=fromStart?'-100':toBarPerc(NProgress.status||0),parent=document.querySelector(Settings.parent),spinner;css(bar,{transition:'all 0 linear',transform:'translate3d('+perc+'%,0,0)'});if(!Settings.showSpinner){spinner=progress.querySelector(Settings.spinnerSelector);spinner&&removeElement(spinner);}
if(parent!=document.body){addClass(parent,'nprogress-custom-parent');}
parent.appendChild(progress);return progress;};NProgress.remove=function(){removeClass(document.documentElement,'nprogress-busy');removeClass(document.querySelector(Settings.parent),'nprogress-custom-parent');var progress=document.getElementById('nprogress');progress&&removeElement(progress);};NProgress.isRendered=function(){return!!document.getElementById('nprogress');};NProgress.getPositioningCSS=function(){var bodyStyle=document.body.style;var vendorPrefix=('WebkitTransform'in bodyStyle)?'Webkit':('MozTransform'in bodyStyle)?'Moz':('msTransform'in bodyStyle)?'ms':('OTransform'in bodyStyle)?'O':'';if(vendorPrefix+'Perspective'in bodyStyle){return'translate3d';}else if(vendorPrefix+'Transform'in bodyStyle){return'translate';}else{return'margin';}};function clamp(n,min,max){if(n<min)return min;if(n>max)return max;return n;}
function toBarPerc(n){return(-1+n)*100;}
function barPositionCSS(n,speed,ease){var barCSS;if(Settings.positionUsing==='translate3d'){barCSS={transform:'translate3d('+toBarPerc(n)+'%,0,0)'};}else if(Settings.positionUsing==='translate'){barCSS={transform:'translate('+toBarPerc(n)+'%,0)'};}else{barCSS={'margin-left':toBarPerc(n)+'%'};}
barCSS.transition='all '+speed+'ms '+ease;return barCSS;}
var queue=(function(){var pending=[];function next(){var fn=pending.shift();if(fn){fn(next);}}
return function(fn){pending.push(fn);if(pending.length==1)next();};})();var css=(function(){var cssPrefixes=['Webkit','O','Moz','ms'],cssProps={};function camelCase(string){return string.replace(/^-ms-/,'ms-').replace(/-([\da-z])/gi,function(match,letter){return letter.toUpperCase();});}
function getVendorProp(name){var style=document.body.style;if(name in style)return name;var i=cssPrefixes.length,capName=name.charAt(0).toUpperCase()+name.slice(1),vendorName;while(i--){vendorName=cssPrefixes[i]+capName;if(vendorName in style)return vendorName;}
return name;}
function getStyleProp(name){name=camelCase(name);return cssProps[name]||(cssProps[name]=getVendorProp(name));}
function applyCss(element,prop,value){prop=getStyleProp(prop);element.style[prop]=value;}
return function(element,properties){var args=arguments,prop,value;if(args.length==2){for(prop in properties){value=properties[prop];if(value!==undefined&&properties.hasOwnProperty(prop))applyCss(element,prop,value);}}else{applyCss(element,args[1],args[2]);}}})();function hasClass(element,name){var list=typeof element=='string'?element:classList(element);return list.indexOf(' '+name+' ')>=0;}
function addClass(element,name){var oldList=classList(element),newList=oldList+name;if(hasClass(oldList,name))return;element.className=newList.substring(1);}
function removeClass(element,name){var oldList=classList(element),newList;if(!hasClass(element,name))return;newList=oldList.replace(' '+name+' ',' ');element.className=newList.substring(1,newList.length-1);}
function classList(element){return(' '+(element&&element.className||'')+' ').replace(/\s+/gi,' ');}
function removeElement(element){element&&element.parentNode&&element.parentNode.removeChild(element);}
return NProgress;});
jQuery(document).ready(function ($) {
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("jQuery")):"function"==typeof define&&define.amd?define("Bmdb",["jQuery"],e):"object"==typeof exports?exports.Bmdb=e(require("jQuery")):t.Bmdb=e(t.jQuery)}(window,(function(t){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/",r(r.s=24)}([function(e,r){e.exports=t},function(t,e,r){var n=r(20),i=r(21);t.exports=function(t){return function(t){return"string"==typeof t}(t)&&t.length?i(t):n(t)}},function(t,e,r){"use strict";t.exports=r(22)},function(t,e){t.exports=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}},function(t,e,r){var n=r(13),i="object"==typeof self&&self&&self.Object===Object&&self,o=n||i||Function("return this")();t.exports=o},function(t,e){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e,r){var n=r(4).Symbol;t.exports=n},function(t,e,r){var n=r(3),i=r(12),o=r(14),a="Expected a function",s=Math.max,c=Math.min;t.exports=function(t,e,r){var u,l,f,d,p,h,v=0,b=!1,g=!1,y=!0;if("function"!=typeof t)throw new TypeError(a);function m(e){var r=u,n=l;return u=l=void 0,v=e,d=t.apply(n,r)}function j(t){var r=t-h;return void 0===h||r>=e||r<0||g&&t-v>=f}function w(){var t=i();if(j(t))return x(t);p=setTimeout(w,function(t){var r=e-(t-h);return g?c(r,f-(t-v)):r}(t))}function x(t){return p=void 0,y&&u?m(t):(u=l=void 0,d)}function $(){var t=i(),r=j(t);if(u=arguments,l=this,h=t,r){if(void 0===p)return function(t){return v=t,p=setTimeout(w,e),b?m(t):d}(h);if(g)return clearTimeout(p),p=setTimeout(w,e),m(h)}return void 0===p&&(p=setTimeout(w,e)),d}return e=o(e)||0,n(r)&&(b=!!r.leading,f=(g="maxWait"in r)?s(o(r.maxWait)||0,e):f,y="trailing"in r?!!r.trailing:y),$.cancel=function(){void 0!==p&&clearTimeout(p),v=0,u=h=l=p=void 0},$.flush=function(){return void 0===p?d:x(i())},$}},function(t,e,r){r(2);t.exports=function(t){"use strict";t=t||{};return'<div class="bmdb-category"><ul></ul></div>','<div class="bmdb-category"><ul></ul></div>'}},function(t,e,r){var n=r(2);t.exports=function(t){"use strict";t=t||{};var e="",r=n.$each,i=t.categories,o=(t.$value,t.$index,n.$escape);return r(i,(function(t,r){e+=" <li><a ",t.active&&(e+=' class="bmdb-category-active" '),e+=' href="',e+=o(t.url),e+='" title="',e+=o(t.name),e+='"> ',e+=o(t.name),e+=" </a></li> "})),e}},function(t,e,r){var n=r(2);t.exports=function(t){"use strict";t=t||{};var e="",r=n.$each,i=t.skeletons;t.$value,t.$index;return e+='<div class="bmdb-list"><ul class="bmdb-ul"></ul></div><div class="bmdb-loader"><ul class="bmdb-ul"> ',r(i,(function(t,r){e+=' <li class="bmdb-li"><div class="bmdb-cover"></div><div class="bmdb-title"></div><div class="bmdb-rank"></div></li> '})),e+=" </ul></div>"}},function(t,e,r){var n=r(2);t.exports=function(t){"use strict";t=t||{};var e="",r=n.$each,i=t.data,o=(t.$value,t.$index,n.$escape);t.starValue;return r(i,(function(t,n){e+=' <li class="bmdb-li"><a href="',e+=o(t.doubanUrl),e+='" class="bmdb-link" target="_blank"><div class="bmdb-cover"><img class="bmdb-cover-image" src="',e+=o(t.cover),e+='" alt="',e+=o(t.title),e+='" width="150" height="220"></div><div class="bmdb-info"><div class="bmdb-title">',e+=o(t.title),e+='</div><div class="bmdb-rank"><span class="bmdb-rank-span bmdb-stars"> ',r(t.stars,(function(t,r){e+=" ",e+=t?' <span class="bmdb-star bmdb-star-full"></span> ':' <span class="bmdb-star bmdb-star-gray"></span> ',e+=" "})),e+=' </span><span class="bmdb-rank-span">',e+=o(t.rating),e+="</span></div></div></a></li> "})),e}},function(t,e,r){var n=r(4);t.exports=function(){return n.Date.now()}},function(t,e,r){(function(e){var r="object"==typeof e&&e&&e.Object===Object&&e;t.exports=r}).call(this,r(5))},function(t,e,r){var n=r(3),i=r(15),o=NaN,a=/^\s+|\s+$/g,s=/^[-+]0x[0-9a-f]+$/i,c=/^0b[01]+$/i,u=/^0o[0-7]+$/i,l=parseInt;t.exports=function(t){if("number"==typeof t)return t;if(i(t))return o;if(n(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=n(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(a,"");var r=c.test(t);return r||u.test(t)?l(t.slice(2),r?2:8):s.test(t)?o:+t}},function(t,e,r){var n=r(16),i=r(19),o="[object Symbol]";t.exports=function(t){return"symbol"==typeof t||i(t)&&n(t)==o}},function(t,e,r){var n=r(6),i=r(17),o=r(18),a="[object Null]",s="[object Undefined]",c=n?n.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?s:a:c&&c in Object(t)?i(t):o(t)}},function(t,e,r){var n=r(6),i=Object.prototype,o=i.hasOwnProperty,a=i.toString,s=n?n.toStringTag:void 0;t.exports=function(t){var e=o.call(t,s),r=t[s];try{t[s]=void 0;var n=!0}catch(t){}var i=a.call(t);return n&&(e?t[s]=r:delete t[s]),i}},function(t,e){var r=Object.prototype.toString;t.exports=function(t){return r.call(t)}},function(t,e){t.exports=function(t){return null!=t&&"object"==typeof t}},function(t,e){var r=Object.prototype.hasOwnProperty,n=Object.prototype.toString;t.exports=function(t){if(null==t)return!0;if("boolean"==typeof t)return!1;if("number"==typeof t)return 0===t;if("string"==typeof t)return 0===t.length;if("function"==typeof t)return 0===t.length;if(Array.isArray(t))return 0===t.length;if(t instanceof Error)return""===t.message;if(t.toString==n)switch(t.toString()){case"[object File]":case"[object Map]":case"[object Set]":return 0===t.size;case"[object Object]":for(var e in t)if(r.call(t,e))return!1;return!0}return!1}},function(t,e,r){"use strict";
/*!
 * is-whitespace <https://github.com/jonschlinkert/is-whitespace>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */var n;t.exports=function(t){return"string"==typeof t&&(n||(n=new RegExp('^[\\s\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"]+$'))).test(t)}},function(t,e,r){"use strict";(function(e){
/*! art-template@runtime | https://github.com/aui/art-template */
var r="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==e?e:{},n=Object.create(r),i=/["&'<>]/;n.$escape=function(t){return function(t){var e=""+t,r=i.exec(e);if(!r)return t;var n="",o=void 0,a=void 0,s=void 0;for(o=r.index,a=0;o<e.length;o++){switch(e.charCodeAt(o)){case 34:s="&#34;";break;case 38:s="&#38;";break;case 39:s="&#39;";break;case 60:s="&#60;";break;case 62:s="&#62;";break;default:continue}a!==o&&(n+=e.substring(a,o)),a=o+1,n+=s}return a!==o?n+e.substring(a,o):n}(function t(e){"string"!=typeof e&&(e=null==e?"":"function"==typeof e?t(e.call(e)):JSON.stringify(e));return e}(t))},n.$each=function(t,e){if(Array.isArray(t))for(var r=0,n=t.length;r<n;r++)e(t[r],r);else for(var i in t)e(t[i],i)},t.exports=n}).call(this,r(5))},function(t,e,r){},function(t,e,r){"use strict";r.r(e);var n=r(0),i=r.n(n),o=r(7),a=r.n(o);var s={get:function(t){try{var e=window.localStorage.getItem(t);if(e){var r=JSON.parse(e);if(Array.isArray(r))return r}}catch(t){}return[]},set:function(t,e){try{window.localStorage.setItem(t,JSON.stringify(e))}catch(t){}}},c={API_BASE_URL:"https://bm.weajs.com/api/",DB_BASE_URL:"https://m.douban.com/movie/subject/"},u=r(1),l=r.n(u);var f={param2object:function(t){var e={};if(t=t.replace(/^\?/,""),l()(t))return e;var r=t.split("&");return r.length>0&&r.forEach((function(t){var r=t.split("=");if(r.length>0){var n=r[1];e[r[0]]=l()(n)?"":decodeURIComponent(n)}})),e},object2param:function(t){var e=[],r=Object.keys(t);return r.length>0&&r.forEach((function(r){e.push(r+"="+t[r])})),e.join("&")}};function d(){return(d=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t}).apply(this,arguments)}var p=r(8),h=r.n(p),v=r(9),b=r.n(v),g=function(){function t(t){this.app=t,this.app.showCategories&&(this.apiUrl=this.app.apiUrl+"/categories",this.cacheKey=(this.app.namespace+"_categories").toUpperCase(),this.location=this.parseLocation(),this.app.category=this.location.query[this.cacheKey],this.$container=i()(h()()).prependTo(this.app.$container),this.$list=this.$container.find("ul"),this.getData())}var e=t.prototype;return e.parseLocation=function(){var t=window.location;return{href:t.href,origin:t.origin+t.pathname,query:this.app.urlParam.param2object(t.search)}},e.getData=function(){var t=this,e=this.cache;if(e){var r=this.app.store.get(this.cacheKey);this.render(r)}i.a.ajax({url:this.apiUrl,data:{secret:this.app.secret},dataType:"json",success:function(r){e&&t.app.store.set(t.cacheKey,r),t.render(r)},error:function(t){console.error("[BMDB]",t)}})},e.render=function(t){var e=this,r={name:"全部",url:this.getCategoryUrl(""),active:l()(this.app.category)};this.$list.append(b()({categories:[r].concat((l()(this.app.categoryFilters)?t:this.app.categoryFilters.filter((function(e){return t.includes(e)}))).map((function(t){var r=e.getCategoryUrl(t);return{name:t,active:t===e.app.category,url:r}})))}))},e.getCategoryUrl=function(t){var e,r=this.location,n=r.origin,i=r.query;return n+"?"+this.app.urlParam.object2param(d({},i,((e={})[this.cacheKey]=encodeURIComponent(t),e)))},t}(),y=function(t){new g(t)},m=r(10),j=r.n(m),w=r(11),x=r.n(w),$=function(){function t(t){var e=t.type,r=t.selector,n=t.secret,o=t.limit,a=t.showCategories,u=t.categoryFilters,l=t.skeletonNum,d=t.noMoreText,p=t.cache,h=t.darkMode;this.apiUrl=""+c.API_BASE_URL+(e||"movies"),this.noMoreText=d||"",this.skeletonNum=l||5,this.page=1,this.secret=n,this.limit=o||30,this.isLoading=!1,this.category=void 0,this.categoryFilters=u||[],this.showCategories="movies"===e&&!!a,this.cache=void 0===p||!!p,this.namespace=("bmdb_"+e).toUpperCase(),this.cacheKey=null,this.darkMode=void 0===h||!!h,this.store=s,this.urlParam=f,this.$container=i()(r),this.$window=i()(window),this.setViews(),this.addPlugin(y),this.getData(),this.bindScrollEvent()}var e=t.prototype;return e.setViews=function(){this.$container.append(j()({darkMode:this.darkMode,skeletons:Array.from({length:this.skeletonNum})})),this.darkMode&&this.$container.addClass("bmdb-dark-mode"),this.$list=this.$container.find(".bmdb-list .bmdb-ul"),this.$loader=this.$container.find(".bmdb-loader")},e.bindScrollEvent=function(){var t=this;this.scrollFn=a()((function(){t.onScroll()}),16),this.$window.on("scroll",this.scrollFn)},e.onScroll=function(){this.$window.scrollTop()+this.$window.height()+100>this.$loader.offset().top&&this.getData()},e.getData=function(){var t=this;if(!this.isLoading){this.isLoading=!0;var e=this.cache&&1===this.page;if(e){this.cacheKey=this.category?this.namespace+":"+this.category:this.namespace;var r=this.store.get(this.cacheKey);this.render(r)}var n={page:this.page,limit:this.limit,secret:this.secret};this.category&&(n.category=this.category),i.a.ajax({url:this.apiUrl,data:n,dataType:"json",success:function(r){r.length<t.limit&&(t.setNoMoreDataView(),t.offScrollEvent()),e&&(t.$list.html(""),t.store.set(t.cacheKey,r)),t.render(r),t.page+=1,t.isLoading=!1},error:function(e){t.isLoading=!1,console.error("[BMDB]",e)}})}},e.render=function(t){t.length>0&&(t=t.map((function(t){var e=Math.round(t.rating/2);return t.doubanUrl=""+c.DB_BASE_URL+t.doubanId,t.stars=Array.from({length:5}).map((function(t,r){return r+1<=e})),t.rating=t.rating.includes(".")?t.rating:t.rating+".0",t})),this.$list.append(x()({data:t})))},e.setNoMoreDataView=function(){this.$loader.text(this.noMoreText)},e.offScrollEvent=function(){this.$window.off("scroll",this.scrollFn)},e.addPlugin=function(t){t(this)},t}();r(23),e.default=$}]).default}));
});
(function(window,document,$,undefined){"use strict";window.console=window.console||{info:function(stuff){}};if(!$){return;}
if($.fn.fancyboxforwp){console.info("fancyBox already initialized");return;}
var defaults={closeExisting:false,loop:false,gutter:50,keyboard:true,preventCaptionOverlap:true,arrows:true,infobar:true,smallBtn:"auto",toolbar:"auto",buttons:["zoom","slideShow","thumbs","close"],idleTime:3,protect:false,modal:false,image:{preload:false},ajax:{settings:{data:{fancybox:true}}},iframe:{tpl:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen allow="autoplay; fullscreen" src=""></iframe>',preload:true,css:{},attr:{scrolling:"auto"}},video:{tpl:'<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}">'+'<source src="{{src}}" type="{{format}}" />'+'Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!'+"</video>",format:"",autoStart:true},defaultType:"image",animationEffect:"zoom",animationDuration:366,zoomOpacity:"auto",transitionEffect:"fade",transitionDuration:366,slideClass:"",baseClass:"",baseTpl:'<div class="fancybox-container" role="dialog" tabindex="-1">'+'<div class="fancybox-bg"></div>'+'<div class="fancybox-inner">'+'<div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div>'+'<div class="fancybox-toolbar">{{buttons}}</div>'+'<div class="fancybox-navigation">{{arrows}}</div>'+'<div class="fancybox-stage"></div>'+'<div class="fancybox-caption"></div>'+"</div>"+"</div>",spinnerTpl:'<div class="fancybox-loading"></div>',errorTpl:'<div class="fancybox-error"><p>{{ERROR}}</p></div>',btnTpl:{download:'<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;">'+'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg>'+"</a>",zoom:'<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}">'+'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg>'+"</button>",close:'<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">'+'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg>'+"</button>",arrowLeft:'<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">'+'<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div>'+"</button>",arrowRight:'<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">'+'<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div>'+"</button>",smallBtn:'<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}">'+'<svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg>'+"</button>"},parentEl:"body",hideScrollbar:true,autoFocus:true,backFocus:true,trapFocus:true,fullScreen:{autoStart:false},touch:{vertical:true,momentum:true},hash:null,media:{},slideShow:{autoStart:false,speed:3000},thumbs:{autoStart:false,hideOnClose:true,parentEl:".fancybox-container",axis:"y"},wheel:"auto",onInit:$.noop,beforeLoad:$.noop,afterLoad:$.noop,beforeShow:$.noop,afterShow:$.noop,beforeClose:$.noop,afterClose:$.noop,onActivate:$.noop,onDeactivate:$.noop,clickContent:function(current,event){return current.type==="image"?"zoom":false;},clickSlide:"close",clickOutside:"close",dblclickContent:false,dblclickSlide:false,dblclickOutside:false,mobile:{preventCaptionOverlap:false,idleTime:false,clickContent:function(current,event){return current.type==="image"?"toggleControls":false;},clickSlide:function(current,event){return current.type==="image"?"toggleControls":"close";},dblclickContent:function(current,event){return current.type==="image"?"zoom":false;},dblclickSlide:function(current,event){return current.type==="image"?"zoom":false;}},lang:"en",i18n:{en:{CLOSE:"Close",NEXT:"Next",PREV:"Previous",ERROR:"The requested content cannot be loaded. <br/> Please try again later.",PLAY_START:"Start slideshow",PLAY_STOP:"Pause slideshow",FULL_SCREEN:"Full screen",THUMBS:"Thumbnails",DOWNLOAD:"Download",SHARE:"Share",ZOOM:"Zoom"},de:{CLOSE:"Schliessen",NEXT:"Weiter",PREV:"Zurück",ERROR:"Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.",PLAY_START:"Diaschau starten",PLAY_STOP:"Diaschau beenden",FULL_SCREEN:"Vollbild",THUMBS:"Vorschaubilder",DOWNLOAD:"Herunterladen",SHARE:"Teilen",ZOOM:"Maßstab"}}};var $W=$(window);var $D=$(document);var called=0;var isQuery=function(obj){return obj&&obj.hasOwnProperty&&obj instanceof $;};var requestAFrame=(function(){return(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||function(callback){return window.setTimeout(callback,1000/60);});})();var cancelAFrame=(function(){return(window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||function(id){window.clearTimeout(id);});})();var transitionEnd=(function(){var el=document.createElement("fakeelement"),t;var transitions={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(t in transitions){if(el.style[t]!==undefined){return transitions[t];}}
return"transitionend";})();var forceRedraw=function($el){return $el&&$el.length&&$el[0].offsetHeight;};var mergeOpts=function(opts1,opts2){var rez=$.extend(true,{},opts1,opts2);$.each(opts2,function(key,value){if($.isArray(value)){rez[key]=value;}});return rez;};var inViewport=function(elem){var elemCenter,rez;if(!elem||elem.ownerDocument!==document){return false;}
$(".fancybox-container").css("pointer-events","none");elemCenter={x:elem.getBoundingClientRect().left+elem.offsetWidth/2,y:elem.getBoundingClientRect().top+elem.offsetHeight/2};rez=document.elementFromPoint(elemCenter.x,elemCenter.y)===elem;$(".fancybox-container").css("pointer-events","");return rez;};var FancyBox=function(content,opts,index){var self=this;self.opts=mergeOpts({index:index},$.fancyboxforwp.defaults);if($.isPlainObject(opts)){self.opts=mergeOpts(self.opts,opts);}
if($.fancyboxforwp.isMobile){self.opts=mergeOpts(self.opts,self.opts.mobile);}
self.id=self.opts.id||++called;self.currIndex=parseInt(self.opts.index,10)||0;self.prevIndex=null;self.prevPos=null;self.currPos=0;self.firstRun=true;self.group=[];self.slides={};self.addContent(content);if(!self.group.length){return;}
self.init();};$.extend(FancyBox.prototype,{init:function(){var self=this,firstItem=self.group[self.currIndex],firstItemOpts=firstItem.opts,$container,buttonStr;if(firstItemOpts.closeExisting){$.fancyboxforwp.close(true);}
$("body").addClass("fancybox-active");if(!$.fancyboxforwp.getInstance()&&firstItemOpts.hideScrollbar!==false&&!$.fancyboxforwp.isMobile&&document.body.scrollHeight>window.innerHeight){$("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:'+
(window.innerWidth-document.documentElement.clientWidth)+"px;}</style>");$("body").addClass("compensate-for-scrollbar");}
buttonStr="";$.each(firstItemOpts.buttons,function(index,value){buttonStr+=firstItemOpts.btnTpl[value]||"";});$container=$(self.translate(self,firstItemOpts.baseTpl.replace("{{buttons}}",buttonStr).replace("{{arrows}}",firstItemOpts.btnTpl.arrowLeft+firstItemOpts.btnTpl.arrowRight))).attr("id","fancybox-container-"+self.id).addClass(firstItemOpts.baseClass).data("FancyBox",self).appendTo(firstItemOpts.parentEl);self.$refs={container:$container};["bg","inner","infobar","toolbar","stage","caption","navigation"].forEach(function(item){self.$refs[item]=$container.find(".fancybox-"+item);});self.trigger("onInit");self.activate();self.jumpTo(self.currIndex);},translate:function(obj,str){var arr=obj.opts.i18n[obj.opts.lang];return str.replace(/\{\{(\w+)\}\}/g,function(match,n){var value=arr[n];if(value===undefined){return match;}
return value;});},addContent:function(content){var self=this,items=$.makeArray(content),thumbs;$.each(items,function(i,item){var obj={},opts={},$item,type,found,src,srcParts;if($.isPlainObject(item)){obj=item;opts=item.opts||item;}else if($.type(item)==="object"&&$(item).length){$item=$(item);opts=$item.data()||{};opts=$.extend(true,{},opts,opts.options);opts.$orig=$item;obj.src=self.opts.src||opts.src||$item.attr("href");if(!obj.type&&!obj.src){obj.type="inline";obj.src=item;}}else{obj={type:"html",src:item+""};}
obj.opts=$.extend(true,{},self.opts,opts);if($.isArray(opts.buttons)){obj.opts.buttons=opts.buttons;}
if($.fancyboxforwp.isMobile&&obj.opts.mobile){obj.opts=mergeOpts(obj.opts,obj.opts.mobile);}
type=obj.type||obj.opts.type;src=obj.src||"";if(!type&&src){if((found=src.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i))){type="video";if(!obj.opts.video.format){obj.opts.video.format="video/"+(found[1]==="ogv"?"ogg":found[1]);}}else if(src.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)){type="image";}else if(src.match(/\.(pdf)((\?|#).*)?$/i)){type="iframe";}else if(src.charAt(0)==="#"){type="inline";}}
if(type){obj.type=type;}else{self.trigger("objectNeedsType",obj);}
if(!obj.contentType){obj.contentType=$.inArray(obj.type,["html","inline","ajax"])>-1?"html":obj.type;}
obj.index=self.group.length;if(obj.opts.smallBtn=="auto"){obj.opts.smallBtn=$.inArray(obj.type,["html","inline","ajax"])>-1;}
if(obj.opts.toolbar==="auto"){obj.opts.toolbar=!obj.opts.smallBtn;}
obj.$thumb=obj.opts.$thumb||null;if(obj.opts.$trigger&&obj.index===self.opts.index){obj.$thumb=obj.opts.$trigger.find("img:first");if(obj.$thumb.length){obj.opts.$orig=obj.opts.$trigger;}}
if(!(obj.$thumb&&obj.$thumb.length)&&obj.opts.$orig){obj.$thumb=obj.opts.$orig.find("img:first");}
if(obj.$thumb&&!obj.$thumb.length){obj.$thumb=null;}
obj.thumb=obj.opts.thumb||(obj.$thumb?obj.$thumb[0].src:null);if($.type(obj.opts.caption)==="function"){obj.opts.caption=obj.opts.caption.apply(item,[self,obj]);}
if($.type(self.opts.caption)==="function"){obj.opts.caption=self.opts.caption.apply(item,[self,obj]);}
if(!(obj.opts.caption instanceof $)){obj.opts.caption=obj.opts.caption===undefined?"":obj.opts.caption+"";}
if(obj.type==="ajax"){srcParts=src.split(/\s+/,2);if(srcParts.length>1){obj.src=srcParts.shift();obj.opts.filter=srcParts.shift();}}
if(obj.opts.modal){obj.opts=$.extend(true,obj.opts,{trapFocus:true,infobar:0,toolbar:0,smallBtn:0,keyboard:0,slideShow:0,fullScreen:0,thumbs:0,touch:0,clickContent:false,clickSlide:false,clickOutside:false,dblclickContent:false,dblclickSlide:false,dblclickOutside:false});}
self.group.push(obj);});if(Object.keys(self.slides).length){self.updateControls();thumbs=self.Thumbs;if(thumbs&&thumbs.isActive){thumbs.create();thumbs.focus();}}},addEvents:function(){var self=this;self.removeEvents();self.$refs.container.on("click.fb-close","[data-fancybox-close]",function(e){e.stopPropagation();e.preventDefault();self.close(e);}).on("touchstart.fb-prev click.fb-prev","[data-fancybox-prev]",function(e){e.stopPropagation();e.preventDefault();self.previous();}).on("touchstart.fb-next click.fb-next","[data-fancybox-next]",function(e){e.stopPropagation();e.preventDefault();self.next();}).on("click.fb","[data-fancybox-zoom]",function(e){self[self.isScaledDown()?"scaleToActual":"scaleToFit"]();});$W.on("orientationchange.fb resize.fb",function(e){if(e&&e.originalEvent&&e.originalEvent.type==="resize"){if(self.requestId){cancelAFrame(self.requestId);}
self.requestId=requestAFrame(function(){self.update(e);});}else{if(self.current&&self.current.type==="iframe"){self.$refs.stage.hide();}
setTimeout(function(){self.$refs.stage.show();self.update(e);},$.fancyboxforwp.isMobile?600:250);}});$D.on("keydown.fb",function(e){var instance=$.fancyboxforwp?$.fancyboxforwp.getInstance():null,current=instance.current,keycode=e.keyCode||e.which;if(keycode==9){if(current.opts.trapFocus){self.focus(e);}
return;}
if(!current.opts.keyboard||e.ctrlKey||e.altKey||e.shiftKey||$(e.target).is("input")||$(e.target).is("textarea")){return;}
if(keycode===8||keycode===27){e.preventDefault();self.close(e);return;}
if(keycode===37||keycode===38){e.preventDefault();self.previous();return;}
if(keycode===39||keycode===40){e.preventDefault();self.next();return;}
self.trigger("afterKeydown",e,keycode);});if(self.group[self.currIndex].opts.idleTime){self.idleSecondsCounter=0;$D.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle",function(e){self.idleSecondsCounter=0;if(self.isIdle){self.showControls();}
self.isIdle=false;});self.idleInterval=window.setInterval(function(){self.idleSecondsCounter++;if(self.idleSecondsCounter>=self.group[self.currIndex].opts.idleTime&&!self.isDragging){self.isIdle=true;self.idleSecondsCounter=0;self.hideControls();}},1000);}},removeEvents:function(){var self=this;$W.off("orientationchange.fb resize.fb");$D.off("keydown.fb .fb-idle");this.$refs.container.off(".fb-close .fb-prev .fb-next");if(self.idleInterval){window.clearInterval(self.idleInterval);self.idleInterval=null;}},previous:function(duration){return this.jumpTo(this.currPos-1,duration);},next:function(duration){return this.jumpTo(this.currPos+1,duration);},jumpTo:function(pos,duration){var self=this,groupLen=self.group.length,firstRun,isMoved,loop,current,previous,slidePos,stagePos,prop,diff;if(self.isDragging||self.isClosing||(self.isAnimating&&self.firstRun)){return;}
pos=parseInt(pos,10);loop=self.current?self.current.opts.loop:self.opts.loop;if(!loop&&(pos<0||pos>=groupLen)){return false;}
firstRun=self.firstRun=!Object.keys(self.slides).length;previous=self.current;self.prevIndex=self.currIndex;self.prevPos=self.currPos;current=self.createSlide(pos);if(groupLen>1){if(loop||current.index<groupLen-1){self.createSlide(pos+1);}
if(loop||current.index>0){self.createSlide(pos-1);}}
self.current=current;self.currIndex=current.index;self.currPos=current.pos;self.trigger("beforeShow",firstRun);self.updateControls();current.forcedDuration=undefined;if($.isNumeric(duration)){current.forcedDuration=duration;}else{duration=current.opts[firstRun?"animationDuration":"transitionDuration"];}
duration=parseInt(duration,10);isMoved=self.isMoved(current);current.$slide.addClass("fancybox-slide--current");if(firstRun){if(current.opts.animationEffect&&duration){self.$refs.container.css("transition-duration",duration+"ms");}
self.$refs.container.addClass("fancybox-is-open").trigger("focus");self.loadSlide(current);self.preload("image");return;}
slidePos=$.fancyboxforwp.getTranslate(previous.$slide);stagePos=$.fancyboxforwp.getTranslate(self.$refs.stage);$.each(self.slides,function(index,slide){$.fancyboxforwp.stop(slide.$slide,true);});if(previous.pos!==current.pos){previous.isComplete=false;}
previous.$slide.removeClass("fancybox-slide--complete fancybox-slide--current");if(isMoved){diff=slidePos.left-(previous.pos*slidePos.width+previous.pos*previous.opts.gutter);$.each(self.slides,function(index,slide){slide.$slide.removeClass("fancybox-animated").removeClass(function(index,className){return(className.match(/(^|\s)fancybox-fx-\S+/g)||[]).join(" ");});var leftPos=slide.pos*slidePos.width+slide.pos*slide.opts.gutter;$.fancyboxforwp.setTranslate(slide.$slide,{top:0,left:leftPos-stagePos.left+diff});if(slide.pos!==current.pos){slide.$slide.addClass("fancybox-slide--"+(slide.pos>current.pos?"next":"previous"));}
forceRedraw(slide.$slide);$.fancyboxforwp.animate(slide.$slide,{top:0,left:(slide.pos-current.pos)*slidePos.width+(slide.pos-current.pos)*slide.opts.gutter},duration,function(){slide.$slide.css({transform:"",opacity:""}).removeClass("fancybox-slide--next fancybox-slide--previous");if(slide.pos===self.currPos){self.complete();}});});}else if(duration&&current.opts.transitionEffect){prop="fancybox-animated fancybox-fx-"+current.opts.transitionEffect;previous.$slide.addClass("fancybox-slide--"+(previous.pos>current.pos?"next":"previous"));$.fancyboxforwp.animate(previous.$slide,prop,duration,function(){previous.$slide.removeClass(prop).removeClass("fancybox-slide--next fancybox-slide--previous");},false);}
if(current.isLoaded){self.revealContent(current);}else{self.loadSlide(current);}
self.preload("image");},createSlide:function(pos){var self=this,$slide,index;index=pos%self.group.length;index=index<0?self.group.length+index:index;if(!self.slides[pos]&&self.group[index]){$slide=$('<div class="fancybox-slide"></div>').appendTo(self.$refs.stage);self.slides[pos]=$.extend(true,{},self.group[index],{pos:pos,$slide:$slide,isLoaded:false});self.updateSlide(self.slides[pos]);}
return self.slides[pos];},scaleToActual:function(x,y,duration){var self=this,current=self.current,$content=current.$content,canvasWidth=$.fancyboxforwp.getTranslate(current.$slide).width,canvasHeight=$.fancyboxforwp.getTranslate(current.$slide).height,newImgWidth=current.width,newImgHeight=current.height,imgPos,posX,posY,scaleX,scaleY;if(self.isAnimating||self.isMoved()||!$content||!(current.type=="image"&&current.isLoaded&&!current.hasError)){return;}
self.isAnimating=true;$.fancyboxforwp.stop($content);x=x===undefined?canvasWidth*0.5:x;y=y===undefined?canvasHeight*0.5:y;imgPos=$.fancyboxforwp.getTranslate($content);imgPos.top-=$.fancyboxforwp.getTranslate(current.$slide).top;imgPos.left-=$.fancyboxforwp.getTranslate(current.$slide).left;scaleX=newImgWidth/imgPos.width;scaleY=newImgHeight/imgPos.height;posX=canvasWidth*0.5-newImgWidth*0.5;posY=canvasHeight*0.5-newImgHeight*0.5;if(newImgWidth>canvasWidth){posX=imgPos.left*scaleX-(x*scaleX-x);if(posX>0){posX=0;}
if(posX<canvasWidth-newImgWidth){posX=canvasWidth-newImgWidth;}}
if(newImgHeight>canvasHeight){posY=imgPos.top*scaleY-(y*scaleY-y);if(posY>0){posY=0;}
if(posY<canvasHeight-newImgHeight){posY=canvasHeight-newImgHeight;}}
self.updateCursor(newImgWidth,newImgHeight);$.fancyboxforwp.animate($content,{top:posY,left:posX,scaleX:scaleX,scaleY:scaleY},duration||330,function(){self.isAnimating=false;});if(self.SlideShow&&self.SlideShow.isActive){self.SlideShow.stop();}},scaleToFit:function(duration){var self=this,current=self.current,$content=current.$content,end;if(self.isAnimating||self.isMoved()||!$content||!(current.type=="image"&&current.isLoaded&&!current.hasError)){return;}
self.isAnimating=true;$.fancyboxforwp.stop($content);end=self.getFitPos(current);self.updateCursor(end.width,end.height);$.fancyboxforwp.animate($content,{top:end.top,left:end.left,scaleX:end.width/$content.width(),scaleY:end.height/$content.height()},duration||330,function(){self.isAnimating=false;});},getFitPos:function(slide){var self=this,$content=slide.$content,$slide=slide.$slide,width=slide.width||slide.opts.width,height=slide.height||slide.opts.height,maxWidth,maxHeight,minRatio,aspectRatio,rez={};if(!slide.isLoaded||!$content||!$content.length){return false;}
maxWidth=$.fancyboxforwp.getTranslate(self.$refs.stage).width;maxHeight=$.fancyboxforwp.getTranslate(self.$refs.stage).height;maxWidth-=parseFloat($slide.css("paddingLeft"))+
parseFloat($slide.css("paddingRight"))+
parseFloat($content.css("marginLeft"))+
parseFloat($content.css("marginRight"));maxHeight-=parseFloat($slide.css("paddingTop"))+
parseFloat($slide.css("paddingBottom"))+
parseFloat($content.css("marginTop"))+
parseFloat($content.css("marginBottom"));if(!width||!height){width=maxWidth;height=maxHeight;}
minRatio=Math.min(1,maxWidth/width,maxHeight/height);width=minRatio*width;height=minRatio*height;if(width>maxWidth-0.5){width=maxWidth;}
if(height>maxHeight-0.5){height=maxHeight;}
if(slide.type==="image"){rez.top=Math.floor((maxHeight-height)*0.5)+parseFloat($slide.css("paddingTop"));rez.left=Math.floor((maxWidth-width)*0.5)+parseFloat($slide.css("paddingLeft"));}else if(slide.contentType==="video"){aspectRatio=slide.opts.width&&slide.opts.height?width/height:slide.opts.ratio||16/9;if(height>width/aspectRatio){height=width/aspectRatio;}else if(width>height*aspectRatio){width=height*aspectRatio;}}
rez.width=width;rez.height=height;return rez;},update:function(e){var self=this;$.each(self.slides,function(key,slide){self.updateSlide(slide,e);});},updateSlide:function(slide,e){var self=this,$content=slide&&slide.$content,width=slide.width||slide.opts.width,height=slide.height||slide.opts.height,$slide=slide.$slide;self.adjustCaption(slide);if($content&&(width||height||slide.contentType==="video")&&!slide.hasError){$.fancyboxforwp.stop($content);$.fancyboxforwp.setTranslate($content,self.getFitPos(slide));if(slide.pos===self.currPos){self.isAnimating=false;self.updateCursor();}}
self.adjustLayout(slide);if($slide.length){$slide.trigger("refresh");if(slide.pos===self.currPos){self.$refs.toolbar.add(self.$refs.navigation.find(".fancybox-button--arrow_right")).toggleClass("compensate-for-scrollbar",$slide.get(0).scrollHeight>$slide.get(0).clientHeight);}}
self.trigger("onUpdate",slide,e);},centerSlide:function(duration){var self=this,current=self.current,$slide=current.$slide;if(self.isClosing||!current){return;}
$slide.siblings().css({transform:"",opacity:""});$slide.parent().children().removeClass("fancybox-slide--previous fancybox-slide--next");$.fancyboxforwp.animate($slide,{top:0,left:0,opacity:1},duration===undefined?0:duration,function(){$slide.css({transform:"",opacity:""});if(!current.isComplete){self.complete();}},false);},isMoved:function(slide){var current=slide||this.current,slidePos,stagePos;if(!current){return false;}
stagePos=$.fancyboxforwp.getTranslate(this.$refs.stage);slidePos=$.fancyboxforwp.getTranslate(current.$slide);return(!current.$slide.hasClass("fancybox-animated")&&(Math.abs(slidePos.top-stagePos.top)>0.5||Math.abs(slidePos.left-stagePos.left)>0.5));},updateCursor:function(nextWidth,nextHeight){var self=this,current=self.current,$container=self.$refs.container,canPan,isZoomable;if(!current||self.isClosing||!self.Guestures){return;}
$container.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-zoomOut fancybox-can-swipe fancybox-can-pan");canPan=self.canPan(nextWidth,nextHeight);isZoomable=canPan?true:self.isZoomable();$container.toggleClass("fancybox-is-zoomable",isZoomable);$("[data-fancybox-zoom]").prop("disabled",!isZoomable);if(canPan){$container.addClass("fancybox-can-pan");}else if(isZoomable&&(current.opts.clickContent==="zoom"||($.isFunction(current.opts.clickContent)&&current.opts.clickContent(current)=="zoom"))){$container.addClass("fancybox-can-zoomIn");}else if(current.opts.touch&&(current.opts.touch.vertical||self.group.length>1)&&current.contentType!=="video"){$container.addClass("fancybox-can-swipe");}},isZoomable:function(){var self=this,current=self.current,fitPos;if(current&&!self.isClosing&&current.type==="image"&&!current.hasError){if(!current.isLoaded){return true;}
fitPos=self.getFitPos(current);if(fitPos&&(current.width>fitPos.width||current.height>fitPos.height)){return true;}}
return false;},isScaledDown:function(nextWidth,nextHeight){var self=this,rez=false,current=self.current,$content=current.$content;if(nextWidth!==undefined&&nextHeight!==undefined){rez=nextWidth<current.width&&nextHeight<current.height;}else if($content){rez=$.fancyboxforwp.getTranslate($content);rez=rez.width<current.width&&rez.height<current.height;}
return rez;},canPan:function(nextWidth,nextHeight){var self=this,current=self.current,pos=null,rez=false;if(current.type==="image"&&(current.isComplete||(nextWidth&&nextHeight))&&!current.hasError){rez=self.getFitPos(current);if(nextWidth!==undefined&&nextHeight!==undefined){pos={width:nextWidth,height:nextHeight};}else if(current.isComplete){pos=$.fancyboxforwp.getTranslate(current.$content);}
if(pos&&rez){rez=Math.abs(pos.width-rez.width)>1.5||Math.abs(pos.height-rez.height)>1.5;}}
return rez;},loadSlide:function(slide){var self=this,type,$slide,ajaxLoad;if(slide.isLoading||slide.isLoaded){return;}
slide.isLoading=true;if(self.trigger("beforeLoad",slide)===false){slide.isLoading=false;return false;}
type=slide.type;$slide=slide.$slide;$slide.off("refresh").trigger("onReset").addClass(slide.opts.slideClass);switch(type){case"image":self.setImage(slide);break;case"iframe":self.setIframe(slide);break;case"html":self.setContent(slide,slide.src||slide.content);break;case"video":self.setContent(slide,slide.opts.video.tpl.replace(/\{\{src\}\}/gi,slide.src).replace("{{format}}",slide.opts.videoFormat||slide.opts.video.format||"").replace("{{poster}}",slide.thumb||""));break;case"inline":if($(slide.src).length){self.setContent(slide,$(slide.src));}else{self.setError(slide);}
break;case"ajax":self.showLoading(slide);ajaxLoad=$.ajax($.extend({},slide.opts.ajax.settings,{url:slide.src,success:function(data,textStatus){if(textStatus==="success"){self.setContent(slide,data);}},error:function(jqXHR,textStatus){if(jqXHR&&textStatus!=="abort"){self.setError(slide);}}}));$slide.one("onReset",function(){ajaxLoad.abort();});break;default:self.setError(slide);break;}
return true;},setImage:function(slide){var self=this,ghost;requestAFrame(function(){requestAFrame(function(){var $img=slide.$image;if(!self.isClosing&&slide.isLoading&&(!$img||!$img.length||!$img[0].complete)&&!slide.hasError){self.showLoading(slide);}});});self.checkSrcset(slide);slide.$content=$('<div class="fancybox-content"></div>').addClass("fancybox-is-hidden").appendTo(slide.$slide.addClass("fancybox-slide--image"));if(slide.opts.preload!==false&&slide.opts.width&&slide.opts.height&&slide.thumb){slide.width=slide.opts.width;slide.height=slide.opts.height;ghost=document.createElement("img");ghost.onerror=function(){$(this).remove();slide.$ghost=null;};ghost.onload=function(){self.afterLoad(slide);};slide.$ghost=$(ghost).addClass("fancybox-image").appendTo(slide.$content).attr("src",slide.thumb);}
self.setBigImage(slide);},checkSrcset:function(slide){var srcset=slide.opts.srcset||slide.opts.image.srcset,found,temp,pxRatio,windowWidth;if(srcset){pxRatio=window.devicePixelRatio||1;windowWidth=window.innerWidth*pxRatio;temp=srcset.split(",").map(function(el){var ret={};el.trim().split(/\s+/).forEach(function(el,i){var value=parseInt(el.substring(0,el.length-1),10);if(i===0){return(ret.url=el);}
if(value){ret.value=value;ret.postfix=el[el.length-1];}});return ret;});temp.sort(function(a,b){return a.value-b.value;});for(var j=0;j<temp.length;j++){var el=temp[j];if((el.postfix==="w"&&el.value>=windowWidth)||(el.postfix==="x"&&el.value>=pxRatio)){found=el;break;}}
if(!found&&temp.length){found=temp[temp.length-1];}
if(found){slide.src=found.url;if(slide.width&&slide.height&&found.postfix=="w"){slide.height=(slide.width/slide.height)*found.value;slide.width=found.value;}
slide.opts.srcset=srcset;}}},setBigImage:function(slide){var self=this,img=document.createElement("img"),$img=$(img);slide.$image=$img.one("error",function(){self.setError(slide);}).one("load",function(){var sizes;if(!slide.$ghost){self.resolveImageSlideSize(slide,this.naturalWidth,this.naturalHeight);self.afterLoad(slide);}
if(self.isClosing){return;}
if(slide.opts.srcset){sizes=slide.opts.sizes;if(!sizes||sizes==="auto"){sizes=(slide.width/slide.height>1&&$W.width()/$W.height()>1?"100":Math.round((slide.width/slide.height)*100))+"vw";}
$img.attr("sizes",sizes).attr("srcset",slide.opts.srcset);}
if(slide.$ghost){setTimeout(function(){if(slide.$ghost&&!self.isClosing){slide.$ghost.hide();}},Math.min(300,Math.max(1000,slide.height/1600)));}
self.hideLoading(slide);}).addClass("fancybox-image").attr("src",slide.src).appendTo(slide.$content);if((img.complete||img.readyState=="complete")&&$img.naturalWidth&&$img.naturalHeight){$img.trigger("load");}else if(img.error){$img.trigger("error");}},resolveImageSlideSize:function(slide,imgWidth,imgHeight){var maxWidth=parseInt(slide.opts.width,10),maxHeight=parseInt(slide.opts.height,10);slide.width=imgWidth;slide.height=imgHeight;if(maxWidth>0){slide.width=maxWidth;slide.height=Math.floor((maxWidth*imgHeight)/imgWidth);}
if(maxHeight>0){slide.width=Math.floor((maxHeight*imgWidth)/imgHeight);slide.height=maxHeight;}},setIframe:function(slide){var self=this,opts=slide.opts.iframe,$slide=slide.$slide,$iframe;if($.fancyboxforwp.isMobile){opts.css.overflow="scroll";}
slide.$content=$('<div class="fancybox-content'+(opts.preload?" fancybox-is-hidden":"")+'"></div>').css(opts.css).appendTo($slide);$slide.addClass("fancybox-slide--"+slide.contentType);slide.$iframe=$iframe=$(opts.tpl.replace(/\{rnd\}/g,new Date().getTime())).attr(opts.attr).appendTo(slide.$content);if(opts.preload){self.showLoading(slide);$iframe.on("load.fb error.fb",function(e){this.isReady=1;slide.$slide.trigger("refresh");self.afterLoad(slide);});$slide.on("refresh.fb",function(){var $content=slide.$content,frameWidth=opts.css.width,frameHeight=opts.css.height,$contents,$body;if($iframe[0].isReady!==1){return;}
try{$contents=$iframe.contents();$body=$contents.find("body");}catch(ignore){}
if($body&&$body.length&&$body.children().length){$slide.css("overflow","visible");$content.css({width:"100%","max-width":"100%",height:"9999px"});if(frameWidth===undefined){frameWidth=Math.ceil(Math.max($body[0].clientWidth,$body.outerWidth(true)));}
$content.css("width",frameWidth?frameWidth:"").css("max-width","");if(frameHeight===undefined){frameHeight=Math.ceil(Math.max($body[0].clientHeight,$body.outerHeight(true)));}
$content.css("height",frameHeight?frameHeight:"");$slide.css("overflow","auto");}
$content.removeClass("fancybox-is-hidden");});}else{self.afterLoad(slide);}
$iframe.attr("src",slide.src);$slide.one("onReset",function(){try{$(this).find("iframe").hide().unbind().attr("src","//about:blank");}catch(ignore){}
$(this).off("refresh.fb").empty();slide.isLoaded=false;slide.isRevealed=false;});},setContent:function(slide,content){var self=this;if(self.isClosing){return;}
self.hideLoading(slide);if(slide.$content){$.fancyboxforwp.stop(slide.$content);}
slide.$slide.empty();if(isQuery(content)&&content.parent().length){if(content.hasClass("fancybox-content")){content.parent(".fancybox-slide--html").trigger("onReset");}
slide.$placeholder=$("<div>").hide().insertAfter(content);content.css("display","inline-block");}else if(!slide.hasError){if($.type(content)==="string"){content=$("<div>").append($.trim(content)).contents();}
if(slide.opts.filter){content=$("<div>").html(content).find(slide.opts.filter);}}
slide.$slide.one("onReset",function(){$(this).find("video,audio").trigger("pause");if(slide.$placeholder){slide.$placeholder.after(content.removeClass("fancybox-content").hide()).remove();slide.$placeholder=null;}
if(slide.$smallBtn){slide.$smallBtn.remove();slide.$smallBtn=null;}
if(!slide.hasError){$(this).empty();slide.isLoaded=false;slide.isRevealed=false;}});$(content).appendTo(slide.$slide);if($(content).is("video,audio")){$(content).addClass("fancybox-video");$(content).wrap("<div></div>");slide.contentType="video";slide.opts.width=slide.opts.width||$(content).attr("width");slide.opts.height=slide.opts.height||$(content).attr("height");}
slide.$content=slide.$slide.children().filter("div,form,main,video,audio,article,.fancybox-content").first();slide.$content.siblings().hide();if(!slide.$content.length){slide.$content=slide.$slide.wrapInner("<div></div>").children().first();}
slide.$content.addClass("fancybox-content");slide.$slide.addClass("fancybox-slide--"+slide.contentType);self.afterLoad(slide);},setError:function(slide){slide.hasError=true;slide.$slide.trigger("onReset").removeClass("fancybox-slide--"+slide.contentType).addClass("fancybox-slide--error");slide.contentType="html";this.setContent(slide,this.translate(slide,slide.opts.errorTpl));if(slide.pos===this.currPos){this.isAnimating=false;}},showLoading:function(slide){var self=this;slide=slide||self.current;if(slide&&!slide.$spinner){slide.$spinner=$(self.translate(self,self.opts.spinnerTpl)).appendTo(slide.$slide).hide().fadeIn("fast");}},hideLoading:function(slide){var self=this;slide=slide||self.current;if(slide&&slide.$spinner){slide.$spinner.stop().remove();delete slide.$spinner;}},afterLoad:function(slide){var self=this;if(self.isClosing){return;}
slide.isLoading=false;slide.isLoaded=true;self.trigger("afterLoad",slide);self.hideLoading(slide);if(slide.opts.smallBtn&&(!slide.$smallBtn||!slide.$smallBtn.length)){slide.$smallBtn=$(self.translate(slide,slide.opts.btnTpl.smallBtn)).appendTo(slide.$content);}
if(slide.opts.protect&&slide.$content&&!slide.hasError){slide.$content.on("contextmenu.fb",function(e){if(e.button==2){e.preventDefault();}
return true;});if(slide.type==="image"){$('<div class="fancybox-spaceball"></div>').appendTo(slide.$content);}}
self.adjustCaption(slide);self.adjustLayout(slide);if(slide.pos===self.currPos){self.updateCursor();}
self.revealContent(slide);},adjustCaption:function(slide){var self=this,current=slide||self.current,caption=current.opts.caption,$caption=self.$refs.caption,captionH=false;if(current.opts.preventCaptionOverlap&&caption&&caption.length){if(current.pos!==self.currPos){$caption=$caption.clone().empty().appendTo($caption.parent());$caption.html(caption);captionH=$caption.outerHeight(true);$caption.empty().remove();}else if(self.$caption){captionH=self.$caption.outerHeight(true);}
current.$slide.css("padding-bottom",captionH||"");}},adjustLayout:function(slide){var self=this,current=slide||self.current,scrollHeight,marginBottom,inlinePadding,actualPadding;if(current.isLoaded&&current.opts.disableLayoutFix!==true){current.$content.css("margin-bottom","");if(current.$content.outerHeight()>current.$slide.height()+0.5){inlinePadding=current.$slide[0].style["padding-bottom"];actualPadding=current.$slide.css("padding-bottom");if(parseFloat(actualPadding)>0){scrollHeight=current.$slide[0].scrollHeight;current.$slide.css("padding-bottom",0);if(Math.abs(scrollHeight-current.$slide[0].scrollHeight)<1){marginBottom=actualPadding;}
current.$slide.css("padding-bottom",inlinePadding);}}
current.$content.css("margin-bottom",marginBottom);}},revealContent:function(slide){var self=this,$slide=slide.$slide,end=false,start=false,isMoved=self.isMoved(slide),isRevealed=slide.isRevealed,effect,effectClassName,duration,opacity;slide.isRevealed=true;effect=slide.opts[self.firstRun?"animationEffect":"transitionEffect"];duration=slide.opts[self.firstRun?"animationDuration":"transitionDuration"];duration=parseInt(slide.forcedDuration===undefined?duration:slide.forcedDuration,10);if(isMoved||slide.pos!==self.currPos||!duration){effect=false;}
if(effect==="zoom"){if(slide.pos===self.currPos&&duration&&slide.type==="image"&&!slide.hasError&&(start=self.getThumbPos(slide))){end=self.getFitPos(slide);}else{effect="fade";}}
if(effect==="zoom"){self.isAnimating=true;end.scaleX=end.width/start.width;end.scaleY=end.height/start.height;opacity=slide.opts.zoomOpacity;if(opacity=="auto"){opacity=Math.abs(slide.width/slide.height-start.width/start.height)>0.1;}
if(opacity){start.opacity=0.1;end.opacity=1;}
$.fancyboxforwp.setTranslate(slide.$content.removeClass("fancybox-is-hidden"),start);forceRedraw(slide.$content);$.fancyboxforwp.animate(slide.$content,end,duration,function(){self.isAnimating=false;self.complete();});return;}
self.updateSlide(slide);if(!effect){slide.$content.removeClass("fancybox-is-hidden");if(!isRevealed&&isMoved&&slide.type==="image"&&!slide.hasError){slide.$content.hide().fadeIn("fast");}
if(slide.pos===self.currPos){self.complete();}
return;}
$.fancyboxforwp.stop($slide);effectClassName="fancybox-slide--"+(slide.pos>=self.prevPos?"next":"previous")+" fancybox-animated fancybox-fx-"+effect;$slide.addClass(effectClassName).removeClass("fancybox-slide--current");slide.$content.removeClass("fancybox-is-hidden");forceRedraw($slide);if(slide.type!=="image"){slide.$content.hide().show(0);}
$.fancyboxforwp.animate($slide,"fancybox-slide--current",duration,function(){$slide.removeClass(effectClassName).css({transform:"",opacity:""});if(slide.pos===self.currPos){self.complete();}},true);},getThumbPos:function(slide){var rez=false,$thumb=slide.$thumb,thumbPos,btw,brw,bbw,blw;if(!$thumb||!inViewport($thumb[0])){return false;}
thumbPos=$.fancyboxforwp.getTranslate($thumb);btw=parseFloat($thumb.css("border-top-width")||0);brw=parseFloat($thumb.css("border-right-width")||0);bbw=parseFloat($thumb.css("border-bottom-width")||0);blw=parseFloat($thumb.css("border-left-width")||0);rez={top:thumbPos.top+btw,left:thumbPos.left+blw,width:thumbPos.width-brw-blw,height:thumbPos.height-btw-bbw,scaleX:1,scaleY:1};return thumbPos.width>0&&thumbPos.height>0?rez:false;},complete:function(){var self=this,current=self.current,slides={},$el;if(self.isMoved()||!current.isLoaded){return;}
if(!current.isComplete){current.isComplete=true;current.$slide.siblings().trigger("onReset");self.preload("inline");forceRedraw(current.$slide);current.$slide.addClass("fancybox-slide--complete");$.each(self.slides,function(key,slide){if(slide.pos>=self.currPos-1&&slide.pos<=self.currPos+1){slides[slide.pos]=slide;}else if(slide){$.fancyboxforwp.stop(slide.$slide);slide.$slide.off().remove();}});self.slides=slides;}
self.isAnimating=false;self.updateCursor();self.trigger("afterShow");if(!!current.opts.video.autoStart){current.$slide.find("video,audio").filter(":visible:first").trigger("play").on("ended",$.proxy(self.next,self));}
if(current.opts.autoFocus&&current.contentType==="html"){$el=current.$content.find("input[autofocus]:enabled:visible:first");if($el.length){$el.trigger("focus");}else{self.focus(null,true);}}
current.$slide.scrollTop(0).scrollLeft(0);},preload:function(type){var self=this,next=self.slides[self.currPos+1],prev=self.slides[self.currPos-1];if(prev&&prev.type===type){self.loadSlide(prev);}
if(next&&next.type===type){self.loadSlide(next);}},focus:function(e,firstRun){var self=this,focusableStr=["a[href]","area[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","iframe","object","embed","[contenteditable]",'[tabindex]:not([tabindex^="-"])'].join(","),focusableItems,focusedItemIndex;if(self.isClosing){return;}
if(e||!self.current||!self.current.isComplete){focusableItems=self.$refs.container.find("*:visible");}else{focusableItems=self.current.$slide.find("*:visible"+(firstRun?":not(.fancybox-close-small)":""));}
focusableItems=focusableItems.filter(focusableStr).filter(function(){return $(this).css("visibility")!=="hidden"&&!$(this).hasClass("disabled");});if(focusableItems.length){focusedItemIndex=focusableItems.index(document.activeElement);if(e&&e.shiftKey){if(focusedItemIndex<0||focusedItemIndex==0){e.preventDefault();focusableItems.eq(focusableItems.length-1).trigger("focus");}}else{if(focusedItemIndex<0||focusedItemIndex==focusableItems.length-1){if(e){e.preventDefault();}
focusableItems.eq(0).trigger("focus");}}}else{self.$refs.container.trigger("focus");}},activate:function(){var self=this;$(".fancybox-container").each(function(){var instance=$(this).data("FancyBox");if(instance&&instance.id!==self.id&&!instance.isClosing){instance.trigger("onDeactivate");instance.removeEvents();instance.isVisible=false;}});self.isVisible=true;if(self.current||self.isIdle){self.update();self.updateControls();}
self.trigger("onActivate");self.addEvents();},close:function(e,d){var self=this,current=self.current,effect,duration,$content,domRect,opacity,start,end;var done=function(){self.cleanUp(e);};if(self.isClosing){return false;}
self.isClosing=true;if(self.trigger("beforeClose",e)===false){self.isClosing=false;requestAFrame(function(){self.update();});return false;}
self.removeEvents();$content=current.$content;effect=current.opts.animationEffect;duration=$.isNumeric(d)?d:effect?current.opts.animationDuration:0;current.$slide.removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated");if(e!==true){$.fancyboxforwp.stop(current.$slide);}else{effect=false;}
current.$slide.siblings().trigger("onReset").remove();if(duration){self.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing").css("transition-duration",duration+"ms");}
self.hideLoading(current);self.hideControls(true);self.updateCursor();if(effect==="zoom"&&!($content&&duration&&current.type==="image"&&!self.isMoved()&&!current.hasError&&(end=self.getThumbPos(current)))){effect="fade";}
if(effect==="zoom"){$.fancyboxforwp.stop($content);domRect=$.fancyboxforwp.getTranslate($content);start={top:domRect.top,left:domRect.left,scaleX:domRect.width/end.width,scaleY:domRect.height/end.height,width:end.width,height:end.height};opacity=current.opts.zoomOpacity;if(opacity=="auto"){opacity=Math.abs(current.width/current.height-end.width/end.height)>0.1;}
if(opacity){end.opacity=0;}
$.fancyboxforwp.setTranslate($content,start);forceRedraw($content);$.fancyboxforwp.animate($content,end,duration,done);return true;}
if(effect&&duration){$.fancyboxforwp.animate(current.$slide.addClass("fancybox-slide--previous").removeClass("fancybox-slide--current"),"fancybox-animated fancybox-fx-"+effect,duration,done);}else{if(e===true){setTimeout(done,duration);}else{done();}}
return true;},cleanUp:function(e){var self=this,instance,$focus=self.current.opts.$orig,x,y;self.current.$slide.trigger("onReset");self.$refs.container.empty().remove();self.trigger("afterClose",e);if(!!self.current.opts.backFocus){if(!$focus||!$focus.length||!$focus.is(":visible")){$focus=self.$trigger;}
if($focus&&$focus.length){x=window.scrollX;y=window.scrollY;$focus.trigger("focus");$("html, body").scrollTop(y).scrollLeft(x);}}
self.current=null;instance=$.fancyboxforwp.getInstance();if(instance){instance.activate();}else{$("body").removeClass("fancybox-active compensate-for-scrollbar");$("#fancybox-style-noscroll").remove();}},trigger:function(name,slide){var args=Array.prototype.slice.call(arguments,1),self=this,obj=slide&&slide.opts?slide:self.current,rez;if(obj){args.unshift(obj);}else{obj=self;}
args.unshift(self);if($.isFunction(obj.opts[name])){rez=obj.opts[name].apply(obj,args);}
if(rez===false){return rez;}
if(name==="afterClose"||!self.$refs){$D.trigger(name+".fb",args);}else{self.$refs.container.trigger(name+".fb",args);}},updateControls:function(){var self=this,current=self.current,index=current.index,$container=self.$refs.container,$caption=self.$refs.caption,caption=current.opts.caption;current.$slide.trigger("refresh");self.$caption=caption&&caption.length?$caption.html(caption):null;if(!self.hasHiddenControls&&!self.isIdle){self.showControls();}
$container.find("[data-fancybox-count]").html(self.group.length);$container.find("[data-fancybox-index]").html(index+1);$container.find("[data-fancybox-prev]").prop("disabled",!current.opts.loop&&index<=0);$container.find("[data-fancybox-next]").prop("disabled",!current.opts.loop&&index>=self.group.length-1);if(current.type==="image"){$container.find("[data-fancybox-zoom]").show().end().find("[data-fancybox-download]").attr("href",current.opts.image.src||current.src).show();}else if(current.opts.toolbar){$container.find("[data-fancybox-download],[data-fancybox-zoom]").hide();}
if($(document.activeElement).is(":hidden,[disabled]")){self.$refs.container.trigger("focus");}},hideControls:function(andCaption){var self=this,arr=["infobar","toolbar","nav"];if(andCaption||!self.current.opts.preventCaptionOverlap){arr.push("caption");}
this.$refs.container.removeClass(arr.map(function(i){return"fancybox-show-"+i;}).join(" "));this.hasHiddenControls=true;},showControls:function(){var self=this,opts=self.current?self.current.opts:self.opts,$container=self.$refs.container;self.hasHiddenControls=false;self.idleSecondsCounter=0;$container.toggleClass("fancybox-show-toolbar",!!(opts.toolbar&&opts.buttons)).toggleClass("fancybox-show-infobar",!!(opts.infobar&&self.group.length>1)).toggleClass("fancybox-show-caption",!!self.$caption).toggleClass("fancybox-show-nav",!!(opts.arrows&&self.group.length>1)).toggleClass("fancybox-is-modal",!!opts.modal);},toggleControls:function(){if(this.hasHiddenControls){this.showControls();}else{this.hideControls();}}});$.fancyboxforwp={version:"3.5.1",defaults:defaults,getInstance:function(command){var instance=$('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"),args=Array.prototype.slice.call(arguments,1);if(instance instanceof FancyBox){if($.type(command)==="string"){instance[command].apply(instance,args);}else if($.type(command)==="function"){command.apply(instance,args);}
return instance;}
return false;},open:function(items,opts,index){return new FancyBox(items,opts,index);},close:function(all){var instance=this.getInstance();if(instance){instance.close();if(all===true){this.close(all);}}},destroy:function(){this.close(true);$D.add("body").off("click.fb-start","**");},isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),use3d:(function(){var div=document.createElement("div");return(window.getComputedStyle&&window.getComputedStyle(div)&&window.getComputedStyle(div).getPropertyValue("transform")&&!(document.documentMode&&document.documentMode<11));})(),getTranslate:function($el){var domRect;if(!$el||!$el.length){return false;}
domRect=$el[0].getBoundingClientRect();return{top:domRect.top||0,left:domRect.left||0,width:domRect.width,height:domRect.height,opacity:parseFloat($el.css("opacity"))};},setTranslate:function($el,props){var str="",css={};if(!$el||!props){return;}
if(props.left!==undefined||props.top!==undefined){str=(props.left===undefined?$el.position().left:props.left)+"px, "+
(props.top===undefined?$el.position().top:props.top)+"px";if(this.use3d){str="translate3d("+str+", 0px)";}else{str="translate("+str+")";}}
if(props.scaleX!==undefined&&props.scaleY!==undefined){str+=" scale("+props.scaleX+", "+props.scaleY+")";}else if(props.scaleX!==undefined){str+=" scaleX("+props.scaleX+")";}
if(str.length){css.transform=str;}
if(props.opacity!==undefined){css.opacity=props.opacity;}
if(props.width!==undefined){css.width=props.width;}
if(props.height!==undefined){css.height=props.height;}
return $el.css(css);},animate:function($el,to,duration,callback,leaveAnimationName){var self=this,from;if($.isFunction(duration)){callback=duration;duration=null;}
self.stop($el);from=self.getTranslate($el);$el.on(transitionEnd,function(e){if(e&&e.originalEvent&&(!$el.is(e.originalEvent.target)||e.originalEvent.propertyName=="z-index")){return;}
self.stop($el);if($.isNumeric(duration)){$el.css("transition-duration","");}
if($.isPlainObject(to)){if(to.scaleX!==undefined&&to.scaleY!==undefined){self.setTranslate($el,{top:to.top,left:to.left,width:from.width*to.scaleX,height:from.height*to.scaleY,scaleX:1,scaleY:1});}}else if(leaveAnimationName!==true){$el.removeClass(to);}
if($.isFunction(callback)){callback(e);}});if($.isNumeric(duration)){$el.css("transition-duration",duration+"ms");}
if($.isPlainObject(to)){if(to.scaleX!==undefined&&to.scaleY!==undefined){delete to.width;delete to.height;if($el.parent().hasClass("fancybox-slide--image")){$el.parent().addClass("fancybox-is-scaling");}}
$.fancyboxforwp.setTranslate($el,to);}else{$el.addClass(to);}
$el.data("timer",setTimeout(function(){$el.trigger(transitionEnd);},duration+33));},stop:function($el,callCallback){if($el&&$el.length){clearTimeout($el.data("timer"));if(callCallback){$el.trigger(transitionEnd);}
$el.off(transitionEnd).css("transition-duration","");$el.parent().removeClass("fancybox-is-scaling");}}};function _run(e,opts){var items=[],index=0,$target,value,instance;if(e&&e.isDefaultPrevented()){return;}
e.preventDefault();opts=opts||{};if(e&&e.data){opts=mergeOpts(e.data.options,opts);}
$target=opts.$target||$(e.currentTarget).trigger("blur");instance=$.fancyboxforwp.getInstance();if(instance&&instance.$trigger&&instance.$trigger.is($target)){return;}
if(opts.selector){items=$(opts.selector);}else{value=$target.attr("data-fancybox")||"";if(value){items=e.data?e.data.items:[];items=items.length?items.filter('[data-fancybox="'+value+'"]'):$('[data-fancybox="'+value+'"]');}else{items=[$target];}}
index=$(items).index($target);if(index<0){index=0;}
instance=$.fancyboxforwp.open(items,opts,index);instance.$trigger=$target;}
$.fn.fancyboxforwp=function(options){var selector;options=options||{};selector=options.selector||false;if(selector){$("body").off("click.fb-start",selector).on("click.fb-start",selector,{options:options},_run);}else{this.off("click.fb-start").on("click.fb-start",{items:this,options:options},_run);}
return this;};$D.on("click.fb-start","[data-fancybox]",_run);$D.on("click.fb-start","[data-fancybox-trigger]",function(e){$('[data-fancybox="'+$(this).attr("data-fancybox-trigger")+'"]').eq($(this).attr("data-fancybox-index")||0).trigger("click.fb-start",{$trigger:$(this)});});(function(){var buttonStr=".fancybox-button",focusStr="fancybox-focus",$pressed=null;$D.on("mousedown mouseup focus blur",buttonStr,function(e){switch(e.type){case"mousedown":$pressed=$(this);break;case"mouseup":$pressed=null;break;case"focusin":$(buttonStr).removeClass(focusStr);if(!$(this).is($pressed)&&!$(this).is("[disabled]")){$(this).addClass(focusStr);}
break;case"focusout":$(buttonStr).removeClass(focusStr);break;}});})();})(window,document,jQuery);(function($){"use strict";var defaults={youtube:{matcher:/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,params:{autoplay:1,autohide:1,fs:1,rel:0,hd:1,wmode:"transparent",enablejsapi:1,html5:1},paramPlace:8,type:"iframe",url:"//www.youtube-nocookie.com/embed/$4",thumb:"//img.youtube.com/vi/$4/hqdefault.jpg"},vimeo:{matcher:/^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,params:{autoplay:1,hd:1,show_title:1,show_byline:1,show_portrait:0,fullscreen:1},paramPlace:3,type:"iframe",url:"//player.vimeo.com/video/$2"},instagram:{matcher:/(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,type:"image",url:"//$1/p/$2/media/?size=l"},gmap_place:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,type:"iframe",url:function(rez){return("//maps.google."+
rez[2]+"/?ll="+
(rez[9]?rez[9]+"&z="+Math.floor(rez[10])+(rez[12]?rez[12].replace(/^\//,"&"):""):rez[12]+"").replace(/\?/,"&")+"&output="+
(rez[12]&&rez[12].indexOf("layer=c")>0?"svembed":"embed"));}},gmap_search:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,type:"iframe",url:function(rez){return"//maps.google."+rez[2]+"/maps?q="+rez[5].replace("query=","q=").replace("api=1","")+"&output=embed";}}};var format=function(url,rez,params){if(!url){return;}
params=params||"";if($.type(params)==="object"){params=$.param(params,true);}
$.each(rez,function(key,value){url=url.replace("$"+key,value||"");});if(params.length){url+=(url.indexOf("?")>0?"&":"?")+params;}
return url;};$(document).on("objectNeedsType.fb",function(e,instance,item){var url=item.src||"",type=false,media,thumb,rez,params,urlParams,paramObj,provider;media=$.extend(true,{},defaults,item.opts.media);$.each(media,function(providerName,providerOpts){rez=url.match(providerOpts.matcher);if(!rez){return;}
type=providerOpts.type;provider=providerName;paramObj={};if(providerOpts.paramPlace&&rez[providerOpts.paramPlace]){urlParams=rez[providerOpts.paramPlace];if(urlParams[0]=="?"){urlParams=urlParams.substring(1);}
urlParams=urlParams.split("&");for(var m=0;m<urlParams.length;++m){var p=urlParams[m].split("=",2);if(p.length==2){paramObj[p[0]]=decodeURIComponent(p[1].replace(/\+/g," "));}}}
params=$.extend(true,{},providerOpts.params,item.opts[providerName],paramObj);url=$.type(providerOpts.url)==="function"?providerOpts.url.call(this,rez,params,item):format(providerOpts.url,rez,params);thumb=$.type(providerOpts.thumb)==="function"?providerOpts.thumb.call(this,rez,params,item):format(providerOpts.thumb,rez);if(providerName==="youtube"){url=url.replace(/&t=((\d+)m)?(\d+)s/,function(match,p1,m,s){return"&start="+((m?parseInt(m,10)*60:0)+parseInt(s,10));});}else if(providerName==="vimeo"){url=url.replace("&%23","#");}
return false;});if(type){if(!item.opts.thumb&&!(item.opts.$thumb&&item.opts.$thumb.length)){item.opts.thumb=thumb;}
if(type==="iframe"){item.opts=$.extend(true,item.opts,{iframe:{preload:false,attr:{scrolling:"no"}}});}
$.extend(item,{type:type,src:url,origSrc:item.src,contentSource:provider,contentType:type==="image"?"image":provider=="gmap_place"||provider=="gmap_search"?"map":"video"});}else if(url){item.type=item.opts.defaultType;}});var VideoAPILoader={youtube:{src:"https://www.youtube.com/iframe_api",class:"YT",loading:false,loaded:false},vimeo:{src:"https://player.vimeo.com/api/player.js",class:"Vimeo",loading:false,loaded:false},load:function(vendor){var _this=this,script;if(this[vendor].loaded){setTimeout(function(){_this.done(vendor);});return;}
if(this[vendor].loading){return;}
this[vendor].loading=true;script=document.createElement("script");script.type="text/javascript";script.src=this[vendor].src;if(vendor==="youtube"){window.onYouTubeIframeAPIReady=function(){_this[vendor].loaded=true;_this.done(vendor);};}else{script.onload=function(){_this[vendor].loaded=true;_this.done(vendor);};}
document.body.appendChild(script);},done:function(vendor){var instance,$el,player;if(vendor==="youtube"){delete window.onYouTubeIframeAPIReady;}
instance=$.fancyboxforwp.getInstance();if(instance){$el=instance.current.$content.find("iframe");if(vendor==="youtube"&&YT!==undefined&&YT){player=new YT.Player($el.attr("id"),{events:{onStateChange:function(e){if(e.data==0){instance.next();}}}});}else if(vendor==="vimeo"&&Vimeo!==undefined&&Vimeo){player=new Vimeo.Player($el);player.on("ended",function(){instance.next();});}}}};$(document).on({"afterShow.fb":function(e,instance,current){if(instance.group.length>1&&(current.contentSource==="youtube"||current.contentSource==="vimeo")){VideoAPILoader.load(current.contentSource);}}});})(jQuery);(function(window,document,$){"use strict";var requestAFrame=(function(){return(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||function(callback){return window.setTimeout(callback,1000/60);});})();var cancelAFrame=(function(){return(window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||function(id){window.clearTimeout(id);});})();var getPointerXY=function(e){var result=[];e=e.originalEvent||e||window.e;e=e.touches&&e.touches.length?e.touches:e.changedTouches&&e.changedTouches.length?e.changedTouches:[e];for(var key in e){if(e[key].pageX){result.push({x:e[key].pageX,y:e[key].pageY});}else if(e[key].clientX){result.push({x:e[key].clientX,y:e[key].clientY});}}
return result;};var distance=function(point2,point1,what){if(!point1||!point2){return 0;}
if(what==="x"){return point2.x-point1.x;}else if(what==="y"){return point2.y-point1.y;}
return Math.sqrt(Math.pow(point2.x-point1.x,2)+Math.pow(point2.y-point1.y,2));};var isClickable=function($el){if($el.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe')||$.isFunction($el.get(0).onclick)||$el.data("selectable")){return true;}
for(var i=0,atts=$el[0].attributes,n=atts.length;i<n;i++){if(atts[i].nodeName.substr(0,14)==="data-fancybox-"){return true;}}
return false;};var hasScrollbars=function(el){var overflowY=window.getComputedStyle(el)["overflow-y"],overflowX=window.getComputedStyle(el)["overflow-x"],vertical=(overflowY==="scroll"||overflowY==="auto")&&el.scrollHeight>el.clientHeight,horizontal=(overflowX==="scroll"||overflowX==="auto")&&el.scrollWidth>el.clientWidth;return vertical||horizontal;};var isScrollable=function($el){var rez=false;while(true){rez=hasScrollbars($el.get(0));if(rez){break;}
$el=$el.parent();if(!$el.length||$el.hasClass("fancybox-stage")||$el.is("body")){break;}}
return rez;};var Guestures=function(instance){var self=this;self.instance=instance;self.$bg=instance.$refs.bg;self.$stage=instance.$refs.stage;self.$container=instance.$refs.container;self.destroy();self.$container.on("touchstart.fb.touch mousedown.fb.touch",$.proxy(self,"ontouchstart"));};Guestures.prototype.destroy=function(){var self=this;self.$container.off(".fb.touch");$(document).off(".fb.touch");if(self.requestId){cancelAFrame(self.requestId);self.requestId=null;}
if(self.tapped){clearTimeout(self.tapped);self.tapped=null;}};Guestures.prototype.ontouchstart=function(e){var self=this,$target=$(e.target),instance=self.instance,current=instance.current,$slide=current.$slide,$content=current.$content,isTouchDevice=e.type=="touchstart";if(isTouchDevice){self.$container.off("mousedown.fb.touch");}
if(e.originalEvent&&e.originalEvent.button==2){return;}
if(!$slide.length||!$target.length||isClickable($target)||isClickable($target.parent())){return;}
if(!$target.is("img")&&e.originalEvent.clientX>$target[0].clientWidth+$target.offset().left){return;}
if(!current||instance.isAnimating||current.$slide.hasClass("fancybox-animated")){e.stopPropagation();e.preventDefault();return;}
self.realPoints=self.startPoints=getPointerXY(e);if(!self.startPoints.length){return;}
if(current.touch){e.stopPropagation();}
self.startEvent=e;self.canTap=true;self.$target=$target;self.$content=$content;self.opts=current.opts.touch;self.isPanning=false;self.isSwiping=false;self.isZooming=false;self.isScrolling=false;self.canPan=instance.canPan();self.startTime=new Date().getTime();self.distanceX=self.distanceY=self.distance=0;self.canvasWidth=Math.round($slide[0].clientWidth);self.canvasHeight=Math.round($slide[0].clientHeight);self.contentLastPos=null;self.contentStartPos=$.fancyboxforwp.getTranslate(self.$content)||{top:0,left:0};self.sliderStartPos=$.fancyboxforwp.getTranslate($slide);self.stagePos=$.fancyboxforwp.getTranslate(instance.$refs.stage);self.sliderStartPos.top-=self.stagePos.top;self.sliderStartPos.left-=self.stagePos.left;self.contentStartPos.top-=self.stagePos.top;self.contentStartPos.left-=self.stagePos.left;$(document).off(".fb.touch").on(isTouchDevice?"touchend.fb.touch touchcancel.fb.touch":"mouseup.fb.touch mouseleave.fb.touch",$.proxy(self,"ontouchend")).on(isTouchDevice?"touchmove.fb.touch":"mousemove.fb.touch",$.proxy(self,"ontouchmove"));if($.fancyboxforwp.isMobile){document.addEventListener("scroll",self.onscroll,true);}
if(!(self.opts||self.canPan)||!($target.is(self.$stage)||self.$stage.find($target).length)){if($target.is(".fancybox-image")){e.preventDefault();}
if(!($.fancyboxforwp.isMobile&&$target.hasClass("fancybox-caption"))){return;}}
self.isScrollable=isScrollable($target)||isScrollable($target.parent());if(!($.fancyboxforwp.isMobile&&self.isScrollable)){e.preventDefault();}
if(self.startPoints.length===1||current.hasError){if(self.canPan){$.fancyboxforwp.stop(self.$content);self.isPanning=true;}else{self.isSwiping=true;}
self.$container.addClass("fancybox-is-grabbing");}
if(self.startPoints.length===2&&current.type==="image"&&(current.isLoaded||current.$ghost)){self.canTap=false;self.isSwiping=false;self.isPanning=false;self.isZooming=true;$.fancyboxforwp.stop(self.$content);self.centerPointStartX=(self.startPoints[0].x+self.startPoints[1].x)*0.5-$(window).scrollLeft();self.centerPointStartY=(self.startPoints[0].y+self.startPoints[1].y)*0.5-$(window).scrollTop();self.percentageOfImageAtPinchPointX=(self.centerPointStartX-self.contentStartPos.left)/self.contentStartPos.width;self.percentageOfImageAtPinchPointY=(self.centerPointStartY-self.contentStartPos.top)/self.contentStartPos.height;self.startDistanceBetweenFingers=distance(self.startPoints[0],self.startPoints[1]);}};Guestures.prototype.onscroll=function(e){var self=this;self.isScrolling=true;document.removeEventListener("scroll",self.onscroll,true);};Guestures.prototype.ontouchmove=function(e){var self=this;if(e.originalEvent.buttons!==undefined&&e.originalEvent.buttons===0){self.ontouchend(e);return;}
if(self.isScrolling){self.canTap=false;return;}
self.newPoints=getPointerXY(e);if(!(self.opts||self.canPan)||!self.newPoints.length||!self.newPoints.length){return;}
if(!(self.isSwiping&&self.isSwiping===true)){e.preventDefault();}
self.distanceX=distance(self.newPoints[0],self.startPoints[0],"x");self.distanceY=distance(self.newPoints[0],self.startPoints[0],"y");self.distance=distance(self.newPoints[0],self.startPoints[0]);if(self.distance>0){if(self.isSwiping){self.onSwipe(e);}else if(self.isPanning){self.onPan();}else if(self.isZooming){self.onZoom();}}};Guestures.prototype.onSwipe=function(e){var self=this,instance=self.instance,swiping=self.isSwiping,left=self.sliderStartPos.left||0,angle;if(swiping===true){if(Math.abs(self.distance)>10){self.canTap=false;if(instance.group.length<2&&self.opts.vertical){self.isSwiping="y";}else if(instance.isDragging||self.opts.vertical===false||(self.opts.vertical==="auto"&&$(window).width()>800)){self.isSwiping="x";}else{angle=Math.abs((Math.atan2(self.distanceY,self.distanceX)*180)/Math.PI);self.isSwiping=angle>45&&angle<135?"y":"x";}
if(self.isSwiping==="y"&&$.fancyboxforwp.isMobile&&self.isScrollable){self.isScrolling=true;return;}
instance.isDragging=self.isSwiping;self.startPoints=self.newPoints;$.each(instance.slides,function(index,slide){var slidePos,stagePos;$.fancyboxforwp.stop(slide.$slide);slidePos=$.fancyboxforwp.getTranslate(slide.$slide);stagePos=$.fancyboxforwp.getTranslate(instance.$refs.stage);slide.$slide.css({transform:"",opacity:"","transition-duration":""}).removeClass("fancybox-animated").removeClass(function(index,className){return(className.match(/(^|\s)fancybox-fx-\S+/g)||[]).join(" ");});if(slide.pos===instance.current.pos){self.sliderStartPos.top=slidePos.top-stagePos.top;self.sliderStartPos.left=slidePos.left-stagePos.left;}
$.fancyboxforwp.setTranslate(slide.$slide,{top:slidePos.top-stagePos.top,left:slidePos.left-stagePos.left});});if(instance.SlideShow&&instance.SlideShow.isActive){instance.SlideShow.stop();}}
return;}
if(swiping=="x"){if(self.distanceX>0&&(self.instance.group.length<2||(self.instance.current.index===0&&!self.instance.current.opts.loop))){left=left+Math.pow(self.distanceX,0.8);}else if(self.distanceX<0&&(self.instance.group.length<2||(self.instance.current.index===self.instance.group.length-1&&!self.instance.current.opts.loop))){left=left-Math.pow(-self.distanceX,0.8);}else{left=left+self.distanceX;}}
self.sliderLastPos={top:swiping=="x"?0:self.sliderStartPos.top+self.distanceY,left:left};if(self.requestId){cancelAFrame(self.requestId);self.requestId=null;}
self.requestId=requestAFrame(function(){if(self.sliderLastPos){$.each(self.instance.slides,function(index,slide){var pos=slide.pos-self.instance.currPos;$.fancyboxforwp.setTranslate(slide.$slide,{top:self.sliderLastPos.top,left:self.sliderLastPos.left+pos*self.canvasWidth+pos*slide.opts.gutter});});self.$container.addClass("fancybox-is-sliding");}});};Guestures.prototype.onPan=function(){var self=this;if(distance(self.newPoints[0],self.realPoints[0])<($.fancyboxforwp.isMobile?10:5)){self.startPoints=self.newPoints;return;}
self.canTap=false;self.contentLastPos=self.limitMovement();if(self.requestId){cancelAFrame(self.requestId);}
self.requestId=requestAFrame(function(){$.fancyboxforwp.setTranslate(self.$content,self.contentLastPos);});};Guestures.prototype.limitMovement=function(){var self=this;var canvasWidth=self.canvasWidth;var canvasHeight=self.canvasHeight;var distanceX=self.distanceX;var distanceY=self.distanceY;var contentStartPos=self.contentStartPos;var currentOffsetX=contentStartPos.left;var currentOffsetY=contentStartPos.top;var currentWidth=contentStartPos.width;var currentHeight=contentStartPos.height;var minTranslateX,minTranslateY,maxTranslateX,maxTranslateY,newOffsetX,newOffsetY;if(currentWidth>canvasWidth){newOffsetX=currentOffsetX+distanceX;}else{newOffsetX=currentOffsetX;}
newOffsetY=currentOffsetY+distanceY;minTranslateX=Math.max(0,canvasWidth*0.5-currentWidth*0.5);minTranslateY=Math.max(0,canvasHeight*0.5-currentHeight*0.5);maxTranslateX=Math.min(canvasWidth-currentWidth,canvasWidth*0.5-currentWidth*0.5);maxTranslateY=Math.min(canvasHeight-currentHeight,canvasHeight*0.5-currentHeight*0.5);if(distanceX>0&&newOffsetX>minTranslateX){newOffsetX=minTranslateX-1+Math.pow(-minTranslateX+currentOffsetX+distanceX,0.8)||0;}
if(distanceX<0&&newOffsetX<maxTranslateX){newOffsetX=maxTranslateX+1-Math.pow(maxTranslateX-currentOffsetX-distanceX,0.8)||0;}
if(distanceY>0&&newOffsetY>minTranslateY){newOffsetY=minTranslateY-1+Math.pow(-minTranslateY+currentOffsetY+distanceY,0.8)||0;}
if(distanceY<0&&newOffsetY<maxTranslateY){newOffsetY=maxTranslateY+1-Math.pow(maxTranslateY-currentOffsetY-distanceY,0.8)||0;}
return{top:newOffsetY,left:newOffsetX};};Guestures.prototype.limitPosition=function(newOffsetX,newOffsetY,newWidth,newHeight){var self=this;var canvasWidth=self.canvasWidth;var canvasHeight=self.canvasHeight;if(newWidth>canvasWidth){newOffsetX=newOffsetX>0?0:newOffsetX;newOffsetX=newOffsetX<canvasWidth-newWidth?canvasWidth-newWidth:newOffsetX;}else{newOffsetX=Math.max(0,canvasWidth/2-newWidth/2);}
if(newHeight>canvasHeight){newOffsetY=newOffsetY>0?0:newOffsetY;newOffsetY=newOffsetY<canvasHeight-newHeight?canvasHeight-newHeight:newOffsetY;}else{newOffsetY=Math.max(0,canvasHeight/2-newHeight/2);}
return{top:newOffsetY,left:newOffsetX};};Guestures.prototype.onZoom=function(){var self=this;var contentStartPos=self.contentStartPos;var currentWidth=contentStartPos.width;var currentHeight=contentStartPos.height;var currentOffsetX=contentStartPos.left;var currentOffsetY=contentStartPos.top;var endDistanceBetweenFingers=distance(self.newPoints[0],self.newPoints[1]);var pinchRatio=endDistanceBetweenFingers/self.startDistanceBetweenFingers;var newWidth=Math.floor(currentWidth*pinchRatio);var newHeight=Math.floor(currentHeight*pinchRatio);var translateFromZoomingX=(currentWidth-newWidth)*self.percentageOfImageAtPinchPointX;var translateFromZoomingY=(currentHeight-newHeight)*self.percentageOfImageAtPinchPointY;var centerPointEndX=(self.newPoints[0].x+self.newPoints[1].x)/2-$(window).scrollLeft();var centerPointEndY=(self.newPoints[0].y+self.newPoints[1].y)/2-$(window).scrollTop();var translateFromTranslatingX=centerPointEndX-self.centerPointStartX;var translateFromTranslatingY=centerPointEndY-self.centerPointStartY;var newOffsetX=currentOffsetX+(translateFromZoomingX+translateFromTranslatingX);var newOffsetY=currentOffsetY+(translateFromZoomingY+translateFromTranslatingY);var newPos={top:newOffsetY,left:newOffsetX,scaleX:pinchRatio,scaleY:pinchRatio};self.canTap=false;self.newWidth=newWidth;self.newHeight=newHeight;self.contentLastPos=newPos;if(self.requestId){cancelAFrame(self.requestId);}
self.requestId=requestAFrame(function(){$.fancyboxforwp.setTranslate(self.$content,self.contentLastPos);});};Guestures.prototype.ontouchend=function(e){var self=this;var swiping=self.isSwiping;var panning=self.isPanning;var zooming=self.isZooming;var scrolling=self.isScrolling;self.endPoints=getPointerXY(e);self.dMs=Math.max(new Date().getTime()-self.startTime,1);self.$container.removeClass("fancybox-is-grabbing");$(document).off(".fb.touch");document.removeEventListener("scroll",self.onscroll,true);if(self.requestId){cancelAFrame(self.requestId);self.requestId=null;}
self.isSwiping=false;self.isPanning=false;self.isZooming=false;self.isScrolling=false;self.instance.isDragging=false;if(self.canTap){return self.onTap(e);}
self.speed=100;self.velocityX=(self.distanceX/self.dMs)*0.5;self.velocityY=(self.distanceY/self.dMs)*0.5;if(panning){self.endPanning();}else if(zooming){self.endZooming();}else{self.endSwiping(swiping,scrolling);}
return;};Guestures.prototype.endSwiping=function(swiping,scrolling){var self=this,ret=false,len=self.instance.group.length,distanceX=Math.abs(self.distanceX),canAdvance=swiping=="x"&&len>1&&((self.dMs>130&&distanceX>10)||distanceX>50),speedX=300;self.sliderLastPos=null;if(swiping=="y"&&!scrolling&&Math.abs(self.distanceY)>50){$.fancyboxforwp.animate(self.instance.current.$slide,{top:self.sliderStartPos.top+self.distanceY+self.velocityY*150,opacity:0},200);ret=self.instance.close(true,250);}else if(canAdvance&&self.distanceX>0){ret=self.instance.previous(speedX);}else if(canAdvance&&self.distanceX<0){ret=self.instance.next(speedX);}
if(ret===false&&(swiping=="x"||swiping=="y")){self.instance.centerSlide(200);}
self.$container.removeClass("fancybox-is-sliding");};Guestures.prototype.endPanning=function(){var self=this,newOffsetX,newOffsetY,newPos;if(!self.contentLastPos){return;}
if(self.opts.momentum===false||self.dMs>350){newOffsetX=self.contentLastPos.left;newOffsetY=self.contentLastPos.top;}else{newOffsetX=self.contentLastPos.left+self.velocityX*500;newOffsetY=self.contentLastPos.top+self.velocityY*500;}
newPos=self.limitPosition(newOffsetX,newOffsetY,self.contentStartPos.width,self.contentStartPos.height);newPos.width=self.contentStartPos.width;newPos.height=self.contentStartPos.height;$.fancyboxforwp.animate(self.$content,newPos,330);};Guestures.prototype.endZooming=function(){var self=this;var current=self.instance.current;var newOffsetX,newOffsetY,newPos,reset;var newWidth=self.newWidth;var newHeight=self.newHeight;if(!self.contentLastPos){return;}
newOffsetX=self.contentLastPos.left;newOffsetY=self.contentLastPos.top;reset={top:newOffsetY,left:newOffsetX,width:newWidth,height:newHeight,scaleX:1,scaleY:1};$.fancyboxforwp.setTranslate(self.$content,reset);if(newWidth<self.canvasWidth&&newHeight<self.canvasHeight){self.instance.scaleToFit(150);}else if(newWidth>current.width||newHeight>current.height){self.instance.scaleToActual(self.centerPointStartX,self.centerPointStartY,150);}else{newPos=self.limitPosition(newOffsetX,newOffsetY,newWidth,newHeight);$.fancyboxforwp.animate(self.$content,newPos,150);}};Guestures.prototype.onTap=function(e){var self=this;var $target=$(e.target);var instance=self.instance;var current=instance.current;var endPoints=(e&&getPointerXY(e))||self.startPoints;var tapX=endPoints[0]?endPoints[0].x-$(window).scrollLeft()-self.stagePos.left:0;var tapY=endPoints[0]?endPoints[0].y-$(window).scrollTop()-self.stagePos.top:0;var where;var process=function(prefix){var action=current.opts[prefix];if($.isFunction(action)){action=action.apply(instance,[current,e]);}
if(!action){return;}
switch(action){case"close":instance.close(self.startEvent);break;case"toggleControls":instance.toggleControls();break;case"next":instance.next();break;case"nextOrClose":if(instance.group.length>1){instance.next();}else{instance.close(self.startEvent);}
break;case"zoom":if(current.type=="image"&&(current.isLoaded||current.$ghost)){if(instance.canPan()){instance.scaleToFit();}else if(instance.isScaledDown()){instance.scaleToActual(tapX,tapY);}else if(instance.group.length<2){instance.close(self.startEvent);}}
break;}};if(e.originalEvent&&e.originalEvent.button==2){return;}
if(!$target.is("img")&&tapX>$target[0].clientWidth+$target.offset().left){return;}
if($target.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container")){where="Outside";}else if($target.is(".fancybox-slide")){where="Slide";}else if(instance.current.$content&&instance.current.$content.find($target).addBack().filter($target).length){where="Content";}else{return;}
if(self.tapped){clearTimeout(self.tapped);self.tapped=null;if(Math.abs(tapX-self.tapX)>50||Math.abs(tapY-self.tapY)>50){return this;}
process("dblclick"+where);}else{self.tapX=tapX;self.tapY=tapY;if(current.opts["dblclick"+where]&&current.opts["dblclick"+where]!==current.opts["click"+where]){self.tapped=setTimeout(function(){self.tapped=null;if(!instance.isAnimating){process("click"+where);}},500);}else{process("click"+where);}}
return this;};$(document).on("onActivate.fb",function(e,instance){if(instance&&!instance.Guestures){instance.Guestures=new Guestures(instance);}}).on("beforeClose.fb",function(e,instance){if(instance&&instance.Guestures){instance.Guestures.destroy();}});})(window,document,jQuery);(function(document,$){"use strict";$.extend(true,$.fancyboxforwp.defaults,{btnTpl:{slideShow:'<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}">'+'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 5.4v13.2l11-6.6z"/></svg>'+'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg>'+"</button>"},slideShow:{autoStart:false,speed:3000,progress:true}});var SlideShow=function(instance){this.instance=instance;this.init();};$.extend(SlideShow.prototype,{timer:null,isActive:false,$button:null,init:function(){var self=this,instance=self.instance,opts=instance.group[instance.currIndex].opts.slideShow;self.$button=instance.$refs.toolbar.find("[data-fancybox-play]").on("click",function(){self.toggle();});if(instance.group.length<2||!opts){self.$button.hide();}else if(opts.progress){self.$progress=$('<div class="fancybox-progress"></div>').appendTo(instance.$refs.inner);}},set:function(force){var self=this,instance=self.instance,current=instance.current;if(current&&(force===true||current.opts.loop||instance.currIndex<instance.group.length-1)){if(self.isActive&&current.contentType!=="video"){if(self.$progress){$.fancyboxforwp.animate(self.$progress.show(),{scaleX:1},current.opts.slideShow.speed);}
self.timer=setTimeout(function(){instance.jumpTo((instance.currIndex+1)%instance.group.length);},current.opts.slideShow.speed);}}else{self.stop();instance.idleSecondsCounter=0;instance.showControls();}},clear:function(){var self=this;clearTimeout(self.timer);self.timer=null;if(self.$progress){self.$progress.removeAttr("style").hide();}},start:function(){var self=this,current=self.instance.current;if(current){self.$button.attr("title",current.opts.i18n[current.opts.lang].PLAY_STOP).removeClass("fancybox-button--play").addClass("fancybox-button--pause");self.isActive=true;if(current.isComplete){self.set(true);}
self.instance.trigger("onSlideShowChange",true);}},stop:function(){var self=this,current=self.instance.current;self.clear();self.$button.attr("title",current.opts.i18n[current.opts.lang].PLAY_START).removeClass("fancybox-button--pause").addClass("fancybox-button--play");self.isActive=false;self.instance.trigger("onSlideShowChange",false);if(self.$progress){self.$progress.removeAttr("style").hide();}},toggle:function(){var self=this;if(self.isActive){self.stop();}else{self.start();}}});$(document).on({"onInit.fb":function(e,instance){if(instance&&!instance.SlideShow){instance.SlideShow=new SlideShow(instance);}},"beforeShow.fb":function(e,instance,current,firstRun){var SlideShow=instance&&instance.SlideShow;if(firstRun){if(SlideShow&&current.opts.slideShow.autoStart){SlideShow.start();}}else if(SlideShow&&SlideShow.isActive){SlideShow.clear();}},"afterShow.fb":function(e,instance,current){var SlideShow=instance&&instance.SlideShow;if(SlideShow&&SlideShow.isActive){SlideShow.set();}},"afterKeydown.fb":function(e,instance,current,keypress,keycode){var SlideShow=instance&&instance.SlideShow;if(SlideShow&&current.opts.slideShow&&(keycode===80||keycode===32)&&!$(document.activeElement).is("button,a,input")){keypress.preventDefault();SlideShow.toggle();}},"beforeClose.fb onDeactivate.fb":function(e,instance){var SlideShow=instance&&instance.SlideShow;if(SlideShow){SlideShow.stop();}}});$(document).on("visibilitychange",function(){var instance=$.fancyboxforwp.getInstance(),SlideShow=instance&&instance.SlideShow;if(SlideShow&&SlideShow.isActive){if(document.hidden){SlideShow.clear();}else{SlideShow.set();}}});})(document,jQuery);(function(document,$){"use strict";var fn=(function(){var fnMap=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]];var ret={};for(var i=0;i<fnMap.length;i++){var val=fnMap[i];if(val&&val[1]in document){for(var j=0;j<val.length;j++){ret[fnMap[0][j]]=val[j];}
return ret;}}
return false;})();if(fn){var FullScreen={request:function(elem){elem=elem||document.documentElement;elem[fn.requestFullscreen](elem.ALLOW_KEYBOARD_INPUT);},exit:function(){document[fn.exitFullscreen]();},toggle:function(elem){elem=elem||document.documentElement;if(this.isFullscreen()){this.exit();}else{this.request(elem);}},isFullscreen:function(){return Boolean(document[fn.fullscreenElement]);},enabled:function(){return Boolean(document[fn.fullscreenEnabled]);}};$.extend(true,$.fancyboxforwp.defaults,{btnTpl:{fullScreen:'<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fsenter" title="{{FULL_SCREEN}}">'+'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>'+'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg>'+"</button>"},fullScreen:{autoStart:false}});$(document).on(fn.fullscreenchange,function(){var isFullscreen=FullScreen.isFullscreen(),instance=$.fancyboxforwp.getInstance();if(instance){if(instance.current&&instance.current.type==="image"&&instance.isAnimating){instance.current.$content.css("transition","none");instance.isAnimating=false;instance.update(true,true,0);}
instance.trigger("onFullscreenChange",isFullscreen);instance.$refs.container.toggleClass("fancybox-is-fullscreen",isFullscreen);instance.$refs.toolbar.find("[data-fancybox-fullscreen]").toggleClass("fancybox-button--fsenter",!isFullscreen).toggleClass("fancybox-button--fsexit",isFullscreen);}});}
$(document).on({"onInit.fb":function(e,instance){var $container;if(!fn){instance.$refs.toolbar.find("[data-fancybox-fullscreen]").remove();return;}
if(instance&&instance.group[instance.currIndex].opts.fullScreen){$container=instance.$refs.container;$container.on("click.fb-fullscreen","[data-fancybox-fullscreen]",function(e){e.stopPropagation();e.preventDefault();FullScreen.toggle();});if(instance.opts.fullScreen&&instance.opts.fullScreen.autoStart===true){FullScreen.request();}
instance.FullScreen=FullScreen;}else if(instance){instance.$refs.toolbar.find("[data-fancybox-fullscreen]").hide();}},"afterKeydown.fb":function(e,instance,current,keypress,keycode){if(instance&&instance.FullScreen&&keycode===70){keypress.preventDefault();instance.FullScreen.toggle();}},"beforeClose.fb":function(e,instance){if(instance&&instance.FullScreen&&instance.$refs.container.hasClass("fancybox-is-fullscreen")){FullScreen.exit();}}});})(document,jQuery);(function(document,$){"use strict";var CLASS="fancybox-thumbs",CLASS_ACTIVE=CLASS+"-active";$.fancyboxforwp.defaults=$.extend(true,{btnTpl:{thumbs:'<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}">'+'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg>'+"</button>"},thumbs:{autoStart:false,hideOnClose:true,parentEl:".fancybox-container",axis:"y"}},$.fancyboxforwp.defaults);var FancyThumbs=function(instance){this.init(instance);};$.extend(FancyThumbs.prototype,{$button:null,$grid:null,$list:null,isVisible:false,isActive:false,init:function(instance){var self=this,group=instance.group,enabled=0;self.instance=instance;self.opts=group[instance.currIndex].opts.thumbs;instance.Thumbs=self;self.$button=instance.$refs.toolbar.find("[data-fancybox-thumbs]");for(var i=0,len=group.length;i<len;i++){if(group[i].thumb){enabled++;}
if(enabled>1){break;}}
if(enabled>1&&!!self.opts){self.$button.removeAttr("style").on("click",function(){self.toggle();});self.isActive=true;}else{self.$button.hide();}},create:function(){var self=this,instance=self.instance,parentEl=self.opts.parentEl,list=[],src;if(!self.$grid){self.$grid=$('<div class="'+CLASS+" "+CLASS+"-"+self.opts.axis+'"></div>').appendTo(instance.$refs.container.find(parentEl).addBack().filter(parentEl));self.$grid.on("click","a",function(){instance.jumpTo($(this).attr("data-index"));});}
if(!self.$list){self.$list=$('<div class="'+CLASS+'__list">').appendTo(self.$grid);}
$.each(instance.group,function(i,item){src=item.thumb;if(!src&&item.type==="image"){src=item.src;}
list.push('<a href="javascript:;" tabindex="0" data-index="'+
i+'"'+
(src&&src.length?' style="background-image:url('+src+')"':'class="fancybox-thumbs-missing"')+"></a>");});self.$list[0].innerHTML=list.join("");if(self.opts.axis==="x"){self.$list.width(parseInt(self.$grid.css("padding-right"),10)+
instance.group.length*self.$list.children().eq(0).outerWidth(true));}},focus:function(duration){var self=this,$list=self.$list,$grid=self.$grid,thumb,thumbPos;if(!self.instance.current){return;}
thumb=$list.children().removeClass(CLASS_ACTIVE).filter('[data-index="'+self.instance.current.index+'"]').addClass(CLASS_ACTIVE);thumbPos=thumb.position();if(self.opts.axis==="y"&&(thumbPos.top<0||thumbPos.top>$list.height()-thumb.outerHeight())){$list.stop().animate({scrollTop:$list.scrollTop()+thumbPos.top},duration);}else if(self.opts.axis==="x"&&(thumbPos.left<$grid.scrollLeft()||thumbPos.left>$grid.scrollLeft()+($grid.width()-thumb.outerWidth()))){$list.parent().stop().animate({scrollLeft:thumbPos.left},duration);}},update:function(){var that=this;that.instance.$refs.container.toggleClass("fancybox-show-thumbs",this.isVisible);if(that.isVisible){if(!that.$grid){that.create();}
that.instance.trigger("onThumbsShow");that.focus(0);}else if(that.$grid){that.instance.trigger("onThumbsHide");}
that.instance.update();},hide:function(){this.isVisible=false;this.update();},show:function(){this.isVisible=true;this.update();},toggle:function(){this.isVisible=!this.isVisible;this.update();}});$(document).on({"onInit.fb":function(e,instance){var Thumbs;if(instance&&!instance.Thumbs){Thumbs=new FancyThumbs(instance);if(Thumbs.isActive&&Thumbs.opts.autoStart===true){Thumbs.show();}}},"beforeShow.fb":function(e,instance,item,firstRun){var Thumbs=instance&&instance.Thumbs;if(Thumbs&&Thumbs.isVisible){Thumbs.focus(firstRun?0:250);}},"afterKeydown.fb":function(e,instance,current,keypress,keycode){var Thumbs=instance&&instance.Thumbs;if(Thumbs&&Thumbs.isActive&&keycode===71){keypress.preventDefault();Thumbs.toggle();}},"beforeClose.fb":function(e,instance){var Thumbs=instance&&instance.Thumbs;if(Thumbs&&Thumbs.isVisible&&Thumbs.opts.hideOnClose!==false){Thumbs.$grid.hide();}}});})(document,jQuery);(function(document,$){"use strict";$.extend(true,$.fancyboxforwp.defaults,{btnTpl:{share:'<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}">'+'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg>'+"</button>"},share:{url:function(instance,item){return((!instance.currentHash&&!(item.type==="inline"||item.type==="html")?item.origSrc||item.src:false)||window.location);},tpl:'<div class="fancybox-share">'+"<h1>{{SHARE}}</h1>"+"<p>"+'<a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}">'+'<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg>'+"<span>Facebook</span>"+"</a>"+'<a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}">'+'<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg>'+"<span>Twitter</span>"+"</a>"+'<a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}">'+'<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg>'+"<span>Pinterest</span>"+"</a>"+"</p>"+'<p><input class="fancybox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p>'+"</div>"}});function escapeHtml(string){var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};return String(string).replace(/[&<>"'`=\/]/g,function(s){return entityMap[s];});}
$(document).on("click","[data-fancybox-share]",function(){var instance=$.fancyboxforwp.getInstance(),current=instance.current||null,url,tpl;if(!current){return;}
if($.type(current.opts.share.url)==="function"){url=current.opts.share.url.apply(current,[instance,current]);}
tpl=current.opts.share.tpl.replace(/\{\{media\}\}/g,current.type==="image"?encodeURIComponent(current.src):"").replace(/\{\{url\}\}/g,encodeURIComponent(url)).replace(/\{\{url_raw\}\}/g,escapeHtml(url)).replace(/\{\{descr\}\}/g,instance.$caption?encodeURIComponent(instance.$caption.text()):"");$.fancyboxforwp.open({src:instance.translate(instance,tpl),type:"html",opts:{touch:false,animationEffect:false,afterLoad:function(shareInstance,shareCurrent){instance.$refs.container.one("beforeClose.fb",function(){shareInstance.close(null,0);});shareCurrent.$content.find(".fancybox-share__button").click(function(){window.open(this.href,"Share","width=550, height=450");return false;});},mobile:{autoFocus:false}}});});})(document,jQuery);(function(window,document,$){"use strict";if(!$.escapeSelector){$.escapeSelector=function(sel){var rcssescape=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;var fcssescape=function(ch,asCodePoint){if(asCodePoint){if(ch==="\0"){return"\uFFFD";}
return ch.slice(0,-1)+"\\"+ch.charCodeAt(ch.length-1).toString(16)+" ";}
return"\\"+ch;};return(sel+"").replace(rcssescape,fcssescape);};}
function parseUrl(){var hash=window.location.hash.substr(1),rez=hash.split("-"),index=rez.length>1&&/^\+?\d+$/.test(rez[rez.length-1])?parseInt(rez.pop(-1),10)||1:1,gallery=rez.join("-");return{hash:hash,index:index<1?1:index,gallery:gallery};}
function triggerFromUrl(url){if(url.gallery!==""){$("[data-fancybox='"+$.escapeSelector(url.gallery)+"']").eq(url.index-1).focus().trigger("click.fb-start");}}
function getGalleryID(instance){var opts,ret;if(!instance){return false;}
opts=instance.current?instance.current.opts:instance.opts;ret=opts.hash||(opts.$orig?opts.$orig.data("fancybox")||opts.$orig.data("fancybox-trigger"):"");return ret===""?false:ret;}
$(function(){if($.fancyboxforwp.defaults.hash===false){return;}
$(document).on({"onInit.fb":function(e,instance){var url,gallery;if(instance.group[instance.currIndex].opts.hash===false){return;}
url=parseUrl();gallery=getGalleryID(instance);if(gallery&&url.gallery&&gallery==url.gallery){instance.currIndex=url.index-1;}},"beforeShow.fb":function(e,instance,current,firstRun){var gallery;if(!current||current.opts.hash===false){return;}
gallery=getGalleryID(instance);if(!gallery){return;}
instance.currentHash=gallery+(instance.group.length>1?"-"+(current.index+1):"");if(window.location.hash==="#"+instance.currentHash){return;}
if(firstRun&&!instance.origHash){instance.origHash=window.location.hash;}
if(instance.hashTimer){clearTimeout(instance.hashTimer);}
instance.hashTimer=setTimeout(function(){if("replaceState"in window.history){window.history[firstRun?"pushState":"replaceState"]({},document.title,window.location.pathname+window.location.search+"#"+instance.currentHash);if(firstRun){instance.hasCreatedHistory=true;}}else{window.location.hash=instance.currentHash;}
instance.hashTimer=null;},300);},"beforeClose.fb":function(e,instance,current){if(current.opts.hash===false){return;}
clearTimeout(instance.hashTimer);if(instance.currentHash&&instance.hasCreatedHistory){window.history.back();}else if(instance.currentHash){if("replaceState"in window.history){window.history.replaceState({},document.title,window.location.pathname+window.location.search+(instance.origHash||""));}else{window.location.hash=instance.origHash;}}
instance.currentHash=null;}});$(window).on("hashchange.fb",function(){var url=parseUrl(),fb=null;$.each($(".fancybox-container").get().reverse(),function(index,value){var tmp=$(value).data("FancyBox");if(tmp&&tmp.currentHash){fb=tmp;return false;}});if(fb){if(fb.currentHash!==url.gallery+"-"+url.index&&!(url.index===1&&fb.currentHash==url.gallery)){fb.currentHash=null;fb.close();}}else if(url.gallery!==""){triggerFromUrl(url);}});setTimeout(function(){if(!$.fancyboxforwp.getInstance()){triggerFromUrl(parseUrl());}},50);});})(window,document,jQuery);(function(document,$){"use strict";var prevTime=new Date().getTime();$(document).on({"onInit.fb":function(e,instance,current){instance.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll",function(e){var current=instance.current,currTime=new Date().getTime();if(instance.group.length<2||current.opts.wheel===false||(current.opts.wheel==="auto"&&current.type!=="image")){return;}
e.preventDefault();e.stopPropagation();if(current.$slide.hasClass("fancybox-animated")){return;}
e=e.originalEvent||e;if(currTime-prevTime<250){return;}
prevTime=currTime;instance[(-e.deltaY||-e.deltaX||e.wheelDelta||-e.detail)<0?"next":"previous"]();});}});})(document,jQuery);
var a_idx=0;
// jQuery(document).ready(function($){$("body").click(function(e){var a=new Array("你的自由就是很久不联络","你一直在玩","一直都在和你自己玩","你有你的我有我的","姿态","我们的生活并不虚幻","虚幻的是我们的理想","如果你要离去","如果你要离去","你经过了我吗","就改变了我吧","那么把胃口养坏了你再来","如果受伤了就喊一声痛","你踩着夏日的步伐离去","有着渴望回头的背影","就是放未去","来呼你留在阮的心","亲爱的","若我提起生活不是好重就是太轻","我继续","你要随意","peace","live","song","dance","life","love","Marlboro","Last","Lust","Lost","可爱又迷人的反派角色","快乐久久","梦梦梦梦梦梦梦","小梦大半","是你","林二一","i","want","every","single","piece","of","you","i","miss","you","so","soo","sooo","soooo","sooooo","much","自闭","自闭","自闭","自闭","自闭","自闭","自闭","自闭","自闭","自闭","自闭","自闭","自闭");var $i=$("<span/>").text(a[a_idx]);a_idx=(a_idx+1)%a.length;var x=e.pageX,y=e.pageY;$i.css({"z-index":999999999999999999999999999999999999999999999999999999999999999999999,"top":y-20,"left":x,"position":"absolute","font-weight":"bold","color":"rgb("+~~(255*Math.random())+","+~~(255*Math.random())+","+~~(255*Math.random())+")"});$("body").append($i);$i.animate({"top":y-180,"opacity":0},1500,function(){$i.remove();});});});
/*! jQuery v1.8.2 jquery.com | jquery.org/license */
(function(a,b){function G(a){var b=F[a]={};return p.each(a.split(s),function(a,c){b[c]=!0}),b}function J(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(I,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:+d+""===d?+d:H.test(d)?p.parseJSON(d):d}catch(f){}p.data(a,c,d)}else d=b}return d}function K(a){var b;for(b in a){if(b==="data"&&p.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function ba(){return!1}function bb(){return!0}function bh(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function bi(a,b){do a=a[b];while(a&&a.nodeType!==1);return a}function bj(a,b,c){b=b||0;if(p.isFunction(b))return p.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return p.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=p.grep(a,function(a){return a.nodeType===1});if(be.test(b))return p.filter(b,d,!c);b=p.filter(b,d)}return p.grep(a,function(a,d){return p.inArray(a,b)>=0===c})}function bk(a){var b=bl.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function bC(a,b){return a.getElementsByTagName(b)[0]||a.appendChild(a.ownerDocument.createElement(b))}function bD(a,b){if(b.nodeType!==1||!p.hasData(a))return;var c,d,e,f=p._data(a),g=p._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;d<e;d++)p.event.add(b,c,h[c][d])}g.data&&(g.data=p.extend({},g.data))}function bE(a,b){var c;if(b.nodeType!==1)return;b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?(b.parentNode&&(b.outerHTML=a.outerHTML),p.support.html5Clone&&a.innerHTML&&!p.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):c==="input"&&bv.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text),b.removeAttribute(p.expando)}function bF(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bG(a){bv.test(a.type)&&(a.defaultChecked=a.checked)}function bY(a,b){if(b in a)return b;var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=bW.length;while(e--){b=bW[e]+c;if(b in a)return b}return d}function bZ(a,b){return a=b||a,p.css(a,"display")==="none"||!p.contains(a.ownerDocument,a)}function b$(a,b){var c,d,e=[],f=0,g=a.length;for(;f<g;f++){c=a[f];if(!c.style)continue;e[f]=p._data(c,"olddisplay"),b?(!e[f]&&c.style.display==="none"&&(c.style.display=""),c.style.display===""&&bZ(c)&&(e[f]=p._data(c,"olddisplay",cc(c.nodeName)))):(d=bH(c,"display"),!e[f]&&d!=="none"&&p._data(c,"olddisplay",d))}for(f=0;f<g;f++){c=a[f];if(!c.style)continue;if(!b||c.style.display==="none"||c.style.display==="")c.style.display=b?e[f]||"":"none"}return a}function b_(a,b,c){var d=bP.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function ca(a,b,c,d){var e=c===(d?"border":"content")?4:b==="width"?1:0,f=0;for(;e<4;e+=2)c==="margin"&&(f+=p.css(a,c+bV[e],!0)),d?(c==="content"&&(f-=parseFloat(bH(a,"padding"+bV[e]))||0),c!=="margin"&&(f-=parseFloat(bH(a,"border"+bV[e]+"Width"))||0)):(f+=parseFloat(bH(a,"padding"+bV[e]))||0,c!=="padding"&&(f+=parseFloat(bH(a,"border"+bV[e]+"Width"))||0));return f}function cb(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=!0,f=p.support.boxSizing&&p.css(a,"boxSizing")==="border-box";if(d<=0||d==null){d=bH(a,b);if(d<0||d==null)d=a.style[b];if(bQ.test(d))return d;e=f&&(p.support.boxSizingReliable||d===a.style[b]),d=parseFloat(d)||0}return d+ca(a,b,c||(f?"border":"content"),e)+"px"}function cc(a){if(bS[a])return bS[a];var b=p("<"+a+">").appendTo(e.body),c=b.css("display");b.remove();if(c==="none"||c===""){bI=e.body.appendChild(bI||p.extend(e.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!bJ||!bI.createElement)bJ=(bI.contentWindow||bI.contentDocument).document,bJ.write("<!doctype html><html><body>"),bJ.close();b=bJ.body.appendChild(bJ.createElement(a)),c=bH(b,"display"),e.body.removeChild(bI)}return bS[a]=c,c}function ci(a,b,c,d){var e;if(p.isArray(b))p.each(b,function(b,e){c||ce.test(a)?d(a,e):ci(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)});else if(!c&&p.type(b)==="object")for(e in b)ci(a+"["+e+"]",b[e],c,d);else d(a,b)}function cz(a){return function(b,c){typeof b!="string"&&(c=b,b="*");var d,e,f,g=b.toLowerCase().split(s),h=0,i=g.length;if(p.isFunction(c))for(;h<i;h++)d=g[h],f=/^\+/.test(d),f&&(d=d.substr(1)||"*"),e=a[d]=a[d]||[],e[f?"unshift":"push"](c)}}function cA(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h,i=a[f],j=0,k=i?i.length:0,l=a===cv;for(;j<k&&(l||!h);j++)h=i[j](c,d,e),typeof h=="string"&&(!l||g[h]?h=b:(c.dataTypes.unshift(h),h=cA(a,c,d,e,h,g)));return(l||!h)&&!g["*"]&&(h=cA(a,c,d,e,"*",g)),h}function cB(a,c){var d,e,f=p.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((f[d]?a:e||(e={}))[d]=c[d]);e&&p.extend(!0,a,e)}function cC(a,c,d){var e,f,g,h,i=a.contents,j=a.dataTypes,k=a.responseFields;for(f in k)f in d&&(c[k[f]]=d[f]);while(j[0]==="*")j.shift(),e===b&&(e=a.mimeType||c.getResponseHeader("content-type"));if(e)for(f in i)if(i[f]&&i[f].test(e)){j.unshift(f);break}if(j[0]in d)g=j[0];else{for(f in d){if(!j[0]||a.converters[f+" "+j[0]]){g=f;break}h||(h=f)}g=g||h}if(g)return g!==j[0]&&j.unshift(g),d[g]}function cD(a,b){var c,d,e,f,g=a.dataTypes.slice(),h=g[0],i={},j=0;a.dataFilter&&(b=a.dataFilter(b,a.dataType));if(g[1])for(c in a.converters)i[c.toLowerCase()]=a.converters[c];for(;e=g[++j];)if(e!=="*"){if(h!=="*"&&h!==e){c=i[h+" "+e]||i["* "+e];if(!c)for(d in i){f=d.split(" ");if(f[1]===e){c=i[h+" "+f[0]]||i["* "+f[0]];if(c){c===!0?c=i[d]:i[d]!==!0&&(e=f[0],g.splice(j--,0,e));break}}}if(c!==!0)if(c&&a["throws"])b=c(b);else try{b=c(b)}catch(k){return{state:"parsererror",error:c?k:"No conversion from "+h+" to "+e}}}h=e}return{state:"success",data:b}}function cL(){try{return new a.XMLHttpRequest}catch(b){}}function cM(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function cU(){return setTimeout(function(){cN=b},0),cN=p.now()}function cV(a,b){p.each(b,function(b,c){var d=(cT[b]||[]).concat(cT["*"]),e=0,f=d.length;for(;e<f;e++)if(d[e].call(a,b,c))return})}function cW(a,b,c){var d,e=0,f=0,g=cS.length,h=p.Deferred().always(function(){delete i.elem}),i=function(){var b=cN||cU(),c=Math.max(0,j.startTime+j.duration-b),d=1-(c/j.duration||0),e=0,f=j.tweens.length;for(;e<f;e++)j.tweens[e].run(d);return h.notifyWith(a,[j,d,c]),d<1&&f?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:p.extend({},b),opts:p.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:cN||cU(),duration:c.duration,tweens:[],createTween:function(b,c,d){var e=p.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(e),e},stop:function(b){var c=0,d=b?j.tweens.length:0;for(;c<d;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;cX(k,j.opts.specialEasing);for(;e<g;e++){d=cS[e].call(j,a,k,j.opts);if(d)return d}return cV(j,k),p.isFunction(j.opts.start)&&j.opts.start.call(a,j),p.fx.timer(p.extend(i,{anim:j,queue:j.opts.queue,elem:a})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}function cX(a,b){var c,d,e,f,g;for(c in a){d=p.camelCase(c),e=b[d],f=a[c],p.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=p.cssHooks[d];if(g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}}function cY(a,b,c){var d,e,f,g,h,i,j,k,l=this,m=a.style,n={},o=[],q=a.nodeType&&bZ(a);c.queue||(j=p._queueHooks(a,"fx"),j.unqueued==null&&(j.unqueued=0,k=j.empty.fire,j.empty.fire=function(){j.unqueued||k()}),j.unqueued++,l.always(function(){l.always(function(){j.unqueued--,p.queue(a,"fx").length||j.empty.fire()})})),a.nodeType===1&&("height"in b||"width"in b)&&(c.overflow=[m.overflow,m.overflowX,m.overflowY],p.css(a,"display")==="inline"&&p.css(a,"float")==="none"&&(!p.support.inlineBlockNeedsLayout||cc(a.nodeName)==="inline"?m.display="inline-block":m.zoom=1)),c.overflow&&(m.overflow="hidden",p.support.shrinkWrapBlocks||l.done(function(){m.overflow=c.overflow[0],m.overflowX=c.overflow[1],m.overflowY=c.overflow[2]}));for(d in b){f=b[d];if(cP.exec(f)){delete b[d];if(f===(q?"hide":"show"))continue;o.push(d)}}g=o.length;if(g){h=p._data(a,"fxshow")||p._data(a,"fxshow",{}),q?p(a).show():l.done(function(){p(a).hide()}),l.done(function(){var b;p.removeData(a,"fxshow",!0);for(b in n)p.style(a,b,n[b])});for(d=0;d<g;d++)e=o[d],i=l.createTween(e,q?h[e]:0),n[e]=h[e]||p.style(a,e),e in h||(h[e]=i.start,q&&(i.end=i.start,i.start=e==="width"||e==="height"?1:0))}}function cZ(a,b,c,d,e){return new cZ.prototype.init(a,b,c,d,e)}function c$(a,b){var c,d={height:a},e=0;b=b?1:0;for(;e<4;e+=2-b)c=bV[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function da(a){return p.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}var c,d,e=a.document,f=a.location,g=a.navigator,h=a.jQuery,i=a.$,j=Array.prototype.push,k=Array.prototype.slice,l=Array.prototype.indexOf,m=Object.prototype.toString,n=Object.prototype.hasOwnProperty,o=String.prototype.trim,p=function(a,b){return new p.fn.init(a,b,c)},q=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,r=/\S/,s=/\s+/,t=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,u=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^[\],:{}\s]*$/,x=/(?:^|:|,)(?:\s*\[)+/g,y=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,z=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,A=/^-ms-/,B=/-([\da-z])/gi,C=function(a,b){return(b+"").toUpperCase()},D=function(){e.addEventListener?(e.removeEventListener("DOMContentLoaded",D,!1),p.ready()):e.readyState==="complete"&&(e.detachEvent("onreadystatechange",D),p.ready())},E={};p.fn=p.prototype={constructor:p,init:function(a,c,d){var f,g,h,i;if(!a)return this;if(a.nodeType)return this.context=this[0]=a,this.length=1,this;if(typeof a=="string"){a.charAt(0)==="<"&&a.charAt(a.length-1)===">"&&a.length>=3?f=[null,a,null]:f=u.exec(a);if(f&&(f[1]||!c)){if(f[1])return c=c instanceof p?c[0]:c,i=c&&c.nodeType?c.ownerDocument||c:e,a=p.parseHTML(f[1],i,!0),v.test(f[1])&&p.isPlainObject(c)&&this.attr.call(a,c,!0),p.merge(this,a);g=e.getElementById(f[2]);if(g&&g.parentNode){if(g.id!==f[2])return d.find(a);this.length=1,this[0]=g}return this.context=e,this.selector=a,this}return!c||c.jquery?(c||d).find(a):this.constructor(c).find(a)}return p.isFunction(a)?d.ready(a):(a.selector!==b&&(this.selector=a.selector,this.context=a.context),p.makeArray(a,this))},selector:"",jquery:"1.8.2",length:0,size:function(){return this.length},toArray:function(){return k.call(this)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=p.merge(this.constructor(),a);return d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")"),d},each:function(a,b){return p.each(this,a,b)},ready:function(a){return p.ready.promise().done(a),this},eq:function(a){return a=+a,a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(k.apply(this,arguments),"slice",k.call(arguments).join(","))},map:function(a){return this.pushStack(p.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:j,sort:[].sort,splice:[].splice},p.fn.init.prototype=p.fn,p.extend=p.fn.extend=function(){var a,c,d,e,f,g,h=arguments[0]||{},i=1,j=arguments.length,k=!1;typeof h=="boolean"&&(k=h,h=arguments[1]||{},i=2),typeof h!="object"&&!p.isFunction(h)&&(h={}),j===i&&(h=this,--i);for(;i<j;i++)if((a=arguments[i])!=null)for(c in a){d=h[c],e=a[c];if(h===e)continue;k&&e&&(p.isPlainObject(e)||(f=p.isArray(e)))?(f?(f=!1,g=d&&p.isArray(d)?d:[]):g=d&&p.isPlainObject(d)?d:{},h[c]=p.extend(k,g,e)):e!==b&&(h[c]=e)}return h},p.extend({noConflict:function(b){return a.$===p&&(a.$=i),b&&a.jQuery===p&&(a.jQuery=h),p},isReady:!1,readyWait:1,holdReady:function(a){a?p.readyWait++:p.ready(!0)},ready:function(a){if(a===!0?--p.readyWait:p.isReady)return;if(!e.body)return setTimeout(p.ready,1);p.isReady=!0;if(a!==!0&&--p.readyWait>0)return;d.resolveWith(e,[p]),p.fn.trigger&&p(e).trigger("ready").off("ready")},isFunction:function(a){return p.type(a)==="function"},isArray:Array.isArray||function(a){return p.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):E[m.call(a)]||"object"},isPlainObject:function(a){if(!a||p.type(a)!=="object"||a.nodeType||p.isWindow(a))return!1;try{if(a.constructor&&!n.call(a,"constructor")&&!n.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||n.call(a,d)},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},error:function(a){throw new Error(a)},parseHTML:function(a,b,c){var d;return!a||typeof a!="string"?null:(typeof b=="boolean"&&(c=b,b=0),b=b||e,(d=v.exec(a))?[b.createElement(d[1])]:(d=p.buildFragment([a],b,c?null:[]),p.merge([],(d.cacheable?p.clone(d.fragment):d.fragment).childNodes)))},parseJSON:function(b){if(!b||typeof b!="string")return null;b=p.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(w.test(b.replace(y,"@").replace(z,"]").replace(x,"")))return(new Function("return "+b))();p.error("Invalid JSON: "+b)},parseXML:function(c){var d,e;if(!c||typeof c!="string")return null;try{a.DOMParser?(e=new DOMParser,d=e.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(f){d=b}return(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&p.error("Invalid XML: "+c),d},noop:function(){},globalEval:function(b){b&&r.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(A,"ms-").replace(B,C)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,c,d){var e,f=0,g=a.length,h=g===b||p.isFunction(a);if(d){if(h){for(e in a)if(c.apply(a[e],d)===!1)break}else for(;f<g;)if(c.apply(a[f++],d)===!1)break}else if(h){for(e in a)if(c.call(a[e],e,a[e])===!1)break}else for(;f<g;)if(c.call(a[f],f,a[f++])===!1)break;return a},trim:o&&!o.call(" ")?function(a){return a==null?"":o.call(a)}:function(a){return a==null?"":(a+"").replace(t,"")},makeArray:function(a,b){var c,d=b||[];return a!=null&&(c=p.type(a),a.length==null||c==="string"||c==="function"||c==="regexp"||p.isWindow(a)?j.call(d,a):p.merge(d,a)),d},inArray:function(a,b,c){var d;if(b){if(l)return l.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=c.length,e=a.length,f=0;if(typeof d=="number")for(;f<d;f++)a[e++]=c[f];else while(c[f]!==b)a[e++]=c[f++];return a.length=e,a},grep:function(a,b,c){var d,e=[],f=0,g=a.length;c=!!c;for(;f<g;f++)d=!!b(a[f],f),c!==d&&e.push(a[f]);return e},map:function(a,c,d){var e,f,g=[],h=0,i=a.length,j=a instanceof p||i!==b&&typeof i=="number"&&(i>0&&a[0]&&a[i-1]||i===0||p.isArray(a));if(j)for(;h<i;h++)e=c(a[h],h,d),e!=null&&(g[g.length]=e);else for(f in a)e=c(a[f],f,d),e!=null&&(g[g.length]=e);return g.concat.apply([],g)},guid:1,proxy:function(a,c){var d,e,f;return typeof c=="string"&&(d=a[c],c=a,a=d),p.isFunction(a)?(e=k.call(arguments,2),f=function(){return a.apply(c,e.concat(k.call(arguments)))},f.guid=a.guid=a.guid||p.guid++,f):b},access:function(a,c,d,e,f,g,h){var i,j=d==null,k=0,l=a.length;if(d&&typeof d=="object"){for(k in d)p.access(a,c,k,d[k],1,g,e);f=1}else if(e!==b){i=h===b&&p.isFunction(e),j&&(i?(i=c,c=function(a,b,c){return i.call(p(a),c)}):(c.call(a,e),c=null));if(c)for(;k<l;k++)c(a[k],d,i?e.call(a[k],k,c(a[k],d)):e,h);f=1}return f?a:j?c.call(a):l?c(a[0],d):g},now:function(){return(new Date).getTime()}}),p.ready.promise=function(b){if(!d){d=p.Deferred();if(e.readyState==="complete")setTimeout(p.ready,1);else if(e.addEventListener)e.addEventListener("DOMContentLoaded",D,!1),a.addEventListener("load",p.ready,!1);else{e.attachEvent("onreadystatechange",D),a.attachEvent("onload",p.ready);var c=!1;try{c=a.frameElement==null&&e.documentElement}catch(f){}c&&c.doScroll&&function g(){if(!p.isReady){try{c.doScroll("left")}catch(a){return setTimeout(g,50)}p.ready()}}()}}return d.promise(b)},p.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){E["[object "+b+"]"]=b.toLowerCase()}),c=p(e);var F={};p.Callbacks=function(a){a=typeof a=="string"?F[a]||G(a):p.extend({},a);var c,d,e,f,g,h,i=[],j=!a.once&&[],k=function(b){c=a.memory&&b,d=!0,h=f||0,f=0,g=i.length,e=!0;for(;i&&h<g;h++)if(i[h].apply(b[0],b[1])===!1&&a.stopOnFalse){c=!1;break}e=!1,i&&(j?j.length&&k(j.shift()):c?i=[]:l.disable())},l={add:function(){if(i){var b=i.length;(function d(b){p.each(b,function(b,c){var e=p.type(c);e==="function"&&(!a.unique||!l.has(c))?i.push(c):c&&c.length&&e!=="string"&&d(c)})})(arguments),e?g=i.length:c&&(f=b,k(c))}return this},remove:function(){return i&&p.each(arguments,function(a,b){var c;while((c=p.inArray(b,i,c))>-1)i.splice(c,1),e&&(c<=g&&g--,c<=h&&h--)}),this},has:function(a){return p.inArray(a,i)>-1},empty:function(){return i=[],this},disable:function(){return i=j=c=b,this},disabled:function(){return!i},lock:function(){return j=b,c||l.disable(),this},locked:function(){return!j},fireWith:function(a,b){return b=b||[],b=[a,b.slice?b.slice():b],i&&(!d||j)&&(e?j.push(b):k(b)),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!d}};return l},p.extend({Deferred:function(a){var b=[["resolve","done",p.Callbacks("once memory"),"resolved"],["reject","fail",p.Callbacks("once memory"),"rejected"],["notify","progress",p.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return p.Deferred(function(c){p.each(b,function(b,d){var f=d[0],g=a[b];e[d[1]](p.isFunction(g)?function(){var a=g.apply(this,arguments);a&&p.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f+"With"](this===e?c:this,[a])}:c[f])}),a=null}).promise()},promise:function(a){return a!=null?p.extend(a,d):d}},e={};return d.pipe=d.then,p.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[a^1][2].disable,b[2][2].lock),e[f[0]]=g.fire,e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=k.call(arguments),d=c.length,e=d!==1||a&&p.isFunction(a.promise)?d:0,f=e===1?a:p.Deferred(),g=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?k.call(arguments):d,c===h?f.notifyWith(b,c):--e||f.resolveWith(b,c)}},h,i,j;if(d>1){h=new Array(d),i=new Array(d),j=new Array(d);for(;b<d;b++)c[b]&&p.isFunction(c[b].promise)?c[b].promise().done(g(b,j,c)).fail(f.reject).progress(g(b,i,h)):--e}return e||f.resolveWith(j,c),f.promise()}}),p.support=function(){var b,c,d,f,g,h,i,j,k,l,m,n=e.createElement("div");n.setAttribute("className","t"),n.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",c=n.getElementsByTagName("*"),d=n.getElementsByTagName("a")[0],d.style.cssText="top:1px;float:left;opacity:.5";if(!c||!c.length)return{};f=e.createElement("select"),g=f.appendChild(e.createElement("option")),h=n.getElementsByTagName("input")[0],b={leadingWhitespace:n.firstChild.nodeType===3,tbody:!n.getElementsByTagName("tbody").length,htmlSerialize:!!n.getElementsByTagName("link").length,style:/top/.test(d.getAttribute("style")),hrefNormalized:d.getAttribute("href")==="/a",opacity:/^0.5/.test(d.style.opacity),cssFloat:!!d.style.cssFloat,checkOn:h.value==="on",optSelected:g.selected,getSetAttribute:n.className!=="t",enctype:!!e.createElement("form").enctype,html5Clone:e.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",boxModel:e.compatMode==="CSS1Compat",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},h.checked=!0,b.noCloneChecked=h.cloneNode(!0).checked,f.disabled=!0,b.optDisabled=!g.disabled;try{delete n.test}catch(o){b.deleteExpando=!1}!n.addEventListener&&n.attachEvent&&n.fireEvent&&(n.attachEvent("onclick",m=function(){b.noCloneEvent=!1}),n.cloneNode(!0).fireEvent("onclick"),n.detachEvent("onclick",m)),h=e.createElement("input"),h.value="t",h.setAttribute("type","radio"),b.radioValue=h.value==="t",h.setAttribute("checked","checked"),h.setAttribute("name","t"),n.appendChild(h),i=e.createDocumentFragment(),i.appendChild(n.lastChild),b.checkClone=i.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=h.checked,i.removeChild(h),i.appendChild(n);if(n.attachEvent)for(k in{submit:!0,change:!0,focusin:!0})j="on"+k,l=j in n,l||(n.setAttribute(j,"return;"),l=typeof n[j]=="function"),b[k+"Bubbles"]=l;return p(function(){var c,d,f,g,h="padding:0;margin:0;border:0;display:block;overflow:hidden;",i=e.getElementsByTagName("body")[0];if(!i)return;c=e.createElement("div"),c.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px",i.insertBefore(c,i.firstChild),d=e.createElement("div"),c.appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",f=d.getElementsByTagName("td"),f[0].style.cssText="padding:0;margin:0;border:0;display:none",l=f[0].offsetHeight===0,f[0].style.display="",f[1].style.display="none",b.reliableHiddenOffsets=l&&f[0].offsetHeight===0,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",b.boxSizing=d.offsetWidth===4,b.doesNotIncludeMarginInBodyOffset=i.offsetTop!==1,a.getComputedStyle&&(b.pixelPosition=(a.getComputedStyle(d,null)||{}).top!=="1%",b.boxSizingReliable=(a.getComputedStyle(d,null)||{width:"4px"}).width==="4px",g=e.createElement("div"),g.style.cssText=d.style.cssText=h,g.style.marginRight=g.style.width="0",d.style.width="1px",d.appendChild(g),b.reliableMarginRight=!parseFloat((a.getComputedStyle(g,null)||{}).marginRight)),typeof d.style.zoom!="undefined"&&(d.innerHTML="",d.style.cssText=h+"width:1px;padding:1px;display:inline;zoom:1",b.inlineBlockNeedsLayout=d.offsetWidth===3,d.style.display="block",d.style.overflow="visible",d.innerHTML="<div></div>",d.firstChild.style.width="5px",b.shrinkWrapBlocks=d.offsetWidth!==3,c.style.zoom=1),i.removeChild(c),c=d=f=g=null}),i.removeChild(n),c=d=f=g=h=i=n=null,b}();var H=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,I=/([A-Z])/g;p.extend({cache:{},deletedIds:[],uuid:0,expando:"jQuery"+(p.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){return a=a.nodeType?p.cache[a[p.expando]]:a[p.expando],!!a&&!K(a)},data:function(a,c,d,e){if(!p.acceptData(a))return;var f,g,h=p.expando,i=typeof c=="string",j=a.nodeType,k=j?p.cache:a,l=j?a[h]:a[h]&&h;if((!l||!k[l]||!e&&!k[l].data)&&i&&d===b)return;l||(j?a[h]=l=p.deletedIds.pop()||p.guid++:l=h),k[l]||(k[l]={},j||(k[l].toJSON=p.noop));if(typeof c=="object"||typeof c=="function")e?k[l]=p.extend(k[l],c):k[l].data=p.extend(k[l].data,c);return f=k[l],e||(f.data||(f.data={}),f=f.data),d!==b&&(f[p.camelCase(c)]=d),i?(g=f[c],g==null&&(g=f[p.camelCase(c)])):g=f,g},removeData:function(a,b,c){if(!p.acceptData(a))return;var d,e,f,g=a.nodeType,h=g?p.cache:a,i=g?a[p.expando]:p.expando;if(!h[i])return;if(b){d=c?h[i]:h[i].data;if(d){p.isArray(b)||(b in d?b=[b]:(b=p.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,f=b.length;e<f;e++)delete d[b[e]];if(!(c?K:p.isEmptyObject)(d))return}}if(!c){delete h[i].data;if(!K(h[i]))return}g?p.cleanData([a],!0):p.support.deleteExpando||h!=h.window?delete h[i]:h[i]=null},_data:function(a,b,c){return p.data(a,b,c,!0)},acceptData:function(a){var b=a.nodeName&&p.noData[a.nodeName.toLowerCase()];return!b||b!==!0&&a.getAttribute("classid")===b}}),p.fn.extend({data:function(a,c){var d,e,f,g,h,i=this[0],j=0,k=null;if(a===b){if(this.length){k=p.data(i);if(i.nodeType===1&&!p._data(i,"parsedAttrs")){f=i.attributes;for(h=f.length;j<h;j++)g=f[j].name,g.indexOf("data-")||(g=p.camelCase(g.substring(5)),J(i,g,k[g]));p._data(i,"parsedAttrs",!0)}}return k}return typeof a=="object"?this.each(function(){p.data(this,a)}):(d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!",p.access(this,function(c){if(c===b)return k=this.triggerHandler("getData"+e,[d[0]]),k===b&&i&&(k=p.data(i,a),k=J(i,a,k)),k===b&&d[1]?this.data(d[0]):k;d[1]=c,this.each(function(){var b=p(this);b.triggerHandler("setData"+e,d),p.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1))},removeData:function(a){return this.each(function(){p.removeData(this,a)})}}),p.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=p._data(a,b),c&&(!d||p.isArray(c)?d=p._data(a,b,p.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=p.queue(a,b),d=c.length,e=c.shift(),f=p._queueHooks(a,b),g=function(){p.dequeue(a,b)};e==="inprogress"&&(e=c.shift(),d--),e&&(b==="fx"&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return p._data(a,c)||p._data(a,c,{empty:p.Callbacks("once memory").add(function(){p.removeData(a,b+"queue",!0),p.removeData(a,c,!0)})})}}),p.fn.extend({queue:function(a,c){var d=2;return typeof a!="string"&&(c=a,a="fx",d--),arguments.length<d?p.queue(this[0],a):c===b?this:this.each(function(){var b=p.queue(this,a,c);p._queueHooks(this,a),a==="fx"&&b[0]!=="inprogress"&&p.dequeue(this,a)})},dequeue:function(a){return this.each(function(){p.dequeue(this,a)})},delay:function(a,b){return a=p.fx?p.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){var d,e=1,f=p.Deferred(),g=this,h=this.length,i=function(){--e||f.resolveWith(g,[g])};typeof a!="string"&&(c=a,a=b),a=a||"fx";while(h--)d=p._data(g[h],a+"queueHooks"),d&&d.empty&&(e++,d.empty.add(i));return i(),f.promise(c)}});var L,M,N,O=/[\t\r\n]/g,P=/\r/g,Q=/^(?:button|input)$/i,R=/^(?:button|input|object|select|textarea)$/i,S=/^a(?:rea|)$/i,T=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,U=p.support.getSetAttribute;p.fn.extend({attr:function(a,b){return p.access(this,p.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){p.removeAttr(this,a)})},prop:function(a,b){return p.access(this,p.prop,a,b,arguments.length>1)},removeProp:function(a){return a=p.propFix[a]||a,this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,f,g,h;if(p.isFunction(a))return this.each(function(b){p(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(s);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{f=" "+e.className+" ";for(g=0,h=b.length;g<h;g++)f.indexOf(" "+b[g]+" ")<0&&(f+=b[g]+" ");e.className=p.trim(f)}}}return this},removeClass:function(a){var c,d,e,f,g,h,i;if(p.isFunction(a))return this.each(function(b){p(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(s);for(h=0,i=this.length;h<i;h++){e=this[h];if(e.nodeType===1&&e.className){d=(" "+e.className+" ").replace(O," ");for(f=0,g=c.length;f<g;f++)while(d.indexOf(" "+c[f]+" ")>=0)d=d.replace(" "+c[f]+" "," ");e.className=a?p.trim(d):""}}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";return p.isFunction(a)?this.each(function(c){p(this).toggleClass(a.call(this,c,this.className,b),b)}):this.each(function(){if(c==="string"){var e,f=0,g=p(this),h=b,i=a.split(s);while(e=i[f++])h=d?h:!g.hasClass(e),g[h?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&p._data(this,"__className__",this.className),this.className=this.className||a===!1?"":p._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(O," ").indexOf(b)>=0)return!0;return!1},val:function(a){var c,d,e,f=this[0];if(!arguments.length){if(f)return c=p.valHooks[f.type]||p.valHooks[f.nodeName.toLowerCase()],c&&"get"in c&&(d=c.get(f,"value"))!==b?d:(d=f.value,typeof d=="string"?d.replace(P,""):d==null?"":d);return}return e=p.isFunction(a),this.each(function(d){var f,g=p(this);if(this.nodeType!==1)return;e?f=a.call(this,d,g.val()):f=a,f==null?f="":typeof f=="number"?f+="":p.isArray(f)&&(f=p.map(f,function(a){return a==null?"":a+""})),c=p.valHooks[this.type]||p.valHooks[this.nodeName.toLowerCase()];if(!c||!("set"in c)||c.set(this,f,"value")===b)this.value=f})}}),p.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,f=a.selectedIndex,g=[],h=a.options,i=a.type==="select-one";if(f<0)return null;c=i?f:0,d=i?f+1:h.length;for(;c<d;c++){e=h[c];if(e.selected&&(p.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!p.nodeName(e.parentNode,"optgroup"))){b=p(e).val();if(i)return b;g.push(b)}}return i&&!g.length&&h.length?p(h[f]).val():g},set:function(a,b){var c=p.makeArray(b);return p(a).find("option").each(function(){this.selected=p.inArray(p(this).val(),c)>=0}),c.length||(a.selectedIndex=-1),c}}},attrFn:{},attr:function(a,c,d,e){var f,g,h,i=a.nodeType;if(!a||i===3||i===8||i===2)return;if(e&&p.isFunction(p.fn[c]))return p(a)[c](d);if(typeof a.getAttribute=="undefined")return p.prop(a,c,d);h=i!==1||!p.isXMLDoc(a),h&&(c=c.toLowerCase(),g=p.attrHooks[c]||(T.test(c)?M:L));if(d!==b){if(d===null){p.removeAttr(a,c);return}return g&&"set"in g&&h&&(f=g.set(a,d,c))!==b?f:(a.setAttribute(c,d+""),d)}return g&&"get"in g&&h&&(f=g.get(a,c))!==null?f:(f=a.getAttribute(c),f===null?b:f)},removeAttr:function(a,b){var c,d,e,f,g=0;if(b&&a.nodeType===1){d=b.split(s);for(;g<d.length;g++)e=d[g],e&&(c=p.propFix[e]||e,f=T.test(e),f||p.attr(a,e,""),a.removeAttribute(U?e:c),f&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(Q.test(a.nodeName)&&a.parentNode)p.error("type property can't be changed");else if(!p.support.radioValue&&b==="radio"&&p.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}},value:{get:function(a,b){return L&&p.nodeName(a,"button")?L.get(a,b):b in a?a.value:null},set:function(a,b,c){if(L&&p.nodeName(a,"button"))return L.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,f,g,h=a.nodeType;if(!a||h===3||h===8||h===2)return;return g=h!==1||!p.isXMLDoc(a),g&&(c=p.propFix[c]||c,f=p.propHooks[c]),d!==b?f&&"set"in f&&(e=f.set(a,d,c))!==b?e:a[c]=d:f&&"get"in f&&(e=f.get(a,c))!==null?e:a[c]},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):R.test(a.nodeName)||S.test(a.nodeName)&&a.href?0:b}}}}),M={get:function(a,c){var d,e=p.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;return b===!1?p.removeAttr(a,c):(d=p.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase())),c}},U||(N={name:!0,id:!0,coords:!0},L=p.valHooks.button={get:function(a,c){var d;return d=a.getAttributeNode(c),d&&(N[c]?d.value!=="":d.specified)?d.value:b},set:function(a,b,c){var d=a.getAttributeNode(c);return d||(d=e.createAttribute(c),a.setAttributeNode(d)),d.value=b+""}},p.each(["width","height"],function(a,b){p.attrHooks[b]=p.extend(p.attrHooks[b],{set:function(a,c){if(c==="")return a.setAttribute(b,"auto"),c}})}),p.attrHooks.contenteditable={get:L.get,set:function(a,b,c){b===""&&(b="false"),L.set(a,b,c)}}),p.support.hrefNormalized||p.each(["href","src","width","height"],function(a,c){p.attrHooks[c]=p.extend(p.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),p.support.style||(p.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=b+""}}),p.support.optSelected||(p.propHooks.selected=p.extend(p.propHooks.selected,{get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}})),p.support.enctype||(p.propFix.enctype="encoding"),p.support.checkOn||p.each(["radio","checkbox"],function(){p.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),p.each(["radio","checkbox"],function(){p.valHooks[this]=p.extend(p.valHooks[this],{set:function(a,b){if(p.isArray(b))return a.checked=p.inArray(p(a).val(),b)>=0}})});var V=/^(?:textarea|input|select)$/i,W=/^([^\.]*|)(?:\.(.+)|)$/,X=/(?:^|\s)hover(\.\S+|)\b/,Y=/^key/,Z=/^(?:mouse|contextmenu)|click/,$=/^(?:focusinfocus|focusoutblur)$/,_=function(a){return p.event.special.hover?a:a.replace(X,"mouseenter$1 mouseleave$1")};p.event={add:function(a,c,d,e,f){var g,h,i,j,k,l,m,n,o,q,r;if(a.nodeType===3||a.nodeType===8||!c||!d||!(g=p._data(a)))return;d.handler&&(o=d,d=o.handler,f=o.selector),d.guid||(d.guid=p.guid++),i=g.events,i||(g.events=i={}),h=g.handle,h||(g.handle=h=function(a){return typeof p!="undefined"&&(!a||p.event.triggered!==a.type)?p.event.dispatch.apply(h.elem,arguments):b},h.elem=a),c=p.trim(_(c)).split(" ");for(j=0;j<c.length;j++){k=W.exec(c[j])||[],l=k[1],m=(k[2]||"").split(".").sort(),r=p.event.special[l]||{},l=(f?r.delegateType:r.bindType)||l,r=p.event.special[l]||{},n=p.extend({type:l,origType:k[1],data:e,handler:d,guid:d.guid,selector:f,needsContext:f&&p.expr.match.needsContext.test(f),namespace:m.join(".")},o),q=i[l];if(!q){q=i[l]=[],q.delegateCount=0;if(!r.setup||r.setup.call(a,e,m,h)===!1)a.addEventListener?a.addEventListener(l,h,!1):a.attachEvent&&a.attachEvent("on"+l,h)}r.add&&(r.add.call(a,n),n.handler.guid||(n.handler.guid=d.guid)),f?q.splice(q.delegateCount++,0,n):q.push(n),p.event.global[l]=!0}a=null},global:{},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,q,r=p.hasData(a)&&p._data(a);if(!r||!(m=r.events))return;b=p.trim(_(b||"")).split(" ");for(f=0;f<b.length;f++){g=W.exec(b[f])||[],h=i=g[1],j=g[2];if(!h){for(h in m)p.event.remove(a,h+b[f],c,d,!0);continue}n=p.event.special[h]||{},h=(d?n.delegateType:n.bindType)||h,o=m[h]||[],k=o.length,j=j?new RegExp("(^|\\.)"+j.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(l=0;l<o.length;l++)q=o[l],(e||i===q.origType)&&(!c||c.guid===q.guid)&&(!j||j.test(q.namespace))&&(!d||d===q.selector||d==="**"&&q.selector)&&(o.splice(l--,1),q.selector&&o.delegateCount--,n.remove&&n.remove.call(a,q));o.length===0&&k!==o.length&&((!n.teardown||n.teardown.call(a,j,r.handle)===!1)&&p.removeEvent(a,h,r.handle),delete m[h])}p.isEmptyObject(m)&&(delete r.handle,p.removeData(a,"events",!0))},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,f,g){if(!f||f.nodeType!==3&&f.nodeType!==8){var h,i,j,k,l,m,n,o,q,r,s=c.type||c,t=[];if($.test(s+p.event.triggered))return;s.indexOf("!")>=0&&(s=s.slice(0,-1),i=!0),s.indexOf(".")>=0&&(t=s.split("."),s=t.shift(),t.sort());if((!f||p.event.customEvent[s])&&!p.event.global[s])return;c=typeof c=="object"?c[p.expando]?c:new p.Event(s,c):new p.Event(s),c.type=s,c.isTrigger=!0,c.exclusive=i,c.namespace=t.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+t.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,m=s.indexOf(":")<0?"on"+s:"";if(!f){h=p.cache;for(j in h)h[j].events&&h[j].events[s]&&p.event.trigger(c,d,h[j].handle.elem,!0);return}c.result=b,c.target||(c.target=f),d=d!=null?p.makeArray(d):[],d.unshift(c),n=p.event.special[s]||{};if(n.trigger&&n.trigger.apply(f,d)===!1)return;q=[[f,n.bindType||s]];if(!g&&!n.noBubble&&!p.isWindow(f)){r=n.delegateType||s,k=$.test(r+s)?f:f.parentNode;for(l=f;k;k=k.parentNode)q.push([k,r]),l=k;l===(f.ownerDocument||e)&&q.push([l.defaultView||l.parentWindow||a,r])}for(j=0;j<q.length&&!c.isPropagationStopped();j++)k=q[j][0],c.type=q[j][1],o=(p._data(k,"events")||{})[c.type]&&p._data(k,"handle"),o&&o.apply(k,d),o=m&&k[m],o&&p.acceptData(k)&&o.apply&&o.apply(k,d)===!1&&c.preventDefault();return c.type=s,!g&&!c.isDefaultPrevented()&&(!n._default||n._default.apply(f.ownerDocument,d)===!1)&&(s!=="click"||!p.nodeName(f,"a"))&&p.acceptData(f)&&m&&f[s]&&(s!=="focus"&&s!=="blur"||c.target.offsetWidth!==0)&&!p.isWindow(f)&&(l=f[m],l&&(f[m]=null),p.event.triggered=s,f[s](),p.event.triggered=b,l&&(f[m]=l)),c.result}return},dispatch:function(c){c=p.event.fix(c||a.event);var d,e,f,g,h,i,j,l,m,n,o=(p._data(this,"events")||{})[c.type]||[],q=o.delegateCount,r=k.call(arguments),s=!c.exclusive&&!c.namespace,t=p.event.special[c.type]||{},u=[];r[0]=c,c.delegateTarget=this;if(t.preDispatch&&t.preDispatch.call(this,c)===!1)return;if(q&&(!c.button||c.type!=="click"))for(f=c.target;f!=this;f=f.parentNode||this)if(f.disabled!==!0||c.type!=="click"){h={},j=[];for(d=0;d<q;d++)l=o[d],m=l.selector,h[m]===b&&(h[m]=l.needsContext?p(m,this).index(f)>=0:p.find(m,this,null,[f]).length),h[m]&&j.push(l);j.length&&u.push({elem:f,matches:j})}o.length>q&&u.push({elem:this,matches:o.slice(q)});for(d=0;d<u.length&&!c.isPropagationStopped();d++){i=u[d],c.currentTarget=i.elem;for(e=0;e<i.matches.length&&!c.isImmediatePropagationStopped();e++){l=i.matches[e];if(s||!c.namespace&&!l.namespace||c.namespace_re&&c.namespace_re.test(l.namespace))c.data=l.data,c.handleObj=l,g=((p.event.special[l.origType]||{}).handle||l.handler).apply(i.elem,r),g!==b&&(c.result=g,g===!1&&(c.preventDefault(),c.stopPropagation()))}}return t.postDispatch&&t.postDispatch.call(this,c),c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,c){var d,f,g,h=c.button,i=c.fromElement;return a.pageX==null&&c.clientX!=null&&(d=a.target.ownerDocument||e,f=d.documentElement,g=d.body,a.pageX=c.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=c.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?c.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0),a}},fix:function(a){if(a[p.expando])return a;var b,c,d=a,f=p.event.fixHooks[a.type]||{},g=f.props?this.props.concat(f.props):this.props;a=p.Event(d);for(b=g.length;b;)c=g[--b],a[c]=d[c];return a.target||(a.target=d.srcElement||e),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,f.filter?f.filter(a,d):a},special:{load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){p.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=p.extend(new p.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?p.event.trigger(e,null,b):p.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},p.event.handle=p.event.dispatch,p.removeEvent=e.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]=="undefined"&&(a[d]=null),a.detachEvent(d,c))},p.Event=function(a,b){if(this instanceof p.Event)a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?bb:ba):this.type=a,b&&p.extend(this,b),this.timeStamp=a&&a.timeStamp||p.now(),this[p.expando]=!0;else return new p.Event(a,b)},p.Event.prototype={preventDefault:function(){this.isDefaultPrevented=bb;var a=this.originalEvent;if(!a)return;a.preventDefault?a.preventDefault():a.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=bb;var a=this.originalEvent;if(!a)return;a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=bb,this.stopPropagation()},isDefaultPrevented:ba,isPropagationStopped:ba,isImmediatePropagationStopped:ba},p.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){p.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj,g=f.selector;if(!e||e!==d&&!p.contains(d,e))a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b;return c}}}),p.support.submitBubbles||(p.event.special.submit={setup:function(){if(p.nodeName(this,"form"))return!1;p.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=p.nodeName(c,"input")||p.nodeName(c,"button")?c.form:b;d&&!p._data(d,"_submit_attached")&&(p.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),p._data(d,"_submit_attached",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&p.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(p.nodeName(this,"form"))return!1;p.event.remove(this,"._submit")}}),p.support.changeBubbles||(p.event.special.change={setup:function(){if(V.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")p.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),p.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),p.event.simulate("change",this,a,!0)});return!1}p.event.add(this,"beforeactivate._change",function(a){var b=a.target;V.test(b.nodeName)&&!p._data(b,"_change_attached")&&(p.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&p.event.simulate("change",this.parentNode,a,!0)}),p._data(b,"_change_attached",!0))})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){return p.event.remove(this,"._change"),!V.test(this.nodeName)}}),p.support.focusinBubbles||p.each({focus:"focusin",blur:"focusout"},function(a,b){var c=0,d=function(a){p.event.simulate(b,a.target,p.event.fix(a),!0)};p.event.special[b]={setup:function(){c++===0&&e.addEventListener(a,d,!0)},teardown:function(){--c===0&&e.removeEventListener(a,d,!0)}}}),p.fn.extend({on:function(a,c,d,e,f){var g,h;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(h in a)this.on(h,c,d,a[h],f);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=ba;else if(!e)return this;return f===1&&(g=e,e=function(a){return p().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=p.guid++)),this.each(function(){p.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){var e,f;if(a&&a.preventDefault&&a.handleObj)return e=a.handleObj,p(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler),this;if(typeof a=="object"){for(f in a)this.off(f,c,a[f]);return this}if(c===!1||typeof c=="function")d=c,c=b;return d===!1&&(d=ba),this.each(function(){p.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){return p(this.context).on(a,this.selector,b,c),this},die:function(a,b){return p(this.context).off(a,this.selector||"**",b),this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length===1?this.off(a,"**"):this.off(b,a||"**",c)},trigger:function(a,b){return this.each(function(){p.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return p.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||p.guid++,d=0,e=function(c){var e=(p._data(this,"lastToggle"+a.guid)||0)%d;return p._data(this,"lastToggle"+a.guid,e+1),c.preventDefault(),b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),p.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){p.fn[b]=function(a,c){return c==null&&(c=a,a=null),arguments.length>0?this.on(b,null,a,c):this.trigger(b)},Y.test(b)&&(p.event.fixHooks[b]=p.event.keyHooks),Z.test(b)&&(p.event.fixHooks[b]=p.event.mouseHooks)}),function(a,b){function bc(a,b,c,d){c=c||[],b=b||r;var e,f,i,j,k=b.nodeType;if(!a||typeof a!="string")return c;if(k!==1&&k!==9)return[];i=g(b);if(!i&&!d)if(e=P.exec(a))if(j=e[1]){if(k===9){f=b.getElementById(j);if(!f||!f.parentNode)return c;if(f.id===j)return c.push(f),c}else if(b.ownerDocument&&(f=b.ownerDocument.getElementById(j))&&h(b,f)&&f.id===j)return c.push(f),c}else{if(e[2])return w.apply(c,x.call(b.getElementsByTagName(a),0)),c;if((j=e[3])&&_&&b.getElementsByClassName)return w.apply(c,x.call(b.getElementsByClassName(j),0)),c}return bp(a.replace(L,"$1"),b,c,d,i)}function bd(a){return function(b){var c=b.nodeName.toLowerCase();return c==="input"&&b.type===a}}function be(a){return function(b){var c=b.nodeName.toLowerCase();return(c==="input"||c==="button")&&b.type===a}}function bf(a){return z(function(b){return b=+b,z(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function bg(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}function bh(a,b){var c,d,f,g,h,i,j,k=C[o][a];if(k)return b?0:k.slice(0);h=a,i=[],j=e.preFilter;while(h){if(!c||(d=M.exec(h)))d&&(h=h.slice(d[0].length)),i.push(f=[]);c=!1;if(d=N.exec(h))f.push(c=new q(d.shift())),h=h.slice(c.length),c.type=d[0].replace(L," ");for(g in e.filter)(d=W[g].exec(h))&&(!j[g]||(d=j[g](d,r,!0)))&&(f.push(c=new q(d.shift())),h=h.slice(c.length),c.type=g,c.matches=d);if(!c)break}return b?h.length:h?bc.error(a):C(a,i).slice(0)}function bi(a,b,d){var e=b.dir,f=d&&b.dir==="parentNode",g=u++;return b.first?function(b,c,d){while(b=b[e])if(f||b.nodeType===1)return a(b,c,d)}:function(b,d,h){if(!h){var i,j=t+" "+g+" ",k=j+c;while(b=b[e])if(f||b.nodeType===1){if((i=b[o])===k)return b.sizset;if(typeof i=="string"&&i.indexOf(j)===0){if(b.sizset)return b}else{b[o]=k;if(a(b,d,h))return b.sizset=!0,b;b.sizset=!1}}}else while(b=b[e])if(f||b.nodeType===1)if(a(b,d,h))return b}}function bj(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function bk(a,b,c,d,e){var f,g=[],h=0,i=a.length,j=b!=null;for(;h<i;h++)if(f=a[h])if(!c||c(f,d,e))g.push(f),j&&b.push(h);return g}function bl(a,b,c,d,e,f){return d&&!d[o]&&(d=bl(d)),e&&!e[o]&&(e=bl(e,f)),z(function(f,g,h,i){if(f&&e)return;var j,k,l,m=[],n=[],o=g.length,p=f||bo(b||"*",h.nodeType?[h]:h,[],f),q=a&&(f||!b)?bk(p,m,a,h,i):p,r=c?e||(f?a:o||d)?[]:g:q;c&&c(q,r,h,i);if(d){l=bk(r,n),d(l,[],h,i),j=l.length;while(j--)if(k=l[j])r[n[j]]=!(q[n[j]]=k)}if(f){j=a&&r.length;while(j--)if(k=r[j])f[m[j]]=!(g[m[j]]=k)}else r=bk(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):w.apply(g,r)})}function bm(a){var b,c,d,f=a.length,g=e.relative[a[0].type],h=g||e.relative[" "],i=g?1:0,j=bi(function(a){return a===b},h,!0),k=bi(function(a){return y.call(b,a)>-1},h,!0),m=[function(a,c,d){return!g&&(d||c!==l)||((b=c).nodeType?j(a,c,d):k(a,c,d))}];for(;i<f;i++)if(c=e.relative[a[i].type])m=[bi(bj(m),c)];else{c=e.filter[a[i].type].apply(null,a[i].matches);if(c[o]){d=++i;for(;d<f;d++)if(e.relative[a[d].type])break;return bl(i>1&&bj(m),i>1&&a.slice(0,i-1).join("").replace(L,"$1"),c,i<d&&bm(a.slice(i,d)),d<f&&bm(a=a.slice(d)),d<f&&a.join(""))}m.push(c)}return bj(m)}function bn(a,b){var d=b.length>0,f=a.length>0,g=function(h,i,j,k,m){var n,o,p,q=[],s=0,u="0",x=h&&[],y=m!=null,z=l,A=h||f&&e.find.TAG("*",m&&i.parentNode||i),B=t+=z==null?1:Math.E;y&&(l=i!==r&&i,c=g.el);for(;(n=A[u])!=null;u++){if(f&&n){for(o=0;p=a[o];o++)if(p(n,i,j)){k.push(n);break}y&&(t=B,c=++g.el)}d&&((n=!p&&n)&&s--,h&&x.push(n))}s+=u;if(d&&u!==s){for(o=0;p=b[o];o++)p(x,q,i,j);if(h){if(s>0)while(u--)!x[u]&&!q[u]&&(q[u]=v.call(k));q=bk(q)}w.apply(k,q),y&&!h&&q.length>0&&s+b.length>1&&bc.uniqueSort(k)}return y&&(t=B,l=z),x};return g.el=0,d?z(g):g}function bo(a,b,c,d){var e=0,f=b.length;for(;e<f;e++)bc(a,b[e],c,d);return c}function bp(a,b,c,d,f){var g,h,j,k,l,m=bh(a),n=m.length;if(!d&&m.length===1){h=m[0]=m[0].slice(0);if(h.length>2&&(j=h[0]).type==="ID"&&b.nodeType===9&&!f&&e.relative[h[1].type]){b=e.find.ID(j.matches[0].replace(V,""),b,f)[0];if(!b)return c;a=a.slice(h.shift().length)}for(g=W.POS.test(a)?-1:h.length-1;g>=0;g--){j=h[g];if(e.relative[k=j.type])break;if(l=e.find[k])if(d=l(j.matches[0].replace(V,""),R.test(h[0].type)&&b.parentNode||b,f)){h.splice(g,1),a=d.length&&h.join("");if(!a)return w.apply(c,x.call(d,0)),c;break}}}return i(a,m)(d,b,f,c,R.test(a)),c}function bq(){}var c,d,e,f,g,h,i,j,k,l,m=!0,n="undefined",o=("sizcache"+Math.random()).replace(".",""),q=String,r=a.document,s=r.documentElement,t=0,u=0,v=[].pop,w=[].push,x=[].slice,y=[].indexOf||function(a){var b=0,c=this.length;for(;b<c;b++)if(this[b]===a)return b;return-1},z=function(a,b){return a[o]=b==null||b,a},A=function(){var a={},b=[];return z(function(c,d){return b.push(c)>e.cacheLength&&delete a[b.shift()],a[c]=d},a)},B=A(),C=A(),D=A(),E="[\\x20\\t\\r\\n\\f]",F="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",G=F.replace("w","w#"),H="([*^$|!~]?=)",I="\\["+E+"*("+F+")"+E+"*(?:"+H+E+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+G+")|)|)"+E+"*\\]",J=":("+F+")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:"+I+")|[^:]|\\\\.)*|.*))\\)|)",K=":(even|odd|eq|gt|lt|nth|first|last)(?:\\("+E+"*((?:-\\d)?\\d*)"+E+"*\\)|)(?=[^-]|$)",L=new RegExp("^"+E+"+|((?:^|[^\\\\])(?:\\\\.)*)"+E+"+$","g"),M=new RegExp("^"+E+"*,"+E+"*"),N=new RegExp("^"+E+"*([\\x20\\t\\r\\n\\f>+~])"+E+"*"),O=new RegExp(J),P=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,Q=/^:not/,R=/[\x20\t\r\n\f]*[+~]/,S=/:not\($/,T=/h\d/i,U=/input|select|textarea|button/i,V=/\\(?!\\)/g,W={ID:new RegExp("^#("+F+")"),CLASS:new RegExp("^\\.("+F+")"),NAME:new RegExp("^\\[name=['\"]?("+F+")['\"]?\\]"),TAG:new RegExp("^("+F.replace("w","w*")+")"),ATTR:new RegExp("^"+I),PSEUDO:new RegExp("^"+J),POS:new RegExp(K,"i"),CHILD:new RegExp("^:(only|nth|first|last)-child(?:\\("+E+"*(even|odd|(([+-]|)(\\d*)n|)"+E+"*(?:([+-]|)"+E+"*(\\d+)|))"+E+"*\\)|)","i"),needsContext:new RegExp("^"+E+"*[>+~]|"+K,"i")},X=function(a){var b=r.createElement("div");try{return a(b)}catch(c){return!1}finally{b=null}},Y=X(function(a){return a.appendChild(r.createComment("")),!a.getElementsByTagName("*").length}),Z=X(function(a){return a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!==n&&a.firstChild.getAttribute("href")==="#"}),$=X(function(a){a.innerHTML="<select></select>";var b=typeof a.lastChild.getAttribute("multiple");return b!=="boolean"&&b!=="string"}),_=X(function(a){return a.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",!a.getElementsByClassName||!a.getElementsByClassName("e").length?!1:(a.lastChild.className="e",a.getElementsByClassName("e").length===2)}),ba=X(function(a){a.id=o+0,a.innerHTML="<a name='"+o+"'></a><div name='"+o+"'></div>",s.insertBefore(a,s.firstChild);var b=r.getElementsByName&&r.getElementsByName(o).length===2+r.getElementsByName(o+0).length;return d=!r.getElementById(o),s.removeChild(a),b});try{x.call(s.childNodes,0)[0].nodeType}catch(bb){x=function(a){var b,c=[];for(;b=this[a];a++)c.push(b);return c}}bc.matches=function(a,b){return bc(a,null,null,b)},bc.matchesSelector=function(a,b){return bc(b,null,null,[a]).length>0},f=bc.getText=function(a){var b,c="",d=0,e=a.nodeType;if(e){if(e===1||e===9||e===11){if(typeof a.textContent=="string")return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=f(a)}else if(e===3||e===4)return a.nodeValue}else for(;b=a[d];d++)c+=f(b);return c},g=bc.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?b.nodeName!=="HTML":!1},h=bc.contains=s.contains?function(a,b){var c=a.nodeType===9?a.documentElement:a,d=b&&b.parentNode;return a===d||!!(d&&d.nodeType===1&&c.contains&&c.contains(d))}:s.compareDocumentPosition?function(a,b){return b&&!!(a.compareDocumentPosition(b)&16)}:function(a,b){while(b=b.parentNode)if(b===a)return!0;return!1},bc.attr=function(a,b){var c,d=g(a);return d||(b=b.toLowerCase()),(c=e.attrHandle[b])?c(a):d||$?a.getAttribute(b):(c=a.getAttributeNode(b),c?typeof a[b]=="boolean"?a[b]?b:null:c.specified?c.value:null:null)},e=bc.selectors={cacheLength:50,createPseudo:z,match:W,attrHandle:Z?{}:{href:function(a){return a.getAttribute("href",2)},type:function(a){return a.getAttribute("type")}},find:{ID:d?function(a,b,c){if(typeof b.getElementById!==n&&!c){var d=b.getElementById(a);return d&&d.parentNode?[d]:[]}}:function(a,c,d){if(typeof c.getElementById!==n&&!d){var e=c.getElementById(a);return e?e.id===a||typeof e.getAttributeNode!==n&&e.getAttributeNode("id").value===a?[e]:b:[]}},TAG:Y?function(a,b){if(typeof b.getElementsByTagName!==n)return b.getElementsByTagName(a)}:function(a,b){var c=b.getElementsByTagName(a);if(a==="*"){var d,e=[],f=0;for(;d=c[f];f++)d.nodeType===1&&e.push(d);return e}return c},NAME:ba&&function(a,b){if(typeof b.getElementsByName!==n)return b.getElementsByName(name)},CLASS:_&&function(a,b,c){if(typeof b.getElementsByClassName!==n&&!c)return b.getElementsByClassName(a)}},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(V,""),a[3]=(a[4]||a[5]||"").replace(V,""),a[2]==="~="&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),a[1]==="nth"?(a[2]||bc.error(a[0]),a[3]=+(a[3]?a[4]+(a[5]||1):2*(a[2]==="even"||a[2]==="odd")),a[4]=+(a[6]+a[7]||a[2]==="odd")):a[2]&&bc.error(a[0]),a},PSEUDO:function(a){var b,c;if(W.CHILD.test(a[0]))return null;if(a[3])a[2]=a[3];else if(b=a[4])O.test(b)&&(c=bh(b,!0))&&(c=b.indexOf(")",b.length-c)-b.length)&&(b=b.slice(0,c),a[0]=a[0].slice(0,c)),a[2]=b;return a.slice(0,3)}},filter:{ID:d?function(a){return a=a.replace(V,""),function(b){return b.getAttribute("id")===a}}:function(a){return a=a.replace(V,""),function(b){var c=typeof b.getAttributeNode!==n&&b.getAttributeNode("id");return c&&c.value===a}},TAG:function(a){return a==="*"?function(){return!0}:(a=a.replace(V,"").toLowerCase(),function(b){return b.nodeName&&b.nodeName.toLowerCase()===a})},CLASS:function(a){var b=B[o][a];return b||(b=B(a,new RegExp("(^|"+E+")"+a+"("+E+"|$)"))),function(a){return b.test(a.className||typeof a.getAttribute!==n&&a.getAttribute("class")||"")}},ATTR:function(a,b,c){return function(d,e){var f=bc.attr(d,a);return f==null?b==="!=":b?(f+="",b==="="?f===c:b==="!="?f!==c:b==="^="?c&&f.indexOf(c)===0:b==="*="?c&&f.indexOf(c)>-1:b==="$="?c&&f.substr(f.length-c.length)===c:b==="~="?(" "+f+" ").indexOf(c)>-1:b==="|="?f===c||f.substr(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d){return a==="nth"?function(a){var b,e,f=a.parentNode;if(c===1&&d===0)return!0;if(f){e=0;for(b=f.firstChild;b;b=b.nextSibling)if(b.nodeType===1){e++;if(a===b)break}}return e-=d,e===c||e%c===0&&e/c>=0}:function(b){var c=b;switch(a){case"only":case"first":while(c=c.previousSibling)if(c.nodeType===1)return!1;if(a==="first")return!0;c=b;case"last":while(c=c.nextSibling)if(c.nodeType===1)return!1;return!0}}},PSEUDO:function(a,b){var c,d=e.pseudos[a]||e.setFilters[a.toLowerCase()]||bc.error("unsupported pseudo: "+a);return d[o]?d(b):d.length>1?(c=[a,a,"",b],e.setFilters.hasOwnProperty(a.toLowerCase())?z(function(a,c){var e,f=d(a,b),g=f.length;while(g--)e=y.call(a,f[g]),a[e]=!(c[e]=f[g])}):function(a){return d(a,0,c)}):d}},pseudos:{not:z(function(a){var b=[],c=[],d=i(a.replace(L,"$1"));return d[o]?z(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)if(f=g[h])a[h]=!(b[h]=f)}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:z(function(a){return function(b){return bc(a,b).length>0}}),contains:z(function(a){return function(b){return(b.textContent||b.innerText||f(b)).indexOf(a)>-1}}),enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&!!a.checked||b==="option"&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},parent:function(a){return!e.pseudos.empty(a)},empty:function(a){var b;a=a.firstChild;while(a){if(a.nodeName>"@"||(b=a.nodeType)===3||b===4)return!1;a=a.nextSibling}return!0},header:function(a){return T.test(a.nodeName)},text:function(a){var b,c;return a.nodeName.toLowerCase()==="input"&&(b=a.type)==="text"&&((c=a.getAttribute("type"))==null||c.toLowerCase()===b)},radio:bd("radio"),checkbox:bd("checkbox"),file:bd("file"),password:bd("password"),image:bd("image"),submit:be("submit"),reset:be("reset"),button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&a.type==="button"||b==="button"},input:function(a){return U.test(a.nodeName)},focus:function(a){var b=a.ownerDocument;return a===b.activeElement&&(!b.hasFocus||b.hasFocus())&&(!!a.type||!!a.href)},active:function(a){return a===a.ownerDocument.activeElement},first:bf(function(a,b,c){return[0]}),last:bf(function(a,b,c){return[b-1]}),eq:bf(function(a,b,c){return[c<0?c+b:c]}),even:bf(function(a,b,c){for(var d=0;d<b;d+=2)a.push(d);return a}),odd:bf(function(a,b,c){for(var d=1;d<b;d+=2)a.push(d);return a}),lt:bf(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:bf(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},j=s.compareDocumentPosition?function(a,b){return a===b?(k=!0,0):(!a.compareDocumentPosition||!b.compareDocumentPosition?a.compareDocumentPosition:a.compareDocumentPosition(b)&4)?-1:1}:function(a,b){if(a===b)return k=!0,0;if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,h=b.parentNode,i=g;if(g===h)return bg(a,b);if(!g)return-1;if(!h)return 1;while(i)e.unshift(i),i=i.parentNode;i=h;while(i)f.unshift(i),i=i.parentNode;c=e.length,d=f.length;for(var j=0;j<c&&j<d;j++)if(e[j]!==f[j])return bg(e[j],f[j]);return j===c?bg(a,f[j],-1):bg(e[j],b,1)},[0,0].sort(j),m=!k,bc.uniqueSort=function(a){var b,c=1;k=m,a.sort(j);if(k)for(;b=a[c];c++)b===a[c-1]&&a.splice(c--,1);return a},bc.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},i=bc.compile=function(a,b){var c,d=[],e=[],f=D[o][a];if(!f){b||(b=bh(a)),c=b.length;while(c--)f=bm(b[c]),f[o]?d.push(f):e.push(f);f=D(a,bn(e,d))}return f},r.querySelectorAll&&function(){var a,b=bp,c=/'|\\/g,d=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,e=[":focus"],f=[":active",":focus"],h=s.matchesSelector||s.mozMatchesSelector||s.webkitMatchesSelector||s.oMatchesSelector||s.msMatchesSelector;X(function(a){a.innerHTML="<select><option selected=''></option></select>",a.querySelectorAll("[selected]").length||e.push("\\["+E+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),a.querySelectorAll(":checked").length||e.push(":checked")}),X(function(a){a.innerHTML="<p test=''></p>",a.querySelectorAll("[test^='']").length&&e.push("[*^$]="+E+"*(?:\"\"|'')"),a.innerHTML="<input type='hidden'/>",a.querySelectorAll(":enabled").length||e.push(":enabled",":disabled")}),e=new RegExp(e.join("|")),bp=function(a,d,f,g,h){if(!g&&!h&&(!e||!e.test(a))){var i,j,k=!0,l=o,m=d,n=d.nodeType===9&&a;if(d.nodeType===1&&d.nodeName.toLowerCase()!=="object"){i=bh(a),(k=d.getAttribute("id"))?l=k.replace(c,"\\$&"):d.setAttribute("id",l),l="[id='"+l+"'] ",j=i.length;while(j--)i[j]=l+i[j].join("");m=R.test(a)&&d.parentNode||d,n=i.join(",")}if(n)try{return w.apply(f,x.call(m.querySelectorAll(n),0)),f}catch(p){}finally{k||d.removeAttribute("id")}}return b(a,d,f,g,h)},h&&(X(function(b){a=h.call(b,"div");try{h.call(b,"[test!='']:sizzle"),f.push("!=",J)}catch(c){}}),f=new RegExp(f.join("|")),bc.matchesSelector=function(b,c){c=c.replace(d,"='$1']");if(!g(b)&&!f.test(c)&&(!e||!e.test(c)))try{var i=h.call(b,c);if(i||a||b.document&&b.document.nodeType!==11)return i}catch(j){}return bc(c,null,null,[b]).length>0})}(),e.pseudos.nth=e.pseudos.eq,e.filters=bq.prototype=e.pseudos,e.setFilters=new bq,bc.attr=p.attr,p.find=bc,p.expr=bc.selectors,p.expr[":"]=p.expr.pseudos,p.unique=bc.uniqueSort,p.text=bc.getText,p.isXMLDoc=bc.isXML,p.contains=bc.contains}(a);var bc=/Until$/,bd=/^(?:parents|prev(?:Until|All))/,be=/^.[^:#\[\.,]*$/,bf=p.expr.match.needsContext,bg={children:!0,contents:!0,next:!0,prev:!0};p.fn.extend({find:function(a){var b,c,d,e,f,g,h=this;if(typeof a!="string")return p(a).filter(function(){for(b=0,c=h.length;b<c;b++)if(p.contains(h[b],this))return!0});g=this.pushStack("","find",a);for(b=0,c=this.length;b<c;b++){d=g.length,p.find(a,this[b],g);if(b>0)for(e=d;e<g.length;e++)for(f=0;f<d;f++)if(g[f]===g[e]){g.splice(e--,1);break}}return g},has:function(a){var b,c=p(a,this),d=c.length;return this.filter(function(){for(b=0;b<d;b++)if(p.contains(this,c[b]))return!0})},not:function(a){return this.pushStack(bj(this,a,!1),"not",a)},filter:function(a){return this.pushStack(bj(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?bf.test(a)?p(a,this.context).index(this[0])>=0:p.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c,d=0,e=this.length,f=[],g=bf.test(a)||typeof a!="string"?p(a,b||this.context):0;for(;d<e;d++){c=this[d];while(c&&c.ownerDocument&&c!==b&&c.nodeType!==11){if(g?g.index(c)>-1:p.find.matchesSelector(c,a)){f.push(c);break}c=c.parentNode}}return f=f.length>1?p.unique(f):f,this.pushStack(f,"closest",a)},index:function(a){return a?typeof a=="string"?p.inArray(this[0],p(a)):p.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(a,b){var c=typeof a=="string"?p(a,b):p.makeArray(a&&a.nodeType?[a]:a),d=p.merge(this.get(),c);return this.pushStack(bh(c[0])||bh(d[0])?d:p.unique(d))},addBack:function(a){return this.add(a==null?this.prevObject:this.prevObject.filter(a))}}),p.fn.andSelf=p.fn.addBack,p.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return p.dir(a,"parentNode")},parentsUntil:function(a,b,c){return p.dir(a,"parentNode",c)},next:function(a){return bi(a,"nextSibling")},prev:function(a){return bi(a,"previousSibling")},nextAll:function(a){return p.dir(a,"nextSibling")},prevAll:function(a){return p.dir(a,"previousSibling")},nextUntil:function(a,b,c){return p.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return p.dir(a,"previousSibling",c)},siblings:function(a){return p.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return p.sibling(a.firstChild)},contents:function(a){return p.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:p.merge([],a.childNodes)}},function(a,b){p.fn[a]=function(c,d){var e=p.map(this,b,c);return bc.test(a)||(d=c),d&&typeof d=="string"&&(e=p.filter(d,e)),e=this.length>1&&!bg[a]?p.unique(e):e,this.length>1&&bd.test(a)&&(e=e.reverse()),this.pushStack(e,a,k.call(arguments).join(","))}}),p.extend({filter:function(a,b,c){return c&&(a=":not("+a+")"),b.length===1?p.find.matchesSelector(b[0],a)?[b[0]]:[]:p.find.matches(a,b)},dir:function(a,c,d){var e=[],f=a[c];while(f&&f.nodeType!==9&&(d===b||f.nodeType!==1||!p(f).is(d)))f.nodeType===1&&e.push(f),f=f[c];return e},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var bl="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",bm=/ jQuery\d+="(?:null|\d+)"/g,bn=/^\s+/,bo=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bp=/<([\w:]+)/,bq=/<tbody/i,br=/<|&#?\w+;/,bs=/<(?:script|style|link)/i,bt=/<(?:script|object|embed|option|style)/i,bu=new RegExp("<(?:"+bl+")[\\s/>]","i"),bv=/^(?:checkbox|radio)$/,bw=/checked\s*(?:[^=]|=\s*.checked.)/i,bx=/\/(java|ecma)script/i,by=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,bz={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bA=bk(e),bB=bA.appendChild(e.createElement("div"));bz.optgroup=bz.option,bz.tbody=bz.tfoot=bz.colgroup=bz.caption=bz.thead,bz.th=bz.td,p.support.htmlSerialize||(bz._default=[1,"X<div>","</div>"]),p.fn.extend({text:function(a){return p.access(this,function(a){return a===b?p.text(this):this.empty().append((this[0]&&this[0].ownerDocument||e).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(p.isFunction(a))return this.each(function(b){p(this).wrapAll(a.call(this,b))});if(this[0]){var b=p(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return p.isFunction(a)?this.each(function(b){p(this).wrapInner(a.call(this,b))}):this.each(function(){var b=p(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=p.isFunction(a);return this.each(function(c){p(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){p.nodeName(this,"body")||p(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){(this.nodeType===1||this.nodeType===11)&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){(this.nodeType===1||this.nodeType===11)&&this.insertBefore(a,this.firstChild)})},before:function(){if(!bh(this[0]))return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=p.clean(arguments);return this.pushStack(p.merge(a,this),"before",this.selector)}},after:function(){if(!bh(this[0]))return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=p.clean(arguments);return this.pushStack(p.merge(this,a),"after",this.selector)}},remove:function(a,b){var c,d=0;for(;(c=this[d])!=null;d++)if(!a||p.filter(a,[c]).length)!b&&c.nodeType===1&&(p.cleanData(c.getElementsByTagName("*")),p.cleanData([c])),c.parentNode&&c.parentNode.removeChild(c);return this},empty:function(){var a,b=0;for(;(a=this[b])!=null;b++){a.nodeType===1&&p.cleanData(a.getElementsByTagName("*"));while(a.firstChild)a.removeChild(a.firstChild)}return this},clone:function(a,b){return a=a==null?!1:a,b=b==null?a:b,this.map(function(){return p.clone(this,a,b)})},html:function(a){return p.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return c.nodeType===1?c.innerHTML.replace(bm,""):b;if(typeof a=="string"&&!bs.test(a)&&(p.support.htmlSerialize||!bu.test(a))&&(p.support.leadingWhitespace||!bn.test(a))&&!bz[(bp.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(bo,"<$1></$2>");try{for(;d<e;d++)c=this[d]||{},c.nodeType===1&&(p.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(f){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){return bh(this[0])?this.length?this.pushStack(p(p.isFunction(a)?a():a),"replaceWith",a):this:p.isFunction(a)?this.each(function(b){var c=p(this),d=c.html();c.replaceWith(a.call(this,b,d))}):(typeof a!="string"&&(a=p(a).detach()),this.each(function(){var b=this.nextSibling,c=this.parentNode;p(this).remove(),b?p(b).before(a):p(c).append(a)}))},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){a=[].concat.apply([],a);var e,f,g,h,i=0,j=a[0],k=[],l=this.length;if(!p.support.checkClone&&l>1&&typeof j=="string"&&bw.test(j))return this.each(function(){p(this).domManip(a,c,d)});if(p.isFunction(j))return this.each(function(e){var f=p(this);a[0]=j.call(this,e,c?f.html():b),f.domManip(a,c,d)});if(this[0]){e=p.buildFragment(a,this,k),g=e.fragment,f=g.firstChild,g.childNodes.length===1&&(g=f);if(f){c=c&&p.nodeName(f,"tr");for(h=e.cacheable||l-1;i<l;i++)d.call(c&&p.nodeName(this[i],"table")?bC(this[i],"tbody"):this[i],i===h?g:p.clone(g,!0,!0))}g=f=null,k.length&&p.each(k,function(a,b){b.src?p.ajax?p.ajax({url:b.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):p.error("no ajax"):p.globalEval((b.text||b.textContent||b.innerHTML||"").replace(by,"")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),p.buildFragment=function(a,c,d){var f,g,h,i=a[0];return c=c||e,c=!c.nodeType&&c[0]||c,c=c.ownerDocument||c,a.length===1&&typeof i=="string"&&i.length<512&&c===e&&i.charAt(0)==="<"&&!bt.test(i)&&(p.support.checkClone||!bw.test(i))&&(p.support.html5Clone||!bu.test(i))&&(g=!0,f=p.fragments[i],h=f!==b),f||(f=c.createDocumentFragment(),p.clean(a,c,f,d),g&&(p.fragments[i]=h&&f)),{fragment:f,cacheable:g}},p.fragments={},p.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){p.fn[a]=function(c){var d,e=0,f=[],g=p(c),h=g.length,i=this.length===1&&this[0].parentNode;if((i==null||i&&i.nodeType===11&&i.childNodes.length===1)&&h===1)return g[b](this[0]),this;for(;e<h;e++)d=(e>0?this.clone(!0):this).get(),p(g[e])[b](d),f=f.concat(d);return this.pushStack(f,a,g.selector)}}),p.extend({clone:function(a,b,c){var d,e,f,g;p.support.html5Clone||p.isXMLDoc(a)||!bu.test("<"+a.nodeName+">")?g=a.cloneNode(!0):(bB.innerHTML=a.outerHTML,bB.removeChild(g=bB.firstChild));if((!p.support.noCloneEvent||!p.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!p.isXMLDoc(a)){bE(a,g),d=bF(a),e=bF(g);for(f=0;d[f];++f)e[f]&&bE(d[f],e[f])}if(b){bD(a,g);if(c){d=bF(a),e=bF(g);for(f=0;d[f];++f)bD(d[f],e[f])}}return d=e=null,g},clean:function(a,b,c,d){var f,g,h,i,j,k,l,m,n,o,q,r,s=b===e&&bA,t=[];if(!b||typeof b.createDocumentFragment=="undefined")b=e;for(f=0;(h=a[f])!=null;f++){typeof h=="number"&&(h+="");if(!h)continue;if(typeof h=="string")if(!br.test(h))h=b.createTextNode(h);else{s=s||bk(b),l=b.createElement("div"),s.appendChild(l),h=h.replace(bo,"<$1></$2>"),i=(bp.exec(h)||["",""])[1].toLowerCase(),j=bz[i]||bz._default,k=j[0],l.innerHTML=j[1]+h+j[2];while(k--)l=l.lastChild;if(!p.support.tbody){m=bq.test(h),n=i==="table"&&!m?l.firstChild&&l.firstChild.childNodes:j[1]==="<table>"&&!m?l.childNodes:[];for(g=n.length-1;g>=0;--g)p.nodeName(n[g],"tbody")&&!n[g].childNodes.length&&n[g].parentNode.removeChild(n[g])}!p.support.leadingWhitespace&&bn.test(h)&&l.insertBefore(b.createTextNode(bn.exec(h)[0]),l.firstChild),h=l.childNodes,l.parentNode.removeChild(l)}h.nodeType?t.push(h):p.merge(t,h)}l&&(h=l=s=null);if(!p.support.appendChecked)for(f=0;(h=t[f])!=null;f++)p.nodeName(h,"input")?bG(h):typeof h.getElementsByTagName!="undefined"&&p.grep(h.getElementsByTagName("input"),bG);if(c){q=function(a){if(!a.type||bx.test(a.type))return d?d.push(a.parentNode?a.parentNode.removeChild(a):a):c.appendChild(a)};for(f=0;(h=t[f])!=null;f++)if(!p.nodeName(h,"script")||!q(h))c.appendChild(h),typeof h.getElementsByTagName!="undefined"&&(r=p.grep(p.merge([],h.getElementsByTagName("script")),q),t.splice.apply(t,[f+1,0].concat(r)),f+=r.length)}return t},cleanData:function(a,b){var c,d,e,f,g=0,h=p.expando,i=p.cache,j=p.support.deleteExpando,k=p.event.special;for(;(e=a[g])!=null;g++)if(b||p.acceptData(e)){d=e[h],c=d&&i[d];if(c){if(c.events)for(f in c.events)k[f]?p.event.remove(e,f):p.removeEvent(e,f,c.handle);i[d]&&(delete i[d],j?delete e[h]:e.removeAttribute?e.removeAttribute(h):e[h]=null,p.deletedIds.push(d))}}}}),function(){var a,b;p.uaMatch=function(a){a=a.toLowerCase();var b=/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||a.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},a=p.uaMatch(g.userAgent),b={},a.browser&&(b[a.browser]=!0,b.version=a.version),b.chrome?b.webkit=!0:b.webkit&&(b.safari=!0),p.browser=b,p.sub=function(){function a(b,c){return new a.fn.init(b,c)}p.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function c(c,d){return d&&d instanceof p&&!(d instanceof a)&&(d=a(d)),p.fn.init.call(this,c,d,b)},a.fn.init.prototype=a.fn;var b=a(e);return a}}();var bH,bI,bJ,bK=/alpha\([^)]*\)/i,bL=/opacity=([^)]*)/,bM=/^(top|right|bottom|left)$/,bN=/^(none|table(?!-c[ea]).+)/,bO=/^margin/,bP=new RegExp("^("+q+")(.*)$","i"),bQ=new RegExp("^("+q+")(?!px)[a-z%]+$","i"),bR=new RegExp("^([-+])=("+q+")","i"),bS={},bT={position:"absolute",visibility:"hidden",display:"block"},bU={letterSpacing:0,fontWeight:400},bV=["Top","Right","Bottom","Left"],bW=["Webkit","O","Moz","ms"],bX=p.fn.toggle;p.fn.extend({css:function(a,c){return p.access(this,function(a,c,d){return d!==b?p.style(a,c,d):p.css(a,c)},a,c,arguments.length>1)},show:function(){return b$(this,!0)},hide:function(){return b$(this)},toggle:function(a,b){var c=typeof a=="boolean";return p.isFunction(a)&&p.isFunction(b)?bX.apply(this,arguments):this.each(function(){(c?a:bZ(this))?p(this).show():p(this).hide()})}}),p.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bH(a,"opacity");return c===""?"1":c}}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":p.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!a||a.nodeType===3||a.nodeType===8||!a.style)return;var f,g,h,i=p.camelCase(c),j=a.style;c=p.cssProps[i]||(p.cssProps[i]=bY(j,i)),h=p.cssHooks[c]||p.cssHooks[i];if(d===b)return h&&"get"in h&&(f=h.get(a,!1,e))!==b?f:j[c];g=typeof d,g==="string"&&(f=bR.exec(d))&&(d=(f[1]+1)*f[2]+parseFloat(p.css(a,c)),g="number");if(d==null||g==="number"&&isNaN(d))return;g==="number"&&!p.cssNumber[i]&&(d+="px");if(!h||!("set"in h)||(d=h.set(a,d,e))!==b)try{j[c]=d}catch(k){}},css:function(a,c,d,e){var f,g,h,i=p.camelCase(c);return c=p.cssProps[i]||(p.cssProps[i]=bY(a.style,i)),h=p.cssHooks[c]||p.cssHooks[i],h&&"get"in h&&(f=h.get(a,!0,e)),f===b&&(f=bH(a,c)),f==="normal"&&c in bU&&(f=bU[c]),d||e!==b?(g=parseFloat(f),d||p.isNumeric(g)?g||0:f):f},swap:function(a,b,c){var d,e,f={};for(e in b)f[e]=a.style[e],a.style[e]=b[e];d=c.call(a);for(e in b)a.style[e]=f[e];return d}}),a.getComputedStyle?bH=function(b,c){var d,e,f,g,h=a.getComputedStyle(b,null),i=b.style;return h&&(d=h[c],d===""&&!p.contains(b.ownerDocument,b)&&(d=p.style(b,c)),bQ.test(d)&&bO.test(c)&&(e=i.width,f=i.minWidth,g=i.maxWidth,i.minWidth=i.maxWidth=i.width=d,d=h.width,i.width=e,i.minWidth=f,i.maxWidth=g)),d}:e.documentElement.currentStyle&&(bH=function(a,b){var c,d,e=a.currentStyle&&a.currentStyle[b],f=a.style;return e==null&&f&&f[b]&&(e=f[b]),bQ.test(e)&&!bM.test(b)&&(c=f.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),f.left=b==="fontSize"?"1em":e,e=f.pixelLeft+"px",f.left=c,d&&(a.runtimeStyle.left=d)),e===""?"auto":e}),p.each(["height","width"],function(a,b){p.cssHooks[b]={get:function(a,c,d){if(c)return a.offsetWidth===0&&bN.test(bH(a,"display"))?p.swap(a,bT,function(){return cb(a,b,d)}):cb(a,b,d)},set:function(a,c,d){return b_(a,c,d?ca(a,b,d,p.support.boxSizing&&p.css(a,"boxSizing")==="border-box"):0)}}}),p.support.opacity||(p.cssHooks.opacity={get:function(a,b){return bL.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=p.isNumeric(b)?"alpha(opacity="+b*100+")":"",f=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&p.trim(f.replace(bK,""))===""&&c.removeAttribute){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bK.test(f)?f.replace(bK,e):f+" "+e}}),p(function(){p.support.reliableMarginRight||(p.cssHooks.marginRight={get:function(a,b){return p.swap(a,{display:"inline-block"},function(){if(b)return bH(a,"marginRight")})}}),!p.support.pixelPosition&&p.fn.position&&p.each(["top","left"],function(a,b){p.cssHooks[b]={get:function(a,c){if(c){var d=bH(a,b);return bQ.test(d)?p(a).position()[b]+"px":d}}}})}),p.expr&&p.expr.filters&&(p.expr.filters.hidden=function(a){return a.offsetWidth===0&&a.offsetHeight===0||!p.support.reliableHiddenOffsets&&(a.style&&a.style.display||bH(a,"display"))==="none"},p.expr.filters.visible=function(a){return!p.expr.filters.hidden(a)}),p.each({margin:"",padding:"",border:"Width"},function(a,b){p.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++)f[a+bV[d]+b]=e[d]||e[d-2]||e[0];return f}},bO.test(a)||(p.cssHooks[a+b].set=b_)});var cd=/%20/g,ce=/\[\]$/,cf=/\r?\n/g,cg=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,ch=/^(?:select|textarea)/i;p.fn.extend({serialize:function(){return p.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?p.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||ch.test(this.nodeName)||cg.test(this.type))}).map(function(a,b){var c=p(this).val();return c==null?null:p.isArray(c)?p.map(c,function(a,c){return{name:b.name,value:a.replace(cf,"\r\n")}}):{name:b.name,value:c.replace(cf,"\r\n")}}).get()}}),p.param=function(a,c){var d,e=[],f=function(a,b){b=p.isFunction(b)?b():b==null?"":b,e[e.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=p.ajaxSettings&&p.ajaxSettings.traditional);if(p.isArray(a)||a.jquery&&!p.isPlainObject(a))p.each(a,function(){f(this.name,this.value)});else for(d in a)ci(d,a[d],c,f);return e.join("&").replace(cd,"+")};var cj,ck,cl=/#.*$/,cm=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,cn=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,co=/^(?:GET|HEAD)$/,cp=/^\/\//,cq=/\?/,cr=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,cs=/([?&])_=[^&]*/,ct=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,cu=p.fn.load,cv={},cw={},cx=["*/"]+["*"];try{ck=f.href}catch(cy){ck=e.createElement("a"),ck.href="",ck=ck.href}cj=ct.exec(ck.toLowerCase())||[],p.fn.load=function(a,c,d){if(typeof a!="string"&&cu)return cu.apply(this,arguments);if(!this.length)return this;var e,f,g,h=this,i=a.indexOf(" ");return i>=0&&(e=a.slice(i,a.length),a=a.slice(0,i)),p.isFunction(c)?(d=c,c=b):c&&typeof c=="object"&&(f="POST"),p.ajax({url:a,type:f,dataType:"html",data:c,complete:function(a,b){d&&h.each(d,g||[a.responseText,b,a])}}).done(function(a){g=arguments,h.html(e?p("<div>").append(a.replace(cr,"")).find(e):a)}),this},p.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){p.fn[b]=function(a){return this.on(b,a)}}),p.each(["get","post"],function(a,c){p[c]=function(a,d,e,f){return p.isFunction(d)&&(f=f||e,e=d,d=b),p.ajax({type:c,url:a,data:d,success:e,dataType:f})}}),p.extend({getScript:function(a,c){return p.get(a,b,c,"script")},getJSON:function(a,b,c){return p.get(a,b,c,"json")},ajaxSetup:function(a,b){return b?cB(a,p.ajaxSettings):(b=a,a=p.ajaxSettings),cB(a,b),a},ajaxSettings:{url:ck,isLocal:cn.test(cj[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":cx},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":p.parseJSON,"text xml":p.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:cz(cv),ajaxTransport:cz(cw),ajax:function(a,c){function y(a,c,f,i){var k,s,t,u,w,y=c;if(v===2)return;v=2,h&&clearTimeout(h),g=b,e=i||"",x.readyState=a>0?4:0,f&&(u=cC(l,x,f));if(a>=200&&a<300||a===304)l.ifModified&&(w=x.getResponseHeader("Last-Modified"),w&&(p.lastModified[d]=w),w=x.getResponseHeader("Etag"),w&&(p.etag[d]=w)),a===304?(y="notmodified",k=!0):(k=cD(l,u),y=k.state,s=k.data,t=k.error,k=!t);else{t=y;if(!y||a)y="error",a<0&&(a=0)}x.status=a,x.statusText=(c||y)+"",k?o.resolveWith(m,[s,y,x]):o.rejectWith(m,[x,y,t]),x.statusCode(r),r=b,j&&n.trigger("ajax"+(k?"Success":"Error"),[x,l,k?s:t]),q.fireWith(m,[x,y]),j&&(n.trigger("ajaxComplete",[x,l]),--p.active||p.event.trigger("ajaxStop"))}typeof a=="object"&&(c=a,a=b),c=c||{};var d,e,f,g,h,i,j,k,l=p.ajaxSetup({},c),m=l.context||l,n=m!==l&&(m.nodeType||m instanceof p)?p(m):p.event,o=p.Deferred(),q=p.Callbacks("once memory"),r=l.statusCode||{},t={},u={},v=0,w="canceled",x={readyState:0,setRequestHeader:function(a,b){if(!v){var c=a.toLowerCase();a=u[c]=u[c]||a,t[a]=b}return this},getAllResponseHeaders:function(){return v===2?e:null},getResponseHeader:function(a){var c;if(v===2){if(!f){f={};while(c=cm.exec(e))f[c[1].toLowerCase()]=c[2]}c=f[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){return v||(l.mimeType=a),this},abort:function(a){return a=a||w,g&&g.abort(a),y(0,a),this}};o.promise(x),x.success=x.done,x.error=x.fail,x.complete=q.add,x.statusCode=function(a){if(a){var b;if(v<2)for(b in a)r[b]=[r[b],a[b]];else b=a[x.status],x.always(b)}return this},l.url=((a||l.url)+"").replace(cl,"").replace(cp,cj[1]+"//"),l.dataTypes=p.trim(l.dataType||"*").toLowerCase().split(s),l.crossDomain==null&&(i=ct.exec(l.url.toLowerCase())||!1,l.crossDomain=i&&i.join(":")+(i[3]?"":i[1]==="http:"?80:443)!==cj.join(":")+(cj[3]?"":cj[1]==="http:"?80:443)),l.data&&l.processData&&typeof l.data!="string"&&(l.data=p.param(l.data,l.traditional)),cA(cv,l,c,x);if(v===2)return x;j=l.global,l.type=l.type.toUpperCase(),l.hasContent=!co.test(l.type),j&&p.active++===0&&p.event.trigger("ajaxStart");if(!l.hasContent){l.data&&(l.url+=(cq.test(l.url)?"&":"?")+l.data,delete l.data),d=l.url;if(l.cache===!1){var z=p.now(),A=l.url.replace(cs,"$1_="+z);l.url=A+(A===l.url?(cq.test(l.url)?"&":"?")+"_="+z:"")}}(l.data&&l.hasContent&&l.contentType!==!1||c.contentType)&&x.setRequestHeader("Content-Type",l.contentType),l.ifModified&&(d=d||l.url,p.lastModified[d]&&x.setRequestHeader("If-Modified-Since",p.lastModified[d]),p.etag[d]&&x.setRequestHeader("If-None-Match",p.etag[d])),x.setRequestHeader("Accept",l.dataTypes[0]&&l.accepts[l.dataTypes[0]]?l.accepts[l.dataTypes[0]]+(l.dataTypes[0]!=="*"?", "+cx+"; q=0.01":""):l.accepts["*"]);for(k in l.headers)x.setRequestHeader(k,l.headers[k]);if(!l.beforeSend||l.beforeSend.call(m,x,l)!==!1&&v!==2){w="abort";for(k in{success:1,error:1,complete:1})x[k](l[k]);g=cA(cw,l,c,x);if(!g)y(-1,"No Transport");else{x.readyState=1,j&&n.trigger("ajaxSend",[x,l]),l.async&&l.timeout>0&&(h=setTimeout(function(){x.abort("timeout")},l.timeout));try{v=1,g.send(t,y)}catch(B){if(v<2)y(-1,B);else throw B}}return x}return x.abort()},active:0,lastModified:{},etag:{}});var cE=[],cF=/\?/,cG=/(=)\?(?=&|$)|\?\?/,cH=p.now();p.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=cE.pop()||p.expando+"_"+cH++;return this[a]=!0,a}}),p.ajaxPrefilter("json jsonp",function(c,d,e){var f,g,h,i=c.data,j=c.url,k=c.jsonp!==!1,l=k&&cG.test(j),m=k&&!l&&typeof i=="string"&&!(c.contentType||"").indexOf("application/x-www-form-urlencoded")&&cG.test(i);if(c.dataTypes[0]==="jsonp"||l||m)return f=c.jsonpCallback=p.isFunction(c.jsonpCallback)?c.jsonpCallback():c.jsonpCallback,g=a[f],l?c.url=j.replace(cG,"$1"+f):m?c.data=i.replace(cG,"$1"+f):k&&(c.url+=(cF.test(j)?"&":"?")+c.jsonp+"="+f),c.converters["script json"]=function(){return h||p.error(f+" was not called"),h[0]},c.dataTypes[0]="json",a[f]=function(){h=arguments},e.always(function(){a[f]=g,c[f]&&(c.jsonpCallback=d.jsonpCallback,cE.push(f)),h&&p.isFunction(g)&&g(h[0]),h=g=b}),"script"}),p.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){return p.globalEval(a),a}}}),p.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),p.ajaxTransport("script",function(a){if(a.crossDomain){var c,d=e.head||e.getElementsByTagName("head")[0]||e.documentElement;return{send:function(f,g){c=e.createElement("script"),c.async="async",a.scriptCharset&&(c.charset=a.scriptCharset),c.src=a.url,c.onload=c.onreadystatechange=function(a,e){if(e||!c.readyState||/loaded|complete/.test(c.readyState))c.onload=c.onreadystatechange=null,d&&c.parentNode&&d.removeChild(c),c=b,e||g(200,"success")},d.insertBefore(c,d.firstChild)},abort:function(){c&&c.onload(0,1)}}}});var cI,cJ=a.ActiveXObject?function(){for(var a in cI)cI[a](0,1)}:!1,cK=0;p.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&cL()||cM()}:cL,function(a){p.extend(p.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(p.ajaxSettings.xhr()),p.support.ajax&&p.ajaxTransport(function(c){if(!c.crossDomain||p.support.cors){var d;return{send:function(e,f){var g,h,i=c.xhr();c.username?i.open(c.type,c.url,c.async,c.username,c.password):i.open(c.type,c.url,c.async);if(c.xhrFields)for(h in c.xhrFields)i[h]=c.xhrFields[h];c.mimeType&&i.overrideMimeType&&i.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(h in e)i.setRequestHeader(h,e[h])}catch(j){}i.send(c.hasContent&&c.data||null),d=function(a,e){var h,j,k,l,m;try{if(d&&(e||i.readyState===4)){d=b,g&&(i.onreadystatechange=p.noop,cJ&&delete cI[g]);if(e)i.readyState!==4&&i.abort();else{h=i.status,k=i.getAllResponseHeaders(),l={},m=i.responseXML,m&&m.documentElement&&(l.xml=m);try{l.text=i.responseText}catch(a){}try{j=i.statusText}catch(n){j=""}!h&&c.isLocal&&!c.crossDomain?h=l.text?200:404:h===1223&&(h=204)}}}catch(o){e||f(-1,o)}l&&f(h,j,l,k)},c.async?i.readyState===4?setTimeout(d,0):(g=++cK,cJ&&(cI||(cI={},p(a).unload(cJ)),cI[g]=d),i.onreadystatechange=d):d()},abort:function(){d&&d(0,1)}}}});var cN,cO,cP=/^(?:toggle|show|hide)$/,cQ=new RegExp("^(?:([-+])=|)("+q+")([a-z%]*)$","i"),cR=/queueHooks$/,cS=[cY],cT={"*":[function(a,b){var c,d,e=this.createTween(a,b),f=cQ.exec(b),g=e.cur(),h=+g||0,i=1,j=20;if(f){c=+f[2],d=f[3]||(p.cssNumber[a]?"":"px");if(d!=="px"&&h){h=p.css(e.elem,a,!0)||c||1;do i=i||".5",h=h/i,p.style(e.elem,a,h+d);while(i!==(i=e.cur()/g)&&i!==1&&--j)}e.unit=d,e.start=h,e.end=f[1]?h+(f[1]+1)*c:c}return e}]};p.Animation=p.extend(cW,{tweener:function(a,b){p.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");var c,d=0,e=a.length;for(;d<e;d++)c=a[d],cT[c]=cT[c]||[],cT[c].unshift(b)},prefilter:function(a,b){b?cS.unshift(a):cS.push(a)}}),p.Tween=cZ,cZ.prototype={constructor:cZ,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(p.cssNumber[c]?"":"px")},cur:function(){var a=cZ.propHooks[this.prop];return a&&a.get?a.get(this):cZ.propHooks._default.get(this)},run:function(a){var b,c=cZ.propHooks[this.prop];return this.options.duration?this.pos=b=p.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):cZ.propHooks._default.set(this),this}},cZ.prototype.init.prototype=cZ.prototype,cZ.propHooks={_default:{get:function(a){var b;return a.elem[a.prop]==null||!!a.elem.style&&a.elem.style[a.prop]!=null?(b=p.css(a.elem,a.prop,!1,""),!b||b==="auto"?0:b):a.elem[a.prop]},set:function(a){p.fx.step[a.prop]?p.fx.step[a.prop](a):a.elem.style&&(a.elem.style[p.cssProps[a.prop]]!=null||p.cssHooks[a.prop])?p.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},cZ.propHooks.scrollTop=cZ.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},p.each(["toggle","show","hide"],function(a,b){var c=p.fn[b];p.fn[b]=function(d,e,f){return d==null||typeof d=="boolean"||!a&&p.isFunction(d)&&p.isFunction(e)?c.apply(this,arguments):this.animate(c$(b,!0),d,e,f)}}),p.fn.extend({fadeTo:function(a,b,c,d){return this.filter(bZ).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=p.isEmptyObject(a),f=p.speed(b,c,d),g=function(){var b=cW(this,p.extend({},a),f);e&&b.stop(!0)};return e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,c,d){var e=function(a){var b=a.stop;delete a.stop,b(d)};return typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,c=a!=null&&a+"queueHooks",f=p.timers,g=p._data(this);if(c)g[c]&&g[c].stop&&e(g[c]);else for(c in g)g[c]&&g[c].stop&&cR.test(c)&&e(g[c]);for(c=f.length;c--;)f[c].elem===this&&(a==null||f[c].queue===a)&&(f[c].anim.stop(d),b=!1,f.splice(c,1));(b||!d)&&p.dequeue(this,a)})}}),p.each({slideDown:c$("show"),slideUp:c$("hide"),slideToggle:c$("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){p.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),p.speed=function(a,b,c){var d=a&&typeof a=="object"?p.extend({},a):{complete:c||!c&&b||p.isFunction(a)&&a,duration:a,easing:c&&b||b&&!p.isFunction(b)&&b};d.duration=p.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in p.fx.speeds?p.fx.speeds[d.duration]:p.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";return d.old=d.complete,d.complete=function(){p.isFunction(d.old)&&d.old.call(this),d.queue&&p.dequeue(this,d.queue)},d},p.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},p.timers=[],p.fx=cZ.prototype.init,p.fx.tick=function(){var a,b=p.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||p.fx.stop()},p.fx.timer=function(a){a()&&p.timers.push(a)&&!cO&&(cO=setInterval(p.fx.tick,p.fx.interval))},p.fx.interval=13,p.fx.stop=function(){clearInterval(cO),cO=null},p.fx.speeds={slow:600,fast:200,_default:400},p.fx.step={},p.expr&&p.expr.filters&&(p.expr.filters.animated=function(a){return p.grep(p.timers,function(b){return a===b.elem}).length});var c_=/^(?:body|html)$/i;p.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){p.offset.setOffset(this,a,b)});var c,d,e,f,g,h,i,j={top:0,left:0},k=this[0],l=k&&k.ownerDocument;if(!l)return;return(d=l.body)===k?p.offset.bodyOffset(k):(c=l.documentElement,p.contains(c,k)?(typeof k.getBoundingClientRect!="undefined"&&(j=k.getBoundingClientRect()),e=da(l),f=c.clientTop||d.clientTop||0,g=c.clientLeft||d.clientLeft||0,h=e.pageYOffset||c.scrollTop,i=e.pageXOffset||c.scrollLeft,{top:j.top+h-f,left:j.left+i-g}):j)},p.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;return p.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(p.css(a,"marginTop"))||0,c+=parseFloat(p.css(a,"marginLeft"))||0),{top:b,left:c}},setOffset:function(a,b,c){var d=p.css(a,"position");d==="static"&&(a.style.position="relative");var e=p(a),f=e.offset(),g=p.css(a,"top"),h=p.css(a,"left"),i=(d==="absolute"||d==="fixed")&&p.inArray("auto",[g,h])>-1,j={},k={},l,m;i?(k=e.position(),l=k.top,m=k.left):(l=parseFloat(g)||0,m=parseFloat(h)||0),p.isFunction(b)&&(b=b.call(a,c,f)),b.top!=null&&(j.top=b.top-f.top+l),b.left!=null&&(j.left=b.left-f.left+m),"using"in b?b.using.call(a,j):e.css(j)}},p.fn.extend({position:function(){if(!this[0])return;var a=this[0],b=this.offsetParent(),c=this.offset(),d=c_.test(b[0].nodeName)?{top:0,left:0}:b.offset();return c.top-=parseFloat(p.css(a,"marginTop"))||0,c.left-=parseFloat(p.css(a,"marginLeft"))||0,d.top+=parseFloat(p.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(p.css(b[0],"borderLeftWidth"))||0,{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||e.body;while(a&&!c_.test(a.nodeName)&&p.css(a,"position")==="static")a=a.offsetParent;return a||e.body})}}),p.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);p.fn[a]=function(e){return p.access(this,function(a,e,f){var g=da(a);if(f===b)return g?c in g?g[c]:g.document.documentElement[e]:a[e];g?g.scrollTo(d?p(g).scrollLeft():f,d?f:p(g).scrollTop()):a[e]=f},a,e,arguments.length,null)}}),p.each({Height:"height",Width:"width"},function(a,c){p.each({padding:"inner"+a,content:c,"":"outer"+a},function(d,e){p.fn[e]=function(e,f){var g=arguments.length&&(d||typeof e!="boolean"),h=d||(e===!0||f===!0?"margin":"border");return p.access(this,function(c,d,e){var f;return p.isWindow(c)?c.document.documentElement["client"+a]:c.nodeType===9?(f=c.documentElement,Math.max(c.body["scroll"+a],f["scroll"+a],c.body["offset"+a],f["offset"+a],f["client"+a])):e===b?p.css(c,d,e,h):p.style(c,d,e,h)},c,g?e:b,g,null)}})}),a.jQuery=a.$=p,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return p})})(window);
/*!
 * Copyright 2012, Chris Wanstrath
 * Released under the MIT License
 * https://github.com/defunkt/jquery-pjax
 */
(function($){function fnPjax(selector,container,options){var context=this
return this.on('click.pjax',selector,function(event){var opts=$.extend({},optionsFor(container,options))
if(!opts.container)
opts.container=$(this).attr('data-pjax')||context
handleClick(event,opts)})}
function handleClick(event,container,options){options=optionsFor(container,options)
var link=event.currentTarget
if(link.tagName.toUpperCase()!=='A')
throw"$.fn.pjax or $.pjax.click requires an anchor element"
if(event.which>1||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)
return
if(location.protocol!==link.protocol||location.hostname!==link.hostname)
return
if(link.href.indexOf('#')>-1&&stripHash(link)==stripHash(location))
return
if(event.isDefaultPrevented())
return
var defaults={url:link.href,container:$(link).attr('data-pjax'),target:link}
var opts=$.extend({},defaults,options)
var clickEvent=$.Event('pjax:click')
$(link).trigger(clickEvent,[opts])
if(!clickEvent.isDefaultPrevented()){pjax(opts)
event.preventDefault()
$(link).trigger('pjax:clicked',[opts])}}
function handleSubmit(event,container,options){options=optionsFor(container,options)
var form=event.currentTarget
var $form=$(form)
if(form.tagName.toUpperCase()!=='FORM')
throw"$.pjax.submit requires a form element"
var defaults={type:($form.attr('method')||'GET').toUpperCase(),url:$form.attr('action'),container:$form.attr('data-pjax'),target:form}
if(defaults.type!=='GET'&&window.FormData!==undefined){defaults.data=new FormData(form);defaults.processData=false;defaults.contentType=false;}else{if($(form).find(':file').length){return;}
defaults.data=$(form).serializeArray();}
pjax($.extend({},defaults,options))
event.preventDefault()}
function pjax(options){options=$.extend(true,{},$.ajaxSettings,pjax.defaults,options)
if($.isFunction(options.url)){options.url=options.url()}
var target=options.target
var hash=parseURL(options.url).hash
var context=options.context=findContainerFor(options.container)
if(!options.data)options.data={}
if($.isArray(options.data)){options.data.push({name:'_pjax',value:context.selector})}else{options.data._pjax=context.selector}
function fire(type,args,props){if(!props)props={}
props.relatedTarget=target
var event=$.Event(type,props)
context.trigger(event,args)
return!event.isDefaultPrevented()}
var timeoutTimer
options.beforeSend=function(xhr,settings){if(settings.type!=='GET'){settings.timeout=0}
xhr.setRequestHeader('X-PJAX','true')
xhr.setRequestHeader('X-PJAX-Container',context.selector)
if(!fire('pjax:beforeSend',[xhr,settings]))
return false
if(settings.timeout>0){timeoutTimer=setTimeout(function(){if(fire('pjax:timeout',[xhr,options]))
xhr.abort('timeout')},settings.timeout)
settings.timeout=0}
var url=parseURL(settings.url)
if(hash)url.hash=hash
options.requestUrl=stripInternalParams(url)}
options.complete=function(xhr,textStatus){if(timeoutTimer)
clearTimeout(timeoutTimer)
fire('pjax:complete',[xhr,textStatus,options])
fire('pjax:end',[xhr,options])}
options.error=function(xhr,textStatus,errorThrown){var container=extractContainer("",xhr,options)
var allowed=fire('pjax:error',[xhr,textStatus,errorThrown,options])
if(options.type=='GET'&&textStatus!=='abort'&&allowed){locationReplace(container.url)}}
options.success=function(data,status,xhr){var previousState=pjax.state;var currentVersion=(typeof $.pjax.defaults.version==='function')?$.pjax.defaults.version():$.pjax.defaults.version
var latestVersion=xhr.getResponseHeader('X-PJAX-Version')
var container=extractContainer(data,xhr,options)
var url=parseURL(container.url)
if(hash){url.hash=hash
container.url=url.href}
if(currentVersion&&latestVersion&&currentVersion!==latestVersion){locationReplace(container.url)
return}
if(!container.contents){locationReplace(container.url)
return}
pjax.state={id:options.id||uniqueId(),url:container.url,title:container.title,container:context.selector,fragment:options.fragment,timeout:options.timeout}
if(options.push||options.replace){window.history.replaceState(pjax.state,container.title,container.url)}
var blurFocus=$.contains(options.container,document.activeElement)
if(blurFocus){try{document.activeElement.blur()}catch(e){}}
if(container.title)document.title=container.title
fire('pjax:beforeReplace',[container.contents,options],{state:pjax.state,previousState:previousState})
context.html(container.contents)
var autofocusEl=context.find('input[autofocus], textarea[autofocus]').last()[0]
if(autofocusEl&&document.activeElement!==autofocusEl){autofocusEl.focus();}
executeScriptTags(container.scripts)
var scrollTo=options.scrollTo
if(hash){var name=decodeURIComponent(hash.slice(1))
var target=document.getElementById(name)||document.getElementsByName(name)[0]
if(target)scrollTo=$(target).offset().top}
if(typeof scrollTo=='number')$(window).scrollTop(scrollTo)
fire('pjax:success',[data,status,xhr,options])}
if(!pjax.state){pjax.state={id:uniqueId(),url:window.location.href,title:document.title,container:context.selector,fragment:options.fragment,timeout:options.timeout}
window.history.replaceState(pjax.state,document.title)}
abortXHR(pjax.xhr)
pjax.options=options
var xhr=pjax.xhr=$.ajax(options)
if(xhr.readyState>0){if(options.push&&!options.replace){cachePush(pjax.state.id,cloneContents(context))
window.history.pushState(null,"",options.requestUrl)}
fire('pjax:start',[xhr,options])
fire('pjax:send',[xhr,options])}
return pjax.xhr}
function pjaxReload(container,options){var defaults={url:window.location.href,push:false,replace:true,scrollTo:false}
return pjax($.extend(defaults,optionsFor(container,options)))}
function locationReplace(url){window.history.replaceState(null,"",pjax.state.url)
window.location.replace(url)}
var initialPop=true
var initialURL=window.location.href
var initialState=window.history.state
if(initialState&&initialState.container){pjax.state=initialState}
if('state'in window.history){initialPop=false}
function onPjaxPopstate(event){if(!initialPop){abortXHR(pjax.xhr)}
var previousState=pjax.state
var state=event.state
var direction
if(state&&state.container){if(initialPop&&initialURL==state.url)return
if(previousState){if(previousState.id===state.id)return
direction=previousState.id<state.id?'forward':'back'}
var cache=cacheMapping[state.id]||[]
var container=$(cache[0]||state.container),contents=cache[1]
if(container.length){if(previousState){cachePop(direction,previousState.id,cloneContents(container))}
var popstateEvent=$.Event('pjax:popstate',{state:state,direction:direction})
container.trigger(popstateEvent)
var options={id:state.id,url:state.url,container:container,push:false,fragment:state.fragment,timeout:state.timeout,scrollTo:false}
if(contents){container.trigger('pjax:start',[null,options])
pjax.state=state
if(state.title)document.title=state.title
var beforeReplaceEvent=$.Event('pjax:beforeReplace',{state:state,previousState:previousState})
container.trigger(beforeReplaceEvent,[contents,options])
container.html(contents)
container.trigger('pjax:end',[null,options])}else{pjax(options)}
container[0].offsetHeight}else{locationReplace(location.href)}}
initialPop=false}
function fallbackPjax(options){var url=$.isFunction(options.url)?options.url():options.url,method=options.type?options.type.toUpperCase():'GET'
var form=$('<form>',{method:method==='GET'?'GET':'POST',action:url,style:'display:none'})
if(method!=='GET'&&method!=='POST'){form.append($('<input>',{type:'hidden',name:'_method',value:method.toLowerCase()}))}
var data=options.data
if(typeof data==='string'){$.each(data.split('&'),function(index,value){var pair=value.split('=')
form.append($('<input>',{type:'hidden',name:pair[0],value:pair[1]}))})}else if($.isArray(data)){$.each(data,function(index,value){form.append($('<input>',{type:'hidden',name:value.name,value:value.value}))})}else if(typeof data==='object'){var key
for(key in data)
form.append($('<input>',{type:'hidden',name:key,value:data[key]}))}
$(document.body).append(form)
form.submit()}
function abortXHR(xhr){if(xhr&&xhr.readyState<4){xhr.onreadystatechange=$.noop
xhr.abort()}}
function uniqueId(){return(new Date).getTime()}
function cloneContents(container){var cloned=container.clone()
cloned.find('script').each(function(){if(!this.src)jQuery._data(this,'globalEval',false)})
return[container.selector,cloned.contents()]}
function stripInternalParams(url){url.search=url.search.replace(/([?&])(_pjax|_)=[^&]*/g,'')
return url.href.replace(/\?($|#)/,'$1')}
function parseURL(url){var a=document.createElement('a')
a.href=url
return a}
function stripHash(location){return location.href.replace(/#.*/,'')}
function optionsFor(container,options){if(container&&options)
options.container=container
else if($.isPlainObject(container))
options=container
else
options={container:container}
if(options.container)
options.container=findContainerFor(options.container)
return options}
function findContainerFor(container){container=$(container)
if(!container.length){throw"no pjax container for "+container.selector}else if(container.selector!==''&&container.context===document){return container}else if(container.attr('id')){return $('#'+container.attr('id'))}else{throw"cant get selector for pjax container!"}}
function findAll(elems,selector){return elems.filter(selector).add(elems.find(selector));}
function parseHTML(html){return $.parseHTML(html,document,true)}
function extractContainer(data,xhr,options){var obj={},fullDocument=/<html/i.test(data)
var serverUrl=xhr.getResponseHeader('X-PJAX-URL')
obj.url=serverUrl?stripInternalParams(parseURL(serverUrl)):options.requestUrl
if(fullDocument){var $head=$(parseHTML(data.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0]))
var $body=$(parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]))}else{var $head=$body=$(parseHTML(data))}
if($body.length===0)
return obj
obj.title=findAll($head,'title').last().text()
if(options.fragment){if(options.fragment==='body'){var $fragment=$body}else{var $fragment=findAll($body,options.fragment).first()}
if($fragment.length){obj.contents=options.fragment==='body'?$fragment:$fragment.contents()
if(!obj.title)
obj.title=$fragment.attr('title')||$fragment.data('title')}}else if(!fullDocument){obj.contents=$body}
if(obj.contents){obj.contents=obj.contents.not(function(){return $(this).is('title')})
obj.contents.find('title').remove()
obj.scripts=findAll(obj.contents,'script[src]').remove()
obj.contents=obj.contents.not(obj.scripts)}
if(obj.title)obj.title=$.trim(obj.title)
return obj}
function executeScriptTags(scripts){if(!scripts)return
var existingScripts=$('script[src]')
scripts.each(function(){var src=this.src
var matchedScripts=existingScripts.filter(function(){return this.src===src})
if(matchedScripts.length)return
var script=document.createElement('script')
var type=$(this).attr('type')
if(type)script.type=type
script.src=$(this).attr('src')
document.head.appendChild(script)})}
var cacheMapping={}
var cacheForwardStack=[]
var cacheBackStack=[]
function cachePush(id,value){cacheMapping[id]=value
cacheBackStack.push(id)
trimCacheStack(cacheForwardStack,0)
trimCacheStack(cacheBackStack,pjax.defaults.maxCacheLength)}
function cachePop(direction,id,value){var pushStack,popStack
cacheMapping[id]=value
if(direction==='forward'){pushStack=cacheBackStack
popStack=cacheForwardStack}else{pushStack=cacheForwardStack
popStack=cacheBackStack}
pushStack.push(id)
if(id=popStack.pop())
delete cacheMapping[id]
trimCacheStack(pushStack,pjax.defaults.maxCacheLength)}
function trimCacheStack(stack,length){while(stack.length>length)
delete cacheMapping[stack.shift()]}
function findVersion(){return $('meta').filter(function(){var name=$(this).attr('http-equiv')
return name&&name.toUpperCase()==='X-PJAX-VERSION'}).attr('content')}
function enable(){$.fn.pjax=fnPjax
$.pjax=pjax
$.pjax.enable=$.noop
$.pjax.disable=disable
$.pjax.click=handleClick
$.pjax.submit=handleSubmit
$.pjax.reload=pjaxReload
$.pjax.defaults={timeout:650,push:true,replace:false,type:'GET',dataType:'html',scrollTo:0,maxCacheLength:20,version:findVersion}
$(window).on('popstate.pjax',onPjaxPopstate)}
function disable(){$.fn.pjax=function(){return this}
$.pjax=fallbackPjax
$.pjax.enable=enable
$.pjax.disable=$.noop
$.pjax.click=$.noop
$.pjax.submit=$.noop
$.pjax.reload=function(){window.location.reload()}
$(window).off('popstate.pjax',onPjaxPopstate)}
if($.inArray('state',$.event.props)<0)
$.event.props.push('state')
$.support.pjax=window.history&&window.history.pushState&&window.history.replaceState&&!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)
$.support.pjax?enable():disable()})(jQuery);
var QRCode;
! function() {
	function a(a) {
		this.mode = c.MODE_8BIT_BYTE, this.data = a, this.parsedData = [];
		for (var b = [], d = 0, e = this.data.length; e > d; d++) {
			var f = this.data.charCodeAt(d);
			f > 65536 ? (b[0] = 240 | (1835008 & f) >>> 18, b[1] = 128 | (258048 & f) >>> 12, b[2] = 128 | (4032 & f) >>> 6, b[3] = 128 | 63 & f) : f > 2048 ? (b[0] = 224 | (61440 & f) >>> 12, b[1] = 128 | (4032 & f) >>> 6, b[2] = 128 | 63 & f) : f > 128 ? (b[0] = 192 | (1984 & f) >>> 6, b[1] = 128 | 63 & f) : b[0] = f, this.parsedData = this.parsedData.concat(b)
		}
		this.parsedData.length != this.data.length && (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239))
	}
	function b(a, b) {
		this.typeNumber = a, this.errorCorrectLevel = b, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = []
	}
	function i(a, b) {
		if (void 0 == a.length) throw new Error(a.length + "/" + b);
		for (var c = 0; c < a.length && 0 == a[c];) c++;
		this.num = new Array(a.length - c + b);
		for (var d = 0; d < a.length - c; d++) this.num[d] = a[d + c]
	}
	function j(a, b) {
		this.totalCount = a, this.dataCount = b
	}
	function k() {
		this.buffer = [], this.length = 0
	}
	function m() {
		return "undefined" != typeof CanvasRenderingContext2D
	}
	function n() {
		var a = !1,
			b = navigator.userAgent;
		return /android/i.test(b) && (a = !0, aMat = b.toString().match(/android ([0-9]\.[0-9])/i), aMat && aMat[1] && (a = parseFloat(aMat[1]))), a
	}
	function r(a, b) {
		for (var c = 1, e = s(a), f = 0, g = l.length; g >= f; f++) {
			var h = 0;
			switch (b) {
				case d.L:
					h = l[f][0];
					break;
				case d.M:
					h = l[f][1];
					break;
				case d.Q:
					h = l[f][2];
					break;
				case d.H:
					h = l[f][3]
			}
			if (h >= e) break;
			c++
		}
		if (c > l.length) throw new Error("Too long data");
		return c
	}
	function s(a) {
		var b = encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
		return b.length + (b.length != a ? 3 : 0)
	}
	a.prototype = {
		getLength: function() {
			return this.parsedData.length
		},
		write: function(a) {
			for (var b = 0, c = this.parsedData.length; c > b; b++) a.put(this.parsedData[b], 8)
		}
	}, b.prototype = {
		addData: function(b) {
			var c = new a(b);
			this.dataList.push(c), this.dataCache = null
		},
		isDark: function(a, b) {
			if (0 > a || this.moduleCount <= a || 0 > b || this.moduleCount <= b) throw new Error(a + "," + b);
			return this.modules[a][b]
		},
		getModuleCount: function() {
			return this.moduleCount
		},
		make: function() {
			this.makeImpl(!1, this.getBestMaskPattern())
		},
		makeImpl: function(a, c) {
			this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount);
			for (var d = 0; d < this.moduleCount; d++) {
				this.modules[d] = new Array(this.moduleCount);
				for (var e = 0; e < this.moduleCount; e++) this.modules[d][e] = null
			}
			this.setupPositionProbePattern(0, 0), this.setupPositionProbePattern(this.moduleCount - 7, 0), this.setupPositionProbePattern(0, this.moduleCount - 7), this.setupPositionAdjustPattern(), this.setupTimingPattern(), this.setupTypeInfo(a, c), this.typeNumber >= 7 && this.setupTypeNumber(a), null == this.dataCache && (this.dataCache = b.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, c)
		},
		setupPositionProbePattern: function(a, b) {
			for (var c = -1; 7 >= c; c++)
				if (!(-1 >= a + c || this.moduleCount <= a + c))
					for (var d = -1; 7 >= d; d++) - 1 >= b + d || this.moduleCount <= b + d || (this.modules[a + c][b + d] = c >= 0 && 6 >= c && (0 == d || 6 == d) || d >= 0 && 6 >= d && (0 == c || 6 == c) || c >= 2 && 4 >= c && d >= 2 && 4 >= d ? !0 : !1)
		},
		getBestMaskPattern: function() {
			for (var a = 0, b = 0, c = 0; 8 > c; c++) {
				this.makeImpl(!0, c);
				var d = f.getLostPoint(this);
				(0 == c || a > d) && (a = d, b = c)
			}
			return b
		},
		createMovieClip: function(a, b, c) {
			var d = a.createEmptyMovieClip(b, c),
				e = 1;
			this.make();
			for (var f = 0; f < this.modules.length; f++)
				for (var g = f * e, h = 0; h < this.modules[f].length; h++) {
					var i = h * e,
						j = this.modules[f][h];
					j && (d.beginFill(0, 100), d.moveTo(i, g), d.lineTo(i + e, g), d.lineTo(i + e, g + e), d.lineTo(i, g + e), d.endFill())
				}
			return d
		},
		setupTimingPattern: function() {
			for (var a = 8; a < this.moduleCount - 8; a++) null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
			for (var b = 8; b < this.moduleCount - 8; b++) null == this.modules[6][b] && (this.modules[6][b] = 0 == b % 2)
		},
		setupPositionAdjustPattern: function() {
			for (var a = f.getPatternPosition(this.typeNumber), b = 0; b < a.length; b++)
				for (var c = 0; c < a.length; c++) {
					var d = a[b],
						e = a[c];
					if (null == this.modules[d][e])
						for (var g = -2; 2 >= g; g++)
							for (var h = -2; 2 >= h; h++) this.modules[d + g][e + h] = -2 == g || 2 == g || -2 == h || 2 == h || 0 == g && 0 == h ? !0 : !1
				}
		},
		setupTypeNumber: function(a) {
			for (var b = f.getBCHTypeNumber(this.typeNumber), c = 0; 18 > c; c++) {
				var d = !a && 1 == (1 & b >> c);
				this.modules[Math.floor(c / 3)][c % 3 + this.moduleCount - 8 - 3] = d
			}
			for (var c = 0; 18 > c; c++) {
				var d = !a && 1 == (1 & b >> c);
				this.modules[c % 3 + this.moduleCount - 8 - 3][Math.floor(c / 3)] = d
			}
		},
		setupTypeInfo: function(a, b) {
			for (var c = this.errorCorrectLevel << 3 | b, d = f.getBCHTypeInfo(c), e = 0; 15 > e; e++) {
				var g = !a && 1 == (1 & d >> e);
				6 > e ? this.modules[e][8] = g : 8 > e ? this.modules[e + 1][8] = g : this.modules[this.moduleCount - 15 + e][8] = g
			}
			for (var e = 0; 15 > e; e++) {
				var g = !a && 1 == (1 & d >> e);
				8 > e ? this.modules[8][this.moduleCount - e - 1] = g : 9 > e ? this.modules[8][15 - e - 1 + 1] = g : this.modules[8][15 - e - 1] = g
			}
			this.modules[this.moduleCount - 8][8] = !a
		},
		mapData: function(a, b) {
			for (var c = -1, d = this.moduleCount - 1, e = 7, g = 0, h = this.moduleCount - 1; h > 0; h -= 2)
				for (6 == h && h--;;) {
					for (var i = 0; 2 > i; i++)
						if (null == this.modules[d][h - i]) {
							var j = !1;
							g < a.length && (j = 1 == (1 & a[g] >>> e));
							var k = f.getMask(b, d, h - i);
							k && (j = !j), this.modules[d][h - i] = j, e--, -1 == e && (g++, e = 7)
						}
					if (d += c, 0 > d || this.moduleCount <= d) {
						d -= c, c = -c;
						break
					}
				}
		}
	}, b.PAD0 = 236, b.PAD1 = 17, b.createData = function(a, c, d) {
		for (var e = j.getRSBlocks(a, c), g = new k, h = 0; h < d.length; h++) {
			var i = d[h];
			g.put(i.mode, 4), g.put(i.getLength(), f.getLengthInBits(i.mode, a)), i.write(g)
		}
		for (var l = 0, h = 0; h < e.length; h++) l += e[h].dataCount;
		if (g.getLengthInBits() > 8 * l) throw new Error("code length overflow. (" + g.getLengthInBits() + ">" + 8 * l + ")");
		for (g.getLengthInBits() + 4 <= 8 * l && g.put(0, 4); 0 != g.getLengthInBits() % 8;) g.putBit(!1);
		for (;;) {
			if (g.getLengthInBits() >= 8 * l) break;
			if (g.put(b.PAD0, 8), g.getLengthInBits() >= 8 * l) break;
			g.put(b.PAD1, 8)
		}
		return b.createBytes(g, e)
	}, b.createBytes = function(a, b) {
		for (var c = 0, d = 0, e = 0, g = new Array(b.length), h = new Array(b.length), j = 0; j < b.length; j++) {
			var k = b[j].dataCount,
				l = b[j].totalCount - k;
			d = Math.max(d, k), e = Math.max(e, l), g[j] = new Array(k);
			for (var m = 0; m < g[j].length; m++) g[j][m] = 255 & a.buffer[m + c];
			c += k;
			var n = f.getErrorCorrectPolynomial(l),
				o = new i(g[j], n.getLength() - 1),
				p = o.mod(n);
			h[j] = new Array(n.getLength() - 1);
			for (var m = 0; m < h[j].length; m++) {
				var q = m + p.getLength() - h[j].length;
				h[j][m] = q >= 0 ? p.get(q) : 0
			}
		}
		for (var r = 0, m = 0; m < b.length; m++) r += b[m].totalCount;
		for (var s = new Array(r), t = 0, m = 0; d > m; m++)
			for (var j = 0; j < b.length; j++) m < g[j].length && (s[t++] = g[j][m]);
		for (var m = 0; e > m; m++)
			for (var j = 0; j < b.length; j++) m < h[j].length && (s[t++] = h[j][m]);
		return s
	};
	for (var c = {
			MODE_NUMBER: 1,
			MODE_ALPHA_NUM: 2,
			MODE_8BIT_BYTE: 4,
			MODE_KANJI: 8
		}, d = {
			L: 1,
			M: 0,
			Q: 3,
			H: 2
		}, e = {
			PATTERN000: 0,
			PATTERN001: 1,
			PATTERN010: 2,
			PATTERN011: 3,
			PATTERN100: 4,
			PATTERN101: 5,
			PATTERN110: 6,
			PATTERN111: 7
		}, f = {
			PATTERN_POSITION_TABLE: [
				[],
				[6, 18],
				[6, 22],
				[6, 26],
				[6, 30],
				[6, 34],
				[6, 22, 38],
				[6, 24, 42],
				[6, 26, 46],
				[6, 28, 50],
				[6, 30, 54],
				[6, 32, 58],
				[6, 34, 62],
				[6, 26, 46, 66],
				[6, 26, 48, 70],
				[6, 26, 50, 74],
				[6, 30, 54, 78],
				[6, 30, 56, 82],
				[6, 30, 58, 86],
				[6, 34, 62, 90],
				[6, 28, 50, 72, 94],
				[6, 26, 50, 74, 98],
				[6, 30, 54, 78, 102],
				[6, 28, 54, 80, 106],
				[6, 32, 58, 84, 110],
				[6, 30, 58, 86, 114],
				[6, 34, 62, 90, 118],
				[6, 26, 50, 74, 98, 122],
				[6, 30, 54, 78, 102, 126],
				[6, 26, 52, 78, 104, 130],
				[6, 30, 56, 82, 108, 134],
				[6, 34, 60, 86, 112, 138],
				[6, 30, 58, 86, 114, 142],
				[6, 34, 62, 90, 118, 146],
				[6, 30, 54, 78, 102, 126, 150],
				[6, 24, 50, 76, 102, 128, 154],
				[6, 28, 54, 80, 106, 132, 158],
				[6, 32, 58, 84, 110, 136, 162],
				[6, 26, 54, 82, 110, 138, 166],
				[6, 30, 58, 86, 114, 142, 170]
			],
			G15: 1335,
			G18: 7973,
			G15_MASK: 21522,
			getBCHTypeInfo: function(a) {
				for (var b = a << 10; f.getBCHDigit(b) - f.getBCHDigit(f.G15) >= 0;) b ^= f.G15 << f.getBCHDigit(b) - f.getBCHDigit(f.G15);
				return (a << 10 | b) ^ f.G15_MASK
			},
			getBCHTypeNumber: function(a) {
				for (var b = a << 12; f.getBCHDigit(b) - f.getBCHDigit(f.G18) >= 0;) b ^= f.G18 << f.getBCHDigit(b) - f.getBCHDigit(f.G18);
				return a << 12 | b
			},
			getBCHDigit: function(a) {
				for (var b = 0; 0 != a;) b++, a >>>= 1;
				return b
			},
			getPatternPosition: function(a) {
				return f.PATTERN_POSITION_TABLE[a - 1]
			},
			getMask: function(a, b, c) {
				switch (a) {
					case e.PATTERN000:
						return 0 == (b + c) % 2;
					case e.PATTERN001:
						return 0 == b % 2;
					case e.PATTERN010:
						return 0 == c % 3;
					case e.PATTERN011:
						return 0 == (b + c) % 3;
					case e.PATTERN100:
						return 0 == (Math.floor(b / 2) + Math.floor(c / 3)) % 2;
					case e.PATTERN101:
						return 0 == b * c % 2 + b * c % 3;
					case e.PATTERN110:
						return 0 == (b * c % 2 + b * c % 3) % 2;
					case e.PATTERN111:
						return 0 == (b * c % 3 + (b + c) % 2) % 2;
					default:
						throw new Error("bad maskPattern:" + a)
				}
			},
			getErrorCorrectPolynomial: function(a) {
				for (var b = new i([1], 0), c = 0; a > c; c++) b = b.multiply(new i([1, g.gexp(c)], 0));
				return b
			},
			getLengthInBits: function(a, b) {
				if (b >= 1 && 10 > b) switch (a) {
					case c.MODE_NUMBER:
						return 10;
					case c.MODE_ALPHA_NUM:
						return 9;
					case c.MODE_8BIT_BYTE:
						return 8;
					case c.MODE_KANJI:
						return 8;
					default:
						throw new Error("mode:" + a)
				} else if (27 > b) switch (a) {
					case c.MODE_NUMBER:
						return 12;
					case c.MODE_ALPHA_NUM:
						return 11;
					case c.MODE_8BIT_BYTE:
						return 16;
					case c.MODE_KANJI:
						return 10;
					default:
						throw new Error("mode:" + a)
				} else {
					if (!(41 > b)) throw new Error("type:" + b);
					switch (a) {
						case c.MODE_NUMBER:
							return 14;
						case c.MODE_ALPHA_NUM:
							return 13;
						case c.MODE_8BIT_BYTE:
							return 16;
						case c.MODE_KANJI:
							return 12;
						default:
							throw new Error("mode:" + a)
					}
				}
			},
			getLostPoint: function(a) {
				for (var b = a.getModuleCount(), c = 0, d = 0; b > d; d++)
					for (var e = 0; b > e; e++) {
						for (var f = 0, g = a.isDark(d, e), h = -1; 1 >= h; h++)
							if (!(0 > d + h || d + h >= b))
								for (var i = -1; 1 >= i; i++) 0 > e + i || e + i >= b || (0 != h || 0 != i) && g == a.isDark(d + h, e + i) && f++;
						f > 5 && (c += 3 + f - 5)
					}
				for (var d = 0; b - 1 > d; d++)
					for (var e = 0; b - 1 > e; e++) {
						var j = 0;
						a.isDark(d, e) && j++, a.isDark(d + 1, e) && j++, a.isDark(d, e + 1) && j++, a.isDark(d + 1, e + 1) && j++, (0 == j || 4 == j) && (c += 3)
					}
				for (var d = 0; b > d; d++)
					for (var e = 0; b - 6 > e; e++) a.isDark(d, e) && !a.isDark(d, e + 1) && a.isDark(d, e + 2) && a.isDark(d, e + 3) && a.isDark(d, e + 4) && !a.isDark(d, e + 5) && a.isDark(d, e + 6) && (c += 40);
				for (var e = 0; b > e; e++)
					for (var d = 0; b - 6 > d; d++) a.isDark(d, e) && !a.isDark(d + 1, e) && a.isDark(d + 2, e) && a.isDark(d + 3, e) && a.isDark(d + 4, e) && !a.isDark(d + 5, e) && a.isDark(d + 6, e) && (c += 40);
				for (var k = 0, e = 0; b > e; e++)
					for (var d = 0; b > d; d++) a.isDark(d, e) && k++;
				var l = Math.abs(100 * k / b / b - 50) / 5;
				return c += 10 * l
			}
		}, g = {
			glog: function(a) {
				if (1 > a) throw new Error("glog(" + a + ")");
				return g.LOG_TABLE[a]
			},
			gexp: function(a) {
				for (; 0 > a;) a += 255;
				for (; a >= 256;) a -= 255;
				return g.EXP_TABLE[a]
			},
			EXP_TABLE: new Array(256),
			LOG_TABLE: new Array(256)
		}, h = 0; 8 > h; h++) g.EXP_TABLE[h] = 1 << h;
	for (var h = 8; 256 > h; h++) g.EXP_TABLE[h] = g.EXP_TABLE[h - 4] ^ g.EXP_TABLE[h - 5] ^ g.EXP_TABLE[h - 6] ^ g.EXP_TABLE[h - 8];
	for (var h = 0; 255 > h; h++) g.LOG_TABLE[g.EXP_TABLE[h]] = h;
	i.prototype = {
		get: function(a) {
			return this.num[a]
		},
		getLength: function() {
			return this.num.length
		},
		multiply: function(a) {
			for (var b = new Array(this.getLength() + a.getLength() - 1), c = 0; c < this.getLength(); c++)
				for (var d = 0; d < a.getLength(); d++) b[c + d] ^= g.gexp(g.glog(this.get(c)) + g.glog(a.get(d)));
			return new i(b, 0)
		},
		mod: function(a) {
			if (this.getLength() - a.getLength() < 0) return this;
			for (var b = g.glog(this.get(0)) - g.glog(a.get(0)), c = new Array(this.getLength()), d = 0; d < this.getLength(); d++) c[d] = this.get(d);
			for (var d = 0; d < a.getLength(); d++) c[d] ^= g.gexp(g.glog(a.get(d)) + b);
			return new i(c, 0).mod(a)
		}
	}, j.RS_BLOCK_TABLE = [
		[1, 26, 19],
		[1, 26, 16],
		[1, 26, 13],
		[1, 26, 9],
		[1, 44, 34],
		[1, 44, 28],
		[1, 44, 22],
		[1, 44, 16],
		[1, 70, 55],
		[1, 70, 44],
		[2, 35, 17],
		[2, 35, 13],
		[1, 100, 80],
		[2, 50, 32],
		[2, 50, 24],
		[4, 25, 9],
		[1, 134, 108],
		[2, 67, 43],
		[2, 33, 15, 2, 34, 16],
		[2, 33, 11, 2, 34, 12],
		[2, 86, 68],
		[4, 43, 27],
		[4, 43, 19],
		[4, 43, 15],
		[2, 98, 78],
		[4, 49, 31],
		[2, 32, 14, 4, 33, 15],
		[4, 39, 13, 1, 40, 14],
		[2, 121, 97],
		[2, 60, 38, 2, 61, 39],
		[4, 40, 18, 2, 41, 19],
		[4, 40, 14, 2, 41, 15],
		[2, 146, 116],
		[3, 58, 36, 2, 59, 37],
		[4, 36, 16, 4, 37, 17],
		[4, 36, 12, 4, 37, 13],
		[2, 86, 68, 2, 87, 69],
		[4, 69, 43, 1, 70, 44],
		[6, 43, 19, 2, 44, 20],
		[6, 43, 15, 2, 44, 16],
		[4, 101, 81],
		[1, 80, 50, 4, 81, 51],
		[4, 50, 22, 4, 51, 23],
		[3, 36, 12, 8, 37, 13],
		[2, 116, 92, 2, 117, 93],
		[6, 58, 36, 2, 59, 37],
		[4, 46, 20, 6, 47, 21],
		[7, 42, 14, 4, 43, 15],
		[4, 133, 107],
		[8, 59, 37, 1, 60, 38],
		[8, 44, 20, 4, 45, 21],
		[12, 33, 11, 4, 34, 12],
		[3, 145, 115, 1, 146, 116],
		[4, 64, 40, 5, 65, 41],
		[11, 36, 16, 5, 37, 17],
		[11, 36, 12, 5, 37, 13],
		[5, 109, 87, 1, 110, 88],
		[5, 65, 41, 5, 66, 42],
		[5, 54, 24, 7, 55, 25],
		[11, 36, 12],
		[5, 122, 98, 1, 123, 99],
		[7, 73, 45, 3, 74, 46],
		[15, 43, 19, 2, 44, 20],
		[3, 45, 15, 13, 46, 16],
		[1, 135, 107, 5, 136, 108],
		[10, 74, 46, 1, 75, 47],
		[1, 50, 22, 15, 51, 23],
		[2, 42, 14, 17, 43, 15],
		[5, 150, 120, 1, 151, 121],
		[9, 69, 43, 4, 70, 44],
		[17, 50, 22, 1, 51, 23],
		[2, 42, 14, 19, 43, 15],
		[3, 141, 113, 4, 142, 114],
		[3, 70, 44, 11, 71, 45],
		[17, 47, 21, 4, 48, 22],
		[9, 39, 13, 16, 40, 14],
		[3, 135, 107, 5, 136, 108],
		[3, 67, 41, 13, 68, 42],
		[15, 54, 24, 5, 55, 25],
		[15, 43, 15, 10, 44, 16],
		[4, 144, 116, 4, 145, 117],
		[17, 68, 42],
		[17, 50, 22, 6, 51, 23],
		[19, 46, 16, 6, 47, 17],
		[2, 139, 111, 7, 140, 112],
		[17, 74, 46],
		[7, 54, 24, 16, 55, 25],
		[34, 37, 13],
		[4, 151, 121, 5, 152, 122],
		[4, 75, 47, 14, 76, 48],
		[11, 54, 24, 14, 55, 25],
		[16, 45, 15, 14, 46, 16],
		[6, 147, 117, 4, 148, 118],
		[6, 73, 45, 14, 74, 46],
		[11, 54, 24, 16, 55, 25],
		[30, 46, 16, 2, 47, 17],
		[8, 132, 106, 4, 133, 107],
		[8, 75, 47, 13, 76, 48],
		[7, 54, 24, 22, 55, 25],
		[22, 45, 15, 13, 46, 16],
		[10, 142, 114, 2, 143, 115],
		[19, 74, 46, 4, 75, 47],
		[28, 50, 22, 6, 51, 23],
		[33, 46, 16, 4, 47, 17],
		[8, 152, 122, 4, 153, 123],
		[22, 73, 45, 3, 74, 46],
		[8, 53, 23, 26, 54, 24],
		[12, 45, 15, 28, 46, 16],
		[3, 147, 117, 10, 148, 118],
		[3, 73, 45, 23, 74, 46],
		[4, 54, 24, 31, 55, 25],
		[11, 45, 15, 31, 46, 16],
		[7, 146, 116, 7, 147, 117],
		[21, 73, 45, 7, 74, 46],
		[1, 53, 23, 37, 54, 24],
		[19, 45, 15, 26, 46, 16],
		[5, 145, 115, 10, 146, 116],
		[19, 75, 47, 10, 76, 48],
		[15, 54, 24, 25, 55, 25],
		[23, 45, 15, 25, 46, 16],
		[13, 145, 115, 3, 146, 116],
		[2, 74, 46, 29, 75, 47],
		[42, 54, 24, 1, 55, 25],
		[23, 45, 15, 28, 46, 16],
		[17, 145, 115],
		[10, 74, 46, 23, 75, 47],
		[10, 54, 24, 35, 55, 25],
		[19, 45, 15, 35, 46, 16],
		[17, 145, 115, 1, 146, 116],
		[14, 74, 46, 21, 75, 47],
		[29, 54, 24, 19, 55, 25],
		[11, 45, 15, 46, 46, 16],
		[13, 145, 115, 6, 146, 116],
		[14, 74, 46, 23, 75, 47],
		[44, 54, 24, 7, 55, 25],
		[59, 46, 16, 1, 47, 17],
		[12, 151, 121, 7, 152, 122],
		[12, 75, 47, 26, 76, 48],
		[39, 54, 24, 14, 55, 25],
		[22, 45, 15, 41, 46, 16],
		[6, 151, 121, 14, 152, 122],
		[6, 75, 47, 34, 76, 48],
		[46, 54, 24, 10, 55, 25],
		[2, 45, 15, 64, 46, 16],
		[17, 152, 122, 4, 153, 123],
		[29, 74, 46, 14, 75, 47],
		[49, 54, 24, 10, 55, 25],
		[24, 45, 15, 46, 46, 16],
		[4, 152, 122, 18, 153, 123],
		[13, 74, 46, 32, 75, 47],
		[48, 54, 24, 14, 55, 25],
		[42, 45, 15, 32, 46, 16],
		[20, 147, 117, 4, 148, 118],
		[40, 75, 47, 7, 76, 48],
		[43, 54, 24, 22, 55, 25],
		[10, 45, 15, 67, 46, 16],
		[19, 148, 118, 6, 149, 119],
		[18, 75, 47, 31, 76, 48],
		[34, 54, 24, 34, 55, 25],
		[20, 45, 15, 61, 46, 16]
	], j.getRSBlocks = function(a, b) {
		var c = j.getRsBlockTable(a, b);
		if (void 0 == c) throw new Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + b);
		for (var d = c.length / 3, e = [], f = 0; d > f; f++)
			for (var g = c[3 * f + 0], h = c[3 * f + 1], i = c[3 * f + 2], k = 0; g > k; k++) e.push(new j(h, i));
		return e
	}, j.getRsBlockTable = function(a, b) {
		switch (b) {
			case d.L:
				return j.RS_BLOCK_TABLE[4 * (a - 1) + 0];
			case d.M:
				return j.RS_BLOCK_TABLE[4 * (a - 1) + 1];
			case d.Q:
				return j.RS_BLOCK_TABLE[4 * (a - 1) + 2];
			case d.H:
				return j.RS_BLOCK_TABLE[4 * (a - 1) + 3];
			default:
				return void 0
		}
	}, k.prototype = {
		get: function(a) {
			var b = Math.floor(a / 8);
			return 1 == (1 & this.buffer[b] >>> 7 - a % 8)
		},
		put: function(a, b) {
			for (var c = 0; b > c; c++) this.putBit(1 == (1 & a >>> b - c - 1))
		},
		getLengthInBits: function() {
			return this.length
		},
		putBit: function(a) {
			var b = Math.floor(this.length / 8);
			this.buffer.length <= b && this.buffer.push(0), a && (this.buffer[b] |= 128 >>> this.length % 8), this.length++
		}
	};
	var l = [
			[17, 14, 11, 7],
			[32, 26, 20, 14],
			[53, 42, 32, 24],
			[78, 62, 46, 34],
			[106, 84, 60, 44],
			[134, 106, 74, 58],
			[154, 122, 86, 64],
			[192, 152, 108, 84],
			[230, 180, 130, 98],
			[271, 213, 151, 119],
			[321, 251, 177, 137],
			[367, 287, 203, 155],
			[425, 331, 241, 177],
			[458, 362, 258, 194],
			[520, 412, 292, 220],
			[586, 450, 322, 250],
			[644, 504, 364, 280],
			[718, 560, 394, 310],
			[792, 624, 442, 338],
			[858, 666, 482, 382],
			[929, 711, 509, 403],
			[1003, 779, 565, 439],
			[1091, 857, 611, 461],
			[1171, 911, 661, 511],
			[1273, 997, 715, 535],
			[1367, 1059, 751, 593],
			[1465, 1125, 805, 625],
			[1528, 1190, 868, 658],
			[1628, 1264, 908, 698],
			[1732, 1370, 982, 742],
			[1840, 1452, 1030, 790],
			[1952, 1538, 1112, 842],
			[2068, 1628, 1168, 898],
			[2188, 1722, 1228, 958],
			[2303, 1809, 1283, 983],
			[2431, 1911, 1351, 1051],
			[2563, 1989, 1423, 1093],
			[2699, 2099, 1499, 1139],
			[2809, 2213, 1579, 1219],
			[2953, 2331, 1663, 1273]
		],
		o = function() {
			var a = function(a, b) {
				this._el = a, this._htOption = b
			};
			return a.prototype.draw = function(a) {
				function g(a, b) {
					var c = document.createElementNS("http://www.w3.org/2000/svg", a);
					for (var d in b) b.hasOwnProperty(d) && c.setAttribute(d, b[d]);
					return c
				}
				var b = this._htOption,
					c = this._el,
					d = a.getModuleCount();
				Math.floor(b.width / d), Math.floor(b.height / d), this.clear();
				var h = g("svg", {
					viewBox: "0 0 " + String(d) + " " + String(d),
					width: "100%",
					height: "100%",
					fill: b.colorLight
				});
				h.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), c.appendChild(h), h.appendChild(g("rect", {
					fill: b.colorDark,
					width: "1",
					height: "1",
					id: "template"
				}));
				for (var i = 0; d > i; i++)
					for (var j = 0; d > j; j++)
						if (a.isDark(i, j)) {
							var k = g("use", {
								x: String(i),
								y: String(j)
							});
							k.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template"), h.appendChild(k)
						}
			}, a.prototype.clear = function() {
				for (; this._el.hasChildNodes();) this._el.removeChild(this._el.lastChild)
			}, a
		}(),
		p = "svg" === document.documentElement.tagName.toLowerCase(),
		q = p ? o : m() ? function() {
			function a() {
				this._elImage.src = this._elCanvas.toDataURL("image/png"), this._elImage.style.display = "block", this._elCanvas.style.display = "none"
			}
			function d(a, b) {
				var c = this;
				if (c._fFail = b, c._fSuccess = a, null === c._bSupportDataURI) {
					var d = document.createElement("img"),
						e = function() {
							c._bSupportDataURI = !1, c._fFail && _fFail.call(c)
						},
						f = function() {
							c._bSupportDataURI = !0, c._fSuccess && c._fSuccess.call(c)
						};
					return d.onabort = e, d.onerror = e, d.onload = f, d.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==", void 0
				}
				c._bSupportDataURI === !0 && c._fSuccess ? c._fSuccess.call(c) : c._bSupportDataURI === !1 && c._fFail && c._fFail.call(c)
			}
			if (this._android && this._android <= 2.1) {
				var b = 1 / window.devicePixelRatio,
					c = CanvasRenderingContext2D.prototype.drawImage;
				CanvasRenderingContext2D.prototype.drawImage = function(a, d, e, f, g, h, i, j) {
					if ("nodeName" in a && /img/i.test(a.nodeName))
						for (var l = arguments.length - 1; l >= 1; l--) arguments[l] = arguments[l] * b;
					else "undefined" == typeof j && (arguments[1] *= b, arguments[2] *= b, arguments[3] *= b, arguments[4] *= b);
					c.apply(this, arguments)
				}
			}
			var e = function(a, b) {
				this._bIsPainted = !1, this._android = n(), this._htOption = b, this._elCanvas = document.createElement("canvas"), this._elCanvas.width = b.width, this._elCanvas.height = b.height, a.appendChild(this._elCanvas), this._el = a, this._oContext = this._elCanvas.getContext("2d"), this._bIsPainted = !1, this._elImage = document.createElement("img"), this._elImage.style.display = "none", this._el.appendChild(this._elImage), this._bSupportDataURI = null
			};
			return e.prototype.draw = function(a) {
				var b = this._elImage,
					c = this._oContext,
					d = this._htOption,
					e = a.getModuleCount(),
					f = d.width / e,
					g = d.height / e,
					h = Math.round(f),
					i = Math.round(g);
				b.style.display = "none", this.clear();
				for (var j = 0; e > j; j++)
					for (var k = 0; e > k; k++) {
						var l = a.isDark(j, k),
							m = k * f,
							n = j * g;
						c.strokeStyle = l ? d.colorDark : d.colorLight, c.lineWidth = 1, c.fillStyle = l ? d.colorDark : d.colorLight, c.fillRect(m, n, f, g), c.strokeRect(Math.floor(m) + .5, Math.floor(n) + .5, h, i), c.strokeRect(Math.ceil(m) - .5, Math.ceil(n) - .5, h, i)
					}
				this._bIsPainted = !0
			}, e.prototype.makeImage = function() {
				this._bIsPainted && d.call(this, a)
			}, e.prototype.isPainted = function() {
				return this._bIsPainted
			}, e.prototype.clear = function() {
				this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1
			}, e.prototype.round = function(a) {
				return a ? Math.floor(1e3 * a) / 1e3 : a
			}, e
		}() : function() {
			var a = function(a, b) {
				this._el = a, this._htOption = b
			};
			return a.prototype.draw = function(a) {
				for (var b = this._htOption, c = this._el, d = a.getModuleCount(), e = Math.floor(b.width / d), f = Math.floor(b.height / d), g = ['<table style="border:0;border-collapse:collapse;">'], h = 0; d > h; h++) {
					g.push("<tr>");
					for (var i = 0; d > i; i++) g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + e + "px;height:" + f + "px;background-color:" + (a.isDark(h, i) ? b.colorDark : b.colorLight) + ';"></td>');
					g.push("</tr>")
				}
				g.push("</table>"), c.innerHTML = g.join("");
				var j = c.childNodes[0],
					k = (b.width - j.offsetWidth) / 2,
					l = (b.height - j.offsetHeight) / 2;
				k > 0 && l > 0 && (j.style.margin = l + "px " + k + "px")
			}, a.prototype.clear = function() {
				this._el.innerHTML = ""
			}, a
		}();
	QRCode = function(a, b) {
		if (this._htOption = {
				width: 256,
				height: 256,
				typeNumber: 4,
				colorDark: "#000000",
				colorLight: "#ffffff",
				correctLevel: d.H
			}, "string" == typeof b && (b = {
				text: b
			}), b)
			for (var c in b) this._htOption[c] = b[c];
		"string" == typeof a && (a = document.getElementById(a)), this._android = n(), this._el = a, this._oQRCode = null, this._oDrawing = new q(this._el, this._htOption), this._htOption.text && this.makeCode(this._htOption.text)
	}, QRCode.prototype.makeCode = function(a) {
		this._oQRCode = new b(r(a, this._htOption.correctLevel), this._htOption.correctLevel), this._oQRCode.addData(a), this._oQRCode.make(), this._el.title = a, this._oDrawing.draw(this._oQRCode), this.makeImage()
	}, QRCode.prototype.makeImage = function() {
		"function" == typeof this._oDrawing.makeImage && (!this._android || this._android >= 3) && this._oDrawing.makeImage()
	}, QRCode.prototype.clear = function() {
		this._oDrawing.clear()
	}, QRCode.CorrectLevel = d
}();
var baguetteBox=function(){function t(t,n){H.transforms=f(),H.svg=g(),e(),j=document.querySelectorAll(t),[].forEach.call(j,function(t){n&&n.filter&&(A=n.filter);var e=t.getElementsByTagName("a");e=[].filter.call(e,function(t){return A.test(t.href)});var o=D.length;D.push(e),D[o].options=n,[].forEach.call(D[o],function(t,e){m(t,"click",function(t){t.preventDefault?t.preventDefault():t.returnValue=!1,i(o),a(e)})})})}
function e(){return(b=v("baguetteBox-overlay"))?(k=v("baguetteBox-slider"),w=v("previous-button"),C=v("next-button"),T=v("close-button"),void 0):(b=y("div"),b.id="baguetteBox-overlay",document.getElementsByTagName("body")[0].appendChild(b),k=y("div"),k.id="baguetteBox-slider",b.appendChild(k),w=y("button"),w.id="previous-button",w.innerHTML=H.svg?E:"<",b.appendChild(w),C=y("button"),C.id="next-button",C.innerHTML=H.svg?x:">",b.appendChild(C),T=y("button"),T.id="close-button",T.innerHTML=H.svg?B:"X",b.appendChild(T),w.className=C.className=T.className="baguetteBox-button",n(),void 0)}
function n(){m(b,"click",function(t){t.target&&"IMG"!==t.target.nodeName&&"FIGCAPTION"!==t.target.nodeName&&r()}),m(w,"click",function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,c()}),m(C,"click",function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,u()}),m(T,"click",function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,r()}),m(b,"touchstart",function(t){N=t.changedTouches[0].pageX}),m(b,"touchmove",function(t){S||(t.preventDefault?t.preventDefault():t.returnValue=!1,touch=t.touches[0]||t.changedTouches[0],touch.pageX-N>40?(S=!0,c()):touch.pageX-N<-40&&(S=!0,u()))}),m(b,"touchend",function(){S=!1}),m(document,"keydown",function(t){switch(t.keyCode){case 37:c();break;case 39:u();break;case 27:r()}})}
function i(t){if(M!==t){for(M=t,o(D[t].options);k.firstChild;)k.removeChild(k.firstChild);X.length=0;for(var e,n=0;n<D[t].length;n++)e=y("div"),e.className="full-image",e.id="baguette-img-"+n,X.push(e),k.appendChild(X[n])}}
function o(t){t||(t={});for(var e in P)I[e]=P[e],"undefined"!=typeof t[e]&&(I[e]=t[e]);k.style.transition=k.style.webkitTransition="fadeIn"===I.animation?"opacity .4s ease":"slideIn"===I.animation?"":"none","auto"===I.buttons&&("ontouchstart"in window||1===D[M].length)&&(I.buttons=!1),w.style.display=C.style.display=I.buttons?"":"none"}
function a(t){"block"!==b.style.display&&(L=t,s(L,function(){p(L),h(L)}),d(),b.style.display="block",setTimeout(function(){b.className="visible",I.afterShow&&I.afterShow()},50),I.onChange&&I.onChange(L,X.length))}
function r(){"none"!==b.style.display&&(b.className="",setTimeout(function(){b.style.display="none",I.afterHide&&I.afterHide()},500))}
function s(t,e){var n=X[t];if("undefined"!=typeof n){if(n.getElementsByTagName("img")[0])return e&&e(),void 0;imageElement=D[M][t],imageCaption="function"==typeof I.captions?I.captions.call(D[M],imageElement):imageElement.getAttribute("data-caption")||imageElement.title,imageSrc=l(imageElement);var i=y("figure"),o=y("img"),a=y("figcaption");n.appendChild(i),i.innerHTML='<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>',o.onload=function(){var n=document.querySelector("#baguette-img-"+t+" .spinner");i.removeChild(n),!I.async&&e&&e()},o.setAttribute("src",imageSrc),i.appendChild(o),I.captions&&imageCaption&&(a.innerHTML=imageCaption,i.appendChild(a)),I.async&&e&&e()}}
function l(t){var e=imageElement.href;if(t.dataset){var n=[];for(var i in t.dataset)"at-"!==i.substring(0,3)||isNaN(i.substring(3))||(n[i.replace("at-","")]=t.dataset[i]);keys=Object.keys(n).sort(function(t,e){return parseInt(t)<parseInt(e)?-1:1});for(var o=window.innerWidth*window.devicePixelRatio,a=0;a<keys.length-1&&keys[a]<o;)a++;e=n[keys[a]]||e}
return e}
function u(){var t;return L<=X.length-2?(L++,d(),p(L),t=!0):I.animation&&(k.className="bounce-from-right",setTimeout(function(){k.className=""},400),t=!1),I.onChange&&I.onChange(L,X.length),t}
function c(){var t;return L>=1?(L--,d(),h(L),t=!0):I.animation&&(k.className="bounce-from-left",setTimeout(function(){k.className=""},400),t=!1),I.onChange&&I.onChange(L,X.length),t}
function d(){var t=100*-L+"%";"fadeIn"===I.animation?(k.style.opacity=0,setTimeout(function(){H.transforms?k.style.transform=k.style.webkitTransform="translate3d("+t+",0,0)":k.style.left=t,k.style.opacity=1},400)):H.transforms?k.style.transform=k.style.webkitTransform="translate3d("+t+",0,0)":k.style.left=t}
function f(){var t=y("div");return"undefined"!=typeof t.style.perspective||"undefined"!=typeof t.style.webkitPerspective}
function g(){var t=y("div");return t.innerHTML="<svg/>","http://www.w3.org/2000/svg"==(t.firstChild&&t.firstChild.namespaceURI)}
function p(t){t-L>=I.preload||s(t+1,function(){p(t+1)})}
function h(t){L-t>=I.preload||s(t-1,function(){h(t-1)})}
function m(t,e,n){t.addEventListener?t.addEventListener(e,n,!1):t.attachEvent("on"+e,n)}
function v(t){return document.getElementById(t)}
function y(t){return document.createElement(t)}
var b,k,w,C,T,N,E='<svg width="44" height="60"><polyline points="30 10 10 30 30 50" stroke="rgba(255,255,255,.8)" stroke-width="4"stroke-linecap="butt" fill="none" stroke-linejoin="round"/></svg>',x='<svg width="44" height="60"><polyline points="14 10 34 30 14 50" stroke="rgba(255,255,255,.8)" stroke-width="4"stroke-linecap="butt" fill="none" stroke-linejoin="round"/></svg>',B='<svg width="30" height="30"><g stroke="rgba(255,255,255,.8)" stroke-width="4"><line x1="5" y1="5" x2="25" y2="25"/><line x1="5" y1="25" x2="25" y2="5"/></g></svg>',I={},P={captions:!0,buttons:"auto",async:!1,preload:2,animation:"slideIn",afterShow:null,afterHide:null,onChange:null},H={},L=0,M=-1,S=!1,A=/.+\.(gif|jpe?g|png|webp)/i,j=[],D=[],X=[];return[].forEach||(Array.prototype.forEach=function(t,e){for(var n=0;n<this.length;n++)t.call(e,this[n],n,this)}),[].filter||(Array.prototype.filter=function(t,e,n,i,o){for(n=this,i=[],o=0;o<n.length;o++)t.call(e,n[o],o,n)&&i.push(n[o]);return i}),{run:t,showNext:u,showPrevious:c}}();var home=location.href,s=$('#bgvideo')[0],Siren={MN:function(){$('.iconflat').on('click',function(){$('body').toggleClass('navOpen');$('#main-container,#mo-nav,.openNav').toggleClass('open');});},MNH:function(){if($('body').hasClass('navOpen')){$('body').toggleClass('navOpen');$('#main-container,#mo-nav,.openNav').toggleClass('open');}},splay:function(){$('#video-btn').addClass('video-pause').removeClass('video-play').show();$('.video-stu').css({"bottom":"-100px"});$('.focusinfo').css({"top":"-999px"});s.play();},spause:function(){$('#video-btn').addClass('video-play').removeClass('video-pause');$('.focusinfo').css({"top":"49.3%"});s.pause();},liveplay:function(){if(s.oncanplay!=undefined&&$('.haslive').length>0){if($('.videolive').length>0){Siren.splay();}}},livepause:function(){if(s.oncanplay!=undefined&&$('.haslive').length>0){Siren.spause();$('.video-stu').css({"bottom":"0px"}).html('已暂停 ...');}},addsource:function(){$('.video-stu').html('正在载入视频 ...').css({"bottom":"0px"});var t=Poi.movies.name.split(","),_t=t[Math.floor(Math.random()*t.length)];$('#bgvideo').attr('src',Poi.movies.url+'/'+_t+'.mp4');$('#bgvideo').attr('video-name',_t);},LV:function(){var _btn=$('#video-btn');_btn.on('click',function(){if($(this).hasClass('loadvideo')){$(this).addClass('video-pause').removeClass('loadvideo').hide();Siren.addsource();s.oncanplay=function(){Siren.splay();$('#video-add').show();_btn.addClass('videolive');_btn.addClass('haslive');}}else{if($(this).hasClass('video-pause')){Siren.spause();_btn.removeClass('videolive');$('.video-stu').css({"bottom":"0px"}).html('已暂停 ...');}else{Siren.splay();_btn.addClass('videolive');}}
s.onended=function(){$('#bgvideo').attr('src','');$('#video-add').hide();_btn.addClass('loadvideo').removeClass('video-pause');_btn.removeClass('videolive');_btn.removeClass('haslive');$('.focusinfo').css({"top":"49.3%"});}});$('#video-add').on('click',function(){Siren.addsource();});},AH:function(){if(Poi.windowheight=='auto'){if($('h1.main-title').length>0){var _height=$(window).height();$('#centerbg').css({'height':_height});$('#bgvideo').css({'min-height':_height});$(window).resize(function(){Siren.AH();});}}else{$('.headertop').addClass('headertop-bar');}},PE:function(){if($('.headertop').length>0){if($('h1.main-title').length>0){$('.blank').css({"padding-top":"0px"});$('.headertop').css({"height":"auto"}).show();if(Poi.movies.live=='open')Siren.liveplay();}else{$('.blank').css({"padding-top":"80px"});$('.headertop').css({"height":"0px"}).hide();Siren.livepause();}}},CE:function(){$('.comments-hidden').show();$('.comments-main').hide();$('.comments-hidden').click(function(){$('.comments-main').slideDown(500);$('.comments-hidden').hide();});$('.archives').hide();$('.archives:first').show();$('#archives-temp h3').click(function(){$(this).next().slideToggle('fast');return false;});baguetteBox.run('.entry-content',{captions:function(element){return element.getElementsByTagName('img')[0].alt;}});$('.js-toggle-search').on('click',function(){$('.js-toggle-search').toggleClass('is-active');$('.js-search').toggleClass('is-visible');});$('.search_close').on('click',function(){if($('.js-search').hasClass('is-visible')){$('.js-toggle-search').toggleClass('is-active');$('.js-search').toggleClass('is-visible');}});$('#show-nav').on('click',function(){if($('#show-nav').hasClass('showNav')){$('#show-nav').removeClass('showNav').addClass('hideNav');$('.site-top .lower nav').addClass('navbar');console.log("%c 打开菜单 %c","background:#9a9da2; color:#ffffff; border-radius:4px;","","http://skyarea.cn");}else{$('#show-nav').removeClass('hideNav').addClass('showNav');$('.site-top .lower nav').removeClass('navbar');console.log("%c 关闭菜单 %c","background:#9a9da2; color:#ffffff; border-radius:4px;","","http://skyarea.cn");}});$("#loading").click(function(){console.log("%c 过渡动画 %c","background:#9a9da2; color:#ffffff; border-radius:4px;","","http://skyarea.cn");$("#loading").fadeOut(800);});$(".smli-button").on('click',function(){$(".smilies-box").fadeToggle("slow");});$('#weixin').click(function(){$("#qrcode-open").addClass("demo-open");$('#black_mask').addClass("add_mask");$('#qrcode img').remove();var qrcode=new QRCode('qrcode',{text:home,colorDark:'rgb(85, 85, 85)',colorLight:'#ffffff',width:'130',height:'130',correctLevel:QRCode.CorrectLevel.H})});$('#black_mask').click(function(){$("#qrcode-open").removeClass("demo-open");$('#black_mask').removeClass("add_mask");});},NH:function(){var h1=0,h2=50,ss=$(document).scrollTop();$(window).scroll(function(){var s=$(document).scrollTop();if(s==h1){$('.site-header').removeClass('yya');}if(s>h1){$('.site-header').addClass('yya');}if(s>h2){$('.site-header').addClass('gizle');if(s>ss){$('.site-header').removeClass('sabit');}else{$('.site-header').addClass('sabit');}
ss=s;}});},XLS:function(){$body=(window.opera)?(document.compatMode=="CSS1Compat"?$('html'):$('body')):$('html,body');$('body').on('click','#pagination a',function(){$(this).addClass("loading").text("");$.ajax({type:"POST",url:$(this).attr("href")+"#main",success:function(data){result=$(data).find("#main .post");nextHref=$(data).find("#pagination a").attr("href");$("#main").append(result.fadeIn(500));$("#pagination a").removeClass("loading").text("下一页");if(nextHref!=undefined){$("#pagination a").attr("href",nextHref);}else{$("#pagination").html("<span>别翻了，真的没有了 ...</span>");}}});return false;});},SFS:function(){$(window).scroll(function(){     var htmlHeight=document.body.scrollHeight||document.documentElement.scrollHeight;     var clientHeight=$(this).height()+1;var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;var page_next=$('#pagination a').attr("href");var load_key=document.getElementById("add_post_time");if(scrollTop+clientHeight>htmlHeight){if(page_next!=undefined&&load_key){var load_time=document.getElementById("add_post_time").title;console.log("%c 自动加载时倒计时 %c","background:#9a9da2; color:#ffffff; border-radius:4px;","","http://skyarea.cn",load_time);$('#add_post span').addClass("loading").text("");setTimeout(function(){load_post();},load_time*1000);function load_post(){$('#pagination a').addClass("loading").text("");$.ajax({type:"POST",url:$('#pagination a').attr("href")+"#main",success:function(data){result=$(data).find("#main .post");nextHref=$(data).find("#pagination a").attr("href");$("#main").append(result.fadeIn(500));$("#pagination a").removeClass("loading").text("下一页");$('#add_post span').removeClass("loading").text("");if(nextHref!=undefined){$("#pagination a").attr("href",nextHref);}else{$("#pagination").html("<span>别翻了，真的没有了 ...</span>");}}});return false;}}}});},XCS:function(){var __cancel=jQuery('#cancel-comment-reply-link'),__cancel_text=__cancel.text(),__list='commentwrap';jQuery(document).on("submit","#commentform",function(){jQuery.ajax({url:Poi.ajaxurl,data:jQuery(this).serialize()+"&action=ajax_comment",type:jQuery(this).attr('method'),beforeSend:addComment.createButterbar("让我看看你是不是在说我坏话！"),error:function(request){var t=addComment;t.createButterbar(request.responseText);},success:function(data){jQuery('textarea').each(function(){this.value=''});var t=addComment,cancel=t.I('cancel-comment-reply-link'),temp=t.I('wp-temp-form-div'),respond=t.I(t.respondId),post=t.I('comment_post_ID').value,parent=t.I('comment_parent').value;if(parent!='0'){jQuery('#respond').before('<ol class="children">'+data+'</ol>');}else if(!jQuery('.'+__list).length){if(Poi.formpostion=='bottom'){jQuery('#respond').before('<ol class="'+__list+'">'+data+'</ol>');}else{jQuery('#respond').after('<ol class="'+__list+'">'+data+'</ol>');}}else{if(Poi.order=='asc'){jQuery('.'+__list).append(data);}else{jQuery('.'+__list).prepend(data);}}
t.createButterbar("算了，呈上去了！");cancel.style.display='none';cancel.onclick=null;t.I('comment_parent').value='0';if(temp&&respond){temp.parentNode.insertBefore(respond,temp);temp.parentNode.removeChild(temp)}}});return false;});addComment={moveForm:function(commId,parentId,respondId){var t=this,div,comm=t.I(commId),respond=t.I(respondId),cancel=t.I('cancel-comment-reply-link'),parent=t.I('comment_parent'),post=t.I('comment_post_ID');__cancel.text(__cancel_text);t.respondId=respondId;if(!t.I('wp-temp-form-div')){div=document.createElement('div');div.id='wp-temp-form-div';div.style.display='none';respond.parentNode.insertBefore(div,respond)}!comm?(temp=t.I('wp-temp-form-div'),t.I('comment_parent').value='0',temp.parentNode.insertBefore(respond,temp),temp.parentNode.removeChild(temp)):comm.parentNode.insertBefore(respond,comm.nextSibling);jQuery("body").animate({scrollTop:jQuery('#respond').offset().top-180},400);parent.value=parentId;cancel.style.display='';cancel.onclick=function(){var t=addComment,temp=t.I('wp-temp-form-div'),respond=t.I(t.respondId);t.I('comment_parent').value='0';if(temp&&respond){temp.parentNode.insertBefore(respond,temp);temp.parentNode.removeChild(temp);}
this.style.display='none';this.onclick=null;return false;};try{t.I('comment').focus();}catch(e){}
return false;},I:function(e){return document.getElementById(e);},clearButterbar:function(e){if(jQuery(".butterBar").length>0){jQuery(".butterBar").remove();}},createButterbar:function(message){var t=this;t.clearButterbar();jQuery("body").append('<div class="butterBar butterBar--center"><p class="butterBar-message">'+message+'</p></div>');setTimeout("jQuery('.butterBar').remove()",3000);}};},XCP:function(){$body=(window.opera)?(document.compatMode=="CSS1Compat"?$('html'):$('body')):$('html,body');$('body').on('click','#comments-navi a',function(e){e.preventDefault();$.ajax({type:"GET",url:$(this).attr('href'),beforeSend:function(){$('#comments-navi').remove();$('ul.commentwrap').remove();$('#loading-comments').slideDown();$body.animate({scrollTop:$('#comments-list-title').offset().top-65},800);},dataType:"html",success:function(out){result=$(out).find('ul.commentwrap');nextlink=$(out).find('#comments-navi');$('#loading-comments').slideUp('fast');$('#loading-comments').after(result.fadeIn(500));$('ul.commentwrap').after(nextlink);}});});},IA:function(){POWERMODE.colorful=true;POWERMODE.shake=false;document.body.addEventListener('input',POWERMODE)},GT:function(){var offset=100,offset_opacity=1200,scroll_top_duration=700,$back_to_top=$('.cd-top');$(window).scroll(function(){($(this).scrollTop()>offset)?$back_to_top.addClass('cd-is-visible'):$back_to_top.removeClass('cd-is-visible cd-fade-out');if($(this).scrollTop()>offset_opacity){$back_to_top.addClass('cd-fade-out');}});$back_to_top.on('click',function(event){event.preventDefault();$('body,html').animate({scrollTop:0,},scroll_top_duration);});},NV:function(){$('.nav_icon').on('click',function(){var time=500;if($('#nav_icon').text()=='目录'){$('.post_nav').addClass('post_nav_hidden');$('.post_nav').animate({opacity:.95,bottom:"0px",},time);$('.nav_icon').removeClass('breath_animation');$('#nav_icon').text("收起");}
else if($('#nav_icon').text()=="收起"){$('.post_nav').animate({opacity:0,bottom:"-999px"},time);$('.post_nav').removeClass('post_nav_hidden');$('.nav_icon').addClass('breath_animation');$('#nav_icon').text("目录");}});$('.tooltip').click(function(e){e.preventDefault();$('html,body').animate({scrollTop:$(this.hash).offset().top-80});});}}
$(function(){Siren.AH();Siren.PE();Siren.NH();Siren.GT();Siren.XLS();Siren.XCS();Siren.XCP();Siren.CE();Siren.MN();Siren.IA();Siren.LV();Siren.SFS();Siren.NV();if(Poi.pjax){$(document).pjax("a[target!=_top][data-pjax!='0'][class!='download'][class!='comment-reply-link']",'#page',{fragment:'#page',timeout:8000,}).on('pjax:send',function(){$('#loading').fadeIn(300);Siren.MNH();}).on('pjax:complete',function(){Siren.AH();Siren.PE();Siren.CE();Siren.NV();home=location.href;$("#loading").fadeOut(500);if($('.ds-thread').length>0){if(typeof DUOSHUO!=='undefined'){DUOSHUO.EmbedThread('.ds-thread');}else{$.getScript("//static.duoshuo.com/embed.js");}};}).on('submit','.search-form,.s-search',function(event){event.preventDefault();$.pjax.submit(event,'#page',{fragment:'#page',timeout:8000,});if($('.js-search.is-visible').length>0){$('.js-toggle-search').toggleClass('is-active');$('.js-search').toggleClass('is-visible');}});window.addEventListener('popstate',function(e){Siren.AH();Siren.PE();Siren.CE();},false);}
$.fn.postLike=function(){if($(this).hasClass('done')){return false;}else{$(this).addClass('done');var id=$(this).data("id"),action=$(this).data('action'),rateHolder=$(this).children('.count');var ajax_data={action:"specs_zan",um_id:id,um_action:action};$.post(Poi.ajaxurl,ajax_data,function(data){$(rateHolder).html(data);});return false;}};$(document).on("click",".specsZan",function(){$(this).postLike();});});var isWebkit=navigator.userAgent.toLowerCase().indexOf('webkit')>-1,isOpera=navigator.userAgent.toLowerCase().indexOf('opera')>-1,isIe=navigator.userAgent.toLowerCase().indexOf('msie')>-1;if((isWebkit||isOpera||isIe)&&document.getElementById&&window.addEventListener){window.addEventListener('hashchange',function(){var id=location.hash.substring(1),element;if(!(/^[A-z0-9_-]+$/.test(id))){return;}
element=document.getElementById(id);if(element){if(!(/^(?:a|select|input|button|textarea)$/i.test(element.tagName))){element.tabIndex=-1;}
element.focus();}},false);};function grin(tag){var myField;tag=' '+tag+' ';if(document.getElementById('comment')&&document.getElementById('comment').type=='textarea'){myField=document.getElementById('comment');}else{return false;}
if(document.selection){myField.focus();sel=document.selection.createRange();sel.text=tag;myField.focus();}
else if(myField.selectionStart||myField.selectionStart=='0'){var startPos=myField.selectionStart;var endPos=myField.selectionEnd;var cursorPos=endPos;myField.value=myField.value.substring(0,startPos)
+tag
+myField.value.substring(endPos,myField.value.length);cursorPos+=tag.length;myField.focus();myField.selectionStart=cursorPos;myField.selectionEnd=cursorPos;}
else{myField.value+=tag;myField.focus();}};
(function webpackUniversalModuleDefinition(b,a){if(typeof exports==="object"&&typeof module==="object"){module.exports=a()}else{if(typeof define==="function"&&define.amd){define([],a)}else{if(typeof exports==="object"){exports.POWERMODE=a()}else{b.POWERMODE=a()}}}})(this,function(){return(function(c){var b={};function a(e){if(b[e]){return b[e].exports}var d=b[e]={exports:{},id:e,loaded:false};c[e].call(d.exports,d,d.exports,a);d.loaded=true;return d.exports}a.m=c;a.c=b;a.p="";return a(0)})([function(j,e,a){var b=document.createElement("canvas");b.width=window.innerWidth;b.height=window.innerHeight;b.style.cssText="position:fixed;top:0;left:0;pointer-events:none;z-index:999999";window.addEventListener("resize",function(){b.width=window.innerWidth;b.height=window.innerHeight});document.body.appendChild(b);var c=b.getContext("2d");var l=[];var k=0;m.shake=true;function h(o,n){return Math.random()*(n-o)+o}function g(n){if(m.colorful){var o=h(0,360);return"hsla("+h(o-10,o+10)+", 100%, "+h(50,80)+"%, "+1+")"}else{return window.getComputedStyle(n).color}}function f(){var o=document.activeElement;var n;if(o.tagName==="TEXTAREA"||(o.tagName==="INPUT"&&o.getAttribute("type")==="text")){var p=a(1)(o,o.selectionStart);n=o.getBoundingClientRect();return{x:p.left+n.left,y:p.top+n.top,color:g(o)}}var r=window.getSelection();if(r.rangeCount){var q=r.getRangeAt(0);var s=q.startContainer;if(s.nodeType===document.TEXT_NODE){s=s.parentNode}n=q.getBoundingClientRect();return{x:n.left,y:n.top,color:g(s)}}return{x:0,y:0,color:"transparent"}}function d(o,p,n){return{x:o,y:p,alpha:1,color:n,velocity:{x:-1+Math.random()*2,y:-3.5+Math.random()*2}}}function m(){var n=f();var p=5+Math.round(Math.random()*10);while(p--){l[k]=d(n.x,n.y,n.color);k=(k+1)%500}if(m.shake){var o=1+2*Math.random();var q=o*(Math.random()>0.5?-1:1);var r=o*(Math.random()>0.5?-1:1);document.body.style.marginLeft=q+"px";document.body.style.marginTop=r+"px";setTimeout(function(){document.body.style.marginLeft="";document.body.style.marginTop=""},75)}}m.colorful=false;function i(){requestAnimationFrame(i);c.clearRect(0,0,b.width,b.height);for(var n=0;n<l.length;++n){var o=l[n];if(o.alpha<=0.1){continue}o.velocity.y+=0.075;o.x+=o.velocity.x;o.y+=o.velocity.y;o.alpha*=0.96;c.globalAlpha=o.alpha;c.fillStyle=o.color;c.fillRect(Math.round(o.x-1.5),Math.round(o.y-1.5),3,3)}}requestAnimationFrame(i);j.exports=m},function(b,a){(function(){var e=["direction","boxSizing","width","height","overflowX","overflowY","borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth","borderStyle","paddingTop","paddingRight","paddingBottom","paddingLeft","fontStyle","fontVariant","fontWeight","fontStretch","fontSize","fontSizeAdjust","lineHeight","fontFamily","textAlign","textTransform","textIndent","textDecoration","letterSpacing","wordSpacing","tabSize","MozTabSize"];var d=window.mozInnerScreenX!=null;function c(k,m,l){var h=l&&l.debug||false;if(h){var j=document.querySelector("#input-textarea-caret-position-mirror-div");if(j){j.parentNode.removeChild(j)}}var i=document.createElement("div");i.id="input-textarea-caret-position-mirror-div";document.body.appendChild(i);var o=i.style;var f=window.getComputedStyle?getComputedStyle(k):k.currentStyle;o.whiteSpace="pre-wrap";if(k.nodeName!=="INPUT"){o.wordWrap="break-word"}o.position="absolute";if(!h){o.visibility="hidden"}e.forEach(function(p){o[p]=f[p]});if(d){if(k.scrollHeight>parseInt(f.height)){o.overflowY="scroll"}}else{o.overflow="hidden"}i.textContent=k.value.substring(0,m);if(k.nodeName==="INPUT"){i.textContent=i.textContent.replace(/\s/g,"\u00a0")}var n=document.createElement("span");n.textContent=k.value.substring(m)||".";i.appendChild(n);var g={top:n.offsetTop+parseInt(f.borderTopWidth),left:n.offsetLeft+parseInt(f.borderLeftWidth)};if(h){n.style.backgroundColor="#aaa"}else{document.body.removeChild(i)}return g}if(typeof b!="undefined"&&typeof b.exports!="undefined"){b.exports=c}else{window.getCaretCoordinates=c}}())}])});
window.addComment=function(a){function b(){c(),g()}function c(a){if(t&&(m=j(r.cancelReplyId),n=j(r.commentFormId),m)){m.addEventListener("touchstart",e),m.addEventListener("click",e);for(var b,c=d(a),g=0,h=c.length;g<h;g++)b=c[g],b.addEventListener("touchstart",f),b.addEventListener("click",f)}}function d(a){var b,c=r.commentReplyClass;return a&&a.childNodes||(a=q),b=q.getElementsByClassName?a.getElementsByClassName(c):a.querySelectorAll("."+c)}function e(a){var b=this,c=r.temporaryFormId,d=j(c);d&&o&&(j(r.parentIdFieldId).value="0",d.parentNode.replaceChild(o,d),b.style.display="none",a.preventDefault())}function f(b){var c,d=this,e=i(d,"belowelement"),f=i(d,"commentid"),g=i(d,"respondelement"),h=i(d,"postid");e&&f&&g&&h&&(c=a.addComment.moveForm(e,f,g,h),!1===c&&b.preventDefault())}function g(){if(s){var a={childList:!0,subTree:!0};p=new s(h),p.observe(q.body,a)}}function h(a){for(var b=a.length;b--;)if(a[b].addedNodes.length)return void c()}function i(a,b){return u?a.dataset[b]:a.getAttribute("data-"+b)}function j(a){return q.getElementById(a)}function k(b,c,d,e){var f=j(b);o=j(d);var g,h,i,k=j(r.parentIdFieldId),p=j(r.postIdFieldId);if(f&&o&&k){l(o),e&&p&&(p.value=e),k.value=c,m.style.display="",f.parentNode.insertBefore(o,f.nextSibling),m.onclick=function(){return!1};try{for(var s=0;s<n.elements.length;s++)if(g=n.elements[s],h=!1,"getComputedStyle"in a?i=a.getComputedStyle(g):q.documentElement.currentStyle&&(i=g.currentStyle),(g.offsetWidth<=0&&g.offsetHeight<=0||"hidden"===i.visibility)&&(h=!0),"hidden"!==g.type&&!g.disabled&&!h){g.focus();break}}catch(t){}return!1}}function l(a){var b=r.temporaryFormId,c=j(b);c||(c=q.createElement("div"),c.id=b,c.style.display="none",a.parentNode.insertBefore(c,a))}var m,n,o,p,q=a.document,r={commentReplyClass:"comment-reply-link",cancelReplyId:"cancel-comment-reply-link",commentFormId:"commentform",temporaryFormId:"wp-temp-form-div",parentIdFieldId:"comment_parent",postIdFieldId:"comment_post_ID"},s=a.MutationObserver||a.WebKitMutationObserver||a.MozMutationObserver,t="querySelector"in q&&"addEventListener"in a,u=!!q.documentElement.dataset;return t&&"loading"!==q.readyState?b():t&&a.addEventListener("DOMContentLoaded",b,!1),{init:c,moveForm:k}}(window);