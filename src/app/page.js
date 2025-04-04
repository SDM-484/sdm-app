"use client"
import AddPatientModal from "@/components/AddPatientModal";
import PatientsTable from "@/components/PatientsTable";
import { addPatient, deletePatient, getPatients } from "@/services/api/patientRequests";
import { UserContext } from "@/services/context/UserContext";
import { Button} from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const {user} = useContext(UserContext);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [patients,setPatients] = useState([])

  useEffect(()=>{
    getPatients()
    .then(res=>{
      setPatients(res.map(patient=>{
        patient.key = patient._id
        return patient
      }))
    })
    .catch(err=>{
      toast.error(err.response.data)
    })
  },[])

  function handleDeletePatient(id){
    deletePatient(id)
    .then(res => {
      const id = res.id
      setPatients(patients.filter(patient=>patient._id!==id));
      toast.success(res.message);
    })
    .catch(err=>{
      toast.error(err.response.data);
    })
  }

  function handleAddPatient(values){
    addPatient(values)
    .then(res=>{
      res.user.key = res.user._id;
      setPatients([...patients,res.user])
      toast.success(res.message)
    })
    .catch(err=>{
      toast.error(err.response.data)
    })
  }

  const showAddPatientModal = () => {
    setIsAddPatientModalOpen(true);
  };

  const handleAddPatientCancel = () => {
    setIsAddPatientModalOpen(false);
  };
  
  if(!user){
    return null;
  }

  return (
    <main>
      {user?.isAdmin && 
        <section id="buttons&modals" className="container mx-auto py-9">
          <>
            <div id="buttons" className="flex gap-6">
              <Button type="primary" onClick={showAddPatientModal}>Pasiyent əlavə et</Button>
            </div>

            <div id="modals">
              <AddPatientModal handleAddPatient={handleAddPatient} isAddPatientModalOpen={isAddPatientModalOpen} handleAddPatientCancel={handleAddPatientCancel} />
            </div>
          </>
          
        </section>
      }

      <section id="Patients" className={`container mx-auto ${user?.isDoctor && "py-12"}`}>
        <PatientsTable patients={patients} handleDeletePatient={handleDeletePatient} />
      </section>

    </main>
  );
}
