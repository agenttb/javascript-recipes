import { Form, InputNumber, Button, Select, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useState } from 'react';


const { Option } = Select;

interface FormValues {
    select: string;
    input: string;
}

interface OptionData {
    label: string;
    value: string;
}

const App: React.FC = () => {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState<{ selectLabel: string, input: string }[]>([]);
    const [options, setOptions] = useState<OptionData[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>('');

    const onFinish = (values: { select: string; input: string }) => {
        setTableData([...tableData, { selectLabel: selectedLabel, input: values.input }]);
        form.resetFields(); // 清空表单字段
    };
    const cityLists = [
        { "label": "上海", "value": "shanghai" },
        { "label": "北京", "value": "beijing" },
        { "label": "深圳", "value": "shenzhen" },
        { "label": "广州", "value": "guangzhou" },
        { "label": "南京", "value": "nanjing" }
    ]
    const columns = [
        {
            title: '月份',
            dataIndex: 'select',
            key: 'select',
        },
        {
            title: '税后薪资',
            dataIndex: 'input',
            key: 'input',
        },
    ];

    const handleSelectChange = (value: string) => {
        const option = options.find(opt => opt.value === value);
        if (option) {
            setSelectedLabel(option.label);
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="select"
                    label="请选择城市"
                    rules={[{ required: true, message: '请选择一个城市' }]}
                >
                    <Select placeholder="请选择一个城市" onChange={handleSelectChange}>
                        {cityLists.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="input"
                    label="请输入税前薪资"
                    rules={[{ required: true, message: '请输入内容' }]}
                >
                    <InputNumber addonBefore={<UserOutlined />} prefix="￥" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
            <Table columns={columns} dataSource={tableData} rowKey={(record, index) => index.toString()} />
        </div>
    );
};

import { createRoot } from 'react-dom/client';

const root = createRoot(document.body);
root.render(<App />);


// export default App;
