const { json } = require('body-parser');
const mysql = require('mysql');
const express= require('express');
const bodyParser = require('body-parser');

const app = express(); //statement creates a new express application
app.use(bodyParser.json());

const mysqlConnection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'cst@2021',
    database:'EmployeeDB',
    multipleStatements:true  //used for post request as we have multi input state in on line with ;
     
});

mysqlConnection.connect((err)=>{
    if(!err)
    console.log("DB connected succeded.");
    else
    console.log("Error connecting to Database \n Error: " + JSON.stringify(err,undefined,2));
});
//   \n for printing on new lines and then we concat json.strigify with error msg

app.listen(3000,()=>console.log('listening on port 3000'));

// home page
app.get("/",(req,res)=>res.json(`Welcome To Our Website`));

//  get all employess
app.get('/Employee',(req,res)=>{
    mysqlConnection.query('SELECT * FROM Employee',(err,rows,fields)=>{
        if(!err){
            
            res.json(rows)
            // res.send ('Below is the list of the Employess:'+ JSON.stringify(rows))
            console.log(rows);
            // console.log(rows[0].Name); same with emp id or any other information
        }
        else console.log(err);
        
    })
});

// get by id  same can be aaplied for name or any other details
app.get('/Employee/:id',(req,res)=>{
    mysqlConnection.query('SELECT * FROM Employee WHERE Employee_id=?',[req.params.id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        console.log(rows);
        }
        else console.log(err);
        
    })
});

// deleting an employee
app.delete('/Employee/:id',(req,res)=>{
    mysqlConnection.query('DELETE FROM Employee WHERE Employee_id=?',[req.params.id],(err,rows,fields)=>{
        if(!err){
            res.send("Deleted Successfully");
        console.log('deleted successfully');
        }
        else {console.log(err);
        res.send(err);}
    })
});


// insert an employee 
app.post('/Employee',(req,res)=>{
    // console.log(req.body);
    let emp=req.body;
    var sql="SET @Employee_id = ?;SET @Name = ?;SET @Employee_code=?;SET @Salary=?; \
            CALL EmployeeEditOrAdd(@Employee_id,@Name,@Employee_code,@Salary);";

    mysqlConnection.query(sql,[emp.Employee_id,emp.Name,emp.Employee_code,emp.Salary],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        console.log(rows);
        }
        else {console.log(err);
        res.send(err);}
    })
});
