const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb"),
  q = faunadb.query
  
  const dotenv = require("dotenv");
  dotenv.config();

  var client = new faunadb.Client({
    secret: process.env.FAUNADB_ADMIN_SECRET,
  })

const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Todo{
      id: ID!
      value: String!
      done: Boolean!
  }
  type Mutation{
      addTodo(value: String!):Todo
      updateTodoDone(id: ID!, done: Boolean!): Todo
  }
`;

const resolvers = {
  Query: {
    todos: async (parent, args, {user}) => {
      if (!user){
        return [];
      }
      else{

        try{
        
          const result = await client.query(
            q.Map(
                q.Paginate(q.Documents(q.Collection('todos'))),
                q.Lambda('todo', q.Get(q.Var('todo')))
            )
        )
        
        return result.data.map(dt => (
            {
                id: dt.ref.id,
                value: dt.data.value,
                done: dt.data.done
            }
        ))
    }
    catch(e){

      return e.toString() 
    }



    }



    }
  },
  Mutation:{
      addTodo: async (_,{value},{user})=>{

        if (!user){
          throw new Error ("Must be authenticated to insert todos")
        }
        
        const results = await client.query(
          q.Create(q.Collection("todos"),{
          data:{
              value: value,
              done: false,
              owner: user
          } 
          })
      );


        return ({
          ...results.data,
          id: results.ref.id
        }
        )
      },
      updateTodoDone: async (_,{id, done}, {user})=>{

        if (!user){
          throw new Error ("Must be authenticated to update todos")
        }

        const results = await client.query(
          q.Update(q.Ref(q.Collection("todos"),id),
          {
          data:{
              done:done
          }
      }
          )
      )

      return (
        {
          ...results.data,
          id: results.ref.id
        }
      )

      }
  }
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({context})=>{
    if (context.clientContext.user){
      return(
        {
          user: context.clientContext.user.sub
        }
      )
    }

    else{
      return {};
    }
    
  },
  playground: true,
  introspection: true
});

const handler = server.createHandler()

module.exports = { handler }
