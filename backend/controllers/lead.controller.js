import pool from "../config/database.js"
import { verifyToken } from "../utils/jwtToken.js"

const getAllLead = async(req,res) => {
    try {
        const {token} = req.body
    
        const decodedToken = verifyToken(token)
    
        let query = `
            SELECT 
                leads.*, 
                users.fname, 
                users.lname, 
                lead_status.status_name, 
                lead_type.type_name, 
                lead_source.source_name 
            FROM leads
            JOIN users ON leads.assigned_to = users.id
            JOIN lead_status ON leads.lead_status_id = lead_status.id 
            JOIN lead_type ON leads.lead_type_id = lead_type.id 
            JOIN lead_source ON leads.lead_source_id = lead_source.id 
            WHERE leads.company_id = ?
        `
        
        const params = [decodedToken.company_id]
        
        if (decodedToken.role === 'staff') {
            
            query += ' AND leads.assigned_to = ?'
            params.push(decodedToken.id)

        } 
        
        const [result] = await pool.execute(query, params)
    
        if(result.length == 0){
            return res.status(400).json({
                'success': false,
                'message': 'No Leads found for your Company',
                'data': []
            })
        }
    
        res.status(201).json({
            'success': true,
            'message': "Leads fetched from db",
            "data": result
        })

    } catch (error) {
        console.log("ERROR : ", error.message);
        res.status(500).json({
            'success': false,
            'message': "Something went wrong while fetching leads"
        })
    }
}

const addLead = async(req,res) => {
    try {
        const {assigned_to, lead_name, lead_company, lead_email, lead_address, lead_phone, lead_type, lead_source, token} = req.body

        if(!assigned_to || !lead_name || !lead_company || !lead_email || !lead_address || !lead_phone || !lead_company || !lead_type || !lead_source || !token){
            return res.status(400).json({
                'success': false,
                'message': 'Enter all the details'
            })
        }

        // console.log(assigned_to, lead_name, lead_company, lead_email, lead_address, lead_phone, lead_type, lead_source, lead_status, token);

        const decodedToken = verifyToken(token) 

        const [result] = await pool.execute('insert into leads(created_by, assigned_to, company_id, lead_name, lead_email, lead_phone, lead_address, lead_company, lead_type_id, lead_source_id) values (?,?,?,?,?,?,?,?,?,?)',[decodedToken.id,assigned_to,decodedToken.company_id,lead_name,lead_email,lead_phone,lead_address,lead_company,lead_type,lead_source])

        if(result.affectedRows === 0){
            return res.status(400).json({
                'success': false,
                'message': "error while storing data in db"
            })
        }

        res.status(201).json({
            'success': true,
            'message': "Lead added Successfully"
        })
    } 
    catch (error) {
        console.log("ERROR : ",error.mesasge);
        res.status(400).json({
            'success': false,
            'message': "Something went wrong while adding lead"
        })
    }
}

const updateStatus = async(req,res) => {
    try {
        const {leadId, newStatusId, token} = req.body

        if(!leadId || !newStatusId || !token){
            return res.status(400).json({
                'success': false,
                'message': "All the parameters are required"
            })
        }

        const [result] = await pool.execute("update leads set lead_status_id=? where id=?",[newStatusId, leadId])

        if(result.affectedRows === 0){
            return res.status(400).json({
                "success": false,
                "message": "No status updated in db"
            })
        }

        res.status(201).json({
            "success": true,
            "message": "Status updated successfully",
            'data': {
                leadId,
                newStatusId
            }
        })

    } 
    catch (error) {
        console.log("ERROR : ", error.message);
        res.status(500).json({
            "success": false,
            'message': "Something went wrong while updating status"
        })
    }
}

const getAllDropdownData = async(req,res) => {
    try {
        const {token} = req.body
    
        if(!token){
            res.status(400).json({
                'success': false,
                'message': "Token is needed"
            })
        }
        const decodedUser = verifyToken(token)

        const [usersData] = await pool.execute("select id, fname, lname from users where company_id = ? ",[decodedUser.company_id])

        const [leadType] = await pool.execute("select id, type_name from lead_type")

        const [leadSource] = await pool.execute("select id, source_name from lead_source")

        const [leadStatus] = await pool.execute("select id, status_name from lead_status")

        res.status(201).json({
            'success': true,
            'message': "Master Data sended successfully",
            'data':[
                usersData, leadType, leadSource, leadStatus
            ]
        })
    } 
    catch (error) {
        console.log("ERROR : ", error.mesasge);

        res.status(500).json({
            'success': false,
            'message': 'Something went wrong while fetching data from master'
        })
    }

}

export {getAllLead, addLead, updateStatus, getAllDropdownData}