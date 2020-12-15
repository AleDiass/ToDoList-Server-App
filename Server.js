const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const uuid4 = require('uuid4')
const bcrypt = require('bcrypt')
const cors = require('cors')

const PORT = 5000

const {Todos} = require('./Services/DataBaseManegement/Models/TodoMongoModel')
const {Users} = require('./Services/DataBaseManegement/Models/UserMongoModel')

const app = express();

const { CreateToken, VerifyToken } = require("./Services/JsonWebTokenControl");

app.use(bodyParser.json());
app.use(cors())



// 'mongodb+srv://<Username>:<password>@cluster0.kl9ic.mongodb.net/<Dbname>?retryWrites=true&w=majority'

const URI_AUTH = '';

mongoose.connect(URI_AUTH,{useCreateIndex:true,useNewUrlParser:true})





/* Users */

app.get('/',(req,res)=>{
	res.send('Teste')
})

app.post('/api/login',async(req,res)=>{


	const {username,password} = req.body

	
	
	
	try{
		const Login = await Users.findOne({Username:username}).exec();
		

		if(Login){
			
			const Comparation = await bcrypt.compare(password,Login.Password)
			const Token = CreateToken(Login["_id"])


			Comparation ? res.status(200).send({Token, Auth:true}): res.status(401).send(({Auth:false}))
		}else{
			res.status(404).send({Auth:false})
		} 
		
	}catch(e){
		res.status(500)
	}
	

	
	
	


})


app.post('/api/register',async(req,res)=>{

	const {username,password,passverify} = req.body;

	const PassHash = await bcrypt.hash(password,6)


	if(password === passverify){
		
		try{
			const id = uuid4()

			const UserAlreadyExist = await Users.findOne({
				Username:username
			}).exec()

			if(!UserAlreadyExist){
				const Register = await Users.create({
					_id:id,
					Username:username,
					Password:PassHash
					
				})
	
				const TokenRegister = CreateToken(id)
				res.status(201).send({Token:TokenRegister,Auth:true})
			}else{

				// User Already Exists
				res.status(401).send('User Already Exists')
			}

			

			
		}catch(e){
			res.status(500)
		}





	}else{
		// Password Diff
		res.status(401).send("Password And PassVerify DIFF")
	}
})


app.get('/api/deleteAccount',async(req,res)=>{
	let {authorization} = req.headers
	authorization = authorization.replace('Bearer','')
	
	try{

		const id = await VerifyToken(authorization)
		const DeleteUser = Users.deleteOne({
			_id:id
		}).exec();

	
		res.status(200).send("Account Deleted")


		

	}catch(e){
		res.status(500)
	}
})



app.get('/api/verifyAuth',async(req,res)=>{
	let {authorization} = req.headers
	authorization = authorization.replace('Bearer','')

	try{
			const id = VerifyToken(authorization);


			
		if(id){


			const {Username,CreatedAt,_id} = await Users.findOne({
				_id:id
			}).exec()

			const data = {User:Username,CreatedAt,id:_id,AutoAuth:true,error:false}
			
			res.status(200).send(data)
		
		}else{
			res.status(402).send({error:true,msg:"Invalid Token"}) 
		}
	

	}catch(e){
		res.status(401).send({msg:'Invalid Token',error:true})
	}
	
})


/// 
/// 
///
///
///


/* Todo List */


app.get('/api/todo/get',async(req,res)=>{
	let {authorization} = req.headers
	authorization = authorization.replace('Bearer','')
	try{

		const id = await VerifyToken(authorization)
		
		if(id){

			const FindTodo = await Todos.find({
				UserId:id,
			}).exec();
			
			res.status(200).send([...FindTodo])

			

		}else{
			res.status(403).send('User Id Invalid')
		}
		


	}catch(e){
		res.status(500)
	}

})

app.post('/api/todo/create',async(req,res)=>{
	const {description,title} = req.body
	let {authorization} = req.headers
	authorization = authorization.replace('Bearer','')

	try{
		const id = VerifyToken(authorization)
		

		if(id){

			const FindTodo = await Todos.find({
				UserId:id,
			}).exec()

			if(FindTodo.length > 4){
				// Todo Limit
				res.status(401).send('Todo limit Reached')
			}else{
					const CreateTodo = Todos.create({
					UserId:id,
					Title:title,
					Description:description,
				})

				// Created 
				res.status(201).send('Todo Created')
			}

			
			
			
		}else{
			
			res.status(401).send('User id Invalid')
		}

	}catch(e){
		res.status(500)
	}


})


app.get('/api/todo/delete' , async(req,res)=>{

	const {todoid} = req.headers

	try{
	
		const FindAndDelete = await Todos.findByIdAndDelete({
			_id:todoid
		})
		

		//Deleted
		res.status(200).send("Todo Deleted")
		

	}catch(e){
		res.status(500)
	}


})




app.listen(process.env.PORT || PORT ,()=>{console.log(process.env.PORT || PORT)})
