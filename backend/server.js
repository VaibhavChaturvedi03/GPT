import express from 'express';
import "dotenv/config";
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(express.json()); //to parse incoming req
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});





