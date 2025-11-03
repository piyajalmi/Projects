require('dotenv').config();

console.log("🔍 Azure Connection:", process.env.AZURE_STORAGE_CONN ? "Loaded ✅" : "Missing ❌");


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors= require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const StudentRouter = require('./Routes/StudentRouter');
const ProjectRouter = require('./Routes/ProjectRouter');
const AdminRouter = require('./Routes/AdminRouter');


require('./Models/db');

const PORT = process.env.PORT || 5000;


app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());  //another port request can be allows(open to everone), u can also specify limited port to send request
app.use('/auth', AuthRouter);
app.use('/api/projects', ProjectRouter);
app.use('/admin', AdminRouter);
app.use('/student', StudentRouter); 
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
