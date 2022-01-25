# Sticky Notes

> 给静态博客（Hexo）制作的便签：[Demo地址](https://xuranus.github.io/sticky)

 - Express + React + MongoDB
 - 后台：白嫖免费的[腾讯云Express Serverless](https://serverless.cloud.tencent.com/)和[MongoDB Cloud Server](https://account.mongodb.com/)
 - CSS：[Sticky Notes](https://codepen.io/danswater/pen/rHtiq)

## 使用
1. 注册一个[MongoDB Account](https://account.mongodb.com)可以获得免费的500MB Cluster
2. 修改`app.js`中的MongoDB `uri`
3. 创建腾讯云Express Serveless，上传项目，拿到服务地址
4. `hexo new page sticky`创建新页面，在`index.md`中粘贴如下几行，并修改其中的Serverless服务地址即可
```html
<div>  
  <link rel="stylesheet" type="text/css" href="${你的Serverless服务}/assets/sticky-note.css">
  <div id="stickyNote" api="${你的Serverless服务}" class="sticky-note-panel"></div>
  <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
  <script type="text/babel" crossorigin src="${你的Serverless服务}/assets/sticky-note.js"></script>
</div>
```