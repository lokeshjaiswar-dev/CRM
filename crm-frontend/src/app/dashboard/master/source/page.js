'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from './page.module.css'

export default function SourcePage() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState("")
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [source_name, setSource_name] = useState("")
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
        fetchSource(userFromLocal.token)
    }, [router])

    const fetchSource = async(token) => {
        setMessage("")
        try {
            const response = await fetch("http://localhost:5000/api/master/allSource",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({token}),
                credentials: "include"
            })

            const sources = await response.json()

            if(sources.success == false){
                setMessage(sources.message)
                return
            }
            
            setData(sources.data)
            setMessage(sources.message)
            
        } catch (error) {
            console.log("ERROR : ",error.message);
            setMessage(error.message)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setMessage("")


        const url = editId 
            ? "http://localhost:5000/api/master/updateSource"
            : "http://localhost:5000/api/master/addSource"


        const requestBody = editId
            ? JSON.stringify({ id: editId, source_name, description })
            : JSON.stringify({ source_name, description })

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
            

            setSource_name("")
            setDescription("")
            setEditId(null)
            setVisible(false)
            

            const userFromLocal = JSON.parse(localStorage.getItem("user"))
            fetchSource(userFromLocal.token)

        } catch (error) {
            console.log("ERROR : "+error.message);
            setMessage(error.message)
        }
    }

    const handleUpdate = (id) => {
        const updateData = data.find(source => source.id == id)
        
        if(updateData) {
            setSource_name(updateData.source_name)
            setDescription(updateData.description)
            setEditId(id)  
            setVisible(true)
        }
    }

    const handleDelete = async(id) => {
        if(!window.confirm("Are you sure you want to delete this source?")) {
            return
        }

        setMessage("")

        try {
            const response = await fetch("http://localhost:5000/api/master/deleteSource",{
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
            fetchSource(userData.token)

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
                            {editId ? "Edit Lead Source" : "Add Lead Source"}
                        </div>
                        <div className={styles.cross}>
                            <button onClick={() => {
                                setVisible(false)
                                setSource_name("")
                                setDescription("")
                                setEditId(null)
                            }}>x</button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.inputs}>
                        <input 
                            type="text"
                            placeholder="Enter Source Name"
                            required
                            value={source_name}
                            onChange={e => setSource_name(e.target.value)}
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
                            value={editId ? "Update Source" : "Add Source"} 
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
                                Source Of Leads
                            </div>
                            <div className={styles.button}>
                                <button onClick={() => {
                                    setSource_name("")
                                    setDescription("")
                                    setEditId(null)
                                    setVisible(true)
                                }}>Add Source</button>
                            </div>
                        </div>

                        <div className={styles.tablebox}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Sr No</th>
                                        <th>Lead Source</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.map(source => (
                                        <tr key={source.id}>
                                            <td>{source.id}</td>
                                            <td>{source.source_name}</td>
                                            <td>{source.description}</td>
                                            <td>
                                                <button onClick={() => handleUpdate(source.id)}>Update</button>
                                                <button onClick={() => handleDelete(source.id)}>Delete</button>
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