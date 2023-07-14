import sql from "mssql";
import config from "../db/config.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

export const loginRequired = (req, res, next) => {
    if (req.user) {
        //if user is present can access the route method
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user!' });
    }

}

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const userCon = await sql.connect(config.sql);
    const result = await userCon
      .request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE username = @username OR email = @email");
    const user = result.recordset[0];
    //avoiding user duplicate- checking if the user exists
    if (user) {
      res.status(409).json({ error: "User already exists" });
    } else {
      let pool = await sql.connect(config.sql);
      await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("email", sql.VarChar, email)
        .input("password", sql.VarChar, hashedPassword)
        .query(
          "INSERT INTO Users (username, email, password) VALUES (@username, @email, @password)"
        );
      res.status(200).send({ message: "user created successfully " });
    }

  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ error: "an error occurred when trying to create a user " });
  } finally {
    sql.close();
  }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    let pool = await sql.connect(config.sql);
    const result = await pool.request()
    .input("username", sql.VarChar, username)
    .query("SELECT * FROM Users WHERE username = @username");
    const user = result.recordset[0];

    if (!user) {
        res.status(401).json({ message:'Authentication failed. wrong credentials.' });
    } else {
        //if user is found go ahead and authenticate
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(401).json({ message:'Authentication failed. wrong credentials.' });
        } else {
            const token = `JWT ${jwt.sign( { username: user.username, email: user.email } , config.jwt_secret, { expiresIn: "1h"})}`;
            res.status(200).json({ id: user.id, username: user.username, email: user.email, token: token });
        }

    }

};
