import { Handlers, PageProps } from "$fresh/server.ts";
import Sidebar from "../islands/Sidebar.tsx";
import { NewButton } from "../islands/NewButton.tsx";
import axios from "npm:axios";
import { EditItemModal } from "../islands/EditItemModal.tsx";
import { DeleteButton } from "../islands/DeleteButton.tsx";

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  category: {
    id: number;
    name: string;
  };
}

interface ExpensesData {
  expenses: Expense[];
  totalAmount: number;
  topCategory: string;
  monthlyAverage: number;
}

export const handler: Handlers<ExpensesData> = {
  async GET(_, ctx) {
    const API_URL = "http://localhost:8080/expenses/all";

    try {
      const response = await axios.get<Expense[]>(API_URL);
      const expenses = response.data || [];
      
      // Calcular total de gastos
      const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Encontrar la categoría con mayor gasto
      const categoryTotals = expenses.reduce((acc, expense) => {
        const categoryName = expense.category?.name || "Sin categoría";
        acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);
      
      // Obtener la categoría con mayor gasto
      let topCategory = "Ninguna";
      let maxAmount = 0;
      
      Object.entries(categoryTotals).forEach(([category, amount]) => {
        if (amount > maxAmount) {
          topCategory = category;
          maxAmount = amount;
        }
      });
      
      // Calcular promedio mensual (simplificado - dividimos por 12)
      const monthlyAverage = totalAmount / 12;

      return ctx.render({ 
        expenses, 
        totalAmount, 
        topCategory, 
        monthlyAverage 
      });
    } catch (error) {
      console.error("Error al obtener los gastos:", error);
      return ctx.render({
        expenses: [],
        totalAmount: 0,
        topCategory: "Ninguna",
        monthlyAverage: 0
      });
    }
  },
};

export default function Expenses({ data }: PageProps<ExpensesData>) {
  const { expenses, totalAmount, topCategory, monthlyAverage } = data;

  // Formato para mostrar montos con dos decimales
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  return (
    <div class="flex h-screen overflow-hidden bg-gray-100 font-sans">
      <Sidebar />
      <main class="flex-1 p-8 flex flex-col overflow-hidden">
        <h1 class="text-2xl font-bold text-navy mb-6">Expenses</h1>
        
        {/* Summary cards */}
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
            <h2 class="text-gray-500 text-sm mb-2">Total Expenses</h2>
            <p class="text-2xl font-semibold text-red-600">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
            <h2 class="text-gray-500 text-sm mb-2">Top Category</h2>
            <p class="text-2xl font-semibold text-navy">
              {topCategory}
            </p>
          </div>
          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
            <h2 class="text-gray-500 text-sm mb-2">Monthly Average</h2>
            <p class="text-2xl font-semibold text-navy">
              {formatCurrency(monthlyAverage)}
            </p>
          </div>
        </div>

        <div class="flex justify-end mb-6">
          <NewButton 
            resource="expenses" 
            label="Expense" 
            onSuccess={() => window.location.reload()}
          />
        </div>
        
        {/* Expenses table - con altura fija y scroll interno */}
        <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6 flex-1 flex flex-col overflow-hidden">
          <div class="overflow-y-auto flex-1 custom-scrollbar">
            <table class="w-full table-fixed">
              <colgroup>
                <col class="w-[30%]" />
                <col class="w-[20%]" />
                <col class="w-[15%]" />
                <col class="w-[15%]" />
                <col class="w-[10%]" />
                <col class="w-[10%]" />
              </colgroup>
              <thead class="sticky top-0 bg-gray-100 z-10">
                <tr class="border-b border-gray-300">
                  <th class="py-3 px-6 text-left font-medium text-navy">Description</th>
                  <th class="py-3 px-6 text-left font-medium text-navy">Category</th>
                  <th class="py-3 px-6 text-right font-medium text-navy">Amount</th>
                  <th class="py-3 px-6 text-left font-medium text-navy">Date</th>
                  <th class="py-3 px-6 text-left font-medium text-navy">User</th>
                  <th class="py-3 px-6 text-right font-medium text-navy">Actions</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-4 px-6">{expense.description}</td>
                    <td class="py-4 px-6">{expense.category.name}</td>
                    <td class="py-4 px-6 text-right text-red-600">-${expense.amount}</td>
                    <td class="py-4 px-6">{expense.date}</td>
                    <td class="py-4 px-6">{expense.user.name}</td>
                    <td class="py-4 px-6 text-right flex justify-end space-x-2">
                      <EditItemModal
                        resource="expenses"
                        item={expense}
                        fields={["description", "amount", "date"]} // campos a editar
                        onSuccess={() => window.location.reload()}
                      />
                      <DeleteButton
                        resource="expenses"
                        id={expense.id}
                        onSuccess={() => window.location.reload()}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}