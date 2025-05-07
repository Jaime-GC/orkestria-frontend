import { Handlers, PageProps } from "$fresh/server.ts";
import Sidebar from "../islands/Sidebar.tsx";
import { NewButton } from "../islands/NewButton.tsx";
import axios from "npm:axios";
import { EditItemModal } from "../islands/EditItemModal.tsx";
import { DeleteButton } from "../islands/DeleteButton.tsx";

interface Income {
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

interface IncomesData {
  incomes: Income[];
  totalAmount: number;
  topSource: string;
  monthlyAverage: number;
}

export const handler: Handlers<IncomesData> = {
  async GET(_, ctx) {
    const API_URL = "http://localhost:8080/incomes/all";

    try {
      const response = await axios.get<Income[]>(API_URL);
      const incomes = response.data || [];
      
      // Calcular total de ingresos
      const totalAmount = incomes.reduce((sum, income) => sum + income.amount, 0);
      
      // Encontrar la categoría con mayor ingreso
      const categoryTotals = incomes.reduce((acc, income) => {
        const categoryName = income.category?.name || "Sin categoría";
        acc[categoryName] = (acc[categoryName] || 0) + income.amount;
        return acc;
      }, {} as Record<string, number>);
      
      // Obtener la categoría con mayor ingreso
      let topSource = "Ninguna";
      let maxAmount = 0;
      
      Object.entries(categoryTotals).forEach(([category, amount]) => {
        if (amount > maxAmount) {
          topSource = category;
          maxAmount = amount;
        }
      });
      
      // Calcular promedio mensual (simplificado - dividimos por 12)
      const monthlyAverage = totalAmount / 12;

      return ctx.render({ 
        incomes, 
        totalAmount, 
        topSource, 
        monthlyAverage 
      });
    } catch (error) {
      console.error("Error al obtener los ingresos:", error);
      return ctx.render({
        incomes: [],
        totalAmount: 0,
        topSource: "Ninguna",
        monthlyAverage: 0
      });
    }
  },
};

export default function Incomes({ data }: PageProps<IncomesData>) {
  const { incomes, totalAmount, topSource, monthlyAverage } = data;

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
        <h1 class="text-2xl font-bold text-navy mb-6">Incomes</h1>

        {/* Summary cards */}
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
            <h2 class="text-gray-500 text-sm mb-2">Total Income</h2>
            <p class="text-2xl font-semibold text-green-600">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
            <h2 class="text-gray-500 text-sm mb-2">Top Source</h2>
            <p class="text-2xl font-semibold text-navy">
              {topSource}
            </p>
          </div>
          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
            <h2 class="text-gray-500 text-sm mb-2">Monthly Average</h2>
            <p class="text-2xl font-semibold text-navy">
              {formatCurrency(monthlyAverage)}
            </p>
          </div>
        </div>

        {/* New income button as modal */}
        <div class="flex justify-end mb-6">
          <NewButton
            resource="incomes"
            label="Income"
            onSuccess={() => window.location.reload()}
          />
        </div>

        {/* Incomes table */}
        <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]
                    p-6 flex-1 flex flex-col overflow-hidden">
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
                {incomes.map((income) => (
                  <tr key={income.id} class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-4 px-6">{income.description}</td>
                    <td class="py-4 px-6">{income.category?.name ?? "-"}</td>
                    <td class="py-4 px-6 text-right text-green-600">
                      +${income.amount}
                    </td>
                    <td class="py-4 px-6">{income.date}</td>
                    <td class="py-4 px-6">{income.user?.name ?? "-"}</td>
                    <td class="py-4 px-6 text-right">
                      <EditItemModal
                        resource="incomes"
                        item={income}
                        fields={["description", "amount", "date"]}
                        onSuccess={() => window.location.reload()}
                      />
                      <DeleteButton
                        resource="incomes"
                        id={income.id}
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