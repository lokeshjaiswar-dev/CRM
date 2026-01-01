import {verifyToken} from "../utils/jwtToken.js"
import pool from "../config/database.js"

const viewType = async(req,res) => {
    try {
        const {token} = req.body
    
        // console.log(token);
        
        if(!token){
            return res.status(400).json({
                'success': false,
                'message': "Token is required"
            })
        }
    
        const decodedToken = verifyToken(token)
    
        if(decodedToken.role != "owner"){
            return res.status(400).json({
                'success': false,
                'message': "Only owner is allowed for this action"
            })
        }

        const [result] = await pool.execute("select * from lead_type")

        if(result.length == 0){
            return res.status(400).json({
                'success': false,
                'message': "Unable to fetch data from db"
            })
        }

        res.status(201).json({
            'success': true,
            "message": "Data fetched",
            "data": result
        })

    } catch (error) {
        console.log("ERROR : ", error.message);
        res.status(500).json({
            'success': false,
            'message': "Something went wrong while getting type of leads"
        })        
    }

}

const addType = async(req,res) => {

}

const removeType = async(req,res) => {

}

const updateType = async(req,res) => {

}

export {viewType, addType, removeType, updateType}