const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const databasePath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());
let database = null;
const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    Id: dbObject.id,
    Todo: dbObject.todo,
    Priority: dbObject.priority,
    Status: dbObject.status,
  };
};

app.get("/todos/",async(request,response)=>{
    const{Todo,Priority,Status}=request.query;
    const getTodoQuery=`
    SELECT 
    *
    FROM 
    todo
    WHERE
    todo LIKE '%${play}%' , priority='High' AND status ='IN PROGRESS' ;`;
    const TodoArray=await database.all(getTodoQuery);
    response.send(TodoArray.map(eachState)=>convertDbObjectToResponseObject(eachState))
});

app.get("/todos/:todoId/",async(request,response)=>{
    const{todoId}=request.params;
    const getSpecificTodo='
    SELECT 
    *
    FROM
    todo
    WHERE
    id=${todoId};';
    const state=await database.get(getSpecificTodo);
    response.send(convertDbObjectToResponseObject(state));

});

app.post("/todos/",async(request,response)=>{
    const{Id,Todo,Priority,Status}=request.body;
    const postQuery=`
    INSERT INTO
    todo(id,todo,priority,status)
    VALUES(${Id},'${Todo}','${Priority}','${Status}');`;
    await database.run(postQuery);
    response.send("Todo Successfully Added")
});

app.put("/todos/:todoId/",async(request,response)=>{
    const{todoId}=request.params;
    const{Todo,Priority,Status}=request.body;
    const updateQuery=`
    UPDATE
    todo
    SET
    todo='${Todo}',
    priority='${Priority}',
    status='${Status}'
    WHERE
    id=${Id};`;
    await db.run(updateQuery);
    response.send("Status Updated");
    response.send("Priority Updated");
    response.send("Todo Updated");
})

app.delete("/todos/:todoId/",async(request,response)=>{
    const{deleteId}=request.params;
    const deleteQuery=`
    DELETE FROM
    todo
    WHERE
    id=${deleteId};`;
    await database.run(deleteQuery);
    response.send("Todo Deleted")

});

module.exports=app;





