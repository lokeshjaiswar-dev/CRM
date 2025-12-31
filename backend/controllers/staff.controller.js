import pool from "../config/database.js"
import { generateToken,verifyToken } from "../utils/jwtToken.js"
import bcrypt from "bcrypt"

const getAllStaff = async(req,res) => {

    try {
        const { token } = req.body
    
        const userFromToken = verifyToken(token)
    
        const [result] = await pool.execute("select * from users where company_id=?",[userFromToken.company_id])
    
        if(result.length === 0){
            return res.status(400).json({
                "success": false,
                'message': "error while fetching data from database"
            })
        }

        res.status(201).json({
            "success": true,
            "message": "Data fetched Successfully",
            "user": result
        })
        
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            "success": false,
            "message": "Something went wrong while getting data"
        })
        
    }

}

const addStaff = async(req,res) => {
    try {
        const {fname, lname, email, role, phone ,token} = req.body

        if(!fname || !lname || !email || !role || !phone || !token){
            return res.status(400).json({
                'success':false,
                'message': "Enter all the details"
            })
        }

        const requestor = verifyToken(token)

        if(requestor.role !== 'owner'){
            return res.status(400).json({
                'success': false,
                "message": "Adding members in the company can only be done by owner of the company"
            })
        }

        const hashedPassword = await bcrypt.hash("user123",10)

        const [result] = await pool.execute("insert into users(company_id, fname, lname, email, password, phone, role) values (?,?,?,?,?,?,?)",[requestor.company_id, fname, lname, email, hashedPassword, phone, role])

        if(result.affectedRows === 0){
            return res.status(400).json({
                'success': false,
                'message': "Staff not added in database"
            })
        }

        res.status(201).json({
            'success': true,
            'message': "Staff Added Successfully"
        })

    } 
    catch (error) {
        console.log("ERROR : ", error.message);
        res.status(500).json({
            "success": false,
            "message": "Something went wrong while adding staff"
        })
    }
}

export {getAllStaff,addStaff}