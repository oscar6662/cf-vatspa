import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Checkbox, Switch, Table, Select, Divider } from 'antd';

export default function AdminUserPanel() {

    const location = useLocation();
    let { record } = location.state;
    const [data, setData] = useState(null);
    const [loading, isLoading] = useState(true);
    const [options, setOptions] = useState(null);
    const [pointer, setPointer] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch(
                    `/api/training/user/${record.id}`
                );
                const r = await data.json();
                let d = [];
                let o = [];
                Object.keys(r).slice(2).map((key) => (
                    d.push({ training: key, status: r[key] })
                ));
                Object.keys(r).slice(2).map((key) => (
                    o.push({ label: key, value: key })
                ));
                setPointer(r.pointer)
                setOptions(o);
                setData(d);
            } catch (error) {
                console.log(error);
            }
            isLoading(false);
        };
        fetchData();
    }, [record.id]);

    async function onPointerChange(value) {
        const r = await fetch('/api/training/user ', {
            credentials: 'include',
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: record.id,
                lesson: 'pointer',
                value: value
            })
        });
        if (r.status === 200) {
            window.location = "/admin"
        }    }

    async function onChange(e) {
        const r = await fetch('/api/admin/editUser ', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: record.id,
                aspect: e.target.value,
                changeTo: e.target.checked
            })
        });
        if (r.status === 200) {
            window.location = "/admin"
        }
    }
    async function HandleSwitchChange(data) {
        await fetch('/api/training/user ', {
            credentials: 'include',
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: record.id,
                lesson: data.training,
                value: !data.status,
            })
        });
    }
    const userTrainingColumns = [
        {
            title: "Training",
            dataIndex: "training",
            key: "training",
        },
        {
            title: 'Status (Completed/Not-Completed)',
            dataIndex: 'status',
            key: 'status',
            render: (e, record) => (< Switch onChange={() => HandleSwitchChange(record)} defaultChecked={e ? true : false} />)
        }
    ];


    return (
        <>
            <div>
                <h1>{record.user_name}</h1>
                <h2>{record.id}</h2>
            </div>
            <Divider />
            <Checkbox
                value='mentor'
                checked={record.mentor}
                onChange={onChange}
            >Mentor
            </Checkbox>
            <Checkbox
                value='admin'
                checked={record.admin}
                onChange={onChange}
            >Admin
            </Checkbox>
            <Divider />
            <Select
                loading = {loading}
                placeholder="Please select pointer to next training"
                options={options}
                onChange={onPointerChange}
                value={pointer}
            />
            <Divider />
            <Table
                dataSource={data}
                columns={userTrainingColumns}
                loading={loading}
                pagination={false}
            />


        </>
    );
}
