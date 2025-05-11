import { h } from "preact";

export interface Schedule {
  date: string;
  shift: string;
}

export default function CalendarTable({ data }: { data: Schedule[] }) {
  return (
    <table class="w-full table-auto bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 text-left text-navy">Date</th>
          <th class="p-2 text-left text-navy">Shift</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} class="border-b border-gray-300">
            <td class="p-2">{row.date}</td>
            <td class="p-2">{row.shift}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
