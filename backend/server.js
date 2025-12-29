import Groq from "groq-sdk";
import "dotenv/config";

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function run() {
    const completion = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            { role: "user", content: "Tell me a joke related to Computer Science" }
        ],
    });

    console.log(completion.choices[0].message.content);
}

run();
