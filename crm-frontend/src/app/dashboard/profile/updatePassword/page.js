'use client'

import { useState } from "react"

export default function () {
    
    const [password, setPassword] = useState("")
    const [cpassword, setCpassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [message,setMessage] = useState("")

    const handleSubmit = async(e) => {
        e.preventDefault()
        setMessage("")

        const userData = JSON.parse(localStorage.getItem('user'))

        try {
            const response = await fetch('http://localhost:5000/api/auth/updatePassword',{
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({password, newPassword, cpassword,id: userData.id}),
                credentials: "include"
            })

            const data = await response.json()

            if(data.success == false){
                setMessage(data.message)
                return
            }

            setMessage(data.message)
            
        } catch (error) {
            console.log("ERROR: "+error.message)
            setMessage(error.message)   
        }
    }

  return (
    <>
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="Enter the current Password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <input 
                type="text"
                placeholder="Enter the New Password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
            />
            <input 
                type="text"
                placeholder="Enter the New Confirm Password"
                required
                value={cpassword}
                onChange={e => setCpassword(e.target.value)}
            />

            <input type="submit" value="Change Password" />
        </form>

        <h3>{message}</h3>
    </>
  )
}
