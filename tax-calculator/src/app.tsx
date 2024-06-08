import {Form, InputNumber, Button, Select, Table, Layout} from 'antd';

const {Header, Content, Footer} = Layout;
import {UserOutlined} from '@ant-design/icons';
import React, {useState} from 'react';


const {Option} = Select;


const cityLists = [
    {"label": "上海", "value": "shanghai"},
    {"label": "北京", "value": "beijing"},
    {"label": "深圳", "value": "shenzhen"},
    {"label": "广州", "value": "guangzhou"},
    {"label": "南京", "value": "nanjing"}
]

function taxedSalary(salaryBeforeTax: number, city: string, fundBase: number): SalaryDetails[] {
    return calculateAnnualSalaries(salaryBeforeTax, city, fundBase);
}


interface SalaryDetails {
    month: string;
    netSalary: string;
    grossSalary: string;
    housingFund: string;
    pension: string;
    medical: string;
    unemployment: string;
    monthlyTax: string;

}

const PERSONAL_DEDUCTION = 5000;

const SOCIAL_INSURANCE_RATE = {
    pension: 0.08,
    medical: 0.02,
    unemployment: 0.005,
};

const HOUSING_FUND_RATE = 0.09;


const TAX_BRACKETS = [
    {lowerBound: 0, upperBound: 36000, rate: 0.03, deduction: 0},
    {lowerBound: 36000, upperBound: 144000, rate: 0.1, deduction: 2520},
    {lowerBound: 144000, upperBound: 300000, rate: 0.2, deduction: 16920},
    {lowerBound: 300000, upperBound: 420000, rate: 0.25, deduction: 31920},
    {lowerBound: 420000, upperBound: 660000, rate: 0.3, deduction: 52920},
    {lowerBound: 660000, upperBound: 960000, rate: 0.35, deduction: 85920},
    {lowerBound: 960000, upperBound: Number.MIN_VALUE, rate: 0.45, deduction: 181920},
]

function calculateCumulativeTax(taxableIncome: number): number {
    let cumulativeTax = 0;
    for (const bracket of TAX_BRACKETS.reverse()) {
        if (taxableIncome > bracket.lowerBound && taxableIncome <= bracket.upperBound) {
            cumulativeTax = taxableIncome * bracket.rate - bracket.deduction;
            break;
        }
    }
    return cumulativeTax;
}


function calculateAnnualSalaries(salaryBeforeTax: number, city: string, fundBase: number): SalaryDetails[] {
    const BASE_SALARY = fundBase;
    const GROSS_SALARY = salaryBeforeTax;
    const socialInsurance = BASE_SALARY * (SOCIAL_INSURANCE_RATE.pension + SOCIAL_INSURANCE_RATE.medical + SOCIAL_INSURANCE_RATE.unemployment);
    const housingFund = BASE_SALARY * HOUSING_FUND_RATE;
    const pension = BASE_SALARY * SOCIAL_INSURANCE_RATE.pension;
    const medical = BASE_SALARY * SOCIAL_INSURANCE_RATE.medical;
    const unemployment = BASE_SALARY * SOCIAL_INSURANCE_RATE.unemployment;
    const taxableAmount = GROSS_SALARY - socialInsurance - housingFund;
    const annualSalaries: SalaryDetails[] = [];
    let cumulativeIncome = 0;
    let cumulativeDeductions = 0;
    let cumulativeTaxAmountPaid = 0;

    for (let month = 1; month <= 12; month++) {
        cumulativeIncome += taxableAmount;
        cumulativeDeductions += PERSONAL_DEDUCTION;
        let cumulativeTaxableIncome = cumulativeIncome - cumulativeDeductions;
        if (cumulativeTaxableIncome < 0) {
            cumulativeTaxableIncome = 0;
        }
        const tax = calculateCumulativeTax(cumulativeTaxableIncome);
        const currentTaxAmount = tax - cumulativeTaxAmountPaid;
        const afterTaxAmount = taxableAmount - currentTaxAmount;
        cumulativeTaxAmountPaid = tax;

        const monthlySalary = {} as SalaryDetails;
        monthlySalary.netSalary = toFxied(afterTaxAmount);
        monthlySalary.monthlyTax = toFxied(currentTaxAmount);
        monthlySalary.grossSalary = toFxied(GROSS_SALARY);
        monthlySalary.housingFund = toFxied(housingFund);
        monthlySalary.month = month.toString();
        monthlySalary.pension = toFxied(pension);
        monthlySalary.medical = toFxied(medical);
        monthlySalary.unemployment = toFxied(unemployment);
        annualSalaries.push(monthlySalary);

    }
    return annualSalaries;
}

function toFxied(num: number): string {
    return num.toFixed(2)
}


const App: React.FC = () => {
    const [form] = Form.useForm();
    const [tableData, setTableData] =
        useState<SalaryDetails[]>([]);

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
            dataIndex: 'grossSalary',
            key: 'grossSalary'
        },
        {
            title: '税后薪资',
            dataIndex: 'netSalary',
            key: 'netSalary'
        },
        {
            title: '公积金',
            dataIndex: 'housingFund',
            key: 'housingFund'
        },
        {
            title: '养老保险',
            dataIndex: 'pension',
            key: 'pension'
        },
        {
            title: '医疗保险',
            dataIndex: 'medical',
            key: 'medical'
        },
        {
            title: '失业保险',
            dataIndex: 'unemployment',
            key: 'unemployment'
        },
        {
            title: '当月个人所得税',
            dataIndex: 'monthlyTax',
            key: 'monthlyTax',
        }
    ];


    return (
        <div style={{padding: '1px', width: '100%'}}>
            <Form form={form} layout="vertical" onFinish={onFinish} style={{width: '100%'}}>
                <Form.Item
                    name="city"
                    label="请选择城市"
                    rules={[{required: true, message: '请选择一个城市'}]}
                >
                    <Select placeholder="请选择一个城市">
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
                    rules={[{required: true, message: '请输入内容'}]}
                >
                    <InputNumber addonBefore={<UserOutlined/>} prefix="￥" style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item
                    name="fundBase"
                    label="社保汇缴基数"
                    rules={[{required: true, message: '请输入内容'}]}
                >
                    <InputNumber addonBefore={<UserOutlined/>} prefix="￥" style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
            <Table style={{width: '100%'}} columns={columns} dataSource={tableData} pagination={{pageSize: 12}}
                   rowKey={(record, index) => index.toString()}/>
        </div>
    );
};

import {createRoot} from 'react-dom/client';

const root = createRoot(document.body);
root.render(<App/>);


// export default App;
