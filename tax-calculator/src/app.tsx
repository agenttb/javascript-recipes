import { Form, InputNumber, Button, Select, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useState } from 'react';


const { Option } = Select;

interface TaxBracket {
    upperLimit: number;
    rate: number;
    quickDeduction: number;
}

interface TaxData {
    salaryBeforeTax: string;
    salaryAfterTax: string;
    month: string;
}

interface FundAndInsurance {
    housingFund: number;
    pensionInsurance: number;
    medicalInsurance: number;
    unemploymentInsurance: number;
}

const taxBrackets: TaxBracket[] = [
    { upperLimit: 3000, rate: 0.03, quickDeduction: 0 },
    { upperLimit: 12000, rate: 0.10, quickDeduction: 210 },
    { upperLimit: 25000, rate: 0.20, quickDeduction: 1410 },
    { upperLimit: 35000, rate: 0.25, quickDeduction: 2660 },
    { upperLimit: 55000, rate: 0.30, quickDeduction: 4410 },
    { upperLimit: 80000, rate: 0.35, quickDeduction: 7160 },
    { upperLimit: Infinity, rate: 0.45, quickDeduction: 15160 }
];
const fundAndInsuranceMap : Map<string, FundAndInsurance> = new Map();
fundAndInsuranceMap.set('shanghai',
    {
        housingFund: 0.07,
        pensionInsurance: 0.08,
        medicalInsurance: 0.02,
        unemploymentInsurance: 0.005
    });

const cityLists = [
    { "label": "上海", "value": "shanghai" },
    { "label": "北京", "value": "beijing" },
    { "label": "深圳", "value": "shenzhen" },
    { "label": "广州", "value": "guangzhou" },
    { "label": "南京", "value": "nanjing" }
]


function calcGrossDeduction(salaryBeforeTax: number, city: string, fundBase: number): number {
    const fundAndInsurance = fundAndInsuranceMap.get(city);
    const housingFund = fundAndInsurance.housingFund * fundBase;
    const pensionInsurance = fundAndInsurance.pensionInsurance * fundBase;
    const medicalInsurance = fundAndInsurance.medicalInsurance * fundBase;
    const unemploymentInsurance = fundAndInsurance.unemploymentInsurance * fundBase;
    return housingFund + pensionInsurance + medicalInsurance + unemploymentInsurance;
}

function taxedSalary(salaryBeforeTax: number, city: string, fundBase: number): TaxData[] {
    const taxedSalary = [] as TaxData[];
    const grossDeduction = calcGrossDeduction(salaryBeforeTax, city, fundBase);
    const result = calculateTaxedSalary(salaryBeforeTax - grossDeduction);
    const data  = {} as TaxData;
    data.salaryAfterTax = result.toString();
    data.salaryBeforeTax = salaryBeforeTax .toString();
    data.month = '一月'
    taxedSalary.push(data);
    return taxedSalary;
}


function calculateTaxedSalary(grossSalary: number): number {
    const taxableIncome = grossSalary - 5000; // Assuming 5000 CNY as the standard deduction
    if (taxableIncome <= 0) return grossSalary;

    let tax = 0;
    for (const bracket of taxBrackets) {
        if (taxableIncome <= bracket.upperLimit) {
            tax += taxableIncome * bracket.rate - bracket.quickDeduction;
            break;
        }
    }

    return grossSalary - tax;
}





const App: React.FC = () => {
    const [form] = Form.useForm();
    const [tableData, setTableData] =
        useState<TaxData[]>([]);

    const onFinish = (values: { city: string; salaryInput: number; fundBase: number }) => {
        setTableData([...tableData, ...taxedSalary(values.salaryInput, values.city, values.fundBase)]);
        form.resetFields(); // 清空表单字段
    };

    const columns = [
        {
            title: '月份',
            dataIndex: 'month',
            key: 'month'
        },
        {
            title: '税前薪资',
            dataIndex: 'salaryBeforeTax',
            key: 'salaryBeforeTax'
        },
        {
            title: '税后薪资',
            dataIndex: 'salaryAfterTax',
            key: 'salaryInput'
        },
    ];


    return (
        <div style={{ padding: '50px' }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="city"
                    label="请选择城市"
                    rules={[{ required: true, message: '请选择一个城市' }]}
                >
                    <Select placeholder="请选择一个城市" >
                        {cityLists.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="salaryInput"
                    label="请输入税前薪资"
                    rules={[{ required: true, message: '请输入内容' }]}
                >
                    <InputNumber addonBefore={<UserOutlined />} prefix="￥" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="fundBase"
                    label="社保汇缴基数"
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
