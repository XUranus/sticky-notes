'use strict'

const createDOM = (DOMType, attrs) => {
  const DOM = document.createElement(DOMType)
  DOM.async = false
  for(let attrName in attrs) {
    DOM.setAttribute(attrName, attrs[attrName])
  }
  return DOM
}

const initDOM = ()=>{
  // get server host
  const stickyNoteDOM = document.querySelector('#stickyNotes')
  const stickyNoteJSDOM = stickyNoteDOM.children[0]

  let serverURI = stickyNoteJSDOM.getAttribute('src')
  let scheme = 'http'
  if(serverURI.startsWith('https://') || window.location.href.startsWith("https://")) {
    scheme = 'https'
  }
  serverURI = serverURI.replace('https://','').replace('http://','').replace('/assets/sticky-notes.bundle.js','')
  if(serverURI=='assets/sticky-notes.bundle.js') {
    serverURI = window.location.href.replace('https://','').replace('http://','').replace('/','')
  }
  /**
   * <div id="stickyNotes">
   *    <script crossorigin src="$server_api/assets/sticky-bundle.js"></script>
   *    <div id="stickyNotesApp" api="$server_api"></div>
   *    <link rel="stylesheet" type="text/css" href="http://localhost:9000/assets/sticky-note.css">
   *    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
   *    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
   *    <script crossorigin src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
   *    <script crossorigin src="$server_api/assets/sticky-notes.js" type="text/babel"></script>
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
  stickyNoteDOM.appendChild(scriptDOM4)
  stickyNoteDOM.appendChild(scriptDOM3)

  console.log('sticky-notes basic DOM initialized')
  
}

//https://stackoverflow.com/questions/53637496/dynamically-appended-jsx-isnt-transpiled-by-babel-standalone-when-babel-is-appe
document.onreadystatechange = ()=> {
  //console.log(document.readyState, document.querySelectorAll('head script').length, document.querySelectorAll('head script'))

  if (document.readyState === 'complete') {
      // if (document.querySelectorAll('head script').length === 0) {
      //     window.dispatchEvent(new Event('DOMContentLoaded'));
      // }
      window.dispatchEvent(new Event('DOMContentLoaded'))
  }
}

initDOM()