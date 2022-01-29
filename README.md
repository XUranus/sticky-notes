# Sticky Notes

> sticky notes widget for static blog like Hexo：[Demo](https://xuranus.github.io/sticky)

 - Express + React + MongoDB
 - deploy on free [Tencent Express Serverless Service](https://serverless.cloud.tencent.com/) and free [MongoDB Cloud Server](https://account.mongodb.com/)
 - CSS：[Sticky Notes](https://codepen.io/danswater/pen/rHtiq)

## Usage
1. modify `.env`
```
STICKY_NOTES_SERVER_PORT= # Server Port
STICKY_NOTES_MONGO_URI= # MongoDB connection uri
```
3. `node app.js`
4. paste code below and change `src` in `<script id="stickyNoteJS/>` to your server uri
```html
<div id="stickyNotes"></div>
<script crossorigin id="stickyNotesJS" src="http://${HOST}/assets/sticky-notes.bundle.js"></script>
```