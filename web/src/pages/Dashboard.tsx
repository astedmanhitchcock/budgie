import { useEffect, useState } from 'react';

import { Calendar } from 'primereact/calendar';
import { Chart } from 'primereact/chart';
import { Toolbar } from 'primereact/toolbar';

import { useDataContext } from '../App';

const initalCurrentMonth = (): Date => {
  var date = new Date();
  const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return currentMonth;
}

const Dashboard: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState<Date>(initalCurrentMonth());
  const [transactions, setTransactions] = useState<any>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  const [expensesData, setExpensesData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const dataContext: any = useDataContext();

  const getTransactionsByActiveMonth = (): void => {
    const isInMonth = (transaction_date: Date) => {
      const date = new Date(transaction_date)
      const lastDayOfMonth = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0);
      return date >= activeMonth && date <= lastDayOfMonth
    }

    const filteredTransations = dataContext?.transactions?.filter((tr: any) => isInMonth(tr.date)) || []
    return filteredTransations;
  }
  
  useEffect(() => {
    const transactions = getTransactionsByActiveMonth();
    setTransactions(transactions);
  }, [activeMonth])

  useEffect(() => {

    // setActiveMonth(currentMonth);

    // Get transaction total amount based on date range.

    // Get transaction totals for all categories.

    // 
    // 
    if (dataContext.categories && transactions) {

      const expense_categories = dataContext.categories.reduce((acc: any, curr: any) => {
        const label = curr.title
        let value = 0;

        transactions.forEach((transaction: any) => {
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
          }
      };
  
      setExpensesData(dataExp);
      setChartOptions(options);
    }

  }, [dataContext.categories, transactions]);

  return (
    <div>
      <Toolbar
        start={
          <h2 className="font-bold text-xl">
            Dashboard
          </h2>
        }
        end={
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
        }
      />

      <hr />
      <div>
        <h2 className="font-bold text-xl">
          Total Expenses: {totalExpenses}
        </h2>
        <h2 className="font-bold text-xl">
          Total Income: {totalIncome}
        </h2>
      </div>
      <div>
        <h2 className="font-bold text-xl text-center">
          Expenses
        </h2>
        <div className="card flex justify-center">

          <Chart type="pie" data={expensesData} options={chartOptions} className="w-full md:w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;