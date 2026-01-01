'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

export default function LeadPage() {
  const [leads, setLeads] = useState([])
  const [message, setMessage] = useState("")

  const fetchLeads = async () => {
    const userData = JSON.parse(localStorage.getItem("user"))
    
    try {
      const response = await fetch('http://localhost:5000/api/lead/all', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "token": userData.token }),
        credentials: "include"
      })

      const data = await response.json()

      if (data.success) {
        setLeads(data.data)  
        setMessage("Leads loaded successfully")
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      console.log("Error:", error)
      setMessage("Failed to load leads")
    }
  }

  const updateStatus = async (leadId, newStatusId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"))
      
      const response = await fetch('http://localhost:5000/api/lead/updateStatus', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: leadId,
          newStatusId: newStatusId,
          token: userData.token
        })
      })

      const data = await response.json()

      if (data.success) {

        setLeads(prevLeads => 
          prevLeads.map(lead => {
            if (lead.id === leadId) {
              return {
                ...lead,
                lead_status_id: newStatusId,  
                status_name: getStatusName(newStatusId) 
              }
            }
            return lead
          })
        )
        setMessage("Status updated!")
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      console.log("Error:", error)
      setMessage("Failed to update status")
    }
  }

  const getStatusName = (id) => {
    const names = {
      1: "new",
      2: "contacted", 
      3: "won",
      4: "lost"
    }
    return names[id] || "unknown"
  }

  useEffect(() => {
    fetchLeads()
  }, [])


  return (
    <div className={styles.container}>
      <div className={styles.leadHeader}>
          <h1 className={styles.title}>Leads Dashboard</h1>
          <Link href='/dashboard/lead/add' className={styles.button}>Add New Lead</Link>
      </div>
      
      <div className={styles.tableContainer}>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Assigned To</th>
              <th>Current Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id}>
                <td>{lead.lead_name}</td>
                <td>{lead.lead_company}</td>
                <td>{lead.fname} {lead.lname}</td>
                <td>{lead.status_name}</td>
                <td>
                  <select 
                    value={lead.lead_status_id}
                    onChange={(e) => updateStatus(lead.id, Number(e.target.value))}
                    className={styles.select}
                  >
                    <option value="1" className={styles.select}>New</option>
                    <option value="2" className={styles.select}>Contacted</option>
                    <option value="3" className={styles.select}>Won</option>
                    <option value="4" className={styles.select}>Lost</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {message && <p>{message}</p>}
      </div>
      
      {/* {leads.length === 0 && <p>No leads found</p>} */}
    </div>
  )
}