import { Routes, Route, Outlet, Link } from "react-router-dom";

import BaseNav from './components/BaseNav';
import BaseFooter from './components/BaseFooter';

import Dashboard from '@pages/Dashboard';
import Transactions from '@pages/Transactions';
import TransactionDetail from '@pages/TransactionDetail';
import Categories from '@pages/Categories';
import FourOhFourPage from '@pages/404';

// import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/themes/mdc-light-deeppurple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import styles from './App.module';
import './main.css';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/transactions">
            <Route index element={<Transactions />} />
            <Route path=":transactionId" element={<TransactionDetail />} />
            <Route path="*" element={<TransactionDetail />} />
          </Route>


          <Route path="categories" element={<Categories />} />

          {/* 
            Using path="*"" means "match anything", so this route
            acts like a catch-all for URLs that we don't have explicit
            routes for. 
          */}
          <Route path="*" element={<FourOhFourPage />} />
        </Route>
      </Routes>
    </>
  );
};

function Layout() {
  return (
    <div className="h-full flex flex-col">
      <header>
        <BaseNav />
      </header>
      <hr />
      <main className="container mx-auto p-4">
        {/*
          An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. 
        */}
        <Outlet />
      </main>
      <div className="mt-auto">
        <BaseFooter />
      </div>
    </div>
  );
}

export default App;