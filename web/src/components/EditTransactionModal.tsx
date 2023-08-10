import { useState } from 'react';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from "primereact/checkbox";

interface TransactionProps {
  id: string
  amount: number
  is_income: boolean,
  onClose: () => void
}

const EditTransactionModal: React.FC<TransactionProps> = (transaction) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isIncome, setIsIncome] = useState<boolean>(transaction?.is_income)
  const [amount, setAmount] = useState<number>(transaction?.amount)

  const handleClick = () => {
    setIsVisible(!isVisible)
  }

  const handleUpdateClick = (e: MouseEvent) => {
    e.preventDefault()
    // Send off data.
    const data = {
      ...transaction,
      amount,
      is_income: isIncome
    }
    fetch(`${process.env.API_URL}update-transaction`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then((res) => res.json())
      .then(data => { 
        console.log('data ! ', data)
        transaction.onClose()
        setIsVisible(false)
      });
  }

  return (
    <>
      <Button
        aria-label="edit transaction"
        icon="pi pi-pencil"
        rounded
        severity="secondary"
        onClick={handleClick}
      />
      <Dialog
        header={`Edit Transaction # ${transaction.id}`}
        visible={isVisible}
        style={{ width: '50vw' }}
        onHide={() => setIsVisible(false)}
      >
        Transaction Data:
        <form>
          <div className="flex align-items-center">
            <Checkbox
              onChange={() => setIsIncome(!isIncome)}
              checked={isIncome}
            />
            <label htmlFor="ingredient1" className="ml-2">is income?</label>
          </div>

          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">$</span>
            <InputNumber
              placeholder="amount"
              value={amount}
              onValueChange={(e) => setAmount(e.value)}
              />
          </div>
          <Button
            icon="pi pi-check" 
            severity='secondary'
            onClick={handleUpdateClick}
          >
            update
          </Button>
        </form>
      </Dialog>
    </>
  )
}

export default EditTransactionModal;