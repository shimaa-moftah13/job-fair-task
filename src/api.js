
export const fetchData = async () => {
    const responseCustomers = await fetch("https://task-api-dusky.vercel.app/customers");
    const customers = await responseCustomers.json();
  
    const responseTransactions = await fetch(
      "https://task-api-dusky.vercel.app/transactions"
    );
    const transactions = await responseTransactions.json();
  
    return { customers, transactions };
  };