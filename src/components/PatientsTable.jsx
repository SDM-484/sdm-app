"use client"

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import React, { useContext, useRef, useState } from 'react'
import '@ant-design/v5-patch-for-react-19';
import { UserContext } from '@/services/context/UserContext';

const handleDownload = async (urls) => {
  for (const url of urls) {
    
    const filename = url.split('/').pop(); 
    const fileExtension = filename.split('.').pop().toLowerCase();
  
    if (fileExtension === "dcm") {
      window.open(url, "_blank");
    } else {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
  }
};



function PatientsTable({patients,handleDeletePatient}) {
  const {user} = useContext(UserContext)
  // console.log(patients);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => {
            var _a;
            return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
          }, 100);
        }
      },
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns = user?.isAdmin ?
  [
    Object.assign(
      { title: 'Pasiyenntin adı', dataIndex: 'name', key: 'name'},
      getColumnSearchProps('name'),
    ),
    Object.assign(
      { title: 'Pasiyenntin soyadı', dataIndex: 'surname', key: 'surname'},
      getColumnSearchProps('surname'),
    ),
    Object.assign(
      { title: 'Həkimin adı', dataIndex: 'doctorsName', key: 'doctorsName'},
      getColumnSearchProps('doctorsName'),
    ),
    Object.assign(
      Object.assign(
        { title: 'Tarix', dataIndex: 'date', key: 'date' },
      ),
      {
        sorter: (a, b) => {
          const dateA = new Date(a.date.split(".").reverse().join("-"));
          const dateB = new Date(b.date.split(".").reverse().join("-"));
          return dateA - dateB;
        },
        sortDirections: ['descend', 'ascend'],
      },
    ),
        Object.assign(
      { title: 'Çəkiliş', dataIndex: 'type', key: 'type'},
    ),
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className='flex gap-2'>

          <Button onClick={() => handleDownload(record.fileURLs)} type='primary'>
            Yüklə
          </Button>
          {/* <Button onClick={()=>record.key} >
            Düzəlt
          </Button> */}
          {
            user?.isAdmin &&
            <Button onClick={()=>{handleDeletePatient(record.key)}} color='danger' variant='solid' >
              Sil
            </Button>
          }
          
        </div>
      ),
    }
  ]
  : 
  [
    Object.assign(
      { title: 'Pasiyenntin adı', dataIndex: 'name', key: 'name'},
      getColumnSearchProps('name'),
    ),
    Object.assign(
      { title: 'Pasiyenntin soyadı', dataIndex: 'surname', key: 'surname'},
      getColumnSearchProps('surname'),
    ),
    Object.assign(
      Object.assign(
        { title: 'Tarix', dataIndex: 'date', key: 'date' },
      ),
      {
        sorter: (a, b) => {
          const dateA = new Date(a.date.split(".").reverse().join("-"));
          const dateB = new Date(b.date.split(".").reverse().join("-"));
          return dateA - dateB;
        },
        sortDirections: ['descend', 'ascend'],
      },
    ),
        Object.assign(
      { title: 'Çəkiliş', dataIndex: 'type', key: 'type'},
      getColumnSearchProps('type'),
    ),
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className='flex gap-2'>
          <Button onClick={() => handleDownload(record.fileURLs)} type='primary'>
            Yüklə
          </Button>
        </div>
      ),
    }
  ]
  ;

  return (
    <>
      <Table columns={columns} dataSource={patients} />
    </>
  )

}

export default PatientsTable
