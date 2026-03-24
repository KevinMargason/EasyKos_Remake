"use client";

import Image from "next/image";
import { Flame, Wallet, TrendingUp } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useAppSelector } from "@/core/store/hooks";
import { useWallet } from "@/core/hooks/useWallet";
import { useKos } from "@/core/hooks/useKos";
import { usePayments } from "@/core/hooks/usePayments";
import { getFullGreeting } from "@/lib/greetings";

export default function OwnerHomeContent() {
  const user = useAppSelector((state: any) => state.user.user);
  const { totalKoin } = useWallet();
  const { kosList, roomsList, fetchKos, fetchRooms } = useKos();
  const { invoices, fetchPayments } = usePayments();

  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchKos(), fetchRooms(), fetchPayments()]);
        // Calculate streak from user data (days since registration or last login streak)
        if (user && user.created_at) {
          const createdDate = new Date(user.created_at);
          const today = new Date();
          const daysDiff =
            Math.floor(
              (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
            ) + 1;
          setStreak(Math.min(daysDiff, 30)); // Cap at 30 days for display
        } else {
          setStreak(0);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchKos, fetchRooms, fetchPayments, user]);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyRevenue =
      invoices
        ?.filter((inv: any) => {
          const paymentDateSource =
            inv.tanggal_bayar || inv.updated_at || inv.created_at;
          const status = String(inv.status || "").toUpperCase();
          const isPaid =
            status === "PAID" || status === "SUCCESS" || status === "SUKSES";
          const paymentDate =
            isPaid && paymentDateSource ? new Date(paymentDateSource) : null;
          return (
            paymentDate && paymentDate >= monthStart && paymentDate <= monthEnd
          );
        })
        .reduce(
          (sum: number, inv: any) =>
            sum + (Number(inv.nominal) || Number(inv.amount) || 0),
          0,
        ) || 0;

    const pendingCount =
      invoices?.filter((inv: any) => {
        const status = String(inv.status || "").toUpperCase();
        return status === "UNPAID" || status === "PENDING";
      }).length || 0;

    const totalRooms =
      roomsList.length ||
      kosList.reduce(
        (sum: number, kos: any) => sum + (kos.jumlah_kamar || 0),
        0,
      );

    const occupiedRooms = roomsList.filter((room: any) => {
      const status = String(room.status || "").toLowerCase();
      return (
        status === "booked" || status === "occupied" || status === "terisi"
      );
    }).length;

    const emptyRooms = totalRooms - occupiedRooms;

    const formatMoney = (amount: number) => {
      if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}M`;
      if (amount > 0) return `Rp ${(amount / 1000).toFixed(0)}K`;
      return "Rp 0";
    };

    return [
      {
        title: "Total pendapatan bulan ini",
        value: formatMoney(monthlyRevenue),
        caption: "Dari pembayaran sewa",
        icon: Wallet,
      },
      {
        title: "Penghuni aktif",
        value: `${occupiedRooms} / ${totalRooms}`,
        caption: emptyRooms > 0 ? `${emptyRooms} kamar kosong` : "Semua terisi",
        icon: TrendingUp,
      },
      {
        title: "Pembayaran tertunda",
        value: `${pendingCount}`,
        caption:
          pendingCount > 0 ? "Perlu perhatian" : "Tidak ada yang tertunda",
        danger: pendingCount > 0,
        icon: Flame,
      },
    ];
  }, [invoices, kosList, roomsList]);

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <header className="flex flex-col gap-4 rounded-[28px] bg-transparent sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/Asset/icon/icon-person.svg"
            alt="Akun pengguna"
            width={90}
            height={90}
          />
          <div className="mb-5">
            <p className="text-[14px] text-slate-500 dark:text-slate-400">
              {getFullGreeting(user?.name).greeting}
            </p>
            <h1 className="text-[26px] font-bold leading-none text-slate-900 dark:text-slate-100">
              {getFullGreeting(user?.name).userName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start">
          <div className="glass-chip inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-[15px] font-semibold transition">
            <Image
              src="/Asset/icon/icon-fire.svg"
              alt="Streak"
              width={18}
              height={18}
            />
            <span>{user?.streak || user?.owner_streak || streak} Hari</span>
          </div>
          <div className="glass-chip inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-[15px] font-semibold transition">
            <Image
              src="/Asset/icon/icon-coin.svg"
              alt="Koin"
              width={18}
              height={18}
            />
            <span>{user?.koin || user?.coin || totalKoin || 0} Koin</span>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat: any) => (
          <article
            key={stat.title}
            className="rounded-[22px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/5"
          >
            <p className="text-[14px] text-slate-500 dark:text-slate-400">
              {stat.title}
            </p>
            <div className="mt-2 text-[28px] font-bold leading-none text-slate-900 dark:text-slate-100">
              {stat.value}
            </div>
            <p
              className={`mt-2 text-[14px] font-medium ${stat.danger ? "text-[#e04e3a]" : "text-[#2bb55d]"}`}
            >
              {stat.caption}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-[18px] bg-[#c86654] px-6 py-7 text-white shadow-[0_14px_30px_rgba(15,23,42,0.10)] sm:px-7">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-[640px]">
            <h2 className="text-[30px] font-bold leading-tight">
              Tingkatkan promosi kos Anda!
            </h2>
            <p className="mt-2 max-w-[440px] text-[16px] leading-7 text-white/85">
              Pasang kos Anda di bagian teratas hasil pencarian agar kamar
              kosong lebih cepat terisi.
            </p>
          </div>
          <button className="rounded-lg bg-white px-8 py-3 text-[15px] font-semibold text-[#c86654] shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition hover:bg-[#fff7f5]">
            Pasang Iklan
          </button>
        </div>
      </section>
    </div>
  );
}
