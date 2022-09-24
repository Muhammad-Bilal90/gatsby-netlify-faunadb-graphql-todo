import React, { useRef, useContext, useState } from 'react';
import { Form, FormControl, ListGroup, Button } from 'react-bootstrap';
import { RouteComponentProps } from "@reach/router";
import { IndentityContext } from '../context/authContext';
import { useQuery, useMutation, gql } from '@apollo/client';
// import gql from 'graphql-tag';

const ADD_TODO = gql`
  mutation AddTodo($value: String!) {
    addTodo(value: $value) {
      id
    }
  }
`

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      value
      done
    }
  }
`

const UPDATE_TODO_DONE = gql`
  mutation UpdateTodo($id: ID!) {
    updateTodoDone(id: $id) {
      value
      done
    }
  }
`

const TodosArea: React.FC<RouteComponentProps> = (props) => {

    const [addTodo] = useMutation(ADD_TODO)
    const [updateTodoDone] = useMutation(UPDATE_TODO_DONE)
    let { loading, error, data, refetch } = useQuery(GET_TODOS,{fetchPolicy:"cache-first"})
  
    const { user, identity } = useContext(IndentityContext)
    const inputRef = useRef<any>()

    React.useEffect(()=>{
        async function fetchData(){
            await refetch();
        }
    
        fetchData()
    
      },[user]);



    return(
        <div className='mt-5'>
            <div className="d-flex justify-content-between">
            <h3 >{user && (user.user_metadata?.full_name)}'s Todos</h3>
            <Button className="h-25" variant="dark" onClick={() => {identity.open()}}>Logout</Button>
            </div>
            <hr />
            <div className='mt-5'>
                <FormControl ref={inputRef} type="text" placeholder='Add Todo...' />

                <Button className='my-3 w-100' variant='dark'
                    onClick={async () => {
                        await addTodo({ variables: { value: inputRef.current.value } })
                        console.log(inputRef.current.value)
                        inputRef.current.value = ""
                        await refetch()
                      }}
                >
                  Add Todo
                </Button>
                <ListGroup variant="flush">
        {(loading ) ? <div>Loading...</div> : 
        error ? <div>{error.message}</div> : 
          (data.todos.length === 0 ? (
            <h5>Your todo list is empty</h5>
          ) : (
            data.todos.map(todo => (
              <ListGroup.Item key={todo.id}>
                <div>
                  <Form.Check
                    defaultChecked={todo.done}
                    disabled={todo.done}
                    type="checkbox"
                    onClick={async e => {
                      await updateTodoDone({ variables: { id: todo.id } })
                      await refetch()
                    }}
                  />
                  <p >{todo.value}</p>
                </div>
              </ListGroup.Item>
            ))
          ))}
      </ListGroup>
        </div>
{/* 
                <input
                    value={reminder} name="reminder" onChange={({target}) => setterReminder(target.value)}
                    // ref={inputRef}
                    type="text"
                    placeholder="Add a new task"
                />
                <Button
                    onClick={Submit}
                    >
                    Add Task
                </Button> */}
            {/* <ListGroup variant="flush">
                {(loading ) ? <div>Loading...</div> : 
                error ? <div>Error: {error.message}</div> : 
                (data.todos.length === 0 ? (
                    <h5>Your todo list is empty</h5>
                ) : (
                    data.todos.map(todo => (
                    <ListGroup.Item key={todo.id}>
                        <div>
                        <Form.Check
                            defaultChecked={todo.done}
                            disabled={todo.done}
                            // className={styles.checkBox}
                            type="checkbox"
                            // onClick={async e => {
                            // await updateTodo({ variables: { id: todo.id } })
                            // await refetch()
                            // }}
                        />
                        <p >{todo.value}</p>
                        </div>
                    </ListGroup.Item>
                    ))
                ))}
            </ListGroup> */}
            {/* <ListGroup className='mt-3'>
                <ListGroup.Item className='mb-2 '>
                    <div className='d-flex'>
                    <Form.Check
                        defaultChecked={false}
                        disabled={false}
                        type="checkbox"
                    />
                    <p className='ms-3'>My Todo</p>
                    </div>
              </ListGroup.Item>
                <ListGroup.Item className='mb-2'>
                    <div className='d-flex'>
                        <Form.Check
                            defaultChecked={false}
                            disabled={false}
                            type="checkbox"
                        />
                        <p className='ms-3'>My Todo</p>
                    </div>
              </ListGroup.Item>
                <ListGroup.Item className='mb-2'>
                    <div className='d-flex'>
                        <Form.Check
                            defaultChecked={false}
                            disabled={false}
                            type="checkbox"
                        />
                        <p className='ms-3'>My Todo</p>
                    </div>
              </ListGroup.Item>
                <ListGroup.Item className='mb-2'>
                    <div className='d-flex'>
                        <Form.Check
                            defaultChecked={false}
                            disabled={false}
                            type="checkbox"
                        />
                        <p className='ms-3'>My Todo</p>
                    </div>
              </ListGroup.Item>
                <ListGroup.Item className='mb-2'>
                    <div className='d-flex'>
                        <Form.Check
                            defaultChecked={false}
                            disabled={false}
                            type="checkbox"
                        />
                        <p className='ms-3'>My Todo</p>
                    </div>
              </ListGroup.Item>
            </ListGroup> */}
        </div>
    );
}

export default TodosArea;