
;(function (global) {
    'use strict'
    var window = global;
    var document = window.document;
    //储存着生成的对象
    var panelData = {};

    function FloatPanel(id, customConfig) {
        //默认配置
        var defaultConfig = {
            width: 300,
            height: 'auto',
            header: {
                enabled: true,
                content: 'Panel title',
            },
            footer: {
                enabled: true,
                content: 'Panel footer',
            },
            body: {
                enabled: true,
                content: 'Panel content',
            },
            closeBtn: true,
            backDrop: false,
            floatHeight: 10,
            floatHeightInvolve: false,
        };
        
        panelData[id] = new Create_floatPanel(id);
        var config = defaultConfig;
        if (customConfig){
            config = _deepClone(defaultConfig, customConfig);
        }
        // console.log(config)
        panelData[id].set(config);
        panelData[id].reposition();
        return panelData[id];
    }

    function Create_floatPanel(id) {
        // console.log(arguments);
        var body = document.body;

        if (!id ) {
            throw ('id required!');
        } else if (typeof id !== 'string'){
            throw ('invalid id!');
        }
        // this.id = typeof id === 'string' ? id : 'floatPanel';
        Object.defineProperty(this, 'id', {
            configurable: true,
            enumerable: true,
            value: id,
            writable: false,
        });
        //据事件坐标浮起的高度距离
        this.floatHeight = 0;
        //浮动高度是否参与进hide时的计算
        this.floatHeightInvolve = false;
        //弹出的方向
        this.direction = 'up';
        //屏幕边缘检测
        this.edgeDetection = true;
        //黑色背景
        Object.defineProperty(this, '_backDropNode', {
            configurable: true,
            enumerable: false,
            value: null,
            writable: true,
        });

        var node = document.getElementById(id);
        if (node) {
            node.parentNode.removeChild(node);
        }

        var div = document.createElement('div');
        div.setAttribute('class', 'floatPanel invisible');
        div.id = id;
        body.appendChild(div);

        // this.node = document.getElementById(id);
        Object.defineProperty(this, 'node', {
            configurable: true,
            enumerable: true,
            value: document.getElementById(id),
            writable: false,
        })

        var panelStr = '<div class="panel panel-blue">' +
            '<div class="panel-header">' +
            '<h3 class="panel-title">'+
            // 'Panel title' +
            '</h3>' +
            '</div>' +
            '<div class="panel-body">' +
            // 'Panel content' +
            '</div>' +
            '<div class="panel-footer">' +
            // 'Panel footer' +
            '</div>' +
            '</div>';
        //'<div class="floatPanel-space"></div>';
        this.node.innerHTML = panelStr;

        //定义对象的属性
        Object.defineProperties(this, {
            width: {
                configurable: true,
                enumerable: true,
                get: function () {
                    return _getCss(this.node, 'width');
                },
                set: function (value) {
                    if (typeof value === 'number') {
                        this.node.style.width = value + 'px';
                        // this.node.querySelector('#' + this.id + ' > .panel').style.width = value + 'px';
                    } else {
                        this.node.style.width = value;
                        // this.node.querySelector('#' + this.id + ' > .panel').style.width = value;
                    }
                },
            },
            height: {
                configurable: true,
                enumerable: true,
                get: function () {
                    return _getCss(this.node, 'height');
                },
                set: function (value) {
                    if(typeof value === 'number'){
                        this.node.style.height = value + 'px';
                    }else{
                        this.node.style.height = value;
                    }
                },
            },
            left: {
                configurable: true,
                enumerable: true,
                get: function () {
                    // console.log(_getCss(this.node, 'left'));
                    return Number(_getCss(this.node, 'left').replace('px', ''));
                },
                set: function (value) {
                    if (typeof value === 'number') {
                        this.node.style.left = value + 'px';
                    } else {
                        this.node.style.left = value;
                    }
                },
            },
            top: {
                configurable: true,
                enumerable: true,
                get: function () {
                    return Number(_getCss(this.node, 'top').replace('px', ''));
                },
                set: function (value) {
                    if (typeof value === 'number') {
                        this.node.style.top = value + 'px';
                    } else {
                        this.node.style.top = value;
                    }
                },
            },
            zIndex: {
                configurable: true,
                enumerable: true,
                get: function () {
                    return Number(_getCss(this.node, 'z-index'));
                },
                set: function (value) {
                    this.node.style['z-index'] = value;
                    if (this._backDropNode) {
                        this._backDropNode.style['z-index'] = Number(value) - 1;
                    }
                },
            },
        });
    }

    Create_floatPanel.prototype = {
        constructor: Create_floatPanel,
        //显示与设置框架
        show: function (event, callback) {
            var arg = arguments;
            // console.log(arg);
            var html = document.querySelector('html');

            for (var i = 0; i < arg.length; i++) {
                if (typeof arg[i] == 'object') {
                    if (arg[i].pageX && arg[i].pageY) {
                        //框架大小和位置调整
                        this.reposition(arg[i]);
                    }
                }
                if (typeof arg[i] == 'function') {
                    arg[i].call(this);
                }
            }
            // IE9兼容问题
            // this.node.classList.add('active');
            if (this._backDropNode){
                this._backDropNode.style.display = 'block';
                document.querySelector('html').style.overflow = 'hidden';
            }
            _addClass(this.node, 'active');
            this.node.style.display = 'block';
            // this.node.classList.remove('invisible');
            _removeClass(this.node,'invisible');

            return this;
        },

        //隐藏框架
        hide: function (event) {
            if (event && event.pageX && event.pageY) { //如果有事件和坐标，则判断鼠标是否移入框体内部
                // console.log(event);

                //获取框三维
                var panelW = this.width + 10;
                var panelH = this.height + 1;
                var pageX = Number(event.pageX);
                var pageY = Number(event.pageY);
                var top = this.top;
                if(this.floatHeightInvolve == true){
                    //补上定位时加的1像素
                    var panelH = this.height + 1 + this.floatHeight;
                    //判断弹出方向
                    if (this.direction && this.direction.toLowerCase() === 'down') {
                        top -= this.floatHeight;
                    }
                }
                // console.log('pageY=' + pageY)
                // console.log('top=' + this.top + ' panelH=' + panelH + ' total=' + (this.top + panelH))

                
                if (pageX >= this.left && pageX <= this.left + panelW && pageY >= top && pageY <= top + panelH) {
                    //在框体内部,不消失
                    return 0;
                } else {
                    if (this._backDropNode) {
                        this._backDropNode.style.display = 'none';
                        document.querySelector('html').style.overflow = '';
                    }
                    // this.node.classList.add('invisible');
                    // this.node.classList.remove('active');
                    _addClass(this.node,'invisible');
                    _removeClass(this.node,'active');
                    this.node.style.removeProperty('max-height');
                    this.node.style.removeProperty('max-width');
                    this.node.style.display = 'none';
                }
            } else {
                //this._backDropNode ? this._backDropNode.style.display = 'none' : null;
                if (this._backDropNode) {
                    this._backDropNode.style.display = 'none';
                    document.querySelector('html').style.overflow = '';
                }
                _addClass(this.node, 'invisible');
                _removeClass(this.node, 'active');
                this.node.style.removeProperty('max-height');
                this.node.style.removeProperty('max-width');
                this.node.style.display = 'none';
            }

            return this;
        },

        //设置框架
        set: function (config) {
            if (config) {
                //宽度
                if (config.width) {
                    this.width = config.width;
                    // this.node.querySelector('#' + this.id + ' > .panel').style.width = config.width + 'px';
                    /* $(this.node).find('.panel').css({
                        width: config.width,
                    }); */
                }
                if (config.height) {
                    this.height = config.height;
                }
                //header
                if (config.header) {
                    if (config.header.enabled === true) {
                        this.node.querySelector('#' + this.id + ' > .panel >.panel-header').style.display = 'block';
                    } else if (config.header.enabled === false) {
                        this.node.querySelector('#' + this.id + ' > .panel >.panel-header').style.display = 'none';
                    }
                    if (config.header.content) {
                        this.node.querySelector('#' + this.id + ' > .panel >.panel-header').innerHTML = config.header.content;
                    }
                }
                //footer
                if (config.footer) {
                    if (config.footer.enabled === true) {
                        this.node.querySelector('#' + this.id + ' > .panel >.panel-footer').style.display = 'block';
                    } else if (config.footer.enabled === false) {
                        this.node.querySelector('#' + this.id + ' > .panel >.panel-footer').style.display = 'none';
                    }
                    if (config.footer.content) {
                        this.node.querySelector('#' + this.id + ' > .panel >.panel-footer').innerHTML = config.footer.content;
                    }
                }
                //body
                if (config.body) {
                    if (config.body.enabled === true) {
                        this.node.querySelector('#' + this.id + ' > .panel >.panel-body').style.display = 'block';
                    } else if (config.body.enabled === false) {
                        this.node.querySelector('#' + this.id + ' > .panel >.panel-body').style.display = 'none';
                    }
                    if (config.body.content) {
                        this.node.querySelector('#' + this.id + ' > .panel >.panel-body').innerHTML = config.body.content;
                    }
                }
                //closeBtn
                if (config.closeBtn === true) {
                    var closeBtn = '';
                    closeBtn = this.node.querySelector('#' + this.id + ' >button.close-button');
                    if (closeBtn) {
                        closeBtn.parentNode.removeChild(closeBtn);
                    }
                    var btnStr = '<button aria-label="关闭" type="button" class="Button close-button Button-plain">' +
                        '<svg class="closeIcon" fill="currentColor" viewBox="0 0 24 24" width="24" height="24" >' +
                        '<path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" ' +
                        'fill-rule="evenodd"></path>' +
                        '</svg >' +
                        '</button >';
                    this.node.insertAdjacentHTML('afterbegin', btnStr);

                    /* $(this.node).children('button.close-button').on('click', this, function (event) {
                        // console.log(event.data);
                        event.data.hide();
                    }) */
                    //通过闭包保存this到事件中
                    this.node.querySelector('#' + this.id + ' >button.close-button').addEventListener('click', (function (data) {
                        return function (event) {
                            data.hide();
                        };
                    }(this)));
                } else if (config.closeBtn === false) {
                    var closeBtn = '';
                    closeBtn = this.node.querySelector('#' + this.id + ' >button.close-button');
                    if (closeBtn) {
                        closeBtn.parentNode.removeChild(closeBtn);
                    }
                }
                //backDrop
                if (config.backDrop === true) {
                    var backDrop = document.querySelector('#' + this.id + '-backDrop');
                    if (backDrop) {
                        backDrop.parentNode.removeChild(backDrop);
                    }
                    var backDropStr = '<div class="floatPanel-backdrop" id="' + this.id + '-backDrop" style="z-index:' + (this.zIndex - 1) + '; display:none;"></div>';
                    // $(this.node).before(backDropStr);
                    this.node.insertAdjacentHTML('beforebegin', backDropStr);
                    this._backDropNode = document.getElementById(this.id + '-backDrop');
                } else if (config.backDrop === false) {
                    if (this._backDropNode) {
                        this._backDropNode.parentNode.removeChild(this._backDropNode);
                        this._backDropNode = null;
                    }
                }
                //弹出方向
                if (config.direction) {
                    config.direction.toLowerCase() === 'down'? this.direction='down' : this.direction='up';
                }
                //边缘检测
                if (config.edgeDetection) {
                    config.edgeDetection == false ? this.edgeDetection = false : this.edgeDetection = true;
                }
                //浮动高度
                if (config.floatHeight) {
                    this.floatHeight = isNaN(Number(config.floatHeight)) ? this.floatHeight : Number(config.floatHeight);
                }
                //浮动高度是否参与进hide()时的计算
                if (config.floatHeightInvolve) {
                    this.floatHeightInvolve = !!config.floatHeightInvolve;
                }
                //callback
                /* if (config.callback && typeof config.callback === 'function') {

                } */
            }

            return this;
        },

        //框架位置调整
        reposition: function (event) {
            //获取屏幕文档宽高
            var winW = document.documentElement.clientWidth;
            var winH = document.documentElement.clientHeight;
            //获取ScrollTop
            var ST = _scrollGet().scrollTop;
            var SL = _scrollGet().scrollLeft;

            //获取框三维
            var panelW = this.width;
            var panelH = this.height + 1;

            // 如果没有event或event内无pageX,pageY,默认显示在屏幕中间
            if (!event || !event.pageX || !event.pageY) {
                var event = {};
                event.pageX = (winW / 2) + SL;
                //判断弹出方向
                if (this.direction && this.direction.toLowerCase() === 'down'){
                    event.pageY = (winH / 2) + ST - (panelH / 2) - this.floatHeight;
                }else{
                    event.pageY = (winH / 2) + ST + (panelH / 2) + this.floatHeight;
                }
            }
            // console.log("coordinate = (" + event.pageX + "," + event.pageY + ")");
            // console.log("scrollLeftTOP = (" + SL + "," + ST + ")");
            //事件定位
            var pageX = Number(event.pageX);
            //实际的left,减去一半框架
            pageX = pageX - panelW / 2;
            var pageY = Number(event.pageY);
            //判断弹出方向
            if (this.direction && this.direction.toLowerCase() === 'down'){
                //实际的top, 加上floatHeight
                pageY = pageY + this.floatHeight;
            }else{
                //实际的top,减去整个框架
                pageY = pageY - panelH - this.floatHeight;
            }

            if (this.edgeDetection == false) {
                this.node.style.left = pageX + 'px';
                this.node.style.top = pageY + 'px';
            }else{
                //屏幕边缘检测
                //框架宽度和X轴定位
                if (panelW > winW) { //框宽>屏幕宽
                    this.node.style.left = (5 + SL) + 'px';
                    this.node.style['max-width'] = (winW - 10) + 'px';
                    this.node.style['overflow-x'] = 'auto';
                } else { //框宽<屏幕宽
                    if ((pageX + panelW) < (winW + SL)) { //框宽+事件left<屏幕宽+scrollLeft
                        if (pageX < SL) { //事件left<scrollLeft
                            this.node.style.left = (5 + SL) + 'px';
                        } else { //事件left>scrollLeft
                            this.node.style.left = pageX + 'px';
                        }
                    } else { //框宽+事件left>屏幕宽+scrollLeft
                        this.node.style.left = (pageX - (pageX + panelW - winW - SL)) + 'px';
                    }
                }

                //框架高度和Y轴定位
                if (this.height > winH) { //框高>屏幕底高
                    this.node.style.top = (5 + ST) + 'px';
                    this.node.style['max-height'] = (winH - 10) + 'px';
                    this.node.style['overflow-y'] = 'auto';
                } else { //框高<屏幕底高
                    if (pageY < ST) { //事件top<屏幕顶高
                        this.node.style.top = (5 + ST) + 'px';
                    } else { //事件top>屏幕顶高
                        if (panelH + pageY - ST < winH) { //框高加上事件top<屏幕底高
                            this.node.style.top = pageY + 'px';
                        } else { //框高加上事件top>屏幕底高
                            this.node.style.top = (pageY - (pageY - ST + panelH - winH)) + 'px';
                        }
                    }
                }
            }

            return this;
        },

        //删除面板
        destroy: function () {
            if (this._backDropNode) {
                this._backDropNode.parentNode.removeChild(this._backDropNode);
                delete this._backDropNode;
            }
            this.node.parentNode.removeChild(this.node);

            for (var i in this) {
                delete this[i];
            }
            return null;
        },

        //鼠标移出面板
        mouseleave: function (func) {
            this.node.addEventListener('mouseleave', func);
            return this;
        },

        //鼠标移入面板
        mouseenter: function (func) {
            this.node.addEventListener('mouseenter', func);
            return this;
        },

    }


    //获取隐藏元素css
    function _getCss(node, type) {
        var result = null;
        // var a = 1;
        switch (type) {
            case 'width':
                _getCss_func1(node, type, function () {
                    result = node.offsetWidth;
                    // console.log(a);
                });
                break;
            case 'height':
                _getCss_func1(node, type, function () {
                    result = node.offsetHeight;
                });
                break;
            /* case 'top':
                result = _getCss_func1(node, type);
                break;
            case 'left':
                result = _getCss_func1(node, type);
                break; */
            default:
                result = _getCss_func1(node, type);
                // console.log('type not supported!');
                break;
        }
        return result;
    }
    //getCss内复用代码块
    function _getCss_func1(node, type, callback) {
        // var a = 2;
        var result = null;
        /* if (node.style[type]) {
            result = node.style[type];
            return result;
        } else */
        {
            // IE9兼容问题
            // node.style.setProperty('visibility', 'hidden');
            node.style['visibility']= 'hidden';
            node.style['position']= 'absolute';
            node.style['display']= 'block';
            if (callback) {
                callback();
            } else {
                result = window.getComputedStyle(node)[type];
            }
            node.style['visibility'] = '';
            node.style['position'] = '';
            node.style['display'] = '';
            if (result) {
                return result;
            }
        }
    }
    //查询class
    function _hasClass(element, yourClassName) {
        return !!element.className.match(new RegExp("(\\s|^)" + yourClassName + "(\\s|$)"));
        // ( \\s|^ ) 判断前面为空格或起始 （\\s | $ ）判断后面为空格或结束 两个感叹号为转换为布尔值 以方便判断
    };
    //增加class
    function _addClass(element, yourClassName) {
        if (!_hasClass(element, yourClassName)) {
            element.className += " " + yourClassName;
        };
    };
    //删除class
    function _removeClass(element, yourClassName) {
        if (_hasClass(element, yourClassName)) {
            element.className = element.className.replace(new RegExp("(\\s|^)" + yourClassName + "(\\s|$)"), " ");
        };
    };
    //对象递归深拷贝, 对象属性值限制为基本数据类型或数组
    function _deepClone(target,source){
        if(source != null){
            for(var key in source){
                if (source.hasOwnProperty(key)) {
                    if (Array.isArray(source[key])) {
                        target[key] = [];
                    } else if (source[key] === null) {
                        target[key] = null;
                        continue;
                    }
                    /* if( typeof source[key] === 'object' ){
                        _deepClone(target[key],source[key]);
                    }else{
                        target[key] = source[key];
                    } */
                    target[key] = typeof source[key] === 'object' ? _deepClone(target[key], source[key]) : source[key];
                }
            }
            return target;
        }
    }
    //获取scrollTop和scrollLeft的兼容方案
    function _scrollGet(){
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

        var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
        var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
        return {scrollTop:y,scrollLeft:x,}
    }

    //向window或者加载器暴露方法
    if (typeof module !== "undefined" && module.exports) {
        module.exports = FloatPanel;
    } else {
        window.FloatPanel = FloatPanel;
    }
    
})("undefined" !== typeof window ? window : this)
//创建框架
