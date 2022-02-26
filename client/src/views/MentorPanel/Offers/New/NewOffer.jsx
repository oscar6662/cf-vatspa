import React, { useEffect, useState } from 'react';
import { Form, DatePicker, Select, Button } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const rangeConfig = {
    rules: [
        {
            type: 'array',
            required: true,
            message: 'Please select time!',
        },
    ],
};

export default function NewOffer() {
    const onFinish = async (fieldsValue) => {
        const rangeTimeValue = fieldsValue['date'];
        const values = {
            ...fieldsValue,
            'date': [
                rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
                rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
            ],
        };
        const r = await fetch('/api/training/offer ', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dates: values.date,
                training: values.training,
            })
        })
        if (r.status === 200) {
            window.location = "/admin"
        }
    };
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch(
                    '/api/training/descriptions'
                );
                const mentorTo = await fetch(
                    '/api/training/admin/mentor'
                );
                const mentorJ = await mentorTo.json();
                const r = await data.json();
                let options = [];
                for (const key in r) {
                    options.push({ label: r[key], value: r[key] });
                    if (mentorJ === r[key]) break;
                }
                setData(options);
            } catch (error) {
                setIsError(true)
            }
            setIsLoading(false);
        };
        fetchData();
    }, [data]);

    return (

        <Form name="time_related_controls"  onFinish={onFinish}>
            <Form.Item name="date" label="Selecciona la fecha" {...rangeConfig}>
                <RangePicker showTime format="YYYY-MM-DD HH:mm" />
            </Form.Item>
            <Form.Item
                label="Training"
                name={'training'}
                rules={[{ required: true, message: 'Training Required' }]}
            >
                <Select placeholder="Selecciona training(s)"
                loading = {isLoading}
                options = {data}
                />
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    xs: {
                        span: 24,
                        offset: 0,
                    },
                    sm: {
                        span: 16,
                        offset: 8,
                    },
                }}
            >
                <Button type="primary" htmlType="submit">
                    Crear
                </Button>
            </Form.Item>
        </Form>

    );
}
