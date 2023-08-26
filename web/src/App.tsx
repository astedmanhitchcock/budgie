import { createContext, useContext, useEffect, useState } from 'react';
import { Routes, Route, Outlet, Link } from "react-router-dom";

import BaseNav from './components/BaseNav/BaseNav';
import BaseFooter from './components/BaseFooter';

import Dashboard from '@pages/Dashboard';
import Transactions from '@pages/Transactions';
import TransactionDetail from '@pages/TransactionDetail';
import Categories from '@pages/Categories';
import FourOhFourPage from '@pages/404';

import { CategoriesService } from './services/CategoriesService';

import './main.scss';

// import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/themes/mdc-light-deeppurple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


export const DataContext = createContext(null)
export const UiContext = createContext(null)

const Provider: Context<unknown> = ({ children, transactions, categories, users, setTransactions, setUsers, setCategories }: any) => {
  const [windowWidth, setWindowWidth]   = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isMobile, setIsMobile] = useState(false);

  const updateDimensions = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);

    setIsMobile(window.innerWidth < 768)
  }

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <DataContext.Provider value={{transactions, categories, users, setTransactions, setUsers, setCategories}}>
      <UiContext.Provider value={{isMobile}}>
        { children }
      </UiContext.Provider>
    </DataContext.Provider>
  );
}

export const useDataContext = () => {
  return useContext(DataContext);
}

export const useUiContext = () => {
  return useContext(UiContext);
}

const App: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState(undefined);
  const [allCategories, setAllCategories] = useState(undefined);
  const [allUsers, setAllUsers] = useState(undefined);

  const getTransactions = async () => {
    fetch(`${process.env.API_URL}transactions`, {
      method: "GET"
    }).then(async (res) => {
      if (res.ok) {
        const jsonData = await res.json();
        console.log('transactions received! :: ', jsonData);
        setAllTransactions(jsonData);
      } else {
        console.log('res err? :: ', res);
      }
    }).catch(err => {
      console.log('error :: ', err);
    });
  };

  const getCategories = async () => {
    CategoriesService.getData().then((data) => {
      setAllCategories(data)
    })
  };  

  const getUsers = async () => {
    fetch(`${process.env.API_URL}users`, {
      method: "GET"
    }).then(async (res) => {
      if (res.ok) {
        const jsonData = await res.json();
        // console.log('users! :: ', jsonData);
        setAllUsers(jsonData)
      } else {
        console.log('res err? :: ', res);
      }
    }).catch(err => {
      console.log('error :: ', err);
    });
  };

  useEffect(() => {
    getTransactions();
    getUsers();
    getCategories();
  }, [])

  return (
    <Provider
      transactions={allTransactions}
      setTransactions={setAllTransactions} 
      categories={allCategories}
      setCategories={setAllCategories}
      users={allUsers}
      setUsers={setAllUsers}
    >
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
    </Provider>
  );
};


function Layout() {

  return (
    <div className="h-full flex flex-col">
      <header>
        <BaseNav />
      </header>
      <hr />
      <main className="p-4">
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