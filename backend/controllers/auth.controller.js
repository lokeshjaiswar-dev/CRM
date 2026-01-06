import pool from "../config/database.js"
import bcrypt from "bcrypt"
import { generateToken,verifyToken } from "../utils/jwtToken.js"

const login = async(req,res) => {
    try {
        const {email, password} = req.body
    
        if(!email || !password){
            return res.status(400).json({
                'success': false,
                'message': 'Enter all the deatils'
            })
        }
    
        const [result] = await pool.execute(
            `
                select u.*,c.company_name
                from users u
                join companies c on u.company_id = c.id
                where u.email = ?
            ` , 
            [email]
        );

        if(result.length === 0){
            return res.status(400).json({
                'success': false,
                'message': 'No data found in the database'
            })
        }

        const user = result[0]

        const isPasswordCorrect = await bcrypt.compare(password, user.password) 

        if(!isPasswordCorrect){
            return res.status(400).json({
                'success': false,
                'message': 'Password not correct'
            })
        }

        const token = generateToken(user.id, user.company_id, user.role, user.company_name);

        res
        .status(201)
        .cookie('token',token)
        .json({
            'success':true,
            'message': "Login Successful",
            'user': {
                "id": user.id,
                "fname": user.fname,
                'lname': user.lname,
                'email':user.email,
                'phone':user.phone,
                'company':user.company,
                'role':user.role,
                'token':token
            }
        })

    } 
    catch (error) {
        res.status(500).json({
            'success': false,
            'message': 'Login Failed',
            'error' : error.message
        })
    }
}

const register = async(req,res) => {
    try {
            const {fname, lname, email, password, cpassword, phone, company_name} = req.body
        
            if(!fname || !lname || !email || !password || !cpassword || !phone || !company_name){
                return res.status(400).json({
                    'success': false,
                    'message': "Enter all the details"
                })
            }
        
            if(password !== cpassword){
                return res.status(400).json({
                    'success': false,
                    'message': "Password and Confirm Password should be same"
                })
            }

            const convertedNumber = Number(phone)

            if(isNaN(convertedNumber)){
                return res.status(400).json({
                    'success': false,
                    'message': "Phone number should be in digits"
                })                
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            
            const [insertCompany] = await pool.execute(
                'insert into companies(company_name) values (?)',
                [company_name]
            )
        
            if(insertCompany.affectedRows === 0){
                return res.status(400).json({
                    'success': false,
                    'message': 'Company Not inserted in Database'
                })
            }
        
            const companyId = insertCompany.insertId
        
            const [insertUser] = await pool.execute(
                "insert into users(company_id, fname, lname, email, password, phone, role) values (?,?,?,?,?,?,?)",
                [companyId, fname, lname, email, hashedPassword, phone, "owner"]
            );
        
            if(!insertUser.insertId){

                await pool.execute('delete from companies where id = ?', [companyId])

                return res.status(400).json({
                    'sucess': false,
                    'message': 'User not Inserted into database'
                })
            }
        
            res.status(201).json({
                'success': true,
                'message': 'User inserted succesfully'
            })
    } 
    catch (error) {
        console.log(error.message);

        if(error.code === 'ER_DUP_ENTRY'){
            return res.status(400).json({
                'success': false,
                'message': "Email, Phone or Company Name already exists"
            })
        }

        return res.status(400).json({
            "success": false,
            'message': "Registeration Failed",
            "error": error.message
        })
    }
}

const currentUser = async(req,res) => {
    try {
        const { token } = req.body
    
        const userfromToken = verifyToken(token)
    
        const [result] = await pool.execute(
            `
                select u.*,c.company_name
                from users u
                join companies c on u.company_id = c.id
                where u.id = ? 
            `
            ,[userfromToken.id])
    
        const user = result[0]
    
        res.status(201).json({
            "success": true,
            'message': "User Data Fetched Successfully",
            "user": {
                "fname": user.fname,
                "lname": user.lname,
                "email": user.email,
                "company_name": user.company_name,
                "phone": user.phone
            }
            })
    } catch (error) {
        console.log("Error: "+ error);
        res.status(400).json({
            'success': false,
            "message": "User Data not fetched"
        })
        
    }
}

const updateUser = async(req, res) => {
    try {
        const {fname,lname,email,phone,id} = req.body

        if(!fname || !lname || !email || !phone){
            return res.status(400).json({
                'success': false,
                'message': "Enter all the details"
            })
        }

        const [result] = await pool.execute("update users set fname=?, lname=?, email=?, phone=? where id=?", [fname,lname,email,phone,id])

        if(result.affectedRows === 0){
            return res.status(400).json({
                'sucess': false,
                'message': 'Data not updated in database'
            })
        }

        const [userFromDB] = await pool.execute("select * from users where id=?",[id])

        const user = userFromDB[0]

        const token = generateToken(user.id,user.company_id, user.role, user.company_name)

        res.status(201).json({
            'success': true,
            'message': "Data updated successsfully",
            "user":{
                "id": user.id,
                "fname": user.fname,
                "lname": user.lname,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                token
            }
        })
    } 

    catch (error) {
        console.log(error.message);
        res.status(500).json({
            "success":false,
            'message': "Something went wrong while inserting data in db"
        })
        
    }
}

const updatePassword = async(req, res) => {
    try {
        const {password, newPassword, cpassword, id} = req.body

        if(!password || !newPassword || !cpassword){
            return res.status(400).json({
                'success': false,
                'message': "Enter all the passwords"
            })
        }

        if(newPassword !== cpassword){
            return res.status(400).json({
                'success': false,
                'message': "New password and Confirm password should be same"
            })
        }

        const [result] = await pool.execute("select * from users where id=?",[id])

        const user = result[0]

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({
                'success': false,
                'message': "Enter the correct old password"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword,10)

        const [updatedPassword] = await pool.execute("update users set password=? where id=?",[hashedPassword,id])

        if(updatedPassword.affectedRows === 0){
            return res.status(400).json({
                'success': false,
                'message': "Data not updated in db"
            })
        }

        res.status(201).json({
            'success': true,
            'message': "Password Updated Successfully"
        })

    } 
    catch (error) {
        console.log("ERROR : ", error.message);

        res.status(500).json({
            'success': false,
            'message': "Something went wrong while updating password"
        })
    }
}


export {login, register, currentUser, updateUser, updatePassword}