import React from 'react';
import CustomerMonthlyPointsTable from './components/table/CustomerMonthlyPointsTable';
import CustomerTotalPointsTable from './components/table/CustomerTotalPointsTable';
import Header from "./components/header/Header";
    
function App() {
    
    return (
    <React.Fragment>
     <Header />
     <CustomerMonthlyPointsTable/>
     <CustomerTotalPointsTable />
    </React.Fragment>    
    )
  }
  
  export default App;