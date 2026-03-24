"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { api } from "@/core/services/api";

interface Resident {
  periode?: string;
  nomor?: string;
  nama?: string;
  tanggalMasuk?: string;
  tanggalKeluar?: string;
  status?: string;
}

interface ResidentHistoryPageProps {
  onBack: () => void;
  kosList: Array<{ label: string; value: string }>;
}

export default function ResidentHistoryPage({
  onBack,
  kosList = [],
}: ResidentHistoryPageProps) {
  const [statusFilter, setStatusFilter] = useState("semua");
  const [selectedKos, setSelectedKos] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load residents from API when selectedKos changes
  useEffect(() => {
    const loadResidents = async () => {
      if (!selectedKos) {
        setResidents([]);
        return;
      }

      try {
        setIsLoading(true);
        // Aman pakai String() supaya gak meledak kalau selectedKos bentuknya angka
        const kosIdMatch = String(selectedKos).match(/(\d+)$/);
        const kosId = kosIdMatch ? kosIdMatch[1] : selectedKos;

        // Pastikan endpoint api.residents.getByKos ini benar-benar ada ya di backend-mu!
        const response = await api.residents.getByKos(kosId);

        if (response && Array.isArray(response)) {
          setResidents(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          setResidents(response.data);
        } else {
          setResidents([]);
        }
      } catch (error: any) {
        console.error("Failed to load residents:", error);
        toast.error("Gagal memuat data penghuni");
        setResidents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadResidents();
  }, [selectedKos]);

  // Sabuk Pengaman Filter: Kebal dari data Null/Undefined
  const filteredResidents = useMemo(() => {
    if (!Array.isArray(residents)) return [];

    return residents.filter((resident) => {
      const resStatus = String(resident?.status || "").toLowerCase();
      const resNama = String(resident?.nama || "").toLowerCase();

      const matchesStatus =
        statusFilter === "semua" || resStatus === statusFilter.toLowerCase();
      const matchesSearch =
        searchName === "" || resNama.includes(searchName.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [residents, statusFilter, searchName]);

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ChevronLeft size={20} />
        <span>Kembali</span>
      </button>

      <div className="rounded-[24px] bg-white p-8 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/5">
        <h2 className="text-[28px] font-bold text-[#c86654]">
          Riwayat Penghuni Kos
        </h2>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {/* Pilih Kamar */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
              Pilih Kamar Kos
            </h3>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari Kamar...."
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                />
                <Image
                  src="/Asset/icon/icon-search-home.svg"
                  alt="search"
                  width={20}
                  height={20}
                  className="absolute right-3 top-3.5"
                />
              </div>
              {kosList.map((kos) => (
                <button
                  key={kos.value}
                  onClick={() => setSelectedKos(kos.value)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition ${
                    selectedKos === kos.value
                      ? "border-[#c86654] bg-[#fef8f6] text-[#c86654] dark:bg-slate-800"
                      : "border-slate-200 bg-white text-slate-900 hover:border-[#c86654] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  }`}
                >
                  {kos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pencarian */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
              Cari Nama Penghuni
            </h3>
            <div className="mb-6 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari Nama"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                />
                <Image
                  src="/Asset/icon/icon-search-home.svg"
                  alt="search"
                  width={20}
                  height={20}
                  className="absolute right-3 top-3.5"
                />
              </div>

              <div className="flex gap-2">
                {["semua", "selesai", "aktif"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      statusFilter === status
                        ? "border-[#c86654] bg-[#fff5f0] text-[#c86654] dark:border-[#f0b2a7] dark:bg-slate-800 dark:text-[#f0b2a7]"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-pulse text-slate-500">
                    Memuat data penghuni...
                  </div>
                </div>
              ) : filteredResidents.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-slate-500">
                    {selectedKos
                      ? "Tidak ada data penghuni"
                      : "Pilih Kos untuk melihat data penghuni"}
                  </div>
                </div>
              ) : (
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                        PERIODE
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                        NOMOR KAMAR
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                        NAMA PENGHUNI
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                        TANGGAL MASUK
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                        TANGGAL KELUAR
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                        STATUS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResidents.map((resident, idx) => {
                      // Sabuk Pengaman Tabel
                      const statusText = String(resident?.status || "-");
                      const isAktif = statusText.toUpperCase() === "AKTIF";

                      return (
                        <tr
                          key={idx}
                          className="border-b border-slate-200 dark:border-slate-700"
                        >
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-400">
                            {resident?.periode || "-"}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                            {resident?.nomor || "-"}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-400">
                            {resident?.nama || "-"}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-400">
                            {resident?.tanggalMasuk || "-"}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-400">
                            {resident?.tanggalKeluar || "-"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded px-3 py-1 text-xs font-semibold ${
                                isAktif
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {statusText}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={onBack}
            className="w-full rounded-lg bg-[#c86654] py-3 font-semibold text-white transition hover:bg-[#b8533d]"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
