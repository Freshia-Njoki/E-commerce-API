//routers logic
import sql from 'mssql'
import config from '../db/config.js'


//get all products
export const getProducts = async (req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT * FROM Products");
        
        res.status(200).json(result.recordset)
    } catch (error) {
        res.status(400).json({error: 'an error occurred when retrieving products'});
        
    } finally{
        sql.close();
    }
}

//create a product--"optimize" check if product exists then create one
export const createProduct = async (req, res) => {
    try {
      const { name, description, price, quantity } = req.body;
     
      const imagePath = `/public/uploads/${req.file.filename}`;
  
      let pool = await sql.connect(config.sql);
      let insertProduct = await pool
        .request()
        .input('name', sql.VarChar, name)
        .input('description', sql.VarChar, description)
        .input('price', sql.Float, price)
        .input('quantity', sql.Int, quantity)
        .input('imagePath', sql.VarChar, imagePath)
        .query(
          'INSERT INTO Products (name, description, price, quantity, image_path) VALUES (@name, @description, @price, @quantity, @imagePath)'
        );
        
  
  

  // Send the image URL along with other product data as a response
  res.json({
    message: 'Product successfully created',
    
  });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'An error occurred when creating a product' });
        console.log(error)
        
    } finally {
      sql.close();
    }
  };

//get a product
export const getProduct = async (req, res) => {
    try {
        const {id} = req.params;
         let pool = await sql.connect(config.sql);
         const result= await pool.request()
         .input('id', sql.VarChar, id)
         .query('SELECT * FROM Products WHERE id = @id');
         
         res.status(200).json(result.recordset[0]);//to get a single item outside an array
    } catch (error) {
        res.status(400).json({ error: "an error occurred while retrieving a product"})
        
    } finally {
        sql.close();
    }
}

//update a product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, price} = req.body;
        let pool = await sql.connect(config.sql);
        await pool.request()
        .input ('id', sql.VarChar, id)
        .input('description', sql.VarChar, description)
        .input('price', sql.Float, price)
        .query('UPDATE Products SET description = @description, price = @price WHERE id =@id')
        res.status(200).json({message: 'product updated successfully'})
        
    } catch (error) {
        res.status(400).json({ error: 'an error occurred while updating a product'})
        
    } finally {
        sql.close()
    }
};

//delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config.sql);
        await pool.request()
          .input('id', sql.VarChar, id)
          .query('DELETE FROM Products WHERE id = @id');
        res.status(200).json({ message: 'product deleted successfully' });
      } catch (error) {
        res.status(400).json({ error: 'an error occurred while deleting a product' });
      } finally {
        sql.close();
      }
      
};