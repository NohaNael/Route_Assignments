import {authRouter,userRouter,msgRouter} from '../Modules/index.js'
const bootstrap=async(app,express)=>{
    app.use(express.json())
    
    app.get('/',(req,res)=>{
        return res.status(200).json({message:"welcome to saraha app"})
    })
    app.use('/api/v1/auth',authRouter)
    app.use('/api/v1/user',userRouter)
    app.use('/api/v1/messages',msgRouter)
    app.all('/*dummy',(req,res)=>{
        return res.status(404).json({message:"page not found"})
    })
}

export default bootstrap