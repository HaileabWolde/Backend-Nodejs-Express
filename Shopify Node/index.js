require('dotenv').config()
require('express-async-errors')
const express = require('express')
const connectDB = require('./config/dbConnect')
const authRoute = require('./routes/authRoute')
const ProductRoute = require('./routes/ProductRoute')
const BlogRoute = require('./routes/BlogRoute')
const CategoryRoute = require('./routes/CategoryRoute')
const BrandRoute = require('./routes/BrandRoute')
const CouponRoute = require('./routes/CouponRoute')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const app = express()


const PORT = process.env.PORT || 4000;

const notFoundMiddleware = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use("/api/user", authRoute)
app.use('/api/Product', ProductRoute)
app.use('/api/Blog', BlogRoute )
app.use('/api/Category', CategoryRoute)
app.use('/api/blogCategory', CategoryRoute)
app.use('/api/Brand', BrandRoute)
app.use('/api/Coupoun', CouponRoute)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI)
      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();
  