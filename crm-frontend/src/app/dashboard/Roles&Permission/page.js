'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from './page.module.css'

export default function Roles(){

    const [visible,setVisible] = useState(false);
    const [role_name, setRole_name] = useState("")
    const [permissions,setPermissions] = useState([])
    const [selectedPermission, setSelectedPermission] = useState([])
    const [user,setUser] = useState("")
    const [roles,setRoles] = useState([])

    useEffect(() => {

        const userFromLocal = JSON.parse(localStorage.getItem("user"))

        if(!userFromLocal || !userFromLocal.token){
            router.push("/")
            return
        }

        setUser(userFromLocal)
        fetchData(userFromLocal.token)
        fetchRolesWithPermissions()
    }, [])

    const fetchData = async(token) => {

        try {
            const response = await fetch("http://localhost:5000/api/permission",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({token})
            })

            const data = await response.json()

            if(data.success == false){
                console.log("ERROR : ", data.message);
                return
            }

            const activePermissions = data.data.filter(perm => perm.status == true);

            // console.log("jjjj",activePermissions);

            setPermissions(activePermissions)

        } catch (error) {
            console.log("ERROR : ", error.message);
        }
    }

    const fetchRolesWithPermissions = async() => {
        try {
            const response = await fetch("http://localhost:5000/api/role",{
                method: "GET"
            })

            const data = await response.json()

            if(data.success == false){
                console.log("ERROR : ", data.message)
                return
            }

            // console.log(typeof(data.data[0].permissions));
            
            setRoles(data.data);

        } catch (error) {
            console.log("ERROR : ", error.message);
        }
    }

    const handleChecboxChange = (permissionId) => {
        setSelectedPermission(
            prevPermission => {
                if(prevPermission.includes(permissionId)){
                    return prevPermission.filter(id => id !== permissionId);
                }

                else{
                    return [...prevPermission, permissionId]
                }
            }
        )
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!role_name.trim()){
            console.log("Enter role name");
            return
        }

        if(selectedPermission.length === 0){
            console.log("Please select at least one permission");
            return
        }

        try {
            const response = await fetch("http://localhost:5000/api/role/addRole",{
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    role_name,
                    permission_ids: selectedPermission
                })
            });

            const data = await response.json()

            if(data.success == false){
                console.log("ERROR from backend", data.message);
                return
            }

            setRole_name("")
            setSelectedPermission([])

        } catch (error) {
            console.log("ERROR ", error.message);
        }
    }

    return(
       <>
        {visible && (
                <div className={styles.form}>
                    <div className={styles.formhead}>
                        <div className={styles.heading}>
                            Add Roles
                        </div>
                        <div className={styles.cross}>
                            <button onClick={() => setVisible(false)}>x</button>
                        </div>
                    </div>

                    <form className={styles.inputs} onSubmit={handleSubmit}>
                        <input 
                            type="text"
                            placeholder="Enter Role Name"
                            required
                            className={styles.input}
                            value={role_name}
                            onChange={e => setRole_name(e.target.value)}
                        />

                        {
                          permissions.map(
                            permission => (
                                <div key={permission.id}>
                                    <label>
                                        {permission.permission_name}
                                    </label>
                                    <input 
                                    type="checkbox"
                                    checked={selectedPermission.includes(permission.id)}
                                    onChange={() => handleChecboxChange(permission.id)}
                                    />
                                </div>
                            )
                          )  
                        }
                        <input 
                            type="submit" 
                            value="Add" 
                            className={styles.submit}
                        />
                    </form>
                </div>
            )}

            <div className={styles.container}>
                <div className={styles.box}>
                    <div className={styles.databox}>
                        <div className={styles.header}>
                            <div className={styles.title}>
                                Roles with their permissions
                            </div>
                            <div className={styles.button}>
                                <button onClick={() => setVisible(true)}>Add Roles</button>
                            </div>
                        </div>

                        <div className={styles.tablebox}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Sr No</th>
                                        <th>Role Name</th>
                                        <th>Permissions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        roles.map((role) => 
                                            <tr key={role.id}>
                                                <td>{role.id}</td>
                                                <td>{role.role_name}</td>
                                                <td>{role.permissions}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
       </>        
    )
}