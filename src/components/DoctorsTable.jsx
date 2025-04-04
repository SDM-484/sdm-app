"use client"

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import React, { useContext, useRef, useState } from 'react'
import '@ant-design/v5-patch-for-react-19';
import { UserContext } from '@/services/context/UserContext';



function DoctorsTable({doctors,handleDeleteDoctor}) {
  // const {user} = useContext(UserContext)




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
  const columns =
  [
    Object.assign(
      { title: 'Həkimin istifadəçi adı', dataIndex: 'username', key: 'username'},
      getColumnSearchProps('username'),
    ),
    Object.assign(
      { title: 'Həkimin adı', dataIndex: 'name', key: 'name'},
      getColumnSearchProps('name'),
    ),
    Object.assign(
      { title: 'Həkimin soyadı', dataIndex: 'surname', key: 'surname'},
      getColumnSearchProps('surname'),
    ),
    {
      title: 'Parol',
      key: 'password',
      render: (_, record) => (
        <Input.Password variant='borderless' readOnly value={record.password} />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className='flex gap-2'>
          <Button onClick={()=>{handleDeleteDoctor(record.id)}} color='danger' variant='solid' >
            Sil
          </Button>
          
        </div>
      ),
    }
  ]  ;

  return (
    <>
      <Table columns={columns} dataSource={doctors} />
    </>
  )

}

export default DoctorsTable
