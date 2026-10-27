
import { useEffect, useState } from "react";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/transactions"
        );

        setTransactions(res.data);
      } catch (error) {
        console.error(error);
        setError("Əməliyyatları yükləmək mümkün olmadı.");
      } finally {
        setLoading(false);
      }
    };

    getTransactions();
  }, []);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const totalPayments = transactions
    .filter((item) => item.type === "payment")
    .reduce((total, item) => total + item.amount, 0);

  const filteredTransactions = transactions.filter((item) => {
    const matchesType =
      filter === "all" || item.type === filter;

    const searchText = `
      ${item.description || ""}
      ${item.category || ""}
      ${item.card?.bank || ""}
    `.toLowerCase();

    return (
      matchesType &&
      searchText.includes(search.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Əməliyyatlar yüklənir...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">
            Xərc İzləyici
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Əməliyyatlar
          </h1>
          <p className="mt-2 text-gray-500">
            Bütün xərclərinizi və borc ödənişlərinizi izləyin.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Ümumi xərclər
            </p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {totalExpenses.toFixed(2)} ₼
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Ümumi borc ödənişləri
            </p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {totalPayments.toFixed(2)} ₼
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Əməliyyat tarixçəsi
            </h2>

            <input
              type="text"
              placeholder="Əməliyyat axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { label: "Hamısı", value: "all" },
              { label: "Xərclər", value: "expense" },
              { label: "Ödənişlər", value: "payment" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  filter === item.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-6 text-red-600">{error}</p>
          )}

          {!error && (
            <div className="mt-6 divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  Əməliyyat tapılmadı.
                </p>
              ) : (
                filteredTransactions.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                          item.type === "expense"
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {item.type === "expense" ? "↗" : "↙"}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.description ||
                            (item.type === "expense"
                              ? "Xərc"
                              : "Borc ödənişi")}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.card?.bank || "Kart yoxdur"}
                          {" · "}
                          {new Date(item.createdAt).toLocaleDateString(
                            "az-AZ"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          item.type === "expense"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.type === "expense" ? "-" : "+"}
                        {item.amount.toFixed(2)} ₼
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {item.category}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
