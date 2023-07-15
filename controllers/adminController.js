import sql from "mssql";
import config from "../db/config.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

export const LoginRequired = (req, res, next) => {
    if (req.admin) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized admin!' });
    }

}

export const admin_register = async (req, res) => {
    
    const { admin_name, phone_no, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      const adminCon = await sql.connect(config.sql);
      const result = await adminCon
        .request()
        .input("admin_name", sql.VarChar, admin_name)
        .input("phone_no", sql.VarChar, phone_no)
        .input("email", sql.VarChar, email)
        .query("SELECT * FROM Admin WHERE admin_name = @admin_name OR email = @email");
      const admin = result.recordset[0];
     
      if (admin) {
        res.status(409).json({ error: "admin already exists" });
      } else {
        let pool = await sql.connect(config.sql);
        await pool
          .request()
          .input("admin_name", sql.VarChar, admin_name)
          .input("phone_no", sql.VarChar, phone_no)
          .input("email", sql.VarChar, email)
          .input("password", sql.VarChar, hashedPassword)
        
          .query(
            "INSERT INTO Admin (admin_name, phone_no, email, password) VALUES (@admin_name, @phone_no, @email, @password)"
          );
        res.status(200).send({ message: "admin created successfully " });
      }
  
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .send({ error: "an error occurred when trying to create an admin " });
    } finally {
      sql.close();
    }
  };


  export const admin_login = async (req, res) => {
   
    const { admin_name, email, password } = req.body;
    let pool = await sql.connect(config.sql);
    const result = await pool.request()
    .input("admin_name", sql.VarChar, admin_name)
    .input("email", sql.VarChar, email)
    .query("SELECT * FROM Admin WHERE admin_name = @admin_name AND email = @email");

    const admin = result.recordset[0];

    if (!admin) {
        res.status(401).json({ message:'Authentication failed. wrong credentials.' });
    } else {
        //if user is found go ahead and authenticate
        if (!bcrypt.compareSync(password, admin.password)) {
            res.status(401).json({ message:'Authentication failed. wrong credentials.' });
        } else {
            const token = `JWT ${jwt.sign( { admin_name: admin.admin_name, email: admin.email } , config.jwt_secret, { expiresIn: "1h"})}`;
            res.status(200).json({ id: admin.id, admin_name: admin.admin_name, email: admin.email, token: token });
        }

    }

};