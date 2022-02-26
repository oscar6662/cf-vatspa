import React, { useState, useEffect } from 'react';
import { Table } from "antd";
import { requestsColumns } from "./columns";

export default function Requests() {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const r = await fetch('/api/training/trainingrequest');
                const j = await r.json();
                setData(j);
            } catch (error) {
                setIsError(true)
            }
            setIsLoading(false);
        };
        fetchData();
    }, [isError]);

    return (
        <Table
            dataSource={data}
            columns={requestsColumns}
            loading={isLoading}
            pagination={false}
        />
    );
}
