import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Calendar } from 'primereact/calendar';
import { Chart } from 'primereact/chart';
import { Toolbar } from 'primereact/toolbar';

import { useDataContext } from '../App';

const initalCurrentMonth = (): Date => {
  var date = new Date();
  const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  console.log('initalCurrentMonth current Month? ', currentMonth)
  return currentMonth;
}

const Dashboard: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState<Date | undefined>(undefined);
  const [filteredTransations, setFilteredTransactions] = useState<any>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  const [expensesData, setExpensesData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const dataContext: any = useDataContext();
  const navigate = useNavigate();

  const getTransactionsByActiveMonth = (): void => {
    const isInMonth = (transaction_date: Date) => {
      if (activeMonth) {
        const date = new Date(transaction_date)
        const lastDayOfMonth = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0);
        return date >= activeMonth && date <= lastDayOfMonth
      }

      return false;
    }

    const filteredTransations = dataContext?.transactions?.filter((tr: any) => isInMonth(tr.date)) || []
    return filteredTransations;
  }
  
  useEffect(() => {
    if (activeMonth) {
      const transactions = getTransactionsByActiveMonth();
      setFilteredTransactions(transactions);
    }
  }, [activeMonth])

  useEffect(() => {


    // setActiveMonth(currentMonth);

    // Get transaction total amount based on date range.

    // Get transaction totals for all categories.

    // 
    // 
    if (dataContext.categories && filteredTransations) {

      const expense_categories = dataContext.categories.reduce((acc: any, curr: any) => {
        const label = curr.title
        let value = 0;

        filteredTransations.forEach((transaction: any) => {
          const { amount, category, is_income } = transaction
          if (category === label && !is_income) {
            value += Number(parseFloat(amount))
          }
        })

        if (value > 0) {
          acc.push({ label, value })
        }

        return acc;
      }, []);
      expense_categories.sort((a: any, b: any) => a.value - b.value)
      const expense_labels = expense_categories.map((exp: any) => exp.label)
      const expense_values = expense_categories.map((exp: any) => exp.value)

      const total_exp = expense_categories.reduce((acc: any, curr: any) => acc += curr.value, 0)
      setTotalExpenses(total_exp)
      const dataExp = {
        labels: expense_labels,
        datasets: [
          {
            data: expense_values
          }
        ]
      }
      const options = {
          plugins: {
              legend: {
                  labels: {
                      usePointStyle: true
                  }
              }
          },
          onClick: (e: MouseEvent, el: any) => {
            const category = expense_categories[el[0].index]
            navigate(`/transactions?category=${category.label}`)
          }
      };
  
      setExpensesData(dataExp);
      setChartOptions(options);
    }

  }, [dataContext.categories, filteredTransations]);

  useEffect(() => {
    if (!activeMonth && dataContext.transactions) {
      setActiveMonth(initalCurrentMonth())
    }
  }, [dataContext.transactions])

  const Logo = () => (
    <h2 className="font-bold text-xl">
      Dashboard
    </h2>
  )

  const Filters = () => (
    <div className="flex items-center gap-2">
      <label htmlFor="currentMonth">Current Month</label>
      <Calendar
        inputId="currentMonth"
        className="p-inputtext-sm"
        value={activeMonth}
        onChange={(e) => setActiveMonth(e.value as Date)}
        view="month"
        dateFormat="mm/yy"
      />
    </div>
  )

  return (
    <div>
      <Toolbar
        start={<Logo />}
        end={<Filters />}
        className='px-0'
      />
      <hr />
      <div className='flex justify-center flex-col md:flex-row gap-8 py-8 max-w-[1180px] mx-auto'>
        <div className='w-full md:w-1/2 justify-center'>
          <h2 className="font-bold text-xl text-center">
            Projected
          </h2>
          <h3 className='text-lg text-center'>
            total : { totalExpenses }
          </h3>
          <Chart type="pie" data={expensesData} options={chartOptions} />
        </div>
        <div className='w-full md:w-1/2 justify-center'>
          <h2 className="font-bold text-xl text-center">
            Actual
          </h2>
          <h3 className='text-lg text-center'>
            total : { totalExpenses }
          </h3>
          <Chart type="pie" data={expensesData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;