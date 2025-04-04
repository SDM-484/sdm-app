import axios from "axios";
import BASE_URL from "./BASE_URL";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export async function Login(username,password){
    let res = await api.post("/users/login",{username,password})
    return res.data
}

export async function Me(){
    let res = await api("/users/me")
    return res
}

export async function Logout(){
    let res = await api.post("/users/logout")

    return res.data
}

export async function getAllDoctors(){
    let res = await api.get("/users/doctors")
    
    return res.data
}
export async function getAllDoctorsNames(){
    let res = await api.get("/users/doctors/names")
    
    return res.data
}
export async function deleteDoctor(id){
    let res = await api.delete("/users/"+id)
    
    return res.data
}
export async function addDoctor(data){
    let res = await api.post("/users/doctors",data)
    
    return res.data
}