//re-routes the response
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/productController.js";
import { createOrder, deleteOrder, getOrder, getOrders, updateOrder } from "../controllers/orderController.js";
import { createOrderItem, deleteOrderItem, getOrderItem, getOrderItems, updateOrderItem } from "../controllers/orderItemsController.js";
import { register, login, loginRequired } from "../controllers/userController.js";

const routes = (app) => {
    app.route('/products')
    .get(loginRequired, getProducts)
    .post(loginRequired, createProduct);
    app.route('/products/:id')
    .get(loginRequired, getProduct)
    .delete(loginRequired, deleteProduct)
    .put(loginRequired, updateProduct);

    app.route('/orders')
    .get(loginRequired, getOrders)
    .post(loginRequired, createOrder);
    app.route('/orders/:id')
    .get(loginRequired, getOrder)
    .delete(loginRequired, deleteOrder)
    .put(loginRequired, updateOrder);

    app.route('/order')
    .get(loginRequired, getOrderItems)
    .post(loginRequired, createOrderItem);
    app.route('/order/:id')
    .get(loginRequired, getOrderItem)
    .delete(loginRequired, deleteOrderItem)
    .put(loginRequired, updateOrderItem);

    //auth routes
    app.route('/auth/register')
    .post(register)

    app.route('/auth/login')
    .post(login)
}


export default routes;