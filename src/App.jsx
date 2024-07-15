import  { useState, useEffect, useRef } from 'react';
import { fetchData } from './api';
import 'tailwindcss/tailwind.css';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import banner from './assets/Banner.png'

Chart.register(CategoryScale);

function App() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionsId, setTransactionsId] = useState([]);
  const [transactionsAmount, setTransactionsAmount] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData();
      setCustomers(data.customers);
      setTransactions(data.transactions);
      setTransactionsAmount(data.transactions);
      setTransactionsId(data.transactions);
      setFilteredTransactions(data.transactions);
    };
    getData();
  }, []);
  const handleFilterCustomerID = (customerId) => {
    let filtered = transactionsAmount;
      filtered = filtered.filter(transaction => transaction.customer_id === parseInt(customerId));
    setFilteredTransactions(filtered);
    setTransactionsId(transactions.filter(transaction => transaction.customer_id === parseInt(customerId)));
  };
 
  const handleFilterAmount = (amount) => {
    let filtered = transactionsId;
      filtered = filtered.filter(transaction => transaction.amount === parseInt(amount));
    setFilteredTransactions(filtered);
    setTransactionsAmount(transactions.filter(transaction => transaction.amount === parseInt(amount)))
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomer(customers.find(customer => customer.id == parseInt(customerId)));
  };

  const chartData = () => {
    if (!selectedCustomer) return {};

    const customerTransactions = transactions.filter(transaction => transaction.customer_id == selectedCustomer.id);
    const dates = [...new Set(customerTransactions.map(transaction => transaction.date))];
    const amounts = dates.map(date => {
      return customerTransactions.filter(transaction => transaction.date == date).reduce((sum, transaction) => sum + transaction.amount, 0);
    });

    return {
      labels: dates,
      datasets: [{
        label: `Total amount per day for ${selectedCustomer.name}`,
        data: amounts,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
  };

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (selectedCustomer && chartContainerRef.current) {
      chartInstanceRef.current = new Chart(chartContainerRef.current, {
        type: 'line',
        data: chartData(),
        options: {
          responsive: true,
        },
      });
    }
  }, [selectedCustomer]);

  return (
    
    <div className=" ">
<img src={banner} alt="" />
<div className="container mx-auto p-8 bg-gray-50 min-h-screen">

<div className="bg-white p-6 rounded-lg shadow-md">
  
    {/* <h1 className="text-3xl font-bold text-cyan-950 mb-6">CUSTOMER JOURNEY</h1> */}
      <div className="mb-4 p-4 bg-white shadow rounded-lg flex">
        <div className='w-1/2 p-4'>
        <label className="block mb-2 text-lg">Filter by customer name :</label>
        <select 
          className=" block w-full p-2 border border-cyan-900 rounded mb-4" 
          onChange={(e) => handleFilterCustomerID(e.target.value)}
        >
          <option value="">All</option>
          {customers.map(customer => (
            <option  key={customer.id} value={customer.id}>{customer.name}</option>
          ))}
        </select></div>
        <div className='w-1/2 p-4'>
        <label className="block mb-2 text-lg">Filter by transaction amount :</label>
        <input 
          type="number" 
          className="block w-full p-2 border border-cyan-900 rounded mb-4" 
          onChange={(e) => handleFilterAmount( e.target.value)} 
        /></div>
      </div>
      <table className="min-w-full bg-white ">
        <thead>
          <tr className="space-y-4 ">
            <th className="bg-cyan-600 p-4 space-y-1 rounded-full text-lg font-semibold text-gray-700">Customer</th>
            <th className="bg-cyan-900 p-4 rounded-full text-lg font-semibold text-white">Date</th>
            <th className="bg-cyan-900 p-4 rounded-full text-lg font-semibold text-white">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction.id} className=" space-y-4">
              <td className="text-center  bg-cyan-100 p-4  text-lg rounded-full ">{customers.find(customer => customer.id == transaction.customer_id)?.name}</td>
              <td className="text-center hover:bg-cyan-50  rounded-full py-2 px-4 ">{transaction.date}</td>
              <td className="text-center hover:bg-cyan-50  rounded-full py-2 px-4 ">{transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="mt-4 p-4 bg-white shadow rounded-lg">
        <label className="block mb-2 text-lg">Select customer for chart:</label>
        <select 
          className="block w-full p-2 border border-gray-300 rounded" 
          onChange={(e) => handleSelectCustomer(e.target.value)}
        >
          <option value="">None</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>{customer.name}</option>
          ))}
        </select>
      </div>
      {selectedCustomer && <div className="mt-4 p-4 bg-white shadow rounded-lg">
        <canvas ref={chartContainerRef}></canvas>
      </div>}
    </div>
    
      
    </div>
  );
}

export default App;