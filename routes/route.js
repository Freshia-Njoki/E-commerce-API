//re-routes the response
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/productController.js";
import { createOrder, deleteOrder, getOrder, getOrders, updateOrder, revenue, savings } from "../controllers/orderController.js";
import { createOrderItem, deleteOrderItem, getOrderItem, getOrderItems, updateOrderItem } from "../controllers/orderItemsController.js";
import { register, login, loginRequired } from "../controllers/userController.js";
import { admin_register, admin_login, LoginRequired } from "../controllers/adminController.js";
import { shipping } from "../controllers/shippingController.js";
import multer from 'multer'

const upload = multer({ dest: '../uploads/' })
const routes = (app) => {
    app.route('/products')
    .get(LoginRequired, getProducts)
    .post(upload.single('image') ,createProduct);
    app.route('/products/:id')
    .get(LoginRequired, getProduct)
    .delete(LoginRequired, deleteProduct)
    .put(LoginRequired, updateProduct);

    app.route('/orders')
    .get(loginRequired, getOrders)
    .post(loginRequired, createOrder)

    app.route('/orders/:id')
    
    .get(loginRequired, getOrder)
    .delete(loginRequired, deleteOrder)
    .put(loginRequired, updateOrder);

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