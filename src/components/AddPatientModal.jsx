import { Modal, Form, Input, Select, DatePicker, Button, message, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { getAllDoctorsNames } from '@/services/api/userRequests';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { addPatient } from '@/services/api/patientRequests';
import toast from 'react-hot-toast';

const { Option } = Select;

function AddPatientModal({isAddPatientModalOpen,handleAddPatientCancel,handleAddPatient}) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [doctors,setDoctors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const types = [
    "ORTOPANTOMOQRAFİYA",
    "LATERAL",
    "LATERAL+ANALİZ",
    "FRONTAL",
    "ƏL BİLƏK",
    "3D ALT ÇƏNƏ",
    "3D ÜST ÇƏNƏ",
    "3D ALT+ÜST TAM",
    "3D HİSSƏVİ ALT",
    "3D HİSSƏVİ ÜST",
    "3D ENDO (XÜSUSİ KEYFİYYƏTLİ)",
    "3D GİCGAH-ÇƏNƏ OYNAQLARI",
    "3D SİNUSLARIN ÇƏKİLİŞİ",
    "2D SİNUSLARIN ÇƏKİLİŞİ",
    "2D GİCGAH-ÇƏNƏ OYNAQLARI",
    "SCAN"
  ];

  // AWS S3 Client
  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    requestChecksumCalculation: "WHEN_REQUIRED",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
    }
  });


  useEffect(()=>{
    if(isAddPatientModalOpen){
      getAllDoctorsNames()
      .then(res=>{
        setDoctors(res);
      })
      .catch(err=>{
        toast.error(err.response.data)
      })
    }else{
      setFileList([])
    }
  },[isAddPatientModalOpen])

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const uploadToS3 = async (file) => {
    try {
      const fileKey = `patients/${Date.now()}_${file.name}`;
      
      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
        Key: fileKey,
        Body: file,
        ContentType: file.type,
      };

      await s3Client.send(new PutObjectCommand(params));
      return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw error;
    }
  };


  const onCreate = async (values) => {
    if (fileList.length === 0) {
      toast.error('Bir fayl seçin!');
      return;
    }
    setUploading(true);
    try {
      const uploadedFileURLs = await Promise.all(
        fileList.map((file) => uploadToS3(file.originFileObj))
      );
  
      values.date = new Date(values.date).toISOString().split('T')[0].split('-').reverse().join('.');
      
      const sendObj = {
        name: values.name,
        surname: values.surname,
        doctorsId: values.doctorsId,
        date: values.date,
        type: values.type,
        fileURLs: uploadedFileURLs
      };

      handleAddPatient(sendObj);

      handleAddPatientCancel();

    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data || 'Bir xəta baş verdi!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal 
    title="Pasiyent əlavə et" 
    okText={uploading ? 'Yüklənir...' : 'Əlavə et'}
    okButtonProps={{ loading: uploading, disabled: uploading, autoFocus: true, htmlType: 'submit' }}
    cancelText="Ləğv et"
    open={isAddPatientModalOpen} 
    onCancel={uploading?()=>{}:handleAddPatientCancel}
    destroyOnClose
    modalRender={dom => (
      <Form
        layout="vertical"
        form={form}
        name="addPatient"
        initialValues={{ modifier: 'public' }}
        clearOnDestroy
        onFinish={values => onCreate(values)}
      >
        {dom}
      </Form>
    )}
    >
        <Form.Item
          label="Pasiyentin adı"
          name="name"
          rules={[
            { required: true, message: 'Pasiyentin adını daxil edin!' },
            { min: 3, message: 'Pasiyentin adı 2 simvoldan uzun olmalıdır!' }
          ]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          label="Pasiyentin soyadı"
          name="surname"
          rules={[
            { required: true, message: 'Pasiyentin soyadını daxil edin!' },
            { min: 3, message: 'Pasiyentin soyadı 2 simvoldan uzun olmalıdır!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="doctorsId"
          label="Həkimin adı"
          rules={[{ required: true, message: 'Həkimin adını daxil edin!' }]}
        >
          <Select
            showSearch
            placeholder="Həkimin adı"
            optionFilterProp="label"
            // onChange={onChange}
            // onSearch={onSearch}
            options={doctors.map(doctor=>{
              return {
                value:doctor.id,
                label:`${doctor.name} ${doctor.surname}${doctor.hospital ? `(${doctor.hospital})`:""}`
              }
            })}
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="Faylın tipi"
          rules={[{ required: true, message: 'Faylın tipini daxil edin!' }]}
        >
          <Select placeholder="Faylın tipi">
            {types.map(type=><Option value={type}>{type}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item
          label="Çəkiliş tarixi"
          name="date"
          rules={[{ required: true, message: 'Çəkiliş tarixini daxil edin!' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="Çəkiliş faylı"
          name="file"
          rules={[{ required: true, message: 'Çəkiliş faylını daxil edin!' }]}
        >
          <Upload name="file"
            fileList={fileList}
            onChange={handleUploadChange}
            accept=".pdf,.jpg,.jpeg,.png,.dicom,.zip,.dcm,.txt,.xml"
            multiple
            beforeUpload={(file) => {
              // console.log('Yüklenmeye çalışılan dosya:', file);
              return false; // Dosyanın yüklenmesine izin vermek için
            }}
            >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

    </Modal>
  )
}

export default AddPatientModal
