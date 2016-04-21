/*模仿jQuery封装的框架
 * @author: luxury_bug(郭洛)
 * @language: javascript
 * 版权所有
 * 关于框架---|----为什么要封装框架？
 *                 |----原生JS有很多兼容性问题，为了处理兼容，所以需要封装框架
 *            |----*/
(function(w){
    function GL(){
    };
    GL.prototype = {
        /*extend:用一个或多个其他对象来扩展一个对象，返回被扩展的对象。     */
        // param：
        // @target目标对象
        // @object功能补充对象
        elements: [],
        extend: function(target,object){
            for(var i in object){
                target[i] = object[i];
            }
            return target;
        }
    }

    var $$ = new GL();
    /*============================================================
     1.原型 2.JSON 3.extend
     * ============================================================*/
    /*字符串操作模块*/
    $$.extend($$,{
        trim: function(str){
            return str.trim();
        }
    });

    /*数组操作模块*/
    $$.extend($$,{
        //打印数组
        arrToString: function(arr){
            for(var i=0;i<arr.length;i++){
                console.log(arr[i]);
            }
        },
    });

    /*数据类型判断模块*/
    $$.extend($$,{
        /*判断数据类型*/
        //数值
        isNumber: function(val){
            return typeof val === 'number' && isFinite(val);
        },
        //字符串
        isString: function(val){
            return typeof val === 'string';
        },
        //布尔
        isBoolean: function(val){
            return typeof val === 'boolean';
        },
        //undefined
        isUndefined: function(val){
            return typeof val === 'undefined';
        },
        //Obj
        isObj: function(val){
            if(str === null || typeof str === 'undefined'){
                return false;
            }
            return typeof str === 'object';
        },
        //数组
        isArray: function(val){
            return Object.prototype.toString.call(arr) === '[object Array]';
        }
    });

    /*选择器模块*/
    $$.extend($$,{
        // 获取父容器
        // 判断mydiv1.是否传参2.是否为dom3.是否为字符串
        // return: mydiv || document || $$.id(mydiv) || null
        getDom: function(mydiv){
            // 1.当mydiv不传参时，默认在整个document中寻找
            var dom = $$.isUndefined(mydiv) ? document : mydiv;   //document,dom,str
            // 2.当dom是str时，转换成dom元素
            dom = $$.isString(dom) ? $$.$id(dom) : dom;
            return dom;
        },
        //ID选择器
        // param：
        // @id元素ID
        $id: function(id){
            this.elements = [];
            this.elements.push(document.getElementById(id));
            return this;
        },
        //标签选择器
        // param：
        // @tag标签-------------------------------------------------------
        // @mydiv某个dom元素或者元素ID
        $tag: function(tag,mydiv){
            //采用隔离法则
            //1.获取容器元素---缩小范围
            var dom = $$.getDom(mydiv);
            //2.获取容器内的目标元素
            var eles = getElements(tag,dom);
            return eles;
            //获取容器内的目标元素
            function getElements(tag,dom){
                return dom ? dom.getElementsByTagName(tag) : null;
            }
        },
        //类选择器
        // param：
        // @cname类名----------------------------
        // @mydiv某个dom元素或者元素ID
        $class: function(cname,mydiv){
            //采用隔离法则
            //1.获取容器元素---缩小范围
            var dom = $$.getDom(mydiv);
            //2.获取容器内的目标元素
            var eles = getElements(cname,dom);

            return eles;

            //2.获取容器内的目标元素
            function getElements(cname,dom){
                if(!dom){ return null;}
                //判断浏览器是否支持getElementsByClassName
                if(dom.getElementsByClassName){
                    //支持
                    return dom.getElementsByClassName(cname);
                }else{
                    //不支持
                    var eles = [];
                    //1.获取文档中所有元素
                    var allEle = dom.getElementsByTagName('*');
                    //2.遍历所有比较className
                    for(var i = 0,len = allEle.length;i < len;i++){
                        if(allEle[i].className == cname){
                            eles.push(allEle[i]);
                        }
                    }
                    return eles;
                }
            }
        },
        //组合选择器
        // param：
        // @str---'.happy,.play,#span1,span'
        $group: function(str){
            //1.分解字符串----转换成数组
            var resultArr = [];
            var arr = $$.trim(str).split(',');
            //2.各个击破
            for(var i=0;i<arr.length;i++){
                var item = $$.trim(arr[i]);
                var first = item.charAt(0);   //获取首字母
                var tname = item.slice(1);    //截取标签单词
                if(first == '#'){
                    //ID
                    resultArr.push($$.$id(tname));
                }else if(first == '.'){
                    //类
                    getClassEles();
                }else{
                    //标签
                    getTagEles();
                }
            }
            return resultArr;

            // 获取类元素，并注意push入结果数组
            function getClassEles(){
                var lis = $$.$class(tname);
                pushResultArr(lis);
            }

            // 获取tag元素，并注意push入结果数组
            function getTagEles(){
                var lis = $$.$tag(item);
                pushResultArr(lis);
            }

            function pushResultArr(doms){
                for(var j=0;j<doms.length;j++){
                    resultArr.push(doms[j]);
                }
            }
        },
        //层级选择器
        // param：
        // @str---".fu li .span1"
        $layer: function(str){
            //1.分解字符串----转换成数组
            var arr = $$.trim(str).split(' ');

            var pipelineArr = [];      //存储管道数组
            var resultArr = [];        //存储管道结果数组
            //2.各个击破
            for(var i=0;i<arr.length;i++){
                //更新管道数组
                pipelineArr = resultArr;
                //清空管道结果数组
                resultArr = [];
                var item = $$.trim(arr[i]);
                var first = item.charAt(0);   //获取首字母
                var tname = item.slice(1);    //截取标签单词
                if(first == '#'){
                    //ID
                    //管道唯一
                    resultArr.push($$.$id(tname));
                }else if(first == '.'){
                    getClassEle();
                }else{
                    getTagEle()
                }
            }

            function getClassEle(){
                //进行判断，是第一个吗？
                if(pipelineArr.length){
                    //有管道
                    //类
                    //遍历每一条管道，寻找每条管道里的该类
                    for(var j= 0,lenJ = pipelineArr.length;j< lenJ;j++){
                        var temp = $$.$class(tname,pipelineArr[j]);
                        pushResultArr(temp);
                    }
                }else{
                    var temp = $$.$class(tname);
                    pushResultArr(temp);
                }
            }

            function getTagEle(){
                //进行判断，是第一个吗？
                if(pipelineArr.length){
                    //标签
                    //遍历每一条管道，寻找每条管道里的该标签
                    //注意：标签不需要被截取首字母
                    for(var j= 0,lenJ = pipelineArr.length;j< lenJ;j++){
                        var temp = $$.$tag(item,pipelineArr[j]);
                        pushResultArr(temp);
                    }
                }else{
                    var temp = $$.$tag(item);
                    pushResultArr(temp);
                }
            }
            function pushResultArr(temp){
                for(var j= 0,len=temp.length;j<len;j++){
                    resultArr.push(temp[j]);
                }
            }

            return resultArr;
        },
        //多组层次选择器
        // param：
        // @str---'.fu li .span1,.play,#box .pp'
        $layerGroup: function(str){
            //1.分解字符串----转换成数组
            var resultArr = [];
            var arr = $$.trim(str).split(',');
            for(var i=0;i<arr.length;i++){
                var item = $$.trim(arr[i]);
                var list = $$.$layer(item);
                pushResultArr(list);
            }

            return resultArr;

            function pushResultArr(temp){
                for(var j= 0,len=temp.length;j<len;j++){
                    resultArr.push(temp[j]);
                }
            }
        },
        //使用h5的querySelectorAll改进的选择器
        // param：
        // @str---'.fu li .span1,.play,#box .pp'
        $all: function(str,context){
            context = context || document;
            this.elements =  context.querySelectorAll(str);
            return this;
        }
    });

    /*CSS属性样式模块*/
    $$.extend($$,{
        // 设置获取样式
        // param：
        // @context 上下文字符串 || dom元素
        // @key 键
        // @value 值
        css: function(key,value){
            //var doms = $$.isString(context) ? $$.$all(context) : context;
            var doms = this.elements;
            if(value){
                //设置样式
                setStyle();
                return this;
            }else{
                //获取样式
                return getStyle();
            }
            //获取样式
            function getStyle(){
                // 判断是集合还是单个dom元素
                var domCurrent = doms.length ? doms[0] : doms;
                if(domCurrent.currentStyle){
                    //IE
                    return domCurrent.currentStyle[key];
                }else{
                    //标准组织
                    return window.getComputedStyle(domCurrent,null)[key];
                }
            }
            //设置样式
            function setStyle(){
                for(var i=0;i<doms.length;i++){
                    doms[i].style[key] = value;
                }
            }
        },
        // 设置获取属性
        // @key 键
        // @value 值
        attr: function(key,value){
            var doms = this.elements;
            if(value){
                //设置属性
                for(var i=0;i<doms.length;i++){
                    doms[i].setAttribute(key,value);
                }
                return this;
            }else{
                //获取属性
                return doms[0].getAttribute(key);
            }
        },
        // 显示
        show: function(){
            $$.css("display","block");
            return this;
        },
        // 隐藏
        hide: function(){
            $$.css("display","none");
            return this;
        },
        // 删除属性
        // @key 属性名称，可传递多个
        removeAttr: function(key){
            var doms = this.elements;
            //获取实参arguments,并将伪数组转换成真数组
            var names = Array.prototype.slice.call(arguments);
            //遍历doms,让每一个元素oneElementRemoveAttr
            for(var i=0;i<doms.length;i++){
                oneElementRemoveAttr(doms[i]);
            }
            return this;

            //一个元素删除自己的多个属性
            function oneElementRemoveAttr(dom){
                for(var j=0;j<names.length;j++){
                    dom.removeAttribute(names[j]);
                }
            }
        },
        // 添加类
        // param：
        // @value 类名称，可传递多个用" "隔开
        addClass: function(value){
            var doms = this.elements;
            for(var i=0;i<doms.length;i++){
                oneClassName(doms[i]);
            }
            return this;
            //给一个元素添加类
            function oneClassName(dom){
                dom.className += " "+value;
            }
        },
        // 删除类
        // param：--------------------------------------------------------------------------------
        // @context 上下文字符串
        // @value 类名称，可传递多个用" "隔开
        removeClass: function(value){
            //1.获得元素
            var doms = this.elements;
            //2.遍历删除每一个
            for(var i=0;i<doms.length;i++){
                removeOneElement(doms[i]);
            }
            return this;
            function removeOneElement(dom){
                //方法2：数组
//            var classArr = dom.className.split(" ");
//            console.log(classArr);
                //方法1
                dom.className = dom.className.replace(value,"");
            }
        },
    });

    /*内容模块*/
    $$.extend($$,{
        // 设置获取HTML内容
        // param：
        // @context 上下文字符串
        // @str html内容
        html: function(str){
            //1.获得所有元素
            var doms = this.elements;
            if(str){
                //设置模式
                setHtml();
                return this;
            }else{
                //获取模式
                return doms[0].innerHTML;
            }
            //2.遍历每一个设置html
            function setHtml(){
                for(var i=0;i<doms.length;i++){
                    doms[i].innerHTML = str;
                }
            }

        },
    });

    /*动画模块*/
    var Animate = function(){
        /*将变量提炼成属性*/
        /*循环句柄*/
        this.timer;
        /*我们可以定义一个属性来保存这个框架需要的一切变量*/
        //this.obj = {};    //json
        this.queue = [];  //定义一个数组来保存多个物体
    }
    Animate.prototype = {
        /*---------------添加部start---------------*/
        /*动画本质：开个定时器不停循环，不停改变dom对象属性值*/
        // 给dom对象添加动画
        add: function(dom,json,duration,ease){
            // 1.准备材料
            this.adapterMore(dom,json,duration,ease);
            // 2.开始运作
            this.run();
        },
        // 多个对象处理数据(适配器)
        adapterMore: function(dom,json,duration,ease){
            var obj = this.adapter(dom,json,duration,ease);
            this.queue.push(obj);
        },
        // 单个对象处理数据(适配器)
        adapter: function(dom,json,duration,ease){
            var obj = {};
            obj.dom = dom;     //dom对象
            obj.startTime = +new Date();    //开始时间
            obj.tween = 0;     //时间进程
            obj.endTime = duration;   //结束时间
            obj.styles = this.getStyles(dom,json);   //样式数组
            obj.ease = ease || 'linear';
            return obj;
        },
        // 将传递进来的json转成数组
        getStyles: function(demo,json){
            var styles = [];
            // {'width': 300,"height": 400,"left": 300}
            for(var k in json){
                var style = {};  // {key:'width',endSite:'300'，startSite:0}
                style.key = k;
                style.startSite = parseFloat($$.css(demo,style.key));   //起始位置
                style.endSite = parseFloat(json[k]) - style.startSite;  //运动距离
                styles.push(style);
            }
            return styles;
        },
        /*---------------添加部end---------------*/

        /*---------------运行部start---------------*/
        // 动画开始运行
        run: function(){
            //move.bind(this)
            // 防止setInterval改变this指向的解决方法：
            this.timer = setInterval(this.loop.bind(this),16);     //(1)
//            var that = this;                                     //(2)
//            this.timer = setInterval(function(){that.move();},16);
        },
        // 多个对象运动方法
        loop: function(){
            for(var i=0;i<this.queue.length;i++){
                var node = this.queue[i];
                this.move(node);
            }
        },
        // 单个对象运动方法
        move: function(obj){
            // 获取时间进程
            obj.tween = this.getTimeTween(obj.startTime,obj.endTime,obj.ease);
            if(obj.tween >= 1){
                obj.tween = 1;
                this.stopMove();
            }else{
                this.setMoreProperty(obj.dom,obj.styles,obj.tween);
            }
        },
        // 获得时间进程
        // ease:哪一种变速运动？
        getTimeTween: function(startTime,endTime,ease){
            var eases = {
                //线性匀速
                linear:function (t, b, c, d){
                    return (c - b) * (t/ d);
                },
                //弹性运动
                easeOutBounce:function (t, b, c, d) {
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                    }
                },
                //其他
                swing: function (t, b, c, d) {
                    return this.easeOutQuad(t, b, c, d);
                },
                easeInQuad: function (t, b, c, d) {
                    return c*(t/=d)*t + b;
                },
                easeOutQuad: function (t, b, c, d) {
                    return -c *(t/=d)*(t-2) + b;
                },
                easeInOutQuad: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                },
                easeInCubic: function (t, b, c, d) {
                    return c*(t/=d)*t*t + b;
                },
                easeOutCubic: function (t, b, c, d) {
                    return c*((t=t/d-1)*t*t + 1) + b;
                },
                easeInOutCubic: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                },
                easeInQuart: function (t, b, c, d) {
                    return c*(t/=d)*t*t*t + b;
                },
                easeOutQuart: function (t, b, c, d) {
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeInOutQuart: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                },
                easeInQuint: function (t, b, c, d) {
                    return c*(t/=d)*t*t*t*t + b;
                },
                easeOutQuint: function (t, b, c, d) {
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },
                easeInOutQuint: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                },
                easeInSine: function (t, b, c, d) {
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },
                easeOutSine: function (t, b, c, d) {
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },
                easeInOutSine: function (t, b, c, d) {
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                },
                easeInExpo: function (t, b, c, d) {
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },
                easeOutExpo: function (t, b, c, d) {
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },
                easeInOutExpo: function (t, b, c, d) {
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },
                easeInCirc: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },
                easeOutCirc: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },
                easeInOutCirc: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                },
                easeInElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                easeOutElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                },
                easeInOutElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                },
                easeInBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                easeOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                easeInOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                },
                easeInBounce: function (t, b, c, d) {
                    return c - this.easeOutBounce (d-t, 0, c, d) + b;
                },
                easeInOutBounce: function (t, b, c, d) {
                    if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
                    return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
                }
            };   //贝塞尔曲线
            var currentTime = +new Date();  //当前时间  (单位：ms)
            var useTime = currentTime - startTime;
            //            var tween = (useTime/1000) / endTime;
            //            console.log("useTime:"+useTime);
            //ms           //ms
            return eases[ease](useTime,0,1,endTime*1000);
        },
        // 停止动画
        stopMove: function(){
            clearInterval(this.timer);
        },
        //设置一个样式
        setOneProperty: function(demo,key,startSite,endSite,tween){
            /*demo.style.left = 起始位置 + 总路程 * 时间进程*/
            // opacity don't need px
            key == "opacity" ? $$.css(demo,key,startSite + endSite * tween) : $$.css(demo,key,startSite + endSite * tween + 'px');
        },
        // 设置多个样式
        setMoreProperty: function(demo,styles,tween){
            for(var j = 0;j<styles.length;j++){
                var item = styles[j];
                this.setOneProperty(demo,item.key,item.startSite,item.endSite,tween);
            }
        },
        /*---------------运行部end-----------------*/

        /*---------------后勤部start---------------*/
        destroy: function(){
            /*垃圾销毁，释放内存*/
        },
        /*---------------后勤部end-----------------*/
    }
    $$.animate = function(dom,json,duration,ease){
        var animate = new Animate();
        animate.add(dom,json,duration,ease);
    }

    /*事件模块*/
    $$.extend($$,{
        //绑定事件
        // param：
        // @cname类名
        // @mydiv某个dom元素或者元素ID
        on: function(id,type,fn){
            //考虑的是代码优化
            var ele = $$.isString(id) ? $$.$id(id) : id;;
            if(ele.addEventListener){
                // 符合标准组织
                ele.addEventListener(type,fn,false);
            }else{
                //兼容IE
                ele.attachEvent('on'+type,fn);
            }
        },
        //解绑事件
        un: function(id,type,fn){
            //考虑的是代码优化
            var ele = $$.isString(id) ? $$.$id(id) : id;;
            if(ele.removeEventListener){
                // 符合标准组织
                ele.removeEventListener(type,fn);
            }else{
                //兼容IE
                ele.detachEvent('on'+type,fn);
            }
        },
        //点击事件
        click: function(id,fn){
            this.on(id,'click',fn);
        },
        //鼠标经过
        mouseover: function(id,fn){
            this.on(id,'mouseover',fn);
        },
        //鼠标离开
        mouseout: function(id,fn){
            this.on(id,'mouseout',fn);
        },
        //鼠标经过+鼠标离开
        hover: function(id,fnOver,fnOut){
            if(fnOver){
                this.on(id,'mouseover',fnOver);
            }
            if(fnOut){
                this.on(id,'mouseout',fnOut);
            }
        },
        //获得事件对象
        getEvent: function(e){
            return e ? e : window.event;
        },
        //获得事件目标
        getTarget: function(e){
            var event = this.getEvent(e);
            return event.target || event.srcElement;
        },
        //阻止浏览器默认行为
        preventDefault: function(e){
            var e = $$.getEvent(e);
            return e.preventDefault ? e.preventDefault() : e.returnValue = false;
        },
        //阻止冒泡
        stopPropagation: function(e){
            var e = $$.getEvent(e);
            return e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        }
    });

    /*数据绑定模块*/
    $$.extend($$,{
        //数据绑定(@name)
        formateString: function(str,data){
            /*注：正则中不识别（、）所以要转义\(、\)l*/
            return str.replace(/@\((\w+)\)/g,function(match,key){
                return data[key];
            });
        },
        // 使用script模板进行数据绑定:模板ID，数据,divId
        getTemplateHtml: function(id,data){
            return template(id,data);
        },
        // 使用字符串模板进行数据绑定（artTemplate）: 字符串模板，数据,divId
        bindArttemplate: function(str,data){
            /*把带坑的str用template.compile(str)编译一下，返回一个render函数*/
            var render = template.compile(str);
            /*使用render函数把真实数据转换成合体数据*/
            var html = render(data);
            return html;
        },
    });

    /*AJAX模块*/
    $$.extend($$,{
        //ajax - 前面我们学习的
        myAjax:function(URL,fn){
            var xhr = createXHR();	//返回了一个对象，这个对象IE6兼容。
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4){
                    if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
                        fn(xhr.responseText);
                    }else{
                        alert("错误的文件！");
                    }
                }
            };
            xhr.open("get",URL,true);
            xhr.send();

            //闭包形式，因为这个函数只服务于ajax函数，所以放在里面
            function createXHR() {
                if (typeof XMLHttpRequest != "undefined") {
                    return new XMLHttpRequest();
                    //判断是否支持ActiveX控件
                } else if (typeof ActiveXObject != "undefined") {
                    if (typeof arguments.callee.activeXString != "string") {
                        var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                                "MSXML2.XMLHttp"
                            ],
                            i, len;

                        for (i = 0, len = versions.length; i < len; i++) {
                            try {
                                new ActiveXObject(versions[i]);
                                arguments.callee.activeXString = versions[i];
                                break;
                            } catch (ex) {
                                //skip
                            }
                        }
                    }

                    return new ActiveXObject(arguments.callee.activeXString);
                } else {
                    throw new Error("No XHR object available.");
                }
            }
        },
    });

    /*利用双对象法则，对象+函数，将自己的框架封装成和jQuery一样*/
    function $(context){
        return $$.$all(context);
    }
    w.$ = $;
})(window);