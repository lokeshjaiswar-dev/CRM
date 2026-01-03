'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from './page.module.css'

export default function MasterPage() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState("")
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [type_name, setType_name] = useState("")
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
        fetchType(userFromLocal.token)
    }, [router])

    const fetchType = async(token) => {
        setMessage("")
        try {
            const response = await fetch("http://localhost:5000/api/master/allType",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({token}),
                credentials: "include"
            })

            const types = await response.json()

            if(types.success == false){
                setMessage(types.message)
                return
            }
            
            setData(types.data)
            setMessage(types.message)
            
        } catch (error) {
            console.log("ERROR : ",error.message);
            setMessage(error.message)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setMessage("")


        const url = editId 
            ? "http://localhost:5000/api/master/updateType"
            : "http://localhost:5000/api/master/addType"

   
        const requestBody = editId
            ? JSON.stringify({ id: editId, type_name, description })
            : JSON.stringify({ type_name, description })

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
            
       
            setType_name("")
            setDescription("")
            setEditId(null)
            setVisible(false)
            
      
            const userFromLocal = JSON.parse(localStorage.getItem("user"))
            fetchType(userFromLocal.token)

        } catch (error) {
            console.log("ERROR : "+error.message);
            setMessage(error.message)
        }
    }

    const handleUpdate = (id) => {
        const updateData = data.find(type => type.id == id)
        
        if(updateData) {
            setType_name(updateData.type_name)
            setDescription(updateData.description)
            setEditId(id)  
            setVisible(true)
        }
    }

    const handleDelete = async(id) => {
        if(!window.confirm("Are you sure you want to delete this type?")) {
            return
        }

        setMessage("")

        try {
            const response = await fetch("http://localhost:5000/api/master/deleteType",{
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
            fetchType(userData.token)

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
                            {editId ? "Edit Lead Type" : "Add Lead Type"}
                        </div>
                        <div className={styles.cross}>
                            <button onClick={() => {
                                setVisible(false)
                                setType_name("")
                                setDescription("")
                                setEditId(null)
                            }}>x</button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.inputs}>
                        <input 
                            type="text"
                            placeholder="Enter Type Name"
                            required
                            value={type_name}
                            onChange={e => setType_name(e.target.value)}
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
                            value={editId ? "Update Type" : "Add Type"} 
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
                                Type Of Leads
                            </div>
                            <div className={styles.button}>
                                <button onClick={() => {
                                    setType_name("")
                                    setDescription("")
                                    setEditId(null)
                                    setVisible(true)
                                }}>Add Type</button>
                            </div>
                        </div>

                        <div className={styles.tablebox}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Sr No</th>
                                        <th>Lead Type</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.map(type => (
                                        <tr key={type.id}>
                                            <td>{type.id}</td>
                                            <td>{type.type_name}</td>
                                            <td>{type.description}</td>
                                            <td>
                                                <button onClick={() => handleUpdate(type.id)}>Update</button>
                                                <button onClick={() => handleDelete(type.id)}>Delete</button>
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