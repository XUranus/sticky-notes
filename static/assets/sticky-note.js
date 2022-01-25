'use strict'

const MountDOM = document.querySelector('#stickyNote')
const APIServer = MountDOM.getAttribute('api')

const doRequest = (method, url, params)=>{
  return new Promise((resolve, reject)=>{
    let xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = ()=> {
      if(xhr.readyState == 4 && xhr.status == 200) {
        resolve(eval('(' + xhr.responseText + ')'))
      } else if(xhr.status != 200) {
        reject(`error, xhr status = ${xhr.status}, ${xhr.error}`)
      }
    }
    if(method.toLowerCase() == 'post') {
      xhr.send(JSON.stringify(params))
    } else {
      xhr.send()
    }
  })
}


const getAllNotes = async () => await doRequest('GET', `${APIServer}/all`)
const deleteNote = async (id) => await doRequest('GET', `${APIServer}/delete/${id}`)
const updateNote = async (id, content) => await doRequest('POST', `${APIServer}/update`, {id, content})
const newNote = async (content) => doRequest('POST', `${APIServer}/new`, {content})

const MAX_NOTES = 9
const deepCopy = (e) => eval('('+JSON.stringify(e)+')')
const {useState, useEffect, useRef} = React

const Note = (props) => (
  <div className="sticky-note">
    <div className="sticky-tool">
      {props.data.edited?(<span>*</span>):null}
      <button 
        onClick={()=>props.handleDelete(props.data._id)}
        className="sticky-tool-delete"/>
    </div>
    <textarea 
      className="sticky-note-textarea" 
      value={props.data.content} 
      onChange={(e)=>{
        let content = e.target.value
        let id = props.data._id
        props.handleChange(id, content)
      }
    }/>
  </div>
)

const AddButton = (props) => (
  <div
    className="create-button" 
    onClick={props.onClick}
  >+</div>
)

const StickyNotesPanel = (props)=>{
  const [notes, setNotes] = useState([])
  const notesRef = useRef([])

  useEffect(async ()=>{
    sessionStorage.clear()
    await initAllNotes()
    startUpdateListen()
  },[])

  // listen notes change
  useEffect(()=>{notesRef.current = notes}, [notes])

  const removeEditFlag = (id)=>{
    let newNotes = deepCopy(notesRef.current)
    let note = newNotes.find(x => x['_id'] == id)
    if(note) {
      note['edited'] = false
      setNotes(newNotes)
    }
  }

  const startUpdateListen = ()=>{
    setInterval(async ()=>{
      for(let id of Object.keys(sessionStorage)) {
        let content = sessionStorage.getItem(id)
        console.log('update note ',id, content)
        let {ok} = await updateNote(id, content)
        if(ok) {
          removeEditFlag(id)
        }
      }
      sessionStorage.clear()
    },2000)
  }

  const initAllNotes = async ()=>{
    let {notes} = await getAllNotes()
    notes.forEach(note => {note['edited'] = false})
    setNotes(notes)
  }

  const addNewNote = async ()=>{
    let {ok, insertedId} = await newNote('')
    if(ok) {
      let newNotes = deepCopy(notes)
      newNotes.push({_id: insertedId, content: ''})
      setNotes(newNotes)
    } else {
      console.log({ok, insertedId})
    }
  }

  const onNoteEdit = async (id, content) => {
    let newNotes = deepCopy(notes)
    let note = newNotes.find(x => x['_id'] == id)
    note['content'] = content
    note['edited'] = true
    sessionStorage.setItem(id, content)
    setNotes(newNotes)
  }

  const onNoteDelete = async (id)=>{
    let newNotes = deepCopy(notes).filter(x => x['_id'] != id)
    let {ok} = await deleteNote(id)
    if(ok) {
      setNotes(newNotes)
    }
  }

  return (
    <div>
      {notes.map(x=><Note key={x._id} handleChange={onNoteEdit} data={x} handleDelete={onNoteDelete}/>)}
      {notes.length < MAX_NOTES?<AddButton onClick={addNewNote}/>:null}
    </div>
  )
}

ReactDOM.render(React.createElement(StickyNotesPanel), MountDOM);
