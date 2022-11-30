import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import config from './config'
import BuyerRoutes from './routes/buyer.routes';
// import OrderRoutes from './routes/order.routes';
import SellerRoutes from './routes/seller.routes';
// import BookRoutes from './routes/book.routes';
import SellersRoutes from './routes/sellers.routes';

const app = express();

app.set('port', config.port)

//middlewares
const corsOptions = {
 origin: config.corsOrigin
}
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//routes
app.get('/', (req, res) => {
 res.json({ message: "book-fair-server..." })
}
)

app.use('/api/seller/', SellerRoutes)
app.use('/api/buyer/', BuyerRoutes)
app.use('/api/sellers/', SellersRoutes)

export default app;