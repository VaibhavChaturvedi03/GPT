import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAiResponse from '../utils/openai.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/thread', requireAuth, async (req, res) => {
    try {
        const threads = await Thread.find({ userId: req.user._id }).sort({ updatedAt: -1 }); //to get in descending order..most recent at top
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "failed to fetch" });
    }
});

router.get('/thread/:threadId', requireAuth, async (req, res) => {
    try {
        const { threadId } = req.params;
        const thread = await Thread.findOne({ threadId, userId: req.user._id });

        if (!thread) {
            res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "failed to fetch" });
    }
});

router.delete('/thread/:threadId', requireAuth, async (req, res) => {
    try {
        const { threadId } = req.params;
        const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.user._id });

        if (!deletedThread) {
            res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "failed to delete" });
    }
});

router.post('/chat', requireAuth, async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        res.status(400).json({ error: "Missing Required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId, userId: req.user._id });

        if(!thread){
            //create new thread in DB
            thread = new Thread({
                threadId,
                userId: req.user._id,
                title: message,
                messages: [{role: "user" , content: message}]
            });
        }else{
            thread.messages.push({role: "user" , content: message});
        }

        const aiResponse = await getOpenAiResponse(message);

        thread.updatedAt = Date.now();

        thread.messages.push({role: "assistant" , content: aiResponse});

        await thread.save();

        res.json({reply: aiResponse});

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "something went wrong" });
    }
});

export default router;