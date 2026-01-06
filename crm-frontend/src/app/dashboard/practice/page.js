'use client'

import { useState } from 'react';

export default function Form(){

    const [fname, setFname] = useState("")
    const [file1, setFile1] = useState("")
    const [file2,setFile2] = useState("")

    const handleSubmit = async() => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:5000/api/formSubmit',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({fname,file1,file2}),
                credentials: "include"
            })

            const data = await response.json()

            if(data.success == false){
                console.log("ERROR : ",data.message);
                return
            }

            console.log("SUCCESSFUL : ",data.message);
            
        } catch (error) {
            console.log("ERRROR : ",error.message);
        }
        
    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" value={fname} onChange={e => setFname(e.target.value)}/>

                <input type="file" value={file1} onChange={e => setFile1(e.target.value)}/>

                <input type="file" value={file2} onChange={e => setFile2(e.target.value)}/>

                <input type="submit" value="Submit" />
            </form>
        </>
    )
}