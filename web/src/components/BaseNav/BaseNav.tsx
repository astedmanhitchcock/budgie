import { Link } from "react-router-dom";
import { Menubar } from 'primereact/menubar';

import './BaseNav.scss'

const BaseNav: React.FC = () => {
  const navItems = [
    {
      label: 'transactions',
      url: '/transactions'
    },
    {
      label: 'categories',
      url: '/categories'
    }
  ]

  const start = () => (
    <Link to="/">
      <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" width="40" className="mr-2"></img>
    </Link>
  );

  return (
    <div className="card">
      <Menubar model={navItems} start={start} />
    </div>
  )
};

export default BaseNav;
