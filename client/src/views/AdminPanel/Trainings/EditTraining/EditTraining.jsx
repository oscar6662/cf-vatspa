import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
    Form,
    Select,
    Input,
    Switch,
    InputNumber,
    Button,
    Row,
    Divider,
} from 'antd';

export default function EditTraining() {
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
                let options = [];
                for (const key in r) {
                    options.push({ label: r[key].long, value: r[key].short });
                }
                setData(options);
            } catch (error) {
                setIsError(true)
            }
            setIsLoading(false);
        };
        fetchData();
    }, [data]);
    const location = useLocation();
    let { record } = location.state;
    if (record.requires !== null && record.requires.includes(",")) {
        record.requires = record.requires.split(",");
    }
    if (record.unlocks !== null && record.unlocks.includes(",")) {
        record.unlocks = record.unlocks.split(",");
    }

    record.mentor = Boolean(record.mentor)
    const deleteTraining = async () => {
        const r = await fetch('/api/training/descriptions ', {
            credentials: 'include',
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                short: record.short,
            })
        });
        if (r.status === 200) {
            window.location = "/admin/training"
        }
    };
    const onFinish = async (values) => {
        const r = await fetch('/api/training/descriptions ', {
            credentials: 'include',
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                originalshort: record.short,
                newshort: values.short,
                long: values.long,
                description: values.description,
                requires: values.requires,
                unlocks: values.unlocks,
                mentor: values.mentor,
                maxStudents: values.max_students,
            })
        });
        if (r.status === 200) {
            window.location = "/admin/training"
        }
    };
    return (
        <>
            <Row style={{ 'justifyContent': 'space-between' }}>
                <h1>{record.long}</h1><Button danger={true} onClick={deleteTraining}>Delete</Button>
            </Row>
            <Divider></Divider>
            <Form
                labelWrap={true}
                labelCol={{ span: 4, offset: 1 }}
                wrapperCol={{ span: 12, offset: 1 }}
                initialValues={record}
                onFinish={onFinish}
            >

                <Form.Item
                    label='Training (short)'
                    name='short'
                    rules={[
                        {
                            required: true,
                            message: 'Introduce a short name for the Training',
                        },
                    ]}
                >
                    <Input placeholder='MAX 16 digits.' showCount={true} />
                </Form.Item>

                <Form.Item
                    label='Training (long)'
                    name='long'
                    rules={[
                        {
                            required: true,
                            message: 'Introduce a short name for the Training',
                        },
                    ]}
                >
                    <Input placeholder='MAX 36 digits.' showCount={true} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Training Description"
                    rules={[
                        {
                            required: true,
                            message: 'Please input Description',
                        },
                    ]}
                >
                    <Input.TextArea showCount maxLength={10000} />
                </Form.Item>

                <Form.Item
                    name="requires"
                    label="Requires"
                >
                    <Select mode="multiple" placeholder="Please select required trainings" loading={isLoading} options={data} />
                </Form.Item>

                <Form.Item
                    name="unlocks"
                    label="Unlocks"
                >
                    <Select mode="multiple" placeholder="Please select trainings that get unlocked" loading={isLoading} options={data} />

                </Form.Item>

                <Form.Item name="mentor" label="Requires a Mentor">
                    <Switch checked={record.mentor} />
                </Form.Item>

                <Form.Item label="Max">
                    <Form.Item
                        name="max_students"
                        noStyle
                        rules={[
                            {
                                required: true,
                                message: 'Introduce Max Number of Students',
                            },
                        ]}>
                        <InputNumber min={1} max={15} />
                    </Form.Item>
                    <span className="ant-form-text"> Students</span>
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        span: 12,
                        offset: 6,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Edit Training
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
