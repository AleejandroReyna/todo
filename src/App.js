import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Spinner
} from 'react-bootstrap'

function App() {
  const [loading, setLoading] = useState(true)
  const [todos, setTodos] = useState([])
  const [showGrid, setShowGrid] = useState(false)
  const [filter, setFilter] = useState('pending')
  const [filterText, setFilterText] = useState('')
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
      const getData = async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {method: 'get'})
        const result = await response.json()
        setTodos(result)
        setLoading(false)
      }
      getData()
  }, [loading])

  function getPending() {
    return todos.filter(todo => todo.completed == false)
  }

  function getCompleted() {
    return todos.filter(todo => todo.completed)
  }

  function getTodos() {
    let todoList
    if(filter === 'pending') {
      todoList = getPending()
    } else if (filter === 'completed') {
      todoList = getCompleted()
    } else {
      todoList = [...todos]
    }
    if(filterText) {
      return todoList.filter(todo => todo.title.includes(filterText))
    }
    return todoList
  }

  function completeItem(item) {
    let newTodos = [...todos]
    newTodos[newTodos.indexOf(item)].completed = true
    setTodos([...newTodos])
  }

  function deleteItem(item) {
    let newTodos = [...todos]
    newTodos.splice(newTodos.indexOf(item), 1)
    setTodos([...newTodos])
  }

  function addItem() {
    let repTodos = [...todos]
    repTodos.push({id: (todos[todos.length - 1].id + 1), title: newItem, completed: false})
    setTodos([...repTodos])
    setNewItem('')
  }

  if(!loading) {
    return (
      <div>
        <button type="button" onClick={() => setFilter('pending')} disabled={filter === 'pending'}>Pending</button>
        <button type="button" onClick={() => setFilter('all')} disabled={filter === 'all'}>All</button>
        <button type="button" onClick={() => setFilter('completed')} disabled={filter === 'completed'}>Completed</button>
        <br/>
        <label htmlFor="">Show as Grid</label>
        <input type="checkbox" onChange={e => setShowGrid(e.target.checked)} />
        <br/>
        <label htmlFor="">search: </label>
        <input type="text" onChange={e => setFilterText(e.target.value)} value={filterText}/><br/>
        <label htmlFor="">Add task: </label>
        <input type="text" onChange={e => setNewItem(e.target.value)} value={newItem}/>
        <button onClick={addItem} disabled={!newItem}>Add Todo</button><br/>
        {!showGrid ?
          <ul>
            {
              getTodos().map(todo =>
                <li key={todo.id}>{ todo.id } - { todo.title }
                    {!todo.completed &&
                      <button onClick={e => completeItem(todo)}>Complete</button>
                    }
                    <button onClick={e => deleteItem(todo)}>Delete</button>
                </li>
              )
            }
          </ul>
        : 
          <div style={{display: 'flex'}}>
            {getTodos().map(todo => 
              <div key={todo.id}>{ todo.id } - { todo.title }</div>
            )}
          </div>
        }
      </div>
    )
  }

  return (
    <div className="spinner-container">
      <Spinner animation="grow" variant="primary"/>
    </div>
  );
}

export default App;
