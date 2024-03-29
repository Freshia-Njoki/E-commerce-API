//re-routes the response
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct, getPaymentIntent } from "../controllers/productController.js";
import { createOrder, deleteOrder, getOrder, getOrders, updateOrder, revenue, savings, getOrderWithStatus, getTotalOrdersCount  } from "../controllers/orderController.js";
import { createOrderItem, deleteOrderItem, getOrderItem, getOrderItems, updateOrderItem } from "../controllers/orderItemsController.js";
import { register, login, loginRequired } from "../controllers/userController.js";
import { admin_register, admin_login, LoginRequired } from "../controllers/adminController.js";
import { shipping } from "../controllers/shippingController.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join( __dirname, '../public/uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

// Define file filter to restrict file types
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and GIF files are allowed.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });



const routes = (app) => {
    app.route('/products')
    .get( getProducts)
    .post(upload.single('image') ,createProduct);
    app.route('/products/:id')
    //protect with LoginRequired
    .get( getProduct)
    .delete( deleteProduct)
    .put(updateProduct);

    app.route('/orders')
    .get(getOrders)
    .post(LoginRequired, createOrder)

    app.route('/orders/:id')
    .get(LoginRequired, getOrder)
    .delete(LoginRequired, deleteOrder)
    .put(LoginRequired, updateOrder);

   app.route('/orders/status')
    .post(getOrderWithStatus);
    
    app.get('/totalOrdersCount', getTotalOrdersCount);

    app.route('/order')
    .get(getOrderItems)
    .post(createOrderItem);
    app.route('/order/:id')
    .get(getOrderItem)
    .delete(deleteOrderItem)
    .put(updateOrderItem);

    //auth routes
    app.route('/auth/register')
    .post(register)

    app.route('/auth/login')
    .post(login)

    app.route('/auth/adminRegister')
    .post(admin_register)

    app.route('/auth/adminLogin')
    .post(admin_login)

    app.get('/revenue', revenue);
    app.get('/savings', savings);
    app.get('/shipping', shipping);


}


export default routes;