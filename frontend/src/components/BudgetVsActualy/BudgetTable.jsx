import React from 'react';

const BudgetTable = ({ data }) => {
  return (
    <div className="w-full max-w-3xl" style={{ marginTop: '32px' }}>
      <h2 className="text-2xl font-semibold text-black dark:text-white" style={{ marginBottom: '16px' }}>
        Budget vs Actual
      </h2>
      <div
        className="overflow-x-auto bg-white dark:bg-black rounded-lg shadow-lg"
        style={{ padding: '16px' }}
      >
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white dark:bg-black text-black dark:text-white">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Budget</th>
              <th className="py-3 px-4 text-center">Actual Spent</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-black dark:text-white">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isOverBudget = item.spent > item.budgetAmount;
                return (
                  <tr
                    key={index}
                    className="border-b border-black dark:border-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
                  >
                    <td className="py-3 px-4 text-black dark:text-white">{item.category}</td>
                    <td className="py-3 px-4 text-center text-blue-500 dark:text-blue-400 font-semibold">
                      ₹{item.budgetAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center text-green-500 dark:text-green-400 font-semibold">
                      ₹{item.spent.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isOverBudget ? (
                        <span  style={{padding:"5px"}} className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-200 dark:bg-red-700 dark:text-red-300 rounded-lg">
                          Over Budget
                        </span>
                      ) : (
                        <span style={{padding:"5px"}}  className="px-3 py-1 text-sm font-semibold text-green-600 bg-green-200 dark:bg-green-700 dark:text-green-300 rounded-lg">
                          Within Budget
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetTable;
