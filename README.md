# floatPanel简介
floatPanel.js是一个javascript网页浮动框生成工具
兼容IE9 +

# 安装
[floatPanel.zip]()
- 引入css
```javascript
<link href="css/floatPanel.css" rel="stylesheet" type="text/css"/>
```
- 引入js
```javascript
<script src="js/floatPanel.js" ></script>
```

# 使用
## 初始化
```javascript
//创建浮动框,参数为浮动框的id值,返回该浮动框对象,默认初始化在屏幕中心
var panel = FloatPanel('panel');

//根据需要,创建浮动框时可以传入配置项
var panel = FloatPanel('panel', {
    closeBtn: true,//关闭按钮
    floatHeight: 10,
});
```

## 简易使用
```javascript
//浮动框定位，传入坐标，不传入坐标则定位于屏幕中心
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
- `id`
    + 浮动面板的id
    + 只能在初始化时传入, 属性不可更改;
- `node`
    + 面板的元素节点
    + 初始化时根据`id`生成，属性不可更改;
- `width`
    + 面板的宽度值，与DOM双向绑定
    + 接受值`Number`, `String`
- `height`
    + 面板的高度值，与DOM双向绑定
    + 接受值`Number`, `String`
- `left`
    + 面板的css`left`值，与DOM双向绑定
    + 接受值`Number`, `String`
- `top`
    + 面板的css`top`值，与DOM双向绑定
    + 接受值`Number`, `String`
- `zIndex`
    + 面板的css`z-index`值，与DOM双向绑定
    + 接受值`Number`, `String`
- `floatHeight`
    + 面板定位时，相对定位坐标浮起的高度
    + 接受值`Number`
    + 默认值 `0`
- `floatHeightInvolve`
    + 面板调用`hide()`方法时, 是否将`floatHeight`也纳入计算
    + 接受值`Boolean`
    + 默认值 `false`
# 配置项
# 方法
## hide(event);

