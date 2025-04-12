"use client"
import DicomViewer from '@/components/DicomViewer';
import { getPatientById } from '@/services/api/patientRequests';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import toast from 'react-hot-toast';

function Patient() {

  const {id} = useParams();
  const [patient,setPatient] = useState()
useEffect(()=>{
  getPatientById(id)
  .then(res=>{
    res.fileURLs = res.fileURLs.filter(file=>file.match(/.(jpeg|jpg|dcm)$/gm))
    setPatient(res);
  })
  .catch(err=>{
    toast.error(err.response.data)
  })
},[])
if(!patient){
  return <div className='mt-48 flex justify-center items-center'>
    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
  </div>
}
// console.log();
  return (
    <main>
      <section className='container mx-auto py-12'>
        <h1 className='text-[36px]'>Pasiyent: {patient.name} {patient.surname}</h1>
        <h2 className='text-[32px]'>Həkim: {patient.doctorsName}</h2>
        <h3 className='text-[24px]'>Çəkıliş Tarixi: {patient.date}</h3>
        <h3 className='text-[24px]'>Çəkılişin növü: {patient.type}</h3>

        <div id='views' className='flex flex-col gap-4 mt-6'>
        {patient.fileURLs.map((file,idx)=>{
          if(file.match(/.dcm$/gm)){
            return <DicomViewer key={idx} url={file} />
          }else{
            return <img key={idx} src={file} alt={`${patient.name} ${patient.surname}`} />
          }
        })}
        </div>
        

      </section>
    </main>
  )
}

export default Patient
