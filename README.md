# floatPanel简介
floatPanel.js是一个javascript网页浮动框生成工具
# 安装
[floatPanel.zip]()
# 使用
```html
- 引入css
    <link href="css/floatPanel.css" rel="stylesheet" type="text/css" />
- 引入js
    <script src="js/floatPanel.js" type="text/javascript"></script>
- 初始化
    <script>
        //创建浮动框,参数为浮动框的id值,返回该浮动框对象
        var panel = FloatPanel('panel');

        //浮动框显示，默认显示在屏幕中心
        panel.show();
    </script>
- 特性
    <script>
        //floatPanel对象的部分属性值与DOM是双向绑定的,修改该属性的值将使DOM即时更新
        panel.width = 500;

        //floatPanel对象的方法支持链式调用
        panel.set({height:300}).reposition();
    </script>
```
# 属性

# 配置项
# 方法
## hide(event);
隐藏面板的函数

event为触发的事件对象
或为包含
event.pageX, event.pageY
属性的自定义对象

传入event,则判断事件坐标是否在面板之内，在面板之内则不隐藏
若无event传入,则直接隐藏
