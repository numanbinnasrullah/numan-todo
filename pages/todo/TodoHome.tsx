import React, { useState } from 'react'
import styles from './Todo.module.css'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';



const TodoHome = () => {

    type todosType = {
        todoContent: string
    }
    const [todoText, setTodoText] = useState('');
    const [todos, setTodos] = useState<todosType[]>([]);
    const [oldItemIndex, setoldItemIndex] = useState(Number);
    const [completeTask, setCompleteTask] = useState<todosType[]>([]);

    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false), setTodoText("") }
    
    const SubmitHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if(!todoText){
            alert("Please Add Todo Must")
        } else {
            const newData = {
                todoContent:todoText
            }
            setTodos([...todos, newData])
            setTodoText("")
        }
    }

    const EditHandler = (todo: todosType, index:number) => {
        setTodoText(todo.todoContent)
        setoldItemIndex(index)
        setShow(true);
    }

    const UpdateHandler = () => {
        let updateTodo: todosType = {
            todoContent:todoText
        }
        let UpdatedTodos = todos.map( (todo, index) => {
            if(oldItemIndex == index){
                return updateTodo
            } else {
                return todo
            }
        } )
        setTodos(UpdatedTodos)
        setTodoText("")
        setShow(false)
       
    }

    const DeleteHandler = (Index: number) => {
        const FilteredTodos = todos.filter( (todo, index)=> index !== Index)
        setTodos(FilteredTodos)
    }

    const CompleteHandler = (Index: number) => {
        const CompleteTasks = todos.filter( (todo, index)=>{
            if(index !== Index){
                return todo
            } else {
                setCompleteTask([...completeTask, todo])
            }
        })
        setTodos(CompleteTasks)
    }

    const CompleteDeleteHandler = (Index: number) => {
        const CompletedDeleteTodos = completeTask.filter( (todo, index)=> index !== Index)
        setCompleteTask(CompletedDeleteTodos)
    }
  return (
    <>
    
        <div className={` ${styles.todoMainContainer} `}>
            <div className={` ${styles.formParentDiv} `}>
                <Form className={` ${styles.MainForm} `}>
                    <Form.Group className={` mb-3 ${styles.inputText} `} controlId="formBasicEmail">
                        <Form.Label>Todo</Form.Label>
                        <Form.Control className={` mb-3 ${styles.input} `} type="text" placeholder="Add Your Todo . . ." value={todoText} onChange={ (e)=>setTodoText(e.target.value) } />
                        <Form.Text className={` ${styles.textMuted} `}>
                        Your Entered Todos Your Today's Tasks
                        </Form.Text>
                    </Form.Group>
                    <Button variant="info" type="submit" className={`${styles.inputBtn}`} onClick={SubmitHandler}>
                        Add Todo
                    </Button>
                </Form>
                {
                    todos.length > 0 ?
                    todos.map( (todo, index) => {
                        return(
                            <div className={` ${styles.TodoMainList} `} key={index}>
                            <div className={` ${styles.TodoList} `}>
                                <Card className={` ${styles.Card} `}>
                                    <Card.Body>{todo.todoContent}</Card.Body>
                                </Card>
                                <div className={` ${styles.TodoListBtns} `}>
                                    <Button variant="light" onClick={ () => EditHandler(todo, index) }>Edit</Button>
                                    <Button variant="success" onClick={ () => CompleteHandler(index) }>Complete</Button>
                                    <Button variant="danger" onClick={ () => DeleteHandler(index) }>Delete</Button>
                                </div>
                            </div>
                        </div>
                        )
                    } ) : <>
                            <div className={` ${styles.Spinner} `}>
                               <h4 className={` ${styles.AddSometodoText} `}>Now Add Some Todos Here . . . </h4> <Spinner animation="grow" className={` ${styles.Spin} `} /> <Spinner animation="grow" className={` ${styles.Spin} `} /> <Spinner animation="grow" className={` ${styles.Spin} `} /> <Spinner animation="grow" className={` ${styles.Spin} `} />
                            </div>
                          </> 
                }

            </div>

               <h4 className={` ${styles.CompleteHeading} `}> <hr /> Your Completed Todos <hr /> </h4> 

            {   completeTask.length > 0 ?
                completeTask.map( (completeTodo, index) => {
                    return(
                        <div className={` ${styles.TodoMainList} `} key={index}>
                        <div className={` ${styles.TodoList} `}>
                            <Card className={` ${styles.Card} `}>
                                <Card.Body>{completeTodo.todoContent}</Card.Body>
                            </Card>
                            <div className={` ${styles.TodoListBtns} `}>
                                <Button variant="danger" onClick={ () => CompleteDeleteHandler(index) }>Delete</Button>
                            </div>
                        </div>
                    </div>
                    )
                } ) : <h5 className={` ${styles.noCompleteTodoText} `}>No Task Completed Yet . . . </h5>
            }

        </div>

        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Update Todo</Modal.Title>
                </Modal.Header>
                <Modal.Body>Update Todo Data</Modal.Body>
                <Form>
                    <Form.Control className={` mb-3 ${styles.input} `} type="text" placeholder="Add Your Todo . . ." value={todoText} onChange={ (e)=>setTodoText(e.target.value) } />
                </Form>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={UpdateHandler}>
                    Update
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    </>
  )
}

export default TodoHome
