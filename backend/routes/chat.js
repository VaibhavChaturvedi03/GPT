import express from 'express';
import Thread from '../models/Thread.js';

const router = express.Router();

//test
router.post('/test' , async(req,res)=>{
    try{
        const thread = new Thread({
            threadId: "xyz",
            title: "sample thread"
        });

        const response = await thread.save();
        res.send(response);

    }catch(error){
        console.log(err);
        res.status(500).send({error: "failed to save in DB"});
    }
});

//GET all threads
router.get('/thread',async(req,res)=>{
    try{
        const threads = await Thread.find({}).sort({updatedAt: -1}); //to get in descending order..most recent at top
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).send({error: "failed to fetch"});
    }
});

//GET particular thread from threadId
router.get('/thread/:threadId', async(req,res)=>{
    try{
        const {threadId} = req.params;
        const thread = await Thread.findOne({threadId});

        if(!thread){
            res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    }catch(err){
        console.log(err);
        res.status(500).send({error: "failed to fetch"});
    }
});

export default router;