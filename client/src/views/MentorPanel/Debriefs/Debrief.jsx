import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table } from "antd";

export default function Debrief() {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const r = await fetch('/api/training/debrief');
                const j = await r.json();
                setData(j);
            } catch (error) {
                setIsError(true)
            }
            setIsLoading(false);
        };
        fetchData();
    }, [isError]);

    const debriefColumns = [
        {
            title: "Student",
            dataIndex: "student_id",
            key: "student_id",
        },
        {
            title: "Trainig",
            dataIndex: "training",
            key: "training",
        },
        {
            title: 'Action',
            render: (record) => (
                <Link to={{ pathname: "/mentor/debrief/user", state: { record } }}>
                    Debrief
                </Link>
            ),

        },
    ];
    return (
        <Table
            dataSource={data}
            columns={debriefColumns}
            loading={isLoading}
            pagination={false}
        />
    );
}
