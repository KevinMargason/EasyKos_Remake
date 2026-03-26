"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Edit3, MoonStar, Sparkles, Utensils, Ticket } from "lucide-react"; // Tambahin Ticket buat voucher
import { toast } from "sonner";
import { useAppSelector } from "@/core/store/hooks";
import { getFullGreeting } from "@/lib/greetings";
import { useWallet } from "@/core/hooks/useWallet";
import { api } from "@/core/services/api";

type MyPetContentProps = {
  mode?: "user" | "owner";
};

// Hardcoded untuk Voucher, Misi dinamis dari Backend
const rewardCards = [
  {
    title: "Diskon Sewa 50rb",
    description: "Berlaku semua kos EasyKos",
    price: "500 Coins",
  },
  {
    title: "Diskon Sewa 50rb",
    description: "Berlaku semua kos EasyKos",
    price: "500 Coins",
  },
  {
    title: "Diskon Sewa 10rb",
    description: "Berlaku semua kos EasyKos",
    price: "40 Coins",
  },
];

const ACTION_THRESHOLD = 70;
const DECAY_PER_MINUTE = 5;

const toDate = (value: unknown) => {
  if (!value) return null;
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? null : date;
};

const clampPercent = (value: unknown) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.max(0, Math.min(100, numericValue));
};

const getElapsedMinutes = (from: Date | null, now: number) => {
  if (!from) return 0;
  return Math.max(0, Math.floor((now - from.getTime()) / 60000));
};

const calculatePetSnapshot = (pet: any, now: number) => {
  if (!pet) return null;

  const snapshot = { ...pet };
  const lastMeal = toDate(pet.terakhir_makan);
  const lastSleep = toDate(pet.terakhir_tidur);
  const sleepUntil = toDate(pet.tidur_sampai);
  const isSleeping = snapshot.status === "sleeping" && !!sleepUntil && sleepUntil.getTime() > now;

  snapshot.level_lapar = clampPercent(
    Number(snapshot.level_lapar) - getElapsedMinutes(lastMeal, now) * DECAY_PER_MINUTE,
  );

  if (isSleeping) {
    snapshot.level_stamina = 100;
    snapshot.status = "sleeping";
    return snapshot;
  }

  const staminaBase = sleepUntil && sleepUntil.getTime() <= now ? sleepUntil : lastSleep;
  snapshot.level_stamina = clampPercent(
    Number(snapshot.level_stamina) - getElapsedMinutes(staminaBase, now) * DECAY_PER_MINUTE,
  );

  if (snapshot.level_lapar < 30) {
    snapshot.status = "hungry";
  } else if (snapshot.level_stamina < 30) {
    snapshot.status = "exhausted";
  } else {
    snapshot.status = "normal";
  }

  return snapshot;
};

function StatProgress({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-[#dd6f5d] transition-all duration-500 dark:bg-[#f0b2a7]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function MetricChip({
  iconSrc,
  label,
  textClassName,
  chipClassName,
}: {
  iconSrc: string;
  label: string;
  textClassName: string;
  chipClassName: string;
}) {
  return (
    <div
      className={`glass-chip inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-[15px] font-semibold transition ${chipClassName}`}
    >
      <div className="relative h-[18px] w-[18px] shrink-0">
        <Image src={iconSrc} alt="Icon chip" fill className="object-contain" />
      </div>
      <span>{label}</span>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  className,
}: {
  label: string;
  icon: typeof Utensils;
  onClick: () => void;
  disabled?: boolean;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full max-w-[280px] items-center justify-center gap-2 rounded-full px-20 py-3 text-sm font-semibold shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

function RewardCard({
  title,
  description,
  price,
}: {
  title: string;
  description: string;
  price: string;
}) {
  return (
    <div className="flex min-h-[96px] items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
      <div className="min-w-0 space-y-1">
        <h4 className="truncate text-[15px] font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h4>
        <p className="text-sm leading-snug text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>
      <div className="shrink-0 rounded-full bg-[#fbf0ed] px-4 py-2 text-sm font-semibold text-[#dd6f5d] dark:bg-[#2f1d18] dark:text-[#f0b2a7]">
        {price}
      </div>
    </div>
  );
}

export default function MyPetContent({ mode = "user" }: MyPetContentProps) {
  const user = useAppSelector((state: any) => state.user.user);
  const { totalKoin, fetchBalance } = useWallet();
  const [tupai, setTupai] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]); // 🔥 State buat misi
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [clock, setClock] = useState(() => Date.now());

  const fetchTupaiStatus = useCallback(async () => {
    if (!user?.id) {
      setTupai(null);
      setLoading(false);
      return;
    }

    try {
      const result = await api.myTupai.check(user.id);
      setTupai(result?.success ? result.data : null);
    } catch (error: any) {
      console.error("Error fetching pet:", error);
      setTupai(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchMissions = useCallback(async () => {
    if (!user?.id) return;
    try {
      const result = await api.missions.getAll(user.id);
      const missionsData = result?.data || [];
      setMissions(Array.isArray(missionsData) ? missionsData : []);
    } catch (error: any) {
      console.error("Error fetching missions:", error);
      toast.error(
        error?.response?.status === 503
          ? "Server misi sedang down. Coba lagi nanti."
          : "Gagal memuat misi. Pastikan backend bisa diakses.",
      );
      setMissions([]);
    }
  }, [user?.id]);

  const handleAdopt = async () => {
    if (!user?.id) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    setIsActionLoading(true);
    try {
      const result = await api.myTupai.adopt({
        users_id: user.id,
        nama: `Tupai ${user.name || displayName}`,
      });

      if (result?.success) {
        setTupai(result.data);
        toast.success("Tupai berhasil diadopsi! Selamat!");
        //fetchMissions();
      } else {
        toast.error(result?.message || "Gagal mengadopsi.");
      }
    } catch (error: any) {
      console.error("Adopt error:", error);
      toast.error(
        error?.response?.status === 503
          ? "Server sedang sibuk, coba lagi nanti."
          : "Gagal mengadopsi. Coba lagi nanti.",
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleInteract = async (action: "feed" | "sleep") => {
    const currentTupai = calculatePetSnapshot(tupai, Date.now());

    if (!currentTupai?.id || isActionLoading) return;

    if (action === "feed" && (currentTupai.status === "sleeping" || currentTupai.level_lapar >= ACTION_THRESHOLD)) {
      toast.error("Tupai masih kenyang, belum perlu makan.");
      return;
    }

    if (action === "sleep" && (currentTupai.status === "sleeping" || currentTupai.level_stamina >= ACTION_THRESHOLD)) {
      toast.error("Tupai masih segar, belum perlu tidur.");
      return;
    }

    setIsActionLoading(true);

    try {
      const result =
        action === "feed"
          ? await api.myTupai.feed(currentTupai.id)
          : await api.myTupai.sleep(currentTupai.id);

      if (result?.success) {
        setTupai(result.data);
        await fetchTupaiStatus();
        toast.success(result.message || "Aksi berhasil dilakukan.");
        fetchMissions();
        if (fetchBalance) await fetchBalance(user.id);
      } else {
        toast.error(result?.message || "Gagal melakukan aksi.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.status === 503
          ? "Server sedang sibuk, coba lagi nanti."
          : "Gagal melakukan aksi. Cek jaringan.",
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleClaimMission = async (misiUserId: number) => {
    setIsActionLoading(true);
    try {
      const result = await api.missions.claim({ misi_user_id: misiUserId });

      if (result?.success) {
        toast.success(`Berhasil klaim! +${result.reward?.coins ?? 0} Koin 🔥`);
        await fetchMissions();
        await fetchTupaiStatus();
        if (fetchBalance) await fetchBalance(user.id);
      } else {
        toast.error(result?.message || "Gagal klaim hadiah.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.status === 503
          ? "Server klaim misi sedang sibuk. Coba lagi nanti."
          : "Terjadi kesalahan jaringan.",
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  useEffect(() => {
    fetchTupaiStatus();
  }, [fetchTupaiStatus, fetchMissions]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(Date.now());
    }, 15000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const syncTimer = window.setInterval(() => {
      fetchTupaiStatus();
    }, 60000);

    return () => window.clearInterval(syncTimer);
  }, [fetchTupaiStatus, user?.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] p-6 text-center font-semibold text-slate-600 dark:text-slate-300">
        Memuat My Pet...
      </div>
    );
  }

  const greeting = getFullGreeting(user?.name || "");
  const displayName = user?.name || "Pengguna";
  const visibleTupai = calculatePetSnapshot(tupai, clock);
  const petLevel = Math.max(1, Number(visibleTupai?.level) || 1);
  const stamina = clampPercent(visibleTupai?.level_stamina);
  const hunger = clampPercent(visibleTupai?.level_lapar);
  const canFeed = !!visibleTupai && visibleTupai.status !== "sleeping" && hunger < ACTION_THRESHOLD;
  const canSleep = !!visibleTupai && visibleTupai.status !== "sleeping" && stamina < ACTION_THRESHOLD;
  const petImage =
    visibleTupai?.status === "sleeping"
      ? "/Asset/squirrel/squirrel-exhausted-light.svg"
      : "/Asset/squirrel/squirrel-normal.svg";
  const pageLabel = mode === "owner" ? "My Pet Owner" : "My Pet";

  return (
    <div className="mx-auto max-w-[1200px] space-y-6" aria-label={pageLabel}>
      <header className="flex flex-col gap-4 rounded-[28px] border border-transparent bg-transparent xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <Image
            className="mt-5"
            src="/Asset/icon/icon-person.svg"
            alt="Akun pengguna"
            width={100}
            height={100}
          />

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {greeting.greeting}
            </p>
            <h1 className="text-[34px] font-bold leading-none text-slate-950 dark:text-white">
              {greeting.userName || displayName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start xl:self-auto">
          <MetricChip
            iconSrc="/Asset/icon/icon-fire.svg"
            label={`${petLevel} Level`} // 🔥 Ganti ke Level bosku!
            textClassName="text-orange-600 dark:text-orange-400"
            chipClassName="hover:bg-orange-50 dark:hover:bg-orange-900/30 cursor-pointer shadow-sm hover:shadow-md border border-orange-200 bg-white text-[#e48a44] dark:border-orange-900/30 dark:bg-slate-900 dark:text-[#f0b2a7]"
          />
          <MetricChip
            iconSrc="/Asset/icon/icon-coin.svg"
            label={`${totalKoin || 0} Coins`}
            textClassName="text-yellow-700 dark:text-yellow-400"
            chipClassName="border border-yellow-200 bg-yellow-50/50 text-yellow-700 dark:border-yellow-700/30 dark:bg-yellow-900/20 dark:text-yellow-400"
          />
        </div>
      </header>

      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 xl:p-8">
        {!visibleTupai ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 text-center">
            <div className="relative h-44 w-44 opacity-75">
              <Image
                src="/Asset/squirrel/squirrel-normal.svg"
                alt="Pet"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                Kandang Masih Kosong
              </h2>
              <p className="mt-2 max-w-xl text-slate-500 dark:text-slate-400">
                Kamu belum memiliki tupai. Adopsi sekarang untuk mulai
                petualangan dan mengumpulkan koin reward.
              </p>
            </div>
            <button
              onClick={handleAdopt}
              disabled={isActionLoading}
              className="inline-flex items-center justify-center rounded-full bg-[#dd6f5d] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(221,111,93,0.22)] transition hover:bg-[#cc5d4d] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#e07b6d] dark:text-slate-950 dark:hover:bg-[#f0b2a7]"
            >
              {isActionLoading ? "Sedang Adopsi..." : "Adopsi Sekarang"}
            </button>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(220px,260px)] xl:items-center xl:gap-4">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="relative flex h-[320px] w-full max-w-[320px] items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,#fff1df_0%,#fff7ee_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] md:h-[320px] md:w-[320px]">
                <div className="relative aspect-square w-full max-w-[280px]">
                  <Image
                    src={petImage}
                    alt="Pet"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="w-full space-y-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[28px] font-bold text-slate-950 dark:text-white">
                        Your Pet
                      </h2>
                      <button
                        className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        aria-label="Edit pet name"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                      {visibleTupai.nama || `Tupai ${displayName}`}
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-[500px] space-y-4">
                  <StatProgress label="Segar" value={stamina} />
                  <StatProgress label="Kenyang" value={hunger} />
                </div>
              </div>
            </div>

            <div className="flex h-full items-center justify-center xl:justify-self-center">
              <div className="grid w-full max-w-[300px] justify-items-center gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:justify-items-center">
                <ActionButton
                  label="Feed (10 Koin)"
                  icon={Utensils}
                  onClick={() => handleInteract("feed")}
                    disabled={isActionLoading || !canFeed}
                  className="bg-[#fff2ef] text-[#dd6f5d] hover:bg-[#fde6e1] dark:bg-[#2f1d18] dark:text-[#f0b2a7] dark:hover:bg-[#3a241e]"
                />
                <ActionButton
                  label="Sleep"
                  icon={MoonStar}
                  onClick={() => handleInteract("sleep")}
                    disabled={isActionLoading || !canSleep}
                  className="bg-[#92a0bf] text-slate-950 hover:bg-[#8291af] dark:bg-[#6f7b97] dark:text-slate-950 dark:hover:bg-[#8792ab]"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 🔥 SECTION MISI HARIAN TUPAI (Dinamis dari Backend!) 🔥 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles
            size={18}
            className="text-yellow-500 dark:text-yellow-400"
          />
          <h3 className="text-[22px] font-semibold text-slate-950 dark:text-white">
            Misi Harian Tupai
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {missions.map((misi, index) => {
            const userProgress = misi.user_status;
            const progress = userProgress ? userProgress.progress_level : 0;
            const target = 3; // Asumsi target misi = 3x (sesuai backend)
            const isCompleted = userProgress?.status === "completed";
            const isClaimed = userProgress?.status === "claimed";

            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:border-yellow-200 hover:shadow-md"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {misi.nama}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Progress:{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      {progress}/{target}
                    </span>
                  </p>
                  <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mt-1">
                    Hadiah: +{misi.coin} Koin & +{misi.xp} EXP
                  </p>
                </div>

                {isClaimed ? (
                  <span className="text-sm font-bold text-green-500 dark:text-green-400">
                    Tuntas ✓
                  </span>
                ) : isCompleted ? (
                  <button
                    onClick={() => handleClaimMission(userProgress.id)}
                    disabled={isActionLoading}
                    className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-yellow-500 transition animate-pulse"
                  >
                    Klaim Koin 🔥
                  </button>
                ) : (
                  <span className="text-sm font-medium text-slate-400">
                    In Progress...
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 pb-8">
        <div className="flex items-center gap-2">
          <Ticket size={18} className="text-[#dd6f5d] dark:text-[#f0b2a7]" />
          <h3 className="text-[22px] font-semibold text-slate-950 dark:text-white">
            Tukar Koin & Dapatkan Reward Voucher!
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {" "}
          {/* Bikin 3 kolom xl bosku! */}
          {rewardCards.map((reward, index) => (
            <RewardCard
              key={`${reward.title}-${index}`}
              title={reward.title}
              description={reward.description}
              price={reward.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
