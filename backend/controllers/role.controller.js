import pool from "../config/database.js"
import { verifyToken } from '../utils/jwtToken.js'

const addRole = async(req,res) => {
    try {
        
        const {role_name, permission_ids} = req.body

        if(!role_name || !permission_ids){
            return res.status(400).json({
                'success': false,
                'message': "Role Name and permissions are required"
            })
        }

        const [result] = await pool.execute("insert into roles(role_name) values (?)",[role_name])

        if(result.affectedRows == 0){
            return res.status(400).json({
                'success':false,
                'message': "No data inserted in roles"
            })
        }

        const [roleFromDb] = await pool.execute("SELECT * from roles where id = ?",[result.insertId])

        const roleId = roleFromDb[0].id

        let insertedCount = 0;
        for(const permissionId of permission_ids){
            try {
                const [insertIntoRolesPermissions] = await pool.execute("insert into role_permissions(role_id, permission_id) values (?,?)", [roleId, permissionId])

                if(insertIntoRolesPermissions.affectedRows > 0){
                    insertedCount++;
                }

            } catch (error) {
                console.log("ERROR inserting permissions");
            }
        }

        res.status(201).json({
            'success': true,
            'message': "Role inserted",
            'data': {
                roleId,
                role_name,
                insertedCount
            }
        })

    } catch (error) {
        console.log("ERROR : ", error.message);
        res.status(500).json({
            'success': false,
            'message': 'Something went wrong'
        })
    }
}

const allRoleWithPermission = async(req,res) => {
    try {
        const [result] = await pool.execute(
            `
                select r.id,r.role_name, group_concat(permission_name) as permissions
                from role_permissions rp
                join roles r on rp.role_id = r.id
                join permissions p on rp.permission_id = p.id
                group by r.id;
            `
        )

        if(result.length == 0){
            return res.status(400).json({
                'success': false,
                'message': "something went wrong while fetching data from db"
            })
        }

        res.status(201).json({
            'success': true,
            'message': "Data fetched from db",
            'data': result
        })

    } catch (error) {
        console.log("ERROR : ", error.message);
        res.status(500).json({
            'success': false,
            'message': "Something went wrong"
        })
    }
}

export {addRole,allRoleWithPermission}