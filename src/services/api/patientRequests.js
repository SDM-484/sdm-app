import axios from "axios";
import BASE_URL from "./BASE_URL";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export async function getPatients(){
    let res = await api.get("/patients")
    
    return res.data
}
export async function getPatientById(id){
    let res = await api.get("/patients/"+id)
    
    return res.data
}
export async function deletePatient(id){
    let res = await api.delete("/patients/"+id)
    
    return res.data
}
export async function addPatient(data){
    let res = await api.post("/patients",data)
    
    return res.data
}