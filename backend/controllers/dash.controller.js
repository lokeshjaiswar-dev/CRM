import pool from "../config/database.js";
import { verifyToken } from "../utils/jwtToken.js";

export const getAllDashData = async(req,res) => {
    try {
        const {token} = req.body

        // console.log(token);

        const user = verifyToken(token);

        const [staff] = await pool.execute("select * from users where company_id=?",[user.company_id])

        const staffNo = staff.length

        const [company] = await pool.execute('select company_name from companies where id=?', [user.company_id])

        const companyName = company[0].company_name

        const [lead] = await pool.execute('select lead_name from leads where company_id=?',[user.company_id])

        const leadNo = lead.length

        res.status(201).json({
            "success": true,
            "message": "Dashboard data sended",
            "user" : {
                "company": companyName,
                "staffNo": staffNo || 0,
                "leadsNo":leadNo || 0
            }
        })
    } 
    catch (error) {
        console.log("ERROR : ",error);

        res.status(400).json({
            "success":false,
            "message":"Error while retrieving data using token"
        })       
    }  
}