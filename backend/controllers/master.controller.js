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
    try {
        const {type_name, description} = req.body
        
        if(!type_name || !description){
            return res.status(400).json({
                'success': false,
                "message": "enter all the details"
            })
        }

        const [result] = await pool.execute("insert into lead_type(type_name,description) values (?,?)",[type_name, description])

        if(result.affectedRows == 0){
            return res.status(400).json({
                'success': false,
                'message': "No data inserted in db"
            })
        }

        res.status(200).json({
            'success': true,
            "message": "Data inserted successfully"
        })

    } catch (error) {
        console.log("ERROR : ",error.message);
        res.status(500).json({
            'success': false,
            "message": "Something went wrong"
        })
    }
}

const removeType = async(req,res) => {
    try {
        const {id} = req.body
    
        if(!id){
            return res.status(400).json({
                'success': false,
                'message': "Type Id not available"
            })
        }

        const [result] = await pool.execute("DELETE from lead_type where id = ?",[id])

        if(result.affectedRows == 0){
            return res.status(400).json({
                "success": false,
                "message": "Data not deleted"
            })
        }

        res.status(201).json({
            'success': true,
            'message': "Data deleted"
        })

    } catch (error) {
        console.log("ERROR : ",error.message);
        res.status(400).json({
            "success": false,
            'message': "Something weent wrong"
        })
    }


}

const updateType = async(req,res) => {
   try {
        const {id,type_name,description} = req.body
    
        if(!id || !type_name || !description){
            return res.status(400).json({
                "success": false,
                "message": "All the fields are required"
            })
        }

        const [result] = await pool.execute("update lead_type set type_name = ? , description = ? where id = ?",[type_name, description, id])

        if(result.affectedRows == 0){
            return res.status(400).json({
                'success': false,
                'message': "Data not updated"
            })
        }

        res.status(200).json({
            'success': true,
            'message': "data updated successfully"
        })

   } catch (error) {
        console.log("ERROR : ", error.message);
        res.status(400).json({
            'success': false,
            'message': "Something went wrong"
        })
   }
}

const viewSource = async(req,res) => {
    try {
        const {token} = req.body
    
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

        const [result] = await pool.execute("select * from lead_source")

        if(result.length == 0){
            return res.status(400).json({
                'success': false,
                'message': "Unable to fetch data from db"
            })
        }

        res.status(201).json({
            'success': true,
            "message": "Source data fetched successfully",
            "data": result
        })

    } catch (error) {
        console.log("ERROR : ", error.message);
        res.status(500).json({
            'success': false,
            'message': "Something went wrong while getting sources"
        })        
    }

}

const addSource = async(req,res) => {
    try {
        const {source_name, description} = req.body
        
        if(!source_name || !description){
            return res.status(400).json({
                'success': false,
                "message": "Please enter all the details"
            })
        }

        const [result] = await pool.execute(
            "insert into lead_source(source_name, description) values (?,?)",
            [source_name, description]
        )

        if(result.affectedRows == 0){
            return res.status(400).json({
                'success': false,
                'message': "No data inserted in database"
            })
        }

        res.status(200).json({
            'success': true,
            "message": "Source added successfully"
        })

    } catch (error) {
        console.log("ERROR : ",error.message);
        
        // Check for duplicate entry error
        if(error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                'success': false,
                "message": "Source name already exists"
            })
        }
        
        res.status(500).json({
            'success': false,
            "message": "Something went wrong while adding source"
        })
    }
}

const removeSource = async(req,res) => {
    try {
        const {id} = req.body
    
        if(!id){
            return res.status(400).json({
                'success': false,
                'message': "Source ID is required"
            })
        }

        const [result] = await pool.execute("DELETE from lead_source where id = ?",[id])

        if(result.affectedRows == 0){
            return res.status(400).json({
                "success": false,
                "message": "Source not found or already deleted"
            })
        }

        res.status(201).json({
            'success': true,
            'message': "Source deleted successfully"
        })

    } catch (error) {
        console.log("ERROR : ",error.message);
        res.status(500).json({
            "success": false,
            'message': "Something went wrong while deleting source"
        })
    }
}

const updateSource = async(req,res) => {
   try {
        const {id, source_name, description} = req.body
    
        if(!id || !source_name || !description){
            return res.status(400).json({
                "success": false,
                "message": "All fields are required"
            })
        }

        const [result] = await pool.execute(
            "update lead_source set source_name = ?, description = ? where id = ?",
            [source_name, description, id]
        )

        if(result.affectedRows == 0){
            return res.status(400).json({
                'success': false,
                'message': "Source not found or not updated"
            })
        }

        res.status(200).json({
            'success': true,
            'message': "Source updated successfully"
        })

   } catch (error) {
        console.log("ERROR : ", error.message);
        
        // Check for duplicate entry error
        if(error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                'success': false,
                "message": "Source name already exists"
            })
        }
        
        res.status(500).json({
            'success': false,
            'message': "Something went wrong while updating source"
        })
   }
}

const viewStatus = async(req,res) => {
    try {
        const {token} = req.body
    
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

        const [result] = await pool.execute("SELECT * FROM lead_status")

        if(result.length == 0){
            return res.status(400).json({
                'success': false,
                'message': "Unable to fetch data from db"
            })
        }

        res.status(201).json({
            'success': true,
            "message": "Status data fetched successfully",
            "data": result
        })

    } catch (error) {
        console.log("ERROR : ", error.message);
        res.status(500).json({
            'success': false,
            'message': "Something went wrong while getting statuses"
        })        
    }
}

const addStatus = async(req,res) => {
    try {
        const {status_name, description} = req.body
        
        if(!status_name || !description){
            return res.status(400).json({
                'success': false,
                "message": "Please enter all the details"
            })
        }

        const [result] = await pool.execute(
            "INSERT INTO lead_status(status_name, description) VALUES (?,?)",
            [status_name, description]
        )

        if(result.affectedRows == 0){
            return res.status(400).json({
                'success': false,
                'message': "No data inserted in database"
            })
        }

        res.status(200).json({
            'success': true,
            "message": "Status added successfully"
        })

    } catch (error) {
        console.log("ERROR : ",error.message);
        
        // Check for duplicate entry error
        if(error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                'success': false,
                "message": "Status name already exists"
            })
        }
        
        res.status(500).json({
            'success': false,
            "message": "Something went wrong while adding status"
        })
    }
}

const removeStatus = async(req,res) => {
    try {
        const {id} = req.body
    
        if(!id){
            return res.status(400).json({
                'success': false,
                'message': "Status ID is required"
            })
        }

        const [result] = await pool.execute("DELETE FROM lead_status WHERE id = ?",[id])

        if(result.affectedRows == 0){
            return res.status(400).json({
                "success": false,
                "message": "Status not found or already deleted"
            })
        }

        res.status(201).json({
            'success': true,
            'message': "Status deleted successfully"
        })

    } catch (error) {
        console.log("ERROR : ",error.message);
        res.status(500).json({
            "success": false,
            'message': "Something went wrong while deleting status"
        })
    }
}

const updateStatus = async(req,res) => {
   try {
        const {id, status_name, description} = req.body
    
        if(!id || !status_name || !description){
            return res.status(400).json({
                "success": false,
                "message": "All fields are required"
            })
        }

        const [result] = await pool.execute(
            "UPDATE lead_status SET status_name = ?, description = ? WHERE id = ?",
            [status_name, description, id]
        )

        if(result.affectedRows == 0){
            return res.status(400).json({
                'success': false,
                'message': "Status not found or not updated"
            })
        }

        res.status(200).json({
            'success': true,
            'message': "Status updated successfully"
        })

   } catch (error) {
        console.log("ERROR : ", error.message);
        
        // Check for duplicate entry error
        if(error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                'success': false,
                "message": "Status name already exists"
            })
        }
        
        res.status(500).json({
            'success': false,
            'message': "Something went wrong while updating status"
        })
   }
}

export {
    
    viewType, addType, removeType, updateType,

    viewSource, addSource, removeSource, updateSource,

    viewStatus, addStatus, removeStatus, updateStatus
}