import { MouseEvent, useEffect, useState } from 'react';
import classnames from 'classnames';

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from "primereact/checkbox";
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from "primereact/inputtextarea";

import { useDataContext } from '../App';
import { useUiContext } from '../App';


interface TransactionForm {
  [key: string]: string | number | boolean | Date | undefined,
  id?: string,
  amount?: number,
  is_income?: boolean,
  source?: string,
  date?: Date,
  created_by?: string,
  category?: string,
  notes?: string
}

interface TransactionModalProps {
  transaction?: TransactionForm
}

const EditTransactionModal: React.FC<TransactionModalProps> = ({transaction}) => {
  const dataContext: any = useDataContext();
  const uiContext: any = useUiContext();

  const initalFormValue = transaction || {
    amount: undefined,
    is_income: false,
    source: undefined,
    date: undefined,
    created_by: undefined,
    category: undefined,
    notes: undefined
  }

  const requiredFields = ['amount', 'source', 'date', 'created_by', 'category']

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<TransactionForm>(initalFormValue)
  const [formErrors, setFormErrors] = useState<string[]>([])

  const submitBtnText = transaction?.id ? "update" : "create"
  const endpoint = transaction?.id ? "update-transaction" : "create-transaction"

  const handleClick = () => {
    setIsVisible(!isVisible)
  }

  const handleFieldUpdate = (value: any, fieldName: string) => {
    const data: {[key: string]: any} = {...formData}
    data[fieldName] = value;
    setFormData(data);
  }

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const isValid = checkForm();

    console.log('formData.created_by?.username : ', formData.created_by?.username)
    // Need to translate the dropdown values.
    // Currently DB only stores strings not the whole object.
    // @todo - issue also seen in useEffect below. Need to address this.
    const sanitizedFormData = {...formData}
    sanitizedFormData['created_by'] = formData.created_by?.id;
    sanitizedFormData['category'] = formData.category?.title;
    
    console.log('formData : ', formData);
    console.log('sanitizedFormData : ', sanitizedFormData);

    if (!isValid) return;

    // Send off data.
    const data = {
      ...transaction,
      ...sanitizedFormData
    }
    console.log('data sent : ', data);

    fetch(`${process.env.API_URL}${endpoint}`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then((res) => res.json())
      .then(data => { 
        dataContext?.setTransactions(data)
        setIsVisible(false)
      });
  }

  const checkForm = () => {
    const errors: string[] = [];
    const formKeys = Object.keys(formData);
    // Check all necessary data is present.
    formKeys.forEach((key: string) => {
      if (!formData[key] && requiredFields.includes(key)) {
        errors.push(key)
      }
    });

    setFormErrors(errors)

    return errors.length < 1;
  }

  const resetForm = () => {
    setFormData(initalFormValue);
    setFormErrors([]);
  }

  const dialogHeader = () => {
    const id = transaction?.id;
    const title = id ? `Edit Transaction # ${transaction.id}` : 'Add New Transaction'
    return title;
  }

  // useEffect(() => {
  //   console.log('transaction?? ', transaction)
  // }, [])

  useEffect(() => {
    if (!isVisible) {
      resetForm()
    }

    if (isVisible && transaction) {
      const created_by = dataContext?.users.find((user: any) => user.username === transaction?.created_by)
      const category = dataContext?.categories.find((category: any) => category.title === transaction?.category)
      setFormData({
        ...transaction,
        created_by: created_by,
        category
      })
    }

  }, [isVisible])

  // useEffect(() => {
  //   console.log('formData ', formData)
  // }, [formData])

  return (
    <>
      {transaction?.id ? (
        <Button
          aria-label="edit transaction"
          icon="pi pi-pencil"
          rounded
          severity="secondary"
          onClick={handleClick}
        />
      ) : (
        <Button
          icon="pi pi-plus"
          onClick={handleClick}
          label={!uiContext.isMobile ? "Create Transaction" : undefined}
        />
      )}

      <Dialog
        header={dialogHeader}
        visible={isVisible}
        className="w-screen md:w-[50vw] max-w-[400px]"
        onHide={() => setIsVisible(false)}
      >
        <form>
          <div className="flex items-center my-3">
            <Checkbox
              inputId='isIncome'
              onChange={() => handleFieldUpdate(!formData?.is_income, 'is_income')}
              checked={formData?.is_income || false}
            />
            <label htmlFor="isIncome" className="ml-2">
              is income?
            </label>
          </div>

          <div className="p-float-label my-5">
            <InputNumber
              inputId="amount"
              className={classnames('w-full', {'p-invalid': formErrors.includes('amount')})}
              placeholder="Amount"
              value={formData?.amount}
              onValueChange={(e) => handleFieldUpdate(e.value, 'amount')}
              mode="currency" currency="USD" locale="en-US"
            />
            <label htmlFor="amount">Amount</label>
          </div>

          <div className="p-float-label my-5">
            <InputText
              id='source'
              className={classnames('w-full', {'p-invalid': formErrors.includes('source')})}
              placeholder='Source'
              value={formData?.source}
              onChange={(e) => handleFieldUpdate(e.target.value, 'source')}
            />
            <label htmlFor='source'>Source</label>
          </div>

          <div className='p-float-label my-5'>
            <Calendar
              inputId='date'
              className={classnames('w-full', {'p-invalid': formErrors.includes('date')})}
              value={formData?.date ? new Date(formData?.date) : undefined}
              onChange={e => handleFieldUpdate(e.value as Date, 'date')}
              placeholder='Date of Transaction'
            />
            <label htmlFor='date'>Date of Transaction</label>
          </div>

          <div className="p-float-label my-5">
              <Dropdown
                inputId="user-select"
                value={formData?.created_by}
                onChange={(e) => handleFieldUpdate(e.value, 'created_by')}
                options={dataContext?.users}
                optionLabel="username"
                className={classnames('w-full', {'p-invalid': formErrors.includes('created_by')})}
                placeholder='Select User'
              />
              <label htmlFor="user-select">Select User</label>
          </div>

          <div className="p-float-label my-5">
              <Dropdown
                inputId="user-select"
                value={formData?.category}
                onChange={(e) => handleFieldUpdate(e.value, 'category')}
                options={dataContext?.categories}
                optionLabel="title"
                className={classnames('w-full', {'p-invalid': formErrors.includes('category')})}
                placeholder='Select Category'
              />
              <label htmlFor="user-select">Select Category</label>
          </div>

          <div className='p-float-label my-5'>
            <InputTextarea
              id="notes"
              placeholder='Notes'
              className='w-full'
              value={formData?.notes}
              onChange={(e) => handleFieldUpdate(e.target.value, 'notes')}
              rows={5}
            />
            <label htmlFor='notes'>
              Notes
            </label>
          </div>

          <Button
            icon="pi pi-check" 
            severity='secondary'
            onClick={handleSubmit}
            label={submitBtnText}
          />
        </form>
      </Dialog>
    </>
  )
}

export default EditTransactionModal;