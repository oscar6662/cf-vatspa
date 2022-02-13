import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Button, Divider, Table } from "antd";
import { trainingColumns } from "./columns";

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(
          '/api/training/descriptions'
        );
        const r = await data.json();
        setData(r);
      } catch (error) {
        setIsError(true)
      }
      setIsLoading(false);
    };
    fetchData();
  }, [data]);

  return (
    isError ? (
      <p>Error</p>
    ) : (
      <>
        <Button>
          <Link to={{ pathname: "/admin/training/new", state: { data } }}>
            Add Training
          </Link>
        </Button>
        <Divider />
        <Table
          dataSource={data}
          columns={trainingColumns}
          pagination={false}
          loading={isLoading}
        />
      </>
    )


  );
}
