'use client'

import { useEffect, useState } from "react"

export default function UpdateUser() {

    const [fname,setFname] = useState("")
    const [lname,setLname] = useState("")
    const [email,setEmail] = useState("")
    const [phone,setPhone] = useState("")
    const [message,setMessage] = useState("")

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"))
        setFname(userData.fname || "")
        setLname(userData.lname || "")
        setEmail(userData.email || "")
        setPhone(userData.phone || "")
    },[])

    const handleSubmit = async(e) => {

        const userData = JSON.parse(localStorage.getItem('user'))

        e.preventDefault()
        setMessage("")

        try {
            const response = await fetch("http://localhost:5000/api/auth/updateUser",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({fname, lname, email, phone,id: userData.id}),
                credentials: "include"
            })

            const data = await response.json()

            if(data.success == false){
                setMessage(data.meesage)
                return
            }

            localStorage.setItem("user", JSON.stringify(data.user))

            setMessage(data.message)
            
        } 
        catch (error) {
            console.log(error.message);
            setMessage(error.meesage)
        }

    }

  return (
    <>
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="Enter your First Name"
                required
                value={fname}
                onChange={e => setFname(e.target.value)}
            />

            <input 
                type="text"
                placeholder="Enter your Last Name"
                required
                value={lname}
                onChange={e => setLname(e.target.value)}
            />

            <input 
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <input 
                type="text"
                placeholder="Enter your Phone no"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
            />

            <input type="submit" value="Update"/>
        </form>

        <h5>{message}</h5>
    </>
  )
}
