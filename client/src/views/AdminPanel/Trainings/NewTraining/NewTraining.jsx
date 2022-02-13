import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'

import {
    Form,
    Select,
    Input,
    Switch,
    InputNumber,
    Button
} from 'antd';

export default function NewTraining() {
    const [isError, setIsError] = useState(false)
    const location = useLocation();
    const { data } = location.state;
    let options = [];
    for (const key in data) {
        options.push({ label: data[key].long, value: data[key].short });
    }
    const onFinish = async (values) => {
        const r = await fetch('/api/training/descriptions ', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                short: values.short,
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
        <Form
            labelWrap={true}
            labelCol={{ span: 4, offset: 1 }}
            wrapperCol={{ span: 12, offset: 1 }}
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
                <Select mode="multiple" placeholder="Please select required trainings" options={options} />
            </Form.Item>

            <Form.Item
                name="unlocks"
                label="Unlocks"
            >
                <Select mode="multiple" placeholder="Please select trainings that get unlocked" options={options} />

            </Form.Item>

            <Form.Item name="mentor" label="Requires a Mentor" valuePropName="mentor">
                <Switch />
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
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}