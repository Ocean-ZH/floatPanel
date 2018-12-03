'use strict'

    //----------**********----------**********

    ; (function (window, document) {
        var panelData = {};
        function floatPanel(id, config) {
            panelData[id] = new Create_floatPanel(id);
            panelData[id].reposition();
            return panelData[id];
        }

        function Create_floatPanel(id) {
            // console.log(arguments);
            var body = document.body;

            // this.id = typeof id === 'string' ? id : 'floatPanel';
            Object.defineProperty(this, 'id', {
                configurable: true,
                enumerable: true,
                value: typeof id === 'string' ? id : 'floatPanel',
                writable: false,
            })
            //黑色背景
            this.backDropNode = null;
            //据事件坐标浮起的高度距离
            this.floatHeight = 0;

            var node = document.getElementById(this.id);
            if (node) {
                node.parentNode.removeChild(node);
            }

            var div = document.createElement('div');
            div.setAttribute('class', 'floatPanel invisible');
            div.id = this.id;
            body.appendChild(div);

            this.node = document.getElementById(id);
            /* Object.defineProperty(this, 'node', {
                configurable: true,
                enumerable: true,
                get: function () {
                    return document.getElementById(this.id);
                },
                set: function (value) {
                    return undefined;
                }
            }) */

            var panelStr = '<div class="panel panel-blue">' +
                    '<div class="panel-header">' +
                        '<h3 class="panel-title">Panel title</h3>' +
                    '</div>' +
                    '<div class="panel-body">' +
                        'Panel content' +
                    '</div>' +
                    '<div class="panel-footer">' +
                        'Panel footer' +
                    '</div>' +
                '</div>'+
                '<div class="floatPanel-space"></div>';
            //'<div class="floatPanel-space"></div>';
            this.node.innerHTML = panelStr;

            //定义对象的属性
            Object.defineProperties(this, {
                width: {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        return _getCss(this.node, 'width');
                        // return $(this.node).width();
                    },
                    set: function (value) {
                        this.node.querySelector('.panel').style.width = value + 'px';
                        return value;
                    },
                },
                height: {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        return _getCss(this.node, 'height');
                    },
                    set: function (value) {
                        this.node.querySelector('.panel').style.height = value + 'px';
                        return value;
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
                        this.node.style.left = value + 'px';
                        return value;
                    },
                },
                top: {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        return Number(_getCss(this.node, 'top').replace('px', ''));
                    },
                    set: function (value) {
                        this.node.style.top = value + 'px';
                        return value;
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
                        return value;
                    },
                },
                //.floatPanel-space高度
                spaceHeight: {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        var fs = this.node.querySelector('#' + this.id + '>.floatPanel-space');
                        return Number(_getCss(fs, 'height'));
                    },
                    set: function (value) {
                        var fs = this.node.querySelector('#' + this.id + '>.floatPanel-space');
                        fs.style['height'] = value + 'px';
                        return value;
                    },
                },
            });
        }

        Create_floatPanel.prototype = {
            constrctor: this,
            //显示与设置框架
            show: function (event,callback) {
                var arg = arguments;
                // console.log(arg);

                for (var i = 0; i < arg.length; i++) {
                    if (typeof arg[i] == 'object'){
                        if(arg[i].pageX && arg[i].pageY){
                            //框架大小和位置调整
                            this.reposition(arg[i]);
                        }
                    }
                    if (typeof arg[i] == 'function') {
                        arg[i].call(this);
                    }
                }

                // typeof callback == 'function' ? callback.call(this) : null;

                this.node.classList.add('active');
                this.node.style.display = 'block';
                this.node.classList.remove('invisible');

                return this;
            },

            //隐藏框架
            hide: function (event) {
                if (event && event.pageX && event.pageY) { //如果有事件和坐标，则判断鼠标是否移入框体内部
                    // console.log(event);

                    //获取框三维
                    var panelW = this.width + 10;
                    //补上定位时加的1像素
                    var panelH = this.height + 1;
                    var pageX = Number(event.pageX);
                    var pageY = Number(event.pageY);

                    console.log('pageY='+pageY)
                    console.log('top=' + this.top + ' panelH=' + panelH + ' total=' + (this.top + panelH))

                    if (pageX >= this.left && pageX <= this.left + panelW && pageY >= this.top && pageY <= this.top + panelH) {
                        //在框体内部,不消失
                        return 0;
                    } else {
                        this.backDropNode ? this.backDropNode.style.display = 'none' : null;
                        this.node.classList.add('invisible');
                        this.node.classList.remove('active');
                        this.node.style.removeProperty('max-height');
                        this.node.style.removeProperty('max-width');
                        this.node.style.display = 'none';
                    }
                } else {
                    this.backDropNode ? this.backDropNode.style.display = 'none' : null;
                    this.node.classList.add('invisible');
                    this.node.classList.remove('active');
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
                        this.node.querySelector('#'+this.id+' > .panel').style.width = config.width + 'px';
                        /* $(this.node).find('.panel').css({
                            width: config.width,
                        }); */
                    }
                    if (config.height) {
                        this.node.querySelector('#' + this.id + ' > .panel').style.width = config.width + 'px';
                    }
                    //header
                    if (config.header) {
                        if (config.header.enabled === true) {
                            this.node.querySelector('.panel-header').style.display = 'block';
                        } else if (config.header.enabled === false) {
                            this.node.querySelector('.panel-header').style.display = 'none';
                        }
                        if (config.header.content) {
                            this.node.querySelector('.panel-header').innerHTML = config.header.content;
                        }
                    }
                    //footer
                    if (config.footer) {
                        if (config.footer.enabled === true) {
                            this.node.querySelector('.panel-footer').style.display = 'block';
                        } else if (config.footer.enabled === false) {
                            this.node.querySelector('.panel-footer').style.display = 'none';
                        }
                        if (config.footer.content) {
                            this.node.querySelector('.panel-footer').innerHTML = config.footer.content;
                        }
                    }
                    //body
                    if (config.body) {
                        if (config.body.enabled === true) {
                            this.node.querySelector('.panel-body').style.display = 'block';
                        } else if (config.body.enabled === false) {
                            this.node.querySelector('.panel-body').style.display = 'none';
                        }
                        if (config.body.content) {
                            this.node.querySelector('.panel-body').innerHTML = config.body.content;
                        }
                    }
                    //closeBtn
                    if (config.closeBtn === true) {
                        var closeBtn = this.node.querySelector('#' + this.id +' >button.close-btn');
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
                        this.node.querySelector('#' + this.id +' >button.close-button').addEventListener('click', (function (data) {
                            return function (event) {
                                data.hide();
                            };
                        }(this)));
                    } else if (config.closeBtn === false) {
                        var closeBtn = '';
                        closeBtn = this.node.querySelector('#' + this.id + ' >button.close-button');
                        if (closeBtn) {
                            this.node.removeChild(closeBtn);
                        }
                    }
                    //backDrop
                    if (config.backDrop === true) {
                        var backDrop = document.querySelector('#' + this.id + '-backDrop');
                        if (backDrop) {
                            backDrop.parentNode.removeChild(backDrop);
                        }
                        var backDropStr = '<div class="floatPanel-backdrop" id="' + this.id + '-backDrop" style="z-index:' + (this.zIndex - 1) + ';"></div>';
                        // $(this.node).before(backDropStr);
                        this.node.insertAdjacentHTML('beforebegin', backDropStr);
                        this.backDropNode = document.getElementById(this.id + '-backDrop');
                    } else if (config.backDrop === false) {
                        this.backDropNode.parentNode.removeChild(this.backDropNode);
                        this.backDropNode = null;
                    }

                    //浮动高度
                    if (config.floatHeight) {
                        this.floatHeight = isNaN(Number(config.floatHeight)) ? this.floatHeight : Number(config.floatHeight);
                    }
                    //.floatPanel-space高度
                    if (config.spaceHeight) {
                        this.spaceHeight = isNaN(Number(config.spaceHeight)) ? this.spaceHeight : Number(config.spaceHeight);
                    }
                    //callback
                    /* if (config.callback && typeof config.callback === 'function') {

                    } */
                }

                return this;
            },

            //框架大小和位置调整
            reposition: function (event) {
                //获取屏幕文档宽高
                var winW = document.documentElement.clientWidth;
                var winH = document.documentElement.clientHeight;
                //获取ScrollTop
                var ST = document.documentElement.scrollTop;
                var SL = document.documentElement.scrollLeft;
                //console.log(ST + ' , ' + SL);

                //获取框三维
                var panelW = this.width;
                var panelH = this.height + 1 + this.floatHeight;

                // 如果没有event或event内无pageX,pageY,默认显示在屏幕中间
                if (!event || !event.pageX || !event.pageY) {
                    var event = {};
                    event.pageX = winW / 2 + SL;
                    event.pageY = winH / 2 + ST;
                }
                // console.log("coordinate = (" + event.pageX + "," + event.pageY + ")");
                // console.log("scrollLeftTOP = (" + SL + "," + ST + ")");
                //事件定位
                var pageX = Number(event.pageX);
                //实际的left,减去一半框架
                pageX = pageX - panelW / 2;
                var pageY = Number(event.pageY);
                //实际的top,减去整个框架
                pageY = pageY - panelH;

                //屏幕边缘检测
                //框架宽度和X轴定位
                if (panelW > winW) { //框宽>屏幕宽
                    this.node.style.left = (5 + SL) + 'px';
                    this.node.style['max-width'] = (winW - 10) + 'px';
                    this.node.style['overflow-x'] = 'auto';
                } else {//框宽<屏幕宽
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

                return this;
            },

            //删除面板
            destroy: function () {
                if (this.backDropNode) {
                    this.backDropNode.parentNode.removeChild(this.backDropNode);
                }
                this.node.parentNode.removeChild(this.node);

                for (var i in this) {
                    delete this[i];
                }
                return null;
            },

            //鼠标移出面板
            mouseleave: function (func) {
                this.node.addEventListener('mouseleave', function (event) {
                    func(event);
                })

                return this;
            },

            //鼠标移入面板
            mouseenter: function (func) {
                this.node.addEventListener('mouseenter', function (event) {
                    func(event);
                })

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
            if (node.style[type]) {
                result = node.style[type];
                return result;
            } else {
                node.style.setProperty('visibility', 'hidden');
                node.style.setProperty('position', 'absolute');
                node.style.setProperty('display', 'block');
                if (callback) {
                    callback();
                } else {
                    result = window.getComputedStyle(node)[type];
                }
                node.style.removeProperty('display');
                node.style.removeProperty('visibility');
                node.style.removeProperty('position');
                if (result) {
                    return result;
                }
            }
        }
        

        //向window暴露方法
        window.floatPanel = floatPanel;
    })(window, document)
//创建框架
