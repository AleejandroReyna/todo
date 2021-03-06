import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Spinner, 
  Container, Row, Col,
  ButtonGroup, Button,
  Form,
  Table,
  Card
} from 'react-bootstrap'
import {
  Trash,
  Check,
  X
} from 'react-bootstrap-icons'

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
      <Container>
        <Row>
          <Col>
            <h1 className="mt-4 mb-4">My Todo</h1>
            <ButtonGroup className="mb-4">
              <Button variant="outline-secondary" onClick={() => setFilter('pending')} disabled={filter === 'pending'}>Pending</Button>
              <Button variant="outline-secondary" onClick={() => setFilter('all')} disabled={filter === 'all'}>All</Button>
              <Button variant="outline-secondary" onClick={() => setFilter('completed')} disabled={filter === 'completed'}>Completed</Button>
            </ButtonGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Switch
              label="Show as grid"
              onChange={e => setShowGrid(e.target.checked)} 
              value={showGrid}
              id='grid-switch'
              className="mb-4"
             />
          </Col>
          <Col>
            <Form.Control 
              onChange={e => setFilterText(e.target.value)} 
              value={filterText}
              placeholder="Search..."
              className="mb-4" />
          </Col>
        </Row>

        <Row>
          <Col>
            {!showGrid ?
              <Table striped bordered hover size="sm">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
                {
                  getTodos().map(todo =>
                    <tr key={todo.id}>
                      <td>{ todo.id }</td>
                      <td>{ todo.title }</td>
                      <td>
                        { todo.completed ? 
                          <Check />
                        :
                          <X />
                        }
                        </td>
                      <td>
                        <Button variant="danger" onClick={e => deleteItem(todo)}><Trash /></Button>{' '}
                        {!todo.completed &&
                          <Button variant="success" onClick={e => completeItem(todo)}><Check /></Button>
                        }
                      </td>
                    </tr>
                  )
                }
              </Table>
            : 
              <Row>
                {getTodos().map(todo => 
                  <Col sm={4} key={todo.id}>
                    <Card className="mb-4">
                      <Card.Header>
                        <div className="d-flex justify-content-between align-items-center">
                          { todo.id }
                          <div>
                            <Button variant="danger" onClick={e => deleteItem(todo)}><Trash /></Button>{' '}
                            {!todo.completed &&
                              <Button variant="success" onClick={e => completeItem(todo)}><Check /></Button>
                            }
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        { todo.title }
                      </Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
            }

            <div>
              <Form.Group className="d-flex flex-row">
                <Form.Control 
                  type="text" 
                  onChange={e => setNewItem(e.target.value)} 
                  value={newItem}
                  placeholder="New Item..."/>
                <Button 
                  variant="primary" 
                  style={{flexShrink: 0, marginLeft: '5px'}} 
                  onClick={addItem} disabled={!newItem}>Add Todo</Button>
              </Form.Group>
            </div>
            
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <div className="spinner-container">
      <Spinner animation="grow" variant="primary"/>
    </div>
  );
}

export default App;
