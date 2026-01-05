import pool from "../config/database.js"
import { verifyToken } from "../utils/jwtToken.js"

const addPermission = async(req,res) => {
    try {
        
        const {permission_name , status , token} = req.body

        if(!permission_name || status == undefined || !token){
            return res.status(400).json({
                'status': false,
                'message': "All inputs are required"
            })
        }

        // console.log(permission_name, status);
        
        const decodedToken = verifyToken(token)

        if(decodedToken.role !== 'owner'){
            return res.status(400).json({
                'success': false,
                'message': "Only owner can add Permissions"
            })
        }

        const [result] = await pool.execute("insert into permissions(created_by, company_id, permission_name, status) values (?,?,?,?)",[decodedToken.id, decodedToken.company_id, permission_name, status])

        if(result.affectedRows === 0){
            return res.status(400).json({
                'success': false,
                'message': "Something went wrong while inserting data in db"
            })
        }

        res.status(200).json({
            "success": true,
            'message': "Data inserted in db"
        })

    } catch (error) {
        console.log("ERROR : ", error.message);
        res.status(500).json({
            "success": false,
            'message': "Something went wrong"
        })   
    }   
}

const allPermissions = async(req,res) => {
    try {
        
        const {token} = req.body

        if(!token){
            return res.status(400).json({
                "success": false,
                'message': "TOken is required"
            })
        }

        const decodedToken = verifyToken(token)

        const [result] = await pool.execute("select * from permissions where company_id = ? ORDER BY id ASC",[decodedToken.company_id])

        if(result.length === 0){
            return res.status(400).json({
                'success': false,
                'message': "Something went wrong while fetching data from db"
            })
        }

        res.status(200).json({
            "success": true,
            'message': "All Permissions fetched",
            "data": result
        })

    } catch (error) {
        console.log("ERROR : ", error.message);
        res.status(500).json({
            "success": false,
            'message': "Something went wrong"
        })   
    }
}

const updateStatus = async(req,res) => {
    try {
        const {id, status} = req.body

        console.log(id, status, typeof(status));
        

        if(!id || status == undefined){
            return res.status(400).json({
                'success': false,
                'message': "All inputs are required"
            })
        }

        // const dbStatus = status ? 1 : 0;

        const [result] = await pool.execute("update permissions set status = ? where id = ? ", [status, id])

        if(result.affectedRows === 0){
            return res.status(400).json({
                'success': false,
                'message': "Not updated in db"
            })
        }

        res.status(200).json({
            'success': true,
            'message': "Status Updated"
        })
        
    } catch (error) {
        console.log("ERROR : ", error.message);
        res.status(400).json({
            'success': false,
            "message": "Something went wrong"
        })
        
    }
}

export {addPermission,allPermissions,updateStatus}