import React from 'react';
import { Form, DatePicker, Select, Button } from 'antd';
import s from './MentorPanel.module.scss';
import "antd/dist/antd.css";
const { Option } = Select;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};


const rangeConfig = {
  rules: [
    {
      type: 'array',
      required: true,
      message: 'Please select time!',
    },
  ],
};

export default function MentorPanelOffer(){
  const onFinish = (fieldsValue) => {
    const rangeValue = fieldsValue['range-picker'];
    const rangeTimeValue = fieldsValue['range-time-picker'];
    const values = {
      ...fieldsValue,
      'range-time-picker': [
        rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
      ],
    };
    console.log('Received values of form: ', values);
  };

return(
   <div className={s.main}>
       <div className={s.main__title}>
            <h1>Crear Oferta</h1>
       </div>
            <div className="">
                 <div className={s.main__content}>
                 <Form name="time_related_controls" {...formItemLayout} onFinish={onFinish}>

                  <Form.Item name="range-time-picker" label="Selecciona la fecha" {...rangeConfig}>
                    <RangePicker showTime format="YYYY-MM-DD HH:mm" />
                  </Form.Item>
                <Form.Item
                label="Training"
                  name={['address', 'province']}
                  rules={[{ required: true, message: 'Training Required' }]}
                >
                  <Select placeholder="Selecciona training(s)">
                    <Option value="s1">S1</Option>
                    <Option value="s2">S2</Option>
                  </Select>
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
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
                 </div>
            </div>
   </div> 
);
}
