'use client'

import { Meera_Inimai } from "next/font/google"
import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from './page.module.css'

export default function LeadPage() {

  const [master, setMaster] = useState({})
  const [message, setMessage] = useState("")

  const [lead_email, setLead_email] = useState("")
  const [lead_name, setLead_name] = useState("")
  const [lead_phone, setLead_phone] = useState("")
  const [lead_address, setLead_address] = useState("")
  const [lead_company, setLead_company] = useState("")
  const [lead_type,setLead_type] = useState(0)
  const [lead_source,setLead_source] = useState(0)
  const [assigned_to, setAssigned_to] = useState(0)

  const [userData,setUserdata] = useState({})

  const router = useRouter()

  const fetchMasterData = async(userData) => {

    try {
      const response = await fetch("http://localhost:5000/api/lead/",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({"token": userData.token}),
        credentials: "include"
      })

      const data = await response.json()

      if(data.success == false){
        setMessage(data.message)
        return
      }

      const [users, leadTypes, leadSources, leadStatuses] = data.data
      
      setMaster({
        users,
        leadTypes, 
        leadSources,
        leadStatuses
      })

      setMessage(data.message)

    } 
    catch (error) {
      console.log("ERROR : ",error.message);
      setMessage(error.message)
    }
  }

  const handleSubmit = async(e) => {

    e.preventDefault()
    setMessage("")

    try {
    
      const response = await fetch('http://localhost:5000/api/lead/add',{
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          lead_name,
          lead_company,
          lead_email,
          lead_address,
          lead_phone,
          assigned_to: userData.role !== "staff" ? assigned_to : userData.id,
          lead_type,
          lead_source,
          "token": userData.token  
        }),
        credentials: "include"
      })

      const data = await response.json()

      if(data.success == false){
        setMessage(data.message)
        return
      }

      setMessage(data.message)

      router.push('/dashboard/lead')

    } 
    catch (error) {
      console.log("ERROR : ",error.message);
      setMessage(error.message)
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))

    if(user){
      setUserdata(user)
      fetchMasterData(user)
    }
    else{
      router.push('/')
    }
  },[])

  return (
    <>
      <div className={styles.container}>
              <div className={styles.formBox}>
            <h1 className={styles.title}>Add Lead</h1>
            <form onSubmit={handleSubmit} className={styles.form}>

            <input 
              type="text"
              placeholder="Enter the Lead name"
              value={lead_name}
              onChange={(e) => setLead_name(e.target.value)}
              required 
              className={styles.input}
            />

            <input 
              type="text"
              placeholder="Enter the company name"
              value={lead_company}
              onChange={(e) => setLead_company(e.target.value)}
              required 
              className={styles.input}
            />

            <input 
              type="text"
              placeholder="Enter the company's email"
              value={lead_email}
              onChange={(e) => setLead_email(e.target.value)}
              required 
              className={styles.input}
            />

            <input 
              type="text"
              placeholder="Enter the company's address"
              value={lead_address}
              onChange={(e) => setLead_address(e.target.value)}
              required 
              className={styles.input}
            />

            <input 
              type="text"
              placeholder="Enter the company's phone no"
              value={lead_phone}
              onChange={(e) => setLead_phone(e.target.value)}
              required 
              className={styles.input}
            />

            {
              userData.role != "staff" && 
              (
                <>
                  <label className={styles.label}> Assigned To  </label>
                  <select value={assigned_to} onChange={e => setAssigned_to(Number(e.target.value))} className={styles.select}>
                        <option value={0}>Select Name</option>
                        {
                          master.users?.map((user) => (
                                <option key={user.id} value={user.id}>
                              {user.fname} {user.lname}
                                </option>
                          ))
                        }
                  </select>
                </>
              )
            }

            <label className={styles.label}>Lead Type</label>
            <select value={lead_type} onChange={(e) => setLead_type(Number(e.target.value))} className={styles.select}>
                <option value={0}>Select Type</option>
                {
                  master.leadTypes?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type_name}
                    </option>
                  ))
                }
            </select>

            <label className={styles.label}>Lead Source</label>
            <select value={lead_source} onChange={(e) => setLead_source(Number(e.target.value))} className={styles.select}>
                <option value={0}>Select Source</option>
                {
                  master.leadSources?.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.source_name}
                    </option>
                  ))
                }
            </select>

            {/* <label>Lead Status</label>
            <select value={lead_status} onChange={(e) => setLead_status(Number(e.target.value))}>
                <option value={0}>Select Status</option>
                {
                  master.leadStatuses?.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.status_name}
                    </option>
                  ))
                }
            </select> */}

            <input type="submit" value="Add Lead" className={styles.button} />
        </form>

        {message}
      </div>
      </div>
    </>
  )
}
