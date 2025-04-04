import { Modal, Form, Input, Select } from 'antd'
import React, { useState } from 'react'


function AddDoctorModal({isAddDoctorModalOpen,handleAddDoctorCancel,handleAddDoctor}) {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState();



  const onCreate = values => {
    // console.log('Received values of form: ', values);
    handleAddDoctor(values);
    setFormValues(values);
    handleAddDoctorCancel();
  };

  return (
    <Modal 
    title="Həkim əlavə et" 
    okText="Əlavə et"
    cancelText="Ləğv et"
    open={isAddDoctorModalOpen} 
    okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
    onCancel={handleAddDoctorCancel}
    destroyOnClose
    modalRender={dom => (
      <Form
        layout="vertical"
        form={form}
        name="addDoctor"
        initialValues={{ modifier: 'public' }}
        clearOnDestroy
        onFinish={values => onCreate(values)}
      >
        {dom}
      </Form>
    )}
    >
        <Form.Item
          label="Həkimin istifadəçi adı"
          name="username"
          rules={[
            { required: true, message: 'Həkimin istifadəçi adını daxil edin!' },
            { min: 3, message: 'Həkimin istifadəçi adı 2 simvoldan uzun olmalıdır!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Həkimin adı"
          name="name"
          rules={[
            { required: true, message: 'Həkimin adını daxil edin!' },
            { min: 3, message: 'Həkimin adı 2 simvoldan uzun olmalıdır!' }
          ]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          label="Həkimin soyadı"
          name="surname"
          rules={[
            { required: true, message: 'Həkimin soyadını daxil edin!' },
            { min: 3, message: 'Həkimin soyadı  2 simvoldan uzun olmalıdır!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Hospital"
          name="hospital"
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          label="Həkimin parolu"
          name="password"
          rules={[
            { required: true, message: 'Həkimin parolunu daxil edin!' },
            { min: 8, message: 'parol 7 simvoldan uzun olmalıdır!' }
          ]}
        >
          <Input.Password />
        </Form.Item>






    </Modal>
  )
}

export default AddDoctorModal
