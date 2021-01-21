const express = require('express');
const path=require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
//const session= require('express-session');


app = express();

const port = 4041;

// Body Parser Middleware
//app.use(bodyparser.urlencoded({ extended: false}));

app.use(bodyparser.json());

app.use(cors());



const pool = mysql.createPool({
        connectionLimit:10,
        host: 'localhost',
        user : 'root',
        password: "",
        database:'Patient_Records'
    });



    app.get('/getblood', (req,res,) =>{
        console.log('start')
        pool.getConnection((err, connection)=>{
            if(err) throw err
    
            console.log(`Connected as id ${connection.threadId}`)
    
            connection.query('select * from bloodtype',req.body, (err,rows) =>{
                connection.release(); // return the connection pool
    
                if(!err){
                    res.send(rows)
                }
                else{
                    console.log(err);
                }
            })
    
        })
    })
    





// Get All Patient
app.get('/getblood/:id', (req,res,) =>{
    console.log('start')
    pool.getConnection((err, connection)=>{
        if(err) throw err

        console.log(`Connected as id ${connection.threadId}`)

        connection.query('select * from bloodtype where bldTypeId =?',req.params.id, (err,rows) =>{
            connection.release(); // return the connection pool

            if(!err){
                res.send(rows)
            }
            else{
                console.log(err);
            }
        })

    })
})


app.post('/logadmin', (req,res,) =>{
    pool.getConnection((err, connection)=>{
        if(err) { console.log('can\'t connect')}
        console.log('start log')

        console.log(`Connected as id ${connection.threadId}`)
        const params = req.body;
        connection.query('select * from admin where adminId =?',req.body.adminId, (err,rows) =>{
            connection.release(); // return the connection pool

            if(rows.length > 0){

                if(req.body.adminPasswrd == params.adminPasswrd)
                {
                    console.log(params)
                    res.send(rows)
                }

                else{
                    console.log('Wrong Password')
                    res.send('Wrong Password')
                }
               /* connection.query('select * from admin where adminPasswrd = ?',param.adminPasswrd, (err,rows) =>{
                    if(rows.length > 0){
                        console.log(params)
                        res.send(rows)
                    }

                    else{
                        console.log('Wrong Password')
                        res.send('Wrong Password')
                    }
                })*/



               // let token = jwt.sign({adminId:params.adminId},'secret', {expiresIn:'2h'});
               // return res.status(200).json(token);
            }
            else{
                res.send('THIS ID NUMBER DOES NOT EXIST');
                console.log('THIS ID NUMBER DOES NOT EXIST');
                //return res.status(501).json({message:'Admin Does Not Exist'});
            }
        })
    })
})
/*
// Get Patient By ID

app.get('/logadmin/:p_id', (req,res,) =>{
    pool.getConnection((err, connection)=>{
        if(err) { console.log('can\'t connect')}

        console.log(`Connected as id ${connection.threadId}`)

        connection.query('select * from admin where adminId =?',[req.params.p_id], (err,rows) =>{
            connection.release(); // return the connection pool

            if(rows.length > 0){

                console.log(req.params)
                res.send(rows)
            }
            else{

                res.send('THIS ID NUMBER DOES NOT EXIST');
                console.log('THIS ID NUMBER DOES NOT EXIST');
            }

           /* if(!err){

                console.log(req.params)
                res.send(rows)
                /*if(req.params.name.toString() == rows.patientName)
                {  
                    console.log(req.params)
                     res.send(rows)
                }

                else{

                }
              
            }
            else{


                console.log(err);
            }//
        })
    })
})*/



// Medical Record

app.post('/patientrecord', (req,res,) =>{
    pool.getConnection((err, connection)=>{
        if(err) { console.log('can\'t connect')}

        console.log(`Connected as id ${connection.threadId}`)
        const params = req.body;
        connection.query('select * from admin where adminId =?',req.body.adminId, (err,rows) =>{
            connection.release(); // return the connection pool

            if(rows.length > 0){

                console.log(params)
                res.send(rows)
            }
            else{
                res.send('THIS ID NUMBER DOES NOT EXIST');
                console.log('THIS ID NUMBER DOES NOT EXIST');
            }
        })
    })
})




// Create A New Parient
app.post('/register', (req,res,) =>{
    console.log("in here");

    pool.getConnection((err, connection)=>{
        if(err) {console.log(err) /*throw err*/}//
        console.log("connected");

    //const {p_Email} = req.body.email;
    const params = req.body;
    connection.query('select * from patient where patientId = ?',req.body.patientId,(err,rows) => {
        if(rows.length > 0){
            console.log('This Id has already been used...')
            res.send('This Id has already been used...');
        }
        else{
            connection.query('select * from patient where email = ?',req.body.email,(err,rows) => {
                if(rows.length > 0){
                    console.log('This Email has already been used...')
                    res.send('This Email has already been used...');
                }

                else{
                    connection.query('insert into patient set ?',params, (err,rows) =>{
            
                        connection.release(); // return the connection pool
                        if(!err){
                            console.log(params);
                            res.send(params);
                            //res.send("Patient registered successful")
                            console.log("Patient registered successful");
                        }
                        else{
                            console.log(err);
                        }
                    });
                }
            });
        }
    });

    });
});





/*
// Create A New Parient
app.post('/register', (req,res,) =>{
    console.log("in here");
   
    pool.getConnection((err, connection)=>{
        if(err) {throw err}//
        console.log("connected");

        //console.log(`Connected as patientId ${connection.threadId}`)
        const params = req.body;
        console.log(params);
        connection.query('insert into patient set ?',params, (err,rows) =>{
            
            connection.release(); // return the connection pool

            if(!err){
                res.send("Patient registered successful")
            }
            else{
                console.log(err);
            }
        });
    });
});
*/

app.use('/', (req,res) => {
    res.send('Invalid Endpoint');
});

//Start Sever
app.listen(port, () =>{
    console.log('Server started at port '+port)
})