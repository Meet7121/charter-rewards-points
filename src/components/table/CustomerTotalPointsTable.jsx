import {flexRender, useReactTable, getCoreRowModel} from '@tanstack/react-table';
import { useMemo } from 'react'
import mData from '../../reward.json' 

function calculateResults(incomingData) {
    // Calculate points per transaction
   
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const pointsPerTransaction = incomingData.map(transaction=> {
      let points = 0; //120
      let over50 = 0;
      let over100 = transaction.amount - 100; //20
      if(transaction.amount < 101 && transaction.amount > 50){
       over50 = transaction.amount - 50;
      }
      if(transaction.amount > 100){
         over50 = transaction.amount - over100 - 50;
      }
      if (over100 > 0) {
        // A customer receives 2 points for every dollar spent over $100 in each transaction      
        points += (over100 * 2);
      }    
      if (transaction.amount > 49) {
        // plus 1 point for every dollar spent over $50 in each transaction
        points += over50;      
      }
      const month = new Date(transaction.transactionDt).getMonth();
      return {...transaction, points, month};
    });
                 
    let byCustomer = {};
    let totalPointsByCustomer = {};
    pointsPerTransaction.forEach(pointsPerTransaction => {
       
      let {_id, name, month, points, amount} = pointsPerTransaction;   
      if (!byCustomer[_id]) {
        byCustomer[_id] = [];      
      }    
      if (!totalPointsByCustomer[name]) {
        totalPointsByCustomer[name] = 0;
      }
      totalPointsByCustomer[name] += points;
      if (byCustomer[_id][month]) {
          
        byCustomer[_id][month].points += points;
        byCustomer[_id][month].monthNumber = month;
        byCustomer[_id][month].amount += amount;
        byCustomer[_id][month].numTransactions++;      
      }
      else {
        
        byCustomer[_id][month] = {
          _id,
          name,
          monthNumber:month,
          month: months[month],
          numTransactions: 1,        
          points,
          amount
        }
      }    
    });
    
    let groupByCustomer = [];
    for (var custKey in byCustomer) {    
      byCustomer[custKey].forEach(row=> {
        groupByCustomer.push(row);
      });    
    }
   
    let totByCustomer = [];
    for (custKey in totalPointsByCustomer) {    
      totByCustomer.push({
        name: custKey,
        points: totalPointsByCustomer[custKey]
      });    
    }
    
    
    return {
      summaryByCustomer: groupByCustomer,
      totalPointsByCustomer:totByCustomer
    };
  }

function CustomerTotalPointsTable() {
    
    const columns = [
      {
        id: 1,
        header:'Customer',
        accessorKey: 'name'      
      },    
      {
        id: 2,
        header:'Total Points',
        accessorKey: 'points'
      }
    ];

    const data = useMemo(() => mData, []);
    const transactionData = calculateResults(data);
    const table = transactionData && useReactTable({
        data: transactionData.totalPointsByCustomer, 
        columns,
        getCoreRowModel: getCoreRowModel()
     });

    return (
    <div className="w3-container">    
        <div className="row">
            <div className="col-10">
            <h2>Customer's total reward points accumulation</h2>
            </div>
        </div>      
        <div className="row">
            <div className="col-8">
            <table className="w3-table-all">
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header =>(
                        <th key={header.id}>
                        {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                        </th>
                    ))}
                </tr> 
                ))}
            </thead>
            <tbody>
                {transactionData && table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell =>(
                            <td key={cell.id}>
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                            </td>
                        ))}
                    </tr> 
                    ))}
                </tbody> 
            </table>
            </div>
        </div>
    </div>    
    )
  }
  
  export default CustomerTotalPointsTable;