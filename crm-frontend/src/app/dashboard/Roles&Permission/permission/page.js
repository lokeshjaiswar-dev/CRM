'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from './page.module.css'

export default function Roles(){

    const router = useRouter()

    const [visible,setVisible] = useState(false);
    const [user,setUser] = useState(null)
    const [permission_name, setPermission_name] = useState("")
    const [status,setStatus] = useState(true)
    const [permissionId, setPermissionId] = useState(null)
    const [permissionData, setPermissionData] = useState([
        {id: 1, permission_name: "Add Lead", status: true}
    ])

    useEffect(() => {

        const userFromLocal = JSON.parse(localStorage.getItem("user"))

        if(!userFromLocal || !userFromLocal.token){
            router.push("/")
            return
        }

        setUser(userFromLocal)
        fetchData(userFromLocal.token)
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

            setPermissionData(data.data)

        } catch (error) {
            console.log("ERROR : ", error.message);
        }
    }

    const addPermission = async(e) => {
        e.preventDefault()

        try {
            const response = await fetch("http://localhost:5000/api/permission/add",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({permission_name, status, token: user.token}),
                credentials: "include"
            })

            const data = await response.json()

            if(data.success == false){
                console.log("Something went wrong in the backend", data.message);
                return
            }

            setPermission_name("")
            setStatus(true)
            setVisible(false)

            fetchData(user.token)

        } catch (error) {
            console.log("ERROR : ", error.message);
        }
    }

    const toggleStatus = async(id, oldStatus) => {
        try {
            const newStatus = !oldStatus;

            const response = await fetch("http://localhost:5000/api/permission/updateStatus",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id, status: newStatus}),
                credentials: "include"
            })

            const data = await response.json()

            if(data.success == false){
                console.log("Something went wrong in the backend ",data.message);
                return
            }

            setPermissionData(
                prevData => prevData.map(
                    permission => permission.id == id
                        ? { ...permission , status: newStatus }
                        : permission
                )
            )

        } catch (error) {
            console.log("ERROR : ", error.message);
        }
    }
    
    return(
       <>
        {visible && (
                <div className={styles.form}>
                    <div className={styles.formhead}>
                        <div className={styles.heading}>
                            Add Permission
                        </div>
                        <div className={styles.cross}>
                            <button onClick={() => setVisible(false)}>x</button>
                        </div>
                    </div>

                    <form className={styles.inputs} onSubmit={addPermission}>
                        <input 
                            type="text"
                            placeholder="Enter Permission Name"
                            required
                            value={permission_name}
                            onChange={(e) => setPermission_name(e.target.value)}
                            className={styles.input}
                        />

                        <select 
                            value={status}
                            onChange={(e) => setStatus(e.target.value === 'true')}
                            className={styles.select}
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>

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
                                Permission Section
                            </div>
                            <div className={styles.button}>
                                <button onClick={() => setVisible(true)}>Add Permission</button>
                            </div>
                        </div>

                        <div className={styles.tablebox}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Sr No</th>
                                        <th>Permission Name</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {permissionData && permissionData.length > 0 ? (
                                        permissionData.map((permission) => (
                                            <tr key={permission.id}>
                                                <td>{permission.id}</td>
                                                <td>{permission.permission_name}</td>
                                                <td 
                                                    style={{ 
                                                        cursor: 'pointer',
                                                        color: permission.status ? 'green' : 'red'
                                                    }}
                                                    onClick={() => toggleStatus(permission.id, permission.status)}
                                                >
                                                    {permission.status ? 'Active' : 'Inactive'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center">
                                                No permissions found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
       </>        
    )
}