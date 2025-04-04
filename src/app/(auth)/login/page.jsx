"use client"
import React, { useContext } from 'react'
import { Button, Checkbox, Form, Input } from 'antd';
import {UserContext} from '@/services/context/UserContext';


function page() {
    const {handleLogIn} = useContext(UserContext)

    const onFinish = values => {
        handleLogIn(values)
    };
    const onFinishFailed = errorInfo => {
        // console.log('Failed:', errorInfo);
    };
    
  return (
    <main className='flex items-center justify-center h-screen overflow-hidden'>
        <Form
            className='md:min-w-[360px]'
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
            label="Istifadəçi adı"
            name="username"
            rules={[
                { required: true, message: 'İstifdadəçi adını daxil edin!' },
                { min: 3, message: 'İstifdadəçi adını 2 simvoldan uzun olmalıdır!' }
            ]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            label="Parol"
            name="password"
            rules={[
                { required: true, message: 'parolu daxil edin!' },
                { min: 8, message: 'parol 7 simvoldan uzun olmalıdır!' }
            ]}
            >
            <Input.Password />
            </Form.Item>

            <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            </Form.Item>
        </Form>
    </main>
  )
}

export default page
