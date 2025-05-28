"use client"
import AddDoctorModal from "@/components/AddDoctorModal";
import DoctorsTable from "@/components/DoctorsTable";
import { addDoctor, deleteDoctor, getAllDoctors } from "@/services/api/userRequests";
import { UserContext } from "@/services/context/UserContext";
import { Button} from "antd";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

function doctors() {
    const {user} = useContext(UserContext);
    const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
    const [doctors,setDoctors] = useState([])
    const router = useRouter();
  
    useEffect(()=>{
      if(!user){
        router.push("/login");
      }else if(!user.isAdmin){
        router.push("/");
      }else{
        getAllDoctors()
        .then(res=>{
          setDoctors(res.map(doctor=>{
            doctor.key = doctor.id
            return doctor
          }).reverse())
        })
        .catch(err=>{
          toast.error(err.response.data)
        })
      }
    },[])

    function handleDeleteDoctor(id){
      deleteDoctor(id)
      .then(res => {
        const id = res.id
        setDoctors(doctors.filter(doctor=>doctor.id!==id));
        toast.success(res.message);
      })
      .catch(err=>{
        setDoctors(doctors.filter(doctor=>doctor.id!==id));
        toast.error(err.response.data);
      })
    }

    function handleAddDoctor(data){
      addDoctor(data)
      .then(res => {
        setDoctors([{...res.user,key:res.user.id}, ...doctors]);
        toast.success(res.message);
      })
      .catch(err=>{
        toast.error(err.response?.data || 'Bir xəta baş verdi!');
      })
    }



    const showAddDoctorModal = () => {
        setIsAddDoctorModalOpen(true);
    };

    const handleAddDoctorCancel = () => {
        setIsAddDoctorModalOpen(false);
    };

    if(!user){
        return null;
    }
    if(!user?.isAdmin){
        return null;
    }

  return (
    <main>
      <section id="buttons&modals" className="container mx-auto py-9">
          <>
            <div id="buttons" className="flex gap-6">
              <Button type="primary" onClick={showAddDoctorModal}>Həkim əlavə et</Button>
            </div>

            <div id="modals">
              <AddDoctorModal isAddDoctorModalOpen={isAddDoctorModalOpen} handleAddDoctorCancel={handleAddDoctorCancel} handleAddDoctor={handleAddDoctor} />
            </div>
          </>
          
        </section>

        
      <section id="Patients" className="container mx-auto">
        <DoctorsTable doctors={doctors} handleDeleteDoctor={handleDeleteDoctor}/>
      </section>
    </main>
  )
}

export default doctors
