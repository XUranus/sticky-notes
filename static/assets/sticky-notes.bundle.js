'use strict'

const createDOM = (DOMType, attrs) => {
  const DOM = document.createElement(DOMType)
  for(let attrName in attrs) {
    DOM.setAttribute(attrName, attrs[attrName])
  }
  return DOM
}

const initDOM = ()=>{
  // get server host
  const stickyNoteDOM = document.querySelector('#stickyNotes')
  const stickyNoteJSDOM = document.querySelector('#stickyNotesJS')

  let serverURI = stickyNoteJSDOM.getAttribute('src')
  let scheme = 'http'
  if(serverURI.startsWith('https://') || window.location.href.startsWith("https://")) {
    scheme = 'https'
  }
  serverURI = serverURI.replace('https://','').replace('http://','').replace('/assets/sticky-notes.bundle.js','')

  /**
   * <div id="stickyNotes">
   *    <div id="stickyNotesApp" api="$server_api"></div>
   *    <link rel="stylesheet" type="text/css" href="http://localhost:9000/assets/sticky-note.css">
   *    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
   *    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
   *    <script crossorigin src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
   *    <script crossorigin src="server/assets/sticky-notes.js" type="text/babel"></script>
   * </div>
   */
  const divDOM = createDOM('div', {
    'id':'stickyNotesApp',
    'api':`${scheme}://${serverURI}`
  })

  const linkDOM = createDOM('link',{
    'rel':'stylesheet',
    'type':'text/css',
    'href':`${scheme}://${serverURI}/assets/sticky-notes.css`
  })

  const scriptDOM1 = createDOM('script',{
    'crossorigin':'',
    'src':'https://unpkg.com/react@17/umd/react.production.min.js'
  })

  const scriptDOM2 = createDOM('script',{
    'crossorigin':'',
    'src':'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js'
  })

  const scriptDOM3 = createDOM('script',{
    'crossorigin':'',
    'src':'https://unpkg.com/babel-standalone@6/babel.min.js'
  })

  const scriptDOM4 = createDOM('script',{
    'type':'text/babel',
    'crossorigin':'',
    'src': `${scheme}://${serverURI}/assets/sticky-notes.js`
  })

  stickyNoteDOM.appendChild(divDOM)
  stickyNoteDOM.appendChild(linkDOM)
  stickyNoteDOM.appendChild(scriptDOM1)
  stickyNoteDOM.appendChild(scriptDOM2)
  stickyNoteDOM.appendChild(scriptDOM3)
  stickyNoteDOM.appendChild(scriptDOM4)
  
}

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
      if (document.querySelectorAll('head script').length === 0) {
          window.dispatchEvent(new Event('DOMContentLoaded'));
      }
  }
}

initDOM()