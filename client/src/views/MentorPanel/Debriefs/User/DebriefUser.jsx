import React from 'react';
import { useLocation } from 'react-router';
import { Form, Input, Select, Button } from 'antd';

const { Option } = Select;
const { TextArea } = Input;


export default function DebriefUser() {
    const location = useLocation();
    const { record } = location.state;
    const onFinish = async (fieldsValue) => {
        const r = await fetch('/api/training/offer ', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentId: record.student_id,
                mentorId: record.mentor_id,
                training: record.training,
                date: record.availabledate,
                result: fieldsValue.result,
                comment: fieldsValue.comment,
            })
        })
        if (r.status === 200) {
            window.location = "/mentor/debrief"
        }
    };

    return (

        <Form name="DebriefUser" onFinish={onFinish}>
            <Form.Item
                label="Result"
                name={'result'}
                rules={[{ required: true, message: 'Result Required' }]}
            >
                <Select placeholder="Resultado training">
                    <Option value='true'>
                        Passed
                    </Option>
                    <Option value='false'>
                        Failed
                    </Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Comments"
                name={'comment'}>
                <TextArea placeholder="Debrief The Trainee" showCount maxLength={1000} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}
