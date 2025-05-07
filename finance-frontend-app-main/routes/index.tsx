import { Handlers, PageProps } from "$fresh/server.ts";
import Sidebar from "../islands/Sidebar.tsx";
import axios from "npm:axios";

interface Income {
  id: number;
  amount: number;
  description: string;
  date: string;
}

interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
}

interface DashboardData {
  incomes: Income[];
  expenses: Expense[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recentTransactions: Array<{
    description: string;
    amount: number;
    type: "income" | "expense";
  }>;
}

export const handler: Handlers<DashboardData> = {
  async GET(_, ctx) {
    try {
      // Obtener ingresos y gastos en paralelo
      const [incomesRes, expensesRes] = await Promise.all([
        axios.get<Income[]>("http://localhost:8080/incomes/all"),
        axios.get<Expense[]>("http://localhost:8080/expenses/all"),
      ]);

      const incomes = incomesRes.data || [];
      const expenses = expensesRes.data || [];

      // Calcular totales
      const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
      const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
      const balance = totalIncome - totalExpense;

      // Crear lista de transacciones recientes (combinando y ordenando por fecha)
      const allTransactions = [
        ...incomes.map(inc => ({
          description: inc.description,
          amount: inc.amount,
          date: new Date(inc.date),
          type: "income" as const
        })),
        ...expenses.map(exp => ({
          description: exp.description,
          amount: exp.amount,
          date: new Date(exp.date),
          type: "expense" as const
        }))
      ].sort((a, b) => b.date.getTime() - a.date.getTime());

      // Tomar las 5 transacciones más recientes
      const recentTransactions = allTransactions.slice(0, 5);

      return ctx.render({
        incomes,
        expenses,
        totalIncome,
        totalExpense,
        balance,
        recentTransactions
      });
    } catch (error) {
      console.error("Error obteniendo datos del dashboard:", error);
      return ctx.render({
        incomes: [],
        expenses: [],
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        recentTransactions: []
      });
    }
  },
};

export default function Home({ data }: PageProps<DashboardData>) {
  const { totalIncome, totalExpense, balance, recentTransactions } = data;
  
  // Formato para mostrar montos con dos decimales
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  return (
    <div class="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar />
      <main class="flex-1 p-8 grid grid-cols-3 gap-6">
        {/* Cards */}
        <div class="col-span-3 grid grid-cols-3 gap-4">
          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
            <h2 class="text-gray-500 text-sm mb-2">Balance</h2>
            <p class={`text-2xl font-semibold ${balance >= 0 ? 'text-navy' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
            <h2 class="text-gray-500 text-sm mb-2">Income</h2>
            <p class="text-2xl font-semibold text-navy">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
            <h2 class="text-gray-500 text-sm mb-2">Expenses</h2>
            <p class="text-2xl font-semibold text-navy">
              {formatCurrency(totalExpense)}
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6 col-span-1">
          <h3 class="text-lg font-medium mb-4 text-navy">Recent Transactions</h3>
          <ul class="text-sm space-y-2">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx, index) => (
                <li key={index} class="flex justify-between">
                  <span>{tx.description}</span>
                  <span class={tx.type === "income" ? "text-green-600" : "text-red-600"}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>
                </li>
              ))
            ) : (
              <li class="text-gray-500">No transactions found</li>
            )}
          </ul>
        </div>

        {/* Chart */}
        <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6 col-span-2">
          <h3 class="text-lg font-medium mb-4 text-navy">Income & Expense Summary</h3>
          <div class="h-40 bg-gray-100 rounded-md shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] flex items-center justify-center text-gray-500">
            [ Chart would go here ]
          </div>
        </div>
      </main>
    </div>
  );
}
