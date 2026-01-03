'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from './page.module.css'

export default function StatusPage() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState("")
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [status_name, setStatus_name] = useState("")
    const [description, setDescription] = useState("")
    const [editId, setEditId] = useState(null) 

    useEffect(() => {
        const userFromLocal = JSON.parse(localStorage.getItem("user"))

        if(!userFromLocal){
            router.push('/login')
            return
        }

        if(userFromLocal.role != "owner"){
            router.push('/dashboard')
            return
        }
        
        setUser(userFromLocal)
        fetchStatus(userFromLocal.token)
    }, [router])

    const fetchStatus = async(token) => {
        setMessage("")
        try {
            const response = await fetch("http://localhost:5000/api/master/allStatus",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({token}),
                credentials: "include"
            })

            const statuses = await response.json()

            if(statuses.success == false){
                setMessage(statuses.message)
                return
            }
            
            setData(statuses.data)
            setMessage(statuses.message)
            
        } catch (error) {
            console.log("ERROR : ",error.message);
            setMessage(error.message)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setMessage("")

        
        const url = editId 
            ? "http://localhost:5000/api/master/updateStatus"
            : "http://localhost:5000/api/master/addStatus"

        
        const requestBody = editId
            ? JSON.stringify({ id: editId, status_name, description })
            : JSON.stringify({ status_name, description })

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: requestBody,
                credentials: "include"
            })

            const result = await response.json()

            if(result.success == false){
                setMessage(result.message)
                return
            }

            setMessage(result.message)
            
            
            setStatus_name("")
            setDescription("")
            setEditId(null)
            setVisible(false)
            
            
            const userFromLocal = JSON.parse(localStorage.getItem("user"))
            fetchStatus(userFromLocal.token)

        } catch (error) {
            console.log("ERROR : "+error.message);
            setMessage(error.message)
        }
    }

    const handleUpdate = (id) => {
        const updateData = data.find(status => status.id == id)
        
        if(updateData) {
            setStatus_name(updateData.status_name)
            setDescription(updateData.description)
            setEditId(id) 
            setVisible(true)
        }
    }

    const handleDelete = async(id) => {
        if(!window.confirm("Are you sure you want to delete this status?")) {
            return
        }

        setMessage("")

        try {
            const response = await fetch("http://localhost:5000/api/master/deleteStatus",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id}),
                credentials: "include"
            })

            const result = await response.json()

            if(result.success == false){
                setMessage(result.message)
                return
            }

            setMessage(result.message)

            const userData = JSON.parse(localStorage.getItem("user"))
            fetchStatus(userData.token)

        } catch (error) {
            console.log("ERROR : ", error.message);
            setMessage(error.message)
        }
    }

    return (
        <>
            {visible && (
                <div className={styles.form}>
                    <div className={styles.formhead}>
                        <div className={styles.heading}>
                            {editId ? "Edit Lead Status" : "Add Lead Status"}
                        </div>
                        <div className={styles.cross}>
                            <button onClick={() => {
                                setVisible(false)
                                setStatus_name("")
                                setDescription("")
                                setEditId(null)
                            }}>x</button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.inputs}>
                        <input 
                            type="text"
                            placeholder="Enter Status Name"
                            required
                            value={status_name}
                            onChange={e => setStatus_name(e.target.value)}
                            className={styles.input}
                        />

                        <input 
                            type="text"
                            placeholder="Enter Description"
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className={styles.input}
                        />

                        <input 
                            type="submit" 
                            value={editId ? "Update Status" : "Add Status"} 
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
                                Status Of Leads
                            </div>
                            <div className={styles.button}>
                                <button onClick={() => {
                                    setStatus_name("")
                                    setDescription("")
                                    setEditId(null)
                                    setVisible(true)
                                }}>Add Status</button>
                            </div>
                        </div>

                        <div className={styles.tablebox}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Sr No</th>
                                        <th>Lead Status</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.map(status => (
                                        <tr key={status.id}>
                                            <td>{status.id}</td>
                                            <td>{status.status_name}</td>
                                            <td>{status.description}</td>
                                            <td>
                                                <button onClick={() => handleUpdate(status.id)}>Update</button>
                                                <button onClick={() => handleDelete(status.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}