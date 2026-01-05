import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js'
import staffRoutes from './routes/staff.routes.js'
import leadRoutes from './routes/lead.routes.js'
import dashRoutes from './routes/dash.routes.js'
import masterRoutes from './routes/master.routes.js'
import permissionRoutes from "./routes/permission.routes.js"
import roleRoutes from './routes/role.routes.js'

const app = express();

dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// app.options('*', cors());

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/lead', leadRoutes)
app.use('/api/dash', dashRoutes)
app.use('/api/master', masterRoutes)
app.use("/api/permission", permissionRoutes)
app.use("/api/role", roleRoutes)

app.get('/api/health', (req,res) => {
    res.json({
        'code': 'Hello World'
    })
})

app.use((req,res) => {
    // console.log(`The request url ${req.originalUrl} is not found`);
    
    res.status(400).json({
        'sucess': false,
        'message': `The request url ${req.originalUrl} is not found`
    })

})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})

