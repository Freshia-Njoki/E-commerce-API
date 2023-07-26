import sql from 'mssql';
import config from '../db/config.js';

//Get all order Items
export const getOrderItems = async (req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT * FROM OrderItems");
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(201).json({ error: 'an error occurred while retrieving order Items' });
    } finally {
        sql.close(); 
    }
};

//Get a single order Item
export const getOrderItem = async (req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM OrderItems WHERE id = @id");
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving an order' });
    } finally {
        sql.close();
    }
};

//Create a new order Item
export const createOrderItem = async (req, res) => {
    try {
      const { order_id, product_id, quantity, price } = req.body;
      const pool = await sql.connect(config.sql);
      await pool.request()
        .input('order_id', sql.Int, order_id)
        .input('product_id', sql.Int, product_id)
        .input('quantity', sql.Int, quantity)
        .input('price', sql.Float, price)
            .query("INSERT INTO OrderItems (order_id, product_id, quantity, price) values (@order_id, @product_id, @quantity, @price)");
        res.status(200).json({ message: 'OrderItem created successfully' });
    } catch (error) {
        console.log(error);
        // res.status(500).json({ error: 'An error occurred while creating an order Item' });
    } finally {
        sql.close(); 
    }
};

//Update a order Item
export const updateOrderItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        let pool = await sql.connect(config.sql);
        await pool.request()
            .input("id", sql.Int, id)
            .input("quantity", sql.Int, quantity)
            .query("UPDATE OrderItems SET quantity = @quantity WHERE id = @id;");
        res.status(200).json({ message: 'updated the Order item quantity successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating an order item quantity' });
    } finally {
        sql.close();
    }
};

//Delete a order Item
export const deleteOrderItem = async (req, res) => {
    try {
        const { id } = req.params;
        await sql.connect(config.sql);
        await sql.query`DELETE FROM OrderItems WHERE id = ${id}`;
        res.status(200).json({ message: 'order item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting an order item' });
    } finally {
        sql.close();
    }
};