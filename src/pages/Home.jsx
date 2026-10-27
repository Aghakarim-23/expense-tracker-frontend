import axios from "axios";
import { useState, useEffect } from "react";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";



const Home = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const getCards = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/cards`);
        setCards(res.data);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    getCards();
  }, []);

  const totalBalance = cards.reduce((total, item) => total + item.balance, 0);

  const totalBudget = cards.reduce(
    (total, item) => total + item.creditLimit,
    0,
  );

  const totalLoan = totalBudget - totalBalance;

  const chartData = [
  {
    name: "İstifadə edilmiş kredit",
    value: totalLoan,
  },
  {
    name: "Mövcud balans",
    value: totalBalance,
  },
];

const COLORS = ["#ef4444", "#22c55e"];

const percentage = totalBudget > 0 ? (totalLoan / totalBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Başlıq */}
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">Xərc İzləyici</p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">Kartlarım</h1>

          <p className="mt-2 text-gray-500">
            Kartlarınızı idarə edin və balanslarınızı izləyin.
          </p>
        </div>

        {/* Kartlar */}
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card._id}
              className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                card.bank === "BirKart"
                  ? "bg-gradient-to-br from-red-600 to-red-800"
                  : "bg-gradient-to-br from-orange-500 to-orange-700"
              }`}
            >
              {/* Decorative circles */}
              <div className="absolute -right-12 -top-12 h-40 w-50 rounded-full bg-white/10" />

              <div className="absolute -bottom-16 -left-10 h-40 w-46 rounded-full bg-white/5" />

              {/* Yuxarı hissə */}
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Bank</p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {card.bank}
                  </h2>
                </div>

                <div className="flex h-10 w-20 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white backdrop-blur">
                  ₼{`${card.creditLimit}`}
                </div>
              </div>

              {/* Çip */}
              <div className="relative mt-10">
                <div className="h-9 w-12 rounded-lg bg-gradient-to-br from-yellow-200 to-yellow-500 shadow-inner" />
              </div>

              {/* Kart nömrəsi */}
              <div className="relative mt-6">
                <p className="text-sm tracking-widest text-white/70">
                  KART NÖMRƏSİ
                </p>

                <p className="mt-2 text-lg font-medium tracking-[0.25em] text-white">
                  {card.bank === "Unibank"
                    ? `•••• •••• •••• 6317`
                    : `•••• •••• •••• 0525`}
                </p>
              </div>

              {/* Aşağı hissə */}
              <div className="relative mt-8 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase text-white/70">Kart sahibi</p>

                  <p className="mt-1 font-medium text-white">{card.name}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase text-white/70">Balans</p>

                  <p className="mt-1 text-2xl font-bold text-white">
                    ₼{card.balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ümumi balans */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ümumi balans</p>

              <h2 className="mt-1 text-3xl font-bold text-gray-900">
                ₼{totalBalance.toFixed(2)}
              </h2>
            </div>

            <div className="rounded-2xl bg-gray-100 px-4 py-3">
              <p className="text-sm font-medium text-gray-600">
                {" "}
                {cards.length} Kart
              </p>
            </div>
          </div>
        </div>

        {/* Ümumi büdcə */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ümumi büdcə olmalıdır</p>

              <h2 className="mt-1 text-3xl font-bold text-gray-900">
                ₼{totalBudget}
              </h2>
            </div>

            <div className="rounded-2xl bg-gray-100 px-4 py-3">
              <p className="text-sm font-medium text-gray-600">
                {" "}
                {cards.length} Kart
              </p>
            </div>
          </div>
        </div>

        {/* Ümumi borc */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ümumi borc</p>

              <h2 className="mt-1 text-3xl font-bold text-gray-900">
                ₼{totalLoan}
              </h2>
            </div>

            <div className="rounded-2xl bg-gray-100 px-4 py-3">
              <p className="text-sm font-medium text-gray-600">
                {" "}
                {cards.length} Kart
              </p>
            </div>
          </div>
        </div>

        {/* Borc statistikası */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Borc statistikası</h2>

          <p className="mt-1 text-sm text-gray-500">
            Kredit limitinin istifadə vəziyyəti
          </p>

          <div className="relative mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={115}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip formatter={(value) => `${value.toFixed(2)} ₼`} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">
                {percentage.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">İstifadə olunub</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm text-gray-600">
                Borc: {totalLoan.toFixed(2)} ₼
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">
                Balans: {totalBalance.toFixed(2)} ₼
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
