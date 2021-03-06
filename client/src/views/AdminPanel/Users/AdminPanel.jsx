import React, { useState } from 'react';
import { Table, Input } from "antd";
import { useTableSearch } from './useTableSearch';
import { userColumns } from "./columns";

const fetchUsers = async () => {
  const data = await fetch(
    '/api/users'
  );
  const r = await data.json();
  return r;
};

export default function AdminPanel() {
  const { Search } = Input;
  const [searchVal, setSearchVal] = useState(null);
  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchUsers
  });

  return (
    <>
      <Search
        onChange={e => setSearchVal(e.target.value)}
        placeholder="Search"
        enterButton
        style={{ position: 'sticky', top: '0', left: '0' }}
      />
      <br /> <br />
      <Table
        dataSource={filteredData}
        columns={userColumns}
        loading={loading}
        pagination={false}
        rowKey='user_name'
      />
    </>
  );
}
