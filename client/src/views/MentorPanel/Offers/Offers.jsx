import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Table, Button, Divider } from "antd";

export default function Offers() {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);
    const [id, setId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const r = await fetch('/api/training/offers');
                const j = await r.json();
                const r2 = await fetch('/api/user/id');
                setId(await r2.json());
                setData(j);
            } catch (error) {
                setIsError(true)
            }
            setIsLoading(false);
        };
        fetchData();
    }, [isError]);

    async function deleteOffer(record) {
        try {
            const r = await fetch('/api/training/offer ', {
                credentials: 'include',
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dates: record.dates,
                    training: record.training,
                })
            });
            if (r.status === 200) {
                window.location = "/admin/training"
            }
        } catch (error) {
            setIsError(true);
        }
    }

    const offersColumns = [
        {
            title: "Training",
            dataIndex: "training",
            key: "training",
        },
        {
            title: "For Specific User",
            dataIndex: "for_user",
            key: "for_user",
        },
        {
            title: "Mentor ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Start",
            dataIndex: "start",
            key: "start",
        },
        {
            title: "End",
            dataIndex: "end",
            key: "end",
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (record) => (
                record.id === id && (
                    <Button
                        onClick={deleteOffer(record)}
                    >Delete Offer</Button>
                )
            ),
        },
    ];


    return (
        <>
            <Button>
                <Link to={{ pathname: "/mentor/offer/new" }}>
                    Hacer Oferta
                </Link>
            </Button>
            <Divider />
            <Table
                dataSource={data}
                columns={offersColumns}
                loading={isLoading}
                pagination={false}
            />
        </>
    );
}
