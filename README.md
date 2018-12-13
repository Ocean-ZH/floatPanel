# floatPanel简介
floatPanel.js是一个javascript网页浮动框生成工具

# 安装
[floatPanel.zip](https://github.com/Ocean-ZH/floatPanel/releases/download/1.0.0/floatPanel.zip)
- 引入css
```javascript
<link href="css/floatPanel.css" rel="stylesheet" type="text/css"/>
```

- 引入js
```javascript
<script src="js/floatPanel.js" ></script>
```

# Demo

[点击查看Demo](https://ocean-zh.github.io/floatPanel/index.html)

# 使用
## 初始化
```javascript
//创建浮动框,参数为自定义的浮动框的id值,返回构建的浮动框对象,默认初始化在当前视区中心
var panel = FloatPanel('panel');

//根据需要,创建浮动框时可以传入配置项
var panel = FloatPanel('panel', {
    closeBtn: true,
    floatHeight: 10,
});
```

## 简易使用
```javascript
//浮动框定位，传入坐标对象，省略则定位于屏幕中心
panel.reposition({
    pageX: 50,
    pageY: 50,
});

//若是由鼠标事件触发，可以直接传入事件通知对象(event)
EventTarget.addEventListener('click',function(event){
    panel.reposition(event);
});

//浮动框显示
panel.show();
```

## 特性
>floatPanel对象的部分属性值与DOM是**双向绑定**的,修改该属性的值将使DOM即时更新,DOM的改变同样会影响属性值
```javascript
panel.width = 500;
```

>floatPanel对象的方法支持链式调用
```javascript
panel.set({height:300}).reposition();
```

# 属性
属性                | 类型              | 默认值        | 描述
:-                  |:-                 |:-             |:-
id                  | `String`          |               |浮动面板的id, 只能在初始化时传入, 属性不可更改
node                | `Object`          |               |面板的元素节点, 初始化时根据`id`生成, 属性不可更改
width               | `Number|String`   | 300           |面板的宽度值, 与DOM双向绑定
height              | `Number|String`   | 'auto'        |面板的高度值, 与DOM双向绑定
left                | `Number|String`   |               |面板的css`left`值，与DOM双向绑定
top                 | `Number|String`   |               |面板的css`left`值，与DOM双向绑定
zIndex              | `Number|String`   | 999           |面板的css`z-index`值，与DOM双向绑定;<br />若是面板启用了`backDrop`，给此对象属性赋值时也会设置`backDrop`的`z-index`为`传入值 - 1`
direction           | `String`          | 'up'          |面板弹出的方向,可选`'up'`或者`'down'`
edgeDetection       | `Boolean`         | true          |面板定位时, 是否进行屏幕边缘的检测
floatHeight         | `Number`          | 10            |面板定位时，相对定位坐标的垂直距离
floatHeightInvolve  | `Boolean`         | false         |面板调用`hide(event)`方法时, 是否将`floatHeight`视作浮动框内部高度纳入计算; **_谨慎使用_**
_backDropNode       | `Object`          | null          |面板背景的元素节点, 通过`set({backDrop:true})`来控制是否启用，非枚举属性


# 配置项

配置项可以在创建浮动框时传入
`var panel = FloatPanel('panel', { yourConfig });`

也可以调用面板对象的`set()`方法来设置
`panel.set({ yourConfig });`

```javascript
//默认配置
var defaultConfig = {
    width : 300,                    //面板宽度
    height : 'auto',                //面板高度
    header: {                       //面板头部
        enabled: true,              //是否启用
        content: 'Panel title',     //设置内容
    },
    footer: {                       //面板底部
        enabled: true,              //是否启用
        content: 'Panel footer',    //设置内容
    },
    body: {                         //面板中部
        enabled: true,              //是否启用
        content: 'Panel content',   //设置内容
    },
    closeBtn: true,                 //面板关闭按钮是否启用
    backDrop: false,                //面板背景是否启用
    direction: 'up',                //面板弹出的方向,可选'up'或者'down'
    edgeDetection: true,            //面板定位时, 是否进行屏幕边缘的检测
    floatHeight: 10,                //面板定位时，相对定位坐标的垂直距离
    floatHeightInvolve: false,      //浮动高度 floatHeight 是否参与进 hide(event) 时的计算
};
```
# 方法

## show([event, callback])
调用此方法显示面板

参数
- `event` : (`Object`)
    + > 可选参数
    + 一个包含了坐标的**对象**，内部必须含有属性`pageX`和`pageY`, 属性值为`Number`
    + 传入此对象，面板在显示之前会先调用`reposition(event)`进行定位，并将此参数传入
    + 省略则直接显示面板
    + 例: `{ pageX: 10, pageY: 10, }`
- `callback` : (`Function`)
    + > 可选参数
    + 回调函数, 在面板定位后(若有), 显示前调用

## hide([event])
调用此方法隐藏面板

参数
- `event` : (`Object`)
    + > 可选参数
    + 一个包含了坐标的对象，内部必须含有属性`pageX`和`pageY`, 属性值为`Number`
    + 传入此对象，面板在隐藏之前会先判断坐标是否位于浮动面板内部，若位于内部则不隐藏
    + 若设置了面板`floatHeightInvolve`属性为`true`, 则`floatHeight`的值也被视作浮动框内部高度进行计算
    + 省略则直接隐藏面板

## set([config])
调用此方法对面板进行设置

参数
- `config` : (`Object`)
    + > 可选参数
    + 默认配置项请见 [配置项](#配置项)
    + 一个包含了配置项的对象，可配置的选项如下
    + `width` : (`Number | String`), 设置面板的宽度
    + `height` : (`Number | String`), 设置面板的高度
    + `header` : (`Object`), 设置面板的头部
        * `enabled` : (`Boolean`), 是否启用
        * `content` : (`String`), 设置内容
    + `footer` : (`Object`), 设置面板的头部
        * `enabled` : (`Boolean`), 是否启用
        * `content` : (`String`), 设置内容
    + `body` : (`Object`), 设置面板的头部
        * `enabled` : (`Boolean`), 是否启用
        * `content` : (`String`), 设置内容
    + `closeBtn` : (`Boolean`), 设置面板的关闭按钮是否启用
    + `backDrop` : (`Boolean`), 设置面板的背景是否启用
    + `direction` : (`String`), 面板弹出的方向,可选'up'或者'down'
    + `edgeDetection` : (`Boolean`), 面板定位时, 是否进行屏幕边缘的检测
    + `floatHeight` : (`Number`), 设置面板定位时上浮的高度
    + `floatHeightInvolve` : (`Boolean`), 设置浮动高度`floatHeight`是否参与进`hide(event)`时的计算; **_谨慎使用_**

## reposition([event])
调用此方法使面板重新定位

参数
- `event` : (`Object`)
    + > 可选参数
    + 一个包含了坐标的对象，内部必须含有属性`pageX`和`pageY`, 属性值为`Number`
    + 省略则定位在当前屏幕中心

## destroy()
调用此方法将删除并销毁面板对象

## mouseenter(func)
此方法接收一个函数，并将函数绑定在面板的鼠标移入事件中

## mouseleave(func)
此方法接收一个函数，并将函数绑定在面板的鼠标移出事件中

# 兼容性
兼容至IE9+
