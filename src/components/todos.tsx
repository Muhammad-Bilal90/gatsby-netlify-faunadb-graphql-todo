import React, { useRef, useContext, useState } from 'react';
import { Form, FormControl, ListGroup, Button } from 'react-bootstrap';
import { RouteComponentProps } from "@reach/router";
import { IndentityContext } from '../context/authContext';
import { useQuery, useMutation, gql } from '@apollo/client';

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
  mutation UpdateTodo($id: ID!, $done: Boolean!) {
    updateTodoDone(id: $id, done: $done) {
      value
      done
    }
  }
`

const TodosArea: React.FC<RouteComponentProps> = (props) => {

  const [addTodo] = useMutation(ADD_TODO)
  const [updateTodoDone] = useMutation(UPDATE_TODO_DONE)
  let { loading, error, data, refetch } = useQuery(GET_TODOS, { fetchPolicy: "cache-first" })

  const { user, identity } = useContext(IndentityContext)
  const inputRef = useRef<any>()

  React.useEffect(() => {
    async function fetchData() {
      await refetch();
    }

    fetchData()

  }, [user]);
  if (user) {
    console.log(data)
  }

  return (
    <div>
      {user !== null ? (
      <div className='mt-5'>
        <div className="d-flex justify-content-between">
          <h3 >{user && (user.user_metadata?.full_name)}'s Todos</h3>
          <Button className="h-25" variant="dark" onClick={() => { identity.open() }}>{user ? "Logout" : "Login"}</Button>
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
          <ListGroup variant="flush" className='mt-3'>
            {(loading) ? <div>Loading...</div> :
              error ? <div>{error.message}</div> :
                (data.todos.length === 0 ? (
                  <h5>Your todo list is empty</h5>
                ) : (
                  data.todos.map(todo => (
                    <ListGroup.Item key={todo.id} className='mb-2 '>
                      <div className='d-flex'>
                        <Form.Check
                          defaultChecked={todo.done}
                          // disabled={todo.done}
                          type="checkbox"
                          onClick={async e => {
                            await updateTodoDone({ variables: { id: todo.id, done: !todo.done } })
                            await refetch()
                          }}
                        />
                        <p className='ms-3'>{todo.value}</p>
                      </div>
                    </ListGroup.Item>
                  ))
                ))}
          </ListGroup>
        </div>
      </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "90vh" }}>
          <p>Please Login To Continue</p>
        <Button variant="dark" className="w-25" onClick={() => {identity.open()}}>Login</Button>
        </div>
      )
}
    </div>  
  );
}

export default TodosArea;