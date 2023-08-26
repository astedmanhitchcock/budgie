// import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

// export interface transaction {
//   id: string;
// }

// export interface TransactionDetailProps {
//   id: string
// }

const TransactionDetail: React.FC = () => {
  // const [transaction, setTransaction] = useState<transaction | undefined>(undefined);
  // const [pageError, setPageError] = useState<boolean>(false);
  const { transactionId } = useParams();

  // useEffect(() => {
  //   const getTransaction = async () => {
  //     fetch(`${process.env.API_URL}transactions/${transactionId}`, {
  //       method: "GET"
  //     }).then(async (res) => {
  //       if (res.ok) {
  //         const jsonData = await res.json();
  //         setTransaction(jsonData);
          
  //         console.log('transactions :: ', jsonData);
  //       } else {
  //         console.log('res err? :: ', res);
  //         setPageError(true);
  //       }
  //     }).catch(err => {
  //       console.log('error :: ', err);
  //       setPageError(true);
  //     });
  //   };
  //   getTransaction();

  // }, []);

  return (
    <div>
      Transaction Detail :: {transactionId}
      {/* {pageError && (
        <>
        Error getting data.
        </>
      )}
      {transaction && (
        <h2>transaction.amount</h2>
      )} */}
      {/* {allTransactions.length && (
        <DataTable value={allTransactions}>
          <Column field="date" header="date"></Column>
          <Column field="amount" header="amount"></Column>
          <Column field="category" header="category"></Column>
          <Column field="source" header="source"></Column>
          <Column field="created_by" header="user"></Column>
          <Column field="notes" header="notes"></Column>
        </DataTable>
      )} */}
    </div>
  )
}

export default TransactionDetail;