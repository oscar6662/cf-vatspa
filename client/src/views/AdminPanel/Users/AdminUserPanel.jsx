import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import ReactLoading from 'react-loading';
import { Checkbox } from 'antd';

export default function AdminUserPanel() {
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);
    const [change, isChanging] = useState([false])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const r = await fetch(`/api/user/${id}`);
                const j = await r.json();
                setData(j);
            } catch (error) {
                setIsError(true);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [id, change]);

    async function onChange(e) {
        await fetch('/api/admin/editUser ', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                aspect: e.target.value,
                changeTo: e.target.checked
            })
        });
        isChanging(!change);
    }

    return (
        isLoading ? (
                <ReactLoading type={'bubble'} color={'black'} height={'20%'} width={'20%'} />
        ) : (
            isError ? (
                <div>
                    Unfortunatelly an Error Ocurred
                </div>
            ) : (
                <>
                    <div>
                        <h1>{data.user_name}</h1>
                        <h2>{data.id}</h2>
                    </div>
                        <Checkbox
                            value='mentor'
                            checked={data.mentor}
                            onChange={onChange}
                        >Mentor</Checkbox>
                        <Checkbox
                            value='admin'
                            checked={data.admin}
                            onChange={onChange}
                        >Admin</Checkbox>
                </>
            )
        )
    );
}
