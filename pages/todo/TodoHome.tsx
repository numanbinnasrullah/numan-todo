import React, { useState, useEffect } from 'react'
import styles from './Todo.module.css'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';

import { collection, getDocs, addDoc, doc, deleteDoc, setDoc, Firestore, DocumentReference, DocumentData } from "firebase/firestore";
import { db } from '../../config/Firebase'
// export declare = () => (firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference<DocumentData>;


const TodoHome = () => {

    type todosType = {
        todoContent: string,
        id?: any
    }
    const [todoText, setTodoText] = useState('');
    const [todos, setTodos] = useState<todosType[]>([]);
    const [oldItemIndex, setoldItemIndex] = useState(Number);
    const [completeTask, setCompleteTask] = useState<todosType[]>([]);

    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false), setTodoText("") }

      useEffect(()=>{
        console.log("Todos component just render");
        getDataHandler()
        getCompletedTodosHandler()
    },[])

    const getDataHandler = async() => {
        try{
            const getTodos = await getDocs(collection(db, "todos"));
            let todosList: todosType[] = []
            getTodos.forEach((doc) => {
                const newData: todosType = {
                    todoContent: doc.data()?.newData?.todoContent,
                    id: doc.id
                }
                todosList.push(newData);
                // todosList.push( {todoContent: doc.data()?.newData?.todoContent,id: doc.id});
            });
            // console.log('Get todos', todosList);
            setTodos(todosList)
        }catch(error){
            console.log(error);
        }
    }

    const getCompletedTodosHandler = async() => {
        try{
            const getTodos = await getDocs(collection(db, "completeTodos"));
            let completeTodosList: todosType[] = []
            getTodos.forEach((doc) => {
                completeTodosList.push({
                    todoContent: doc.data()?.todoContent,
                    id: doc.id
                });
            });
            // console.log('todos', todosList);
            setCompleteTask(completeTodosList)
        }catch(error){
            console.log(error);
        }
    }


    const SubmitHandler = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!todoText) {
            alert("Please Add Todo Must")
        } else {
            const newData = {
                todoContent: todoText
            }
            try{
                const docRef = await addDoc(collection(db, "todos"), {newData});
                setTodos([...todos,  { ...newData, id: docRef.id }])
                setTodoText("")
                // console.log("Submited todoss",todos)
            }catch(e){
                console.error("Error adding document: ", e);
            }
        }
    }

    const EditHandler = (todo: todosType, index: number) => {
        setTodoText(todo.todoContent)
        setoldItemIndex(index)
        setShow(true);
        // console.log(todo)
    }

    const UpdateHandler = () => {
        const newData = {
            newData: {
                todoContent: todoText
            }
        }

        todos.forEach(async(todo:todosType, index) => {
            // console.log("Update",todo)
            if (oldItemIndex == index) {
                const docRef = doc(db, "todos", todo.id);
                setDoc(docRef, { ...newData})
            }
        });

        let UpdatedTodos = todos.map((todo, index) => {
            const newData = {
                todoContent: todoText
            }
            if (oldItemIndex == index) {
                return newData
            } else {
                return todo
            }
        });
        
       
        setTodos(UpdatedTodos)
        setTodoText("")
        setShow(false)
        // console.log("Updated Todos..",todos)
    }

    const DeleteHandler = async(Index: number) => {
        const FilteredTodos = todos.filter((todo, index) => index !== Index)
        todos.forEach(async(todo: todosType, index) => {
            if(index === Index){
                await deleteDoc(doc(db,"todos", todo.id ));
            }
        });
        setTodos(FilteredTodos)
    }

    const CompleteHandler = (Index: number) => {
        const CompleteTasks = todos.filter((todo, index) => {
            if (index !== Index) {
                return todo
            } else {
                setCompleteTask([...completeTask, todo])
            }
        })
        todos.forEach(async(todo: todosType, index) => {
            if(index === Index){
                await deleteDoc(doc(db,"todos", todo.id ));
            }
        });
        todos.forEach(async(todo, index) => {
            if(index === Index){
                const docRef = await addDoc(collection(db, "completeTodos"), todo);
                setCompleteTask([...completeTask, {...todo, id: docRef.id}])
                console.log(completeTask)
            }
        });
        setTodos(CompleteTasks)
    }

    const CompleteDeleteHandler = (Index: number) => {
        const CompletedDeleteTodos = completeTask.filter((todo, index) => index !== Index)
        completeTask.forEach(async(todo: todosType, index) => {
            if(index === Index){
                await deleteDoc(doc(db,"completeTodos", todo.id ));
            }
        });
        setCompleteTask(CompletedDeleteTodos)
    }
    return (
        <>

            <div className={` ${styles.todoMainContainer} `}>
                <div className={` ${styles.formParentDiv} `}>
                    <Form className={` ${styles.MainForm} `}>
                        <Form.Group className={` mb-3 ${styles.inputText} `} controlId="formBasicEmail">
                            <Form.Label>Todo</Form.Label>
                            <Form.Control className={` mb-3 ${styles.input} `} type="text" placeholder="Add Your Todo . . ." value={show ? "":todoText} onChange={(e) => setTodoText(e.target.value)} />
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
                            todos.map((todo, index) => {
                                // console.log("Edit Todos",todo)
                                return (
                                    <div className={` ${styles.TodoMainList} `} key={index}>
                                        <div className={` ${styles.TodoList} `}>
                                            <Card className={` ${styles.Card} `}>
                                                <Card.Body>{todo.todoContent}</Card.Body>
                                            </Card>
                                            <div className={` ${styles.TodoListBtns} `}>
                                                <Button className={` ${styles.cardBtns} `} variant="light" onClick={() => EditHandler(todo, index)}>Edit</Button>
                                                <Button className={` ${styles.cardBtns} `} variant="success" onClick={() => CompleteHandler(index)}>Complete</Button>
                                                <Button className={` ${styles.cardBtns} `} variant="danger" onClick={() => DeleteHandler(index)}>Delete</Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : <>
                                <div className={` ${styles.Spinner} `}>
                                    <h4 className={` ${styles.AddSometodoText} `}>Now Add Some Todos Here . . . </h4> <Spinner animation="grow" className={` ${styles.Spin} `} /> <Spinner animation="grow" className={` ${styles.Spin} `} /> <Spinner animation="grow" className={` ${styles.Spin} `} /> <Spinner animation="grow" className={` ${styles.Spin} `} />
                                </div>
                            </>
                    }

                </div>

                <h4 className={` ${styles.CompleteHeading} `}> <hr /> Your Completed Todos <hr /> </h4>

                {completeTask.length > 0 ?
                    completeTask.map((completeTodo, index) => {
                        return (
                            <div className={` ${styles.TodoMainList} `} key={index}>
                                <div className={` ${styles.TodoList} `}>
                                    <Card className={` ${styles.Card} ${styles.CardComplete} `}>
                                        <Card.Body>{completeTodo.todoContent}</Card.Body>
                                    </Card>
                                    <div className={` ${styles.TodoListBtns} `}>
                                        <Button className={` ${styles.cardBtns} `} variant="danger" onClick={() => CompleteDeleteHandler(index)}>Delete</Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : <h5 className={` ${styles.noCompleteTodoText} `}>No Task Completed Yet . . . </h5>
                }

            </div>

            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Todo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Update Todo Data</Modal.Body>
                    <Form>
                        <Form.Control className={` mb-3 ${styles.input} `} type="text" placeholder="Add Your Todo . . ." value={todoText} onChange={(e) => setTodoText(e.target.value)} />
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
