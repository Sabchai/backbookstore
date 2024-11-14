const express = require("express");
const Bookroute = express.Router();
const bookSchema = require("../model/Bookdata");


// route get all book
// http://localhost:5000/book/getall

Bookroute.get('/getall',async(req,res)=>{
try{
const books= await bookSchema.find()

res.status(200).json({msg :'you got all books',books})
}catch(err){
    console.log(err)
}

})

// route post or add book
//http://localhost:5000/book/addbook

Bookroute.post('/addbook',async(req,res)=>{
    try{
        const newbook= new bookSchema (req.body)  
       await  newbook.save()
        
    res.status(200).json({msg :'you added the book',newbook})
    }catch(err){
        console.log(err)
    }
    
    })

// route update book
//    http://localhost:5000/book/update/:id   <= api 
Bookroute.put('/update/:id',async(req,res)=>{
    try{
        const {id}=req.params
        const updatebook=await  bookSchema.findByIdAndUpdate(id,{$set:{...req.body}})
    res.status(200).json({msg :'your book already  updated',updatebook})

    }catch(err){
        console.log(err)
    }
    
    })

// route delete book
//    http://localhost:5000/book/delete/:id
Bookroute.delete('/delete/:id',async(req,res)=>{
    try{
        const {id}=req.params
        const deletebook=await  bookSchema.findByIdAndDelete(id)
    res.status(200).json({msg :'you delete  book'})
    }catch(err){
        console.log(err)
    }
    
    })



// route get unique book
//htt://localhost:5000/book/getunique/:id

Bookroute.get('/getunique/:id',async(req,res)=>{
    try{
        const {id}=req.params
        const getbook=await  bookSchema.findById(id)
    res.status(200).json({msg :'you get unique  book',getbook})
    }catch(err){
        console.log(err)
    }
    
    })






module.exports= Bookroute