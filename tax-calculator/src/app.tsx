import { Form, InputNumber, Button, Select, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useState } from 'react';


const { Option } = Select;

// interface TaxBracket {
//     upperLimit: number;
//     rate: number;
//     quickDeduction: number;
// }
//
// interface TaxData {
//     salaryBeforeTax: string;
//     salaryAfterTax: string;
//     month: string;
//     totalNetSalary: string;
//     cumulativeTaxPaid: string;
//     cumulativeGrossSalary: string;
//
// }
//
// interface FundAndInsurance {
//     housingFund: number;
//     pensionInsurance: number;
//     medicalInsurance: number;
//     unemploymentInsurance: number;
// }
//
// const taxBrackets: TaxBracket[] = [
//     { upperLimit: 3000, rate: 0.03, quickDeduction: 0 },
//     { upperLimit: 12000, rate: 0.10, quickDeduction: 210 },
//     { upperLimit: 25000, rate: 0.20, quickDeduction: 1410 },
//     { upperLimit: 35000, rate: 0.25, quickDeduction: 2660 },
//     { upperLimit: 55000, rate: 0.30, quickDeduction: 4410 },
//     { upperLimit: 80000, rate: 0.35, quickDeduction: 7160 },
//     { upperLimit: Infinity, rate: 0.45, quickDeduction: 15160 }
// ];
// const fundAndInsuranceMap : Map<string, FundAndInsurance> = new Map();
// fundAndInsuranceMap.set('shanghai',
//     {
//         housingFund: 0.07,
//         pensionInsurance: 0.08,
//         medicalInsurance: 0.02,
//         unemploymentInsurance: 0.005
//     });

const cityLists = [
    { "label": "上海", "value": "shanghai" },
    { "label": "北京", "value": "beijing" },
    { "label": "深圳", "value": "shenzhen" },
    { "label": "广州", "value": "guangzhou" },
    { "label": "南京", "value": "nanjing" }
]
function taxedSalary(salaryBeforeTax: number, city: string, fundBase: number): SalaryDetails[] {
    return calculateAnnualSalaries();
}

// function taxedSalary(salaryBeforeTax: number, city: string, fundBase: number): TaxData[] {
//     return calculateAnnualNetSalary(1111111, 1111111)
// }
//
// function calculateCumulativeTax(taxableIncome: number): number {
//     let tax = 0;
//     for (const bracket of taxBrackets) {
//         if (taxableIncome <= bracket.upperLimit) {
//             tax = taxableIncome * bracket.rate - bracket.quickDeduction;
//             break;
//         }
//     }
//     return tax;
// }
//
// function calculateMonthlyNetSalary(grossSalary: number,
//                                    cumulativeGrossSalary: number,
//                                    cumulativeDeductions: number,
//                                    cumulativeTaxPaid: number,
//                                    fundBase: number): { netSalary: number, cumulativeTaxPaid: number, cumulativeDeductions: number} {
//     const socialInsuranceRate = {
//         pension: 0.08, // 养老保险
//         medical: 0.02, // 医疗保险
//         unemployment: 0.005 // 失业保险
//     };
//
//     const housingFundRate = 0.07; // 住房公积金
//     const taxThreshold = 5000; // 个税起征点
//     const specialDeduction = 0; // 假设无专项附加扣除
//
//     // 计算当月社保和公积金
//     const pension = fundBase * socialInsuranceRate.pension;
//     const medical = fundBase * socialInsuranceRate.medical;
//     const unemployment = fundBase * socialInsuranceRate.unemployment;
//     const housingFund = fundBase * housingFundRate;
//     const monthlyDeductions = pension + medical + unemployment + housingFund;
//
//     // 计算累计数据
//     cumulativeGrossSalary += grossSalary;
//     cumulativeDeductions += monthlyDeductions + taxThreshold + specialDeduction;
//
//     // 计算累计应纳税所得额
//     const cumulativeTaxableIncome = cumulativeGrossSalary - cumulativeDeductions;
//
//     // 计算累计应纳税额
//     const cumulativeTax = calculateCumulativeTax(cumulativeTaxableIncome);
//
//     // 计算当月应纳税额
//     const monthlyTax = cumulativeTax - cumulativeTaxPaid;
//
//     // 计算税后工资
//     const netSalary = grossSalary - monthlyDeductions - monthlyTax;
//
//     // 更新累计已缴税额
//     cumulativeTaxPaid = cumulativeTax;
//
//     return { netSalary, cumulativeTaxPaid, cumulativeDeductions};
// }
//
// function calculateAnnualNetSalary(monthlyGrossSalary: number,
//                                   fundBase: number): TaxData[] {
//     let cumulativeGrossSalary = 0;
//     let cumulativeDeductions = 0;
//     let cumulativeTaxPaid = 0;
//     let totalNetSalary = 0;
//     const taxedSalary = [] as TaxData[];
//     for (let month = 1; month <= 12; month++) {
//         const result = calculateMonthlyNetSalary(monthlyGrossSalary,
//             cumulativeGrossSalary,
//             cumulativeDeductions,
//             cumulativeTaxPaid,
//             fundBase);
//         totalNetSalary += result.netSalary;
//         cumulativeTaxPaid = result.cumulativeTaxPaid;
//         cumulativeGrossSalary += monthlyGrossSalary;
//         cumulativeDeductions += result.cumulativeDeductions;
//
//
//         const monthlySalary = {} as TaxData;
//         monthlySalary.salaryAfterTax = result.netSalary.toString();
//         monthlySalary.salaryBeforeTax = monthlyGrossSalary.toString();
//         monthlySalary.totalNetSalary = totalNetSalary.toString();
//         monthlySalary.cumulativeTaxPaid = cumulativeTaxPaid.toString();
//         monthlySalary.cumulativeGrossSalary = cumulativeGrossSalary.toString();
//         taxedSalary.push(monthlySalary);
//     }
//     console.log(taxedSalary);
//
//     return taxedSalary;
// }


interface SalaryDetails {
    month: number;
    grossSalary: number;
    socialInsurance: number;
    housingFund: number;
    cumulativeIncome: number;
    cumulativeDeductions: number;
    cumulativeTaxableIncome: number;
    cumulativeTax: number;
    monthlyTax: number;
    netSalary: number;
}

const BASE_SALARY = 11111;
const GROSS_SALARY = 11111;
const PERSONAL_DEDUCTION = 5000;

const SOCIAL_INSURANCE_RATE = {
    pension: 0.08,
    medical: 0.02,
    unemployment: 0.005,
};

const HOUSING_FUND_RATE = 0.09;

const TAX_BRACKETS = [
    { threshold: 960000, rate: 0.45, deduction: 15160 },
    { threshold: 660000, rate: 0.35, deduction: 7160 },
    { threshold: 420000, rate: 0.30, deduction: 4410 },
    { threshold: 300000, rate: 0.25, deduction: 2660 },
    { threshold: 144000, rate: 0.20, deduction: 1410 },
    { threshold: 36000, rate: 0.10, deduction: 210 },
    { threshold: 0, rate: 0.03, deduction: 0 },
];

function calculateCumulativeTax(taxableIncome: number): number {
    let cumulativeTax = 0;
    for (const bracket of TAX_BRACKETS) {
        if (taxableIncome > bracket.threshold) {
            cumulativeTax = taxableIncome * bracket.rate - bracket.deduction;
            break;
        }
    }
    return cumulativeTax;
}

function calculateMonthlySalary(month: number, cumulativeIncome: number, cumulativeDeductions: number): SalaryDetails {
    const socialInsurance = BASE_SALARY * (SOCIAL_INSURANCE_RATE.pension + SOCIAL_INSURANCE_RATE.medical + SOCIAL_INSURANCE_RATE.unemployment);
    const housingFund = BASE_SALARY * HOUSING_FUND_RATE;

    cumulativeIncome += GROSS_SALARY;
    cumulativeDeductions += (socialInsurance + housingFund + PERSONAL_DEDUCTION);

    const cumulativeTaxableIncome = cumulativeIncome - cumulativeDeductions;
    const cumulativeTax = calculateCumulativeTax(cumulativeTaxableIncome);

    let previousCumulativeTax = 0;
    if (month > 1) {
        previousCumulativeTax = calculateCumulativeTax(cumulativeTaxableIncome - (GROSS_SALARY - socialInsurance - housingFund - PERSONAL_DEDUCTION));
    }

    const monthlyTax = cumulativeTax - previousCumulativeTax;
    const netSalary = GROSS_SALARY - socialInsurance - housingFund - monthlyTax;

    return {
        month,
        grossSalary: GROSS_SALARY,
        socialInsurance,
        housingFund,
        cumulativeIncome,
        cumulativeDeductions,
        cumulativeTaxableIncome,
        cumulativeTax,
        monthlyTax,
        netSalary,
    };
}

function calculateAnnualSalaries(): SalaryDetails[] {
    const annualSalaries: SalaryDetails[] = [];
    let cumulativeIncome = 0;
    let cumulativeDeductions = 0;

    for (let month = 1; month <= 12; month++) {
        const salaryDetails = calculateMonthlySalary(month, cumulativeIncome, cumulativeDeductions);
        cumulativeIncome = salaryDetails.cumulativeIncome;
        cumulativeDeductions = salaryDetails.cumulativeDeductions;
        annualSalaries.push(salaryDetails);
    }

    const a = annualSalaries.map( v => v.netSalary);
    console.log(a);
    return annualSalaries;
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
            dataIndex: 'salaryBeforeTax',
            key: 'salaryBeforeTax'
        },
        {
            title: '税后薪资',
            dataIndex: 'salaryAfterTax',
            key: 'salaryAfterTax'
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
