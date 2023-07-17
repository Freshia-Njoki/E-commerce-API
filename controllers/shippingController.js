import sql from 'mssql';
import config from '../db/config.js';

export const shipping = async (req, res) => {
    try {
      let pool = await sql.connect(config.sql);
      const result = await pool.request().query('SELECT * FROM Shipping');
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving shipping records' });
    } finally {
      sql.close();
    }
  };
  