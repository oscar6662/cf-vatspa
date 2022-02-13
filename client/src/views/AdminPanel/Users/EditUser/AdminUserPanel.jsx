import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Checkbox, List } from 'antd';


export default function AdminUserPanel() {
    const location = useLocation();
    let { record } = location.state;
    const [data, setData] = useState(null);
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch(
                    `/api/training/user/${record.id}`
                );
                const r = await data.json();
                console.log(r);
                setData(r);
            } catch (error) {
                console.log(error);
            }
            isLoading(false);
        };
        fetchData();
    }, [record.id]);

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

    return (
        <>
            <div>
                <h1>{record.user_name}</h1>
                <h2>{record.id}</h2>
            </div>
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
            <List
            bordered={true}
            grid = {{gutter: 2, column: 2}}
            header = {'trainings'}
            loading = {loading}>
                {!loading && Object.keys(data).map((key, i) => (

                    <List.Item.Meta 
                    title = {key}
                    description={data[key]}/>
                ))}
            </List>


        </>
    );
}
