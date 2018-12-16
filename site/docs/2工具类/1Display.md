# Display

快速修改元素的 `display` 样式。

## 类名组合

类名称采用这样的格式：`d-{值}`。

其中 `{值}` 包括：

* `none`
* `inline`
* `inline-block`
* `block`
* `flex`
* `inline-flex`

## 示例

<div class="demo">
    <div class="d-inline p-5 bg-red color-white">d-inline</div>
    <div class="d-inline p-5 bg-blue color-white">d-inline</div>
</div>

```html
<div class="d-inline">d-inline</div>
<div class="d-inline">d-inline</div>
```

<div class="demo">
    <span class="d-block p-5 bg-red color-white">d-block</span>
    <span class="d-block p-5 bg-blue color-white">d-block</span>
</div>

```html
<span class="d-block">d-block</span>
<span class="d-block">d-block</span>
```

<div class="demo">
    <div class="d-none">这个元素被隐藏了</div>
</div>

```html
<div class="d-none">这个元素被隐藏了</div>
```