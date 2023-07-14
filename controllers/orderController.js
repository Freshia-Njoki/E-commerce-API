import sql from 'mssql';
import config from '../db/config.js';

//Get all orders
export const getOrders = async (req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT * FROM Orders");
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(201).json({ error: 'an error occurred while retrieving orders' });
    } finally {
        sql.close();
    }
};

//Get a single order
export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM Orders WHERE id = @id");
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving an order' });
    } finally {
        sql.close();
    }
};

//Create a new order
export const createOrder = async (req, res) => {
    try {
      const { user_id, total_amount, status } = req.body;
      const pool = await sql.connect(config.sql);
        const result = await pool.request()
        .input('user_id', sql.Int, user_id)
        .input('total_amount', sql.Decimal(10, 2), total_amount)
        .input('status', sql.VarChar(50), status)
            .query("INSERT INTO Orders (user_id, total_amount, status) values (@user_id, @total_amount, @status)");
        res.status(200).json({ message: 'order created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating an order' });
    } finally {
        sql.close();
    }
};

//Update a order
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        let pool = await sql.connect(config.sql);
        await pool.request()
            .input("id", sql.Int, id)
            .input("status", sql.VarChar, status)
            .query("UPDATE Orders SET status = @status WHERE id = @id;");
        res.status(200).json({ message: 'order updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating an order' });
    } finally {
        sql.close();
    }
};

//Delete a order
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await sql.connect(config.sql);
        await sql.query`DELETE FROM Orders WHERE id = ${id}`;
        res.status(200).json({ message: 'order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting an order' });
    } finally {
        sql.close();
    }
};