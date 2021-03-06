import { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [todos, setTodos] = useState([])
  const [showTodos, setShowTodos] = useState([])
  const [showGrid, setShowGrid] = useState(false)
  const [filter, setFilter] = useState('pending')
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
      const getData = async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {method: 'get'})
        const result = await response.json()
        setTodos(result)
        let pendingTodos = result.filter(todo => !todo.completed)
        setShowTodos([...pendingTodos])
        setLoading(false)
      }
      getData()
  }, [todos.length])

  function resetShowTodos() {
    if(filter == 'all') {
      showAll()
    } else if(filter == 'pending') {
      showPending()
    } else {
      showCompleted()
    }
  }

  function showPending() {
    setShowTodos(todos.filter(todo => !todo.completed))
    setFilter('pending')
  }

  function showAll() {
    setShowTodos([...todos])
    setFilter('all')
  }

  function showCompleted() {
    setShowTodos(todos.filter(todo => todo.completed))
    setFilter('completed')
  }

  function showFiltered(event) {
    let filteredTodos = todos.filter(todo => todo.title.includes(event.target.value))
    setShowTodos(filteredTodos)

  }

  function completeItem(item) {
    let newTodos = [...todos]
    newTodos[newTodos.indexOf(item)].completed = true
    setTodos([...newTodos])
  }

  function deleteItem(item) {
    let newTodos = [...todos]
    delete newTodos[newTodos.indexOf(item)]
    setTodos([...newTodos])
  }

  function addItem() {
    let repTodos = [...todos]
    setTodos([...todos, {id: todos.length, title: newItem, completed: false}])
    setNewItem('')
    console.log(todos.length)
  }

  if(!loading) {
    return (
      <div>
        <button type="button" onClick={showPending}>Pending</button>
        <button type="button" onClick={showAll}>All</button>
        <button type="button" onClick={showCompleted}>Completed</button>
        <br/>
        <label htmlFor="">Show as Grid</label>
        <input type="checkbox" onChange={e => setShowGrid(e.target.checked)} />
        <br/>
        <label htmlFor="">search</label>
        <input type="text" onChange={showFiltered}/><br/>
        <label htmlFor="">Add task: </label>
        <input type="text" onChange={e => setNewItem(e.target.value)} value={newItem}/>
        <button onClick={addItem} disabled={!newItem}>Add Todo</button><br/>
        {!showGrid ?
          <ul>
            {showTodos.map(todo => 
              <li key={todo.id}>{ todo.id } - { todo.title }
                  {!todo.completed &&
                    <button onClick={e => completeItem(todo)}>Complete</button>
                  }
                  <button onClick={e => deleteItem(todo)}>Delete</button>
              </li>
            )}
          </ul>
        : 
          <div style={{display: 'flex'}}>
            {showTodos.map(todo => 
              <div key={todo.id}>{ todo.id } - { todo.title }</div>
            )}
          </div>
        }
      </div>
    )
  }

  return (
    <div className="App">
      loading...
    </div>
  );
}

export default App;
