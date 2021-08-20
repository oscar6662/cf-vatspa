import React, {useEffect, useState} from 'react';
import { Table, Input, Button } from "antd";
import { useTableSearch } from './useTableSearch';
import { userColumns } from "./columns";

import ReactLoading from 'react-loading';
import s from './MentorPanel.module.scss';
import "antd/lib/table/style/index.css";
import "antd/lib/input/style/index.css";
import "antd/lib/button/style/index.css";

const fetchUsers = async () => {
    const data = await fetch(
      '/api/trainingrequests'
    );
    const r = await data.json();
    return r;
};

export default function MentorPanel(){
    const { Search } = Input;
    const [searchVal, setSearchVal] = useState(null);
    const { filteredData, loading } = useTableSearch({
       searchVal,
       retrieve: fetchUsers
    });

return(
  <>
    <Button
        href = '/mentor/offer'
        type = 'primary'
        >Hacer oferta</Button>
    <br></br><br></br>
    <Search
        onChange={e => setSearchVal(e.target.value)}
        placeholder="Search"
        enterButton
        style={{position: 'sticky', top: '0', left: '0'}}
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
