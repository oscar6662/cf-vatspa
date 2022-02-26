import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { Button } from "antd";

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

    return (
        isLoading ? (
            <ReactLoading type={'bubbles'} color={'black'} />
        ) : (
            data.map(i => (
                <Button>
                    <Link to={{ pathname: "/mentor/debrief/user", state: { i } }}>
                        Debrief
                    </Link>
                </Button>
            ))
        )
    );
}
