"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Edit3, MoonStar, Sparkles, Utensils, Ticket, Check, Clock, Zap } from "lucide-react"; // Tambahin Ticket buat voucher
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
const DECAY_PER_MINUTE = 25;
const FEED_GAIN_PERCENT = 25;


const getPetCacheKey = (userId: number | string) => `mytupai-cache-${userId}`;

const readCachedPet = (userId: number | string) => {
  if (typeof window === "undefined") return null;

  try {
    const cached = window.localStorage.getItem(getPetCacheKey(userId));
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const writeCachedPet = (userId: number | string, pet: any) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(getPetCacheKey(userId), JSON.stringify(pet));
  } catch {
    // Ignore storage quota or serialization issues.
  }
};

const clearCachedPet = (userId: number | string) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(getPetCacheKey(userId));
  } catch {
    // Ignore storage cleanup issues.
  }
};

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

  // Jika sedang tidur: stamina BERTAMBAH, hunger BERKURANG
  if (isSleeping) {
    // Stamina naik saat tidur
    const gainedStamina = Number(snapshot.level_stamina) + getElapsedMinutes(lastSleep, now) * DECAY_PER_MINUTE;
    snapshot.level_stamina = clampPercent(gainedStamina);

    // Hunger tetap berkurang saat tidur
    snapshot.level_lapar = clampPercent(
      Number(snapshot.level_lapar) - getElapsedMinutes(lastMeal, now) * DECAY_PER_MINUTE,
    );

    // Jika sudah full stamina atau waktu tidur habis, bangun
    if (snapshot.level_stamina >= 100 || sleepUntil.getTime() <= now) {
      snapshot.level_stamina = 100;
      snapshot.status = "normal";
      // Reset terakhir_tidur ke sekarang agar decay tidak langsung besar
      snapshot.terakhir_tidur = new Date(now).toISOString();
      snapshot.tidur_sampai = null; // Clear sleep end time
      return snapshot;
    }

    snapshot.status = "sleeping";
    return snapshot;
  }

  // Normal state: kedua stat BERKURANG seiring waktu
  snapshot.level_lapar = clampPercent(
    Number(snapshot.level_lapar) - getElapsedMinutes(lastMeal, now) * DECAY_PER_MINUTE,
  );

  const staminaBase = lastSleep || lastMeal;
  snapshot.level_stamina = clampPercent(
    Number(snapshot.level_stamina) - getElapsedMinutes(staminaBase, now) * DECAY_PER_MINUTE,
  );

  // Update status berdasarkan stat values
  if (snapshot.level_lapar >= 100 && snapshot.level_stamina >= 100) {
    snapshot.status = "happy";
  } else if (snapshot.level_lapar < 30) {
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

function MissionCard({
  misi,
  onClaim,
  isLoading,
}: {
  misi: any;
  onClaim: (id: number) => void;
  isLoading: boolean;
}) {
  const userProgress = misi.user_status;
  const progress = userProgress ? userProgress.progress_level : 0;
  const target = misi.target_level || 3;
  const isCompleted = userProgress?.status === "completed";
  const isClaimed = userProgress?.status === "claimed";
  const progressPercent = Math.min((progress / target) * 100, 100);

  const getMissionIcon = () => {
    const iconClass = "w-5 h-5";
    if (misi.nama?.toLowerCase().includes("makan")) return <Utensils className={iconClass} />;
    if (misi.nama?.toLowerCase().includes("tidur")) return <MoonStar className={iconClass} />;
    return <Zap className={iconClass} />;
  };

  const getStatusColor = () => {
    if (isClaimed) return "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30";
    if (isCompleted) return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900/30";
    return "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800";
  };

  const getIconColor = () => {
    if (isClaimed) return "text-green-500 dark:text-green-400";
    if (isCompleted) return "text-yellow-500 dark:text-yellow-400";
    return "text-slate-600 dark:text-slate-400";
  };

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${getStatusColor()}`}
    >
      {/* Header dengan Icon dan Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div
            className={`shrink-0 rounded-full p-2.5 ${
              isClaimed
                ? "bg-green-100 dark:bg-green-900/40"
                : isCompleted
                  ? "bg-yellow-100 dark:bg-yellow-900/40"
                  : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <div className={getIconColor()}>{getMissionIcon()}</div>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-slate-950 dark:text-white text-sm md:text-base">
              {misi.nama}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {progress}/{target} Selesai
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {isClaimed && (
          <div className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white">
            <Check size={14} />
            <span>Tuntas</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isClaimed
                ? "bg-green-500"
                : isCompleted
                  ? "bg-yellow-400"
                  : "bg-[#dd6f5d] dark:bg-[#f0b2a7]"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Reward dan Action */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="text-xs sm:text-sm font-semibold text-yellow-600 dark:text-yellow-400">
          {misi.coin ? `+${misi.coin}🪙` : "+"}
          {misi.xp ? ` +${misi.xp}⭐` : ""}
        </div>

        {!isClaimed && isCompleted ? (
          <button
            onClick={() => onClaim(userProgress.id)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-1.5 text-xs font-bold text-slate-950 shadow-sm hover:shadow-md transition hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse md:text-sm"
          >
            <Zap size={14} className="mt-px" />
            Klaim
          </button>
        ) : isClaimed ? (
          <div className="text-xs font-semibold text-green-600 dark:text-green-400">
            ✓ Diklaim
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Clock size={13} />
            <span>Berlangsung</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyPetContent({ mode = "user" }: MyPetContentProps) {
  const user = useAppSelector((state: any) => state.user.user);
  const { totalKoin, fetchBalance, spendCoins } = useWallet();
  const [tupai, setTupai] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]); // 🔥 State buat misi
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [clock, setClock] = useState(() => Date.now());

  const loadCachedTupai = useCallback(() => {
    if (!user?.id) {
      setTupai(null);
      setLoading(false);
      return null;
    }

    const cachedPet = readCachedPet(user.id);
    setTupai(cachedPet);
    setLoading(false);
    return cachedPet;
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
        writeCachedPet(user.id, result.data);
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

    if (action === "feed" && (currentTupai.status === "sleeping" || currentTupai.level_lapar >= 100)) {
      toast.error("Tupai masih kenyang, belum perlu makan.");
      return;
    }

    if (action === "sleep" && (currentTupai.status === "sleeping" || currentTupai.level_stamina >= ACTION_THRESHOLD)) {
      toast.error("Tupai masih segar, belum perlu tidur.");
      return;
    }

    setIsActionLoading(true);

    try {
      const now = Date.now();
      const nowIso = new Date(now).toISOString();

      let nextTupai = currentTupai;
      let successMessage = "Tupai sekarang tidur.";

      if (action === "feed") {
        if (spendCoins) {
          const spendResult = await spendCoins(10);
          if (!spendResult?.success) {
            toast.error(spendResult?.message || "Koin tidak cukup.");
            return;
          }
        }

        const nextLapar = Math.min(100, Number(currentTupai.level_lapar) + FEED_GAIN_PERCENT);
        const nextStamina = clampPercent(currentTupai.level_stamina);
        successMessage = nextLapar >= 100 ? "Tupai kenyang!" : "Tupai sudah makan.";

        nextTupai = {
          ...currentTupai,
          level_lapar: nextLapar,
          level_stamina: nextStamina,
          xp: Number(currentTupai.xp || 0) + 10,
          terakhir_makan: nowIso,
          status:
            nextLapar >= 100 && nextStamina >= 100
              ? "happy"
              : nextLapar < 30
                ? "hungry"
                : nextStamina < 30
                  ? "exhausted"
                  : "normal",
        };
      } else {
        const stamina = clampPercent(currentTupai.level_stamina);
        const sleepMinutes =  Math.max(1, Math.ceil((100 - stamina) / DECAY_PER_MINUTE));;

        nextTupai = {
          ...currentTupai,
          status: "sleeping",
          terakhir_tidur: nowIso,
          tidur_sampai: new Date(now + sleepMinutes * 60000).toISOString(),
        };
      }

      setTupai(nextTupai);
      writeCachedPet(user.id, nextTupai);
      toast.success(successMessage);
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal memperbarui tupai secara lokal.");
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
        loadCachedTupai();
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
    if (!user?.id) return;

    loadCachedTupai();
  }, [loadCachedTupai, user?.id]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(Date.now());
    }, 15000);

    return () => window.clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] p-6 text-center font-semibold text-slate-600 dark:text-slate-300">
        Memuat Peliharaan Saya...
      </div>
    );
  }

  const greeting = getFullGreeting(user?.name || "");
  const displayName = user?.name || "Pengguna";
  const visibleTupai = calculatePetSnapshot(tupai, clock);
  const petLevel = Math.max(1, Number(visibleTupai?.level) || 1);
  const stamina = clampPercent(visibleTupai?.level_stamina);
  const hunger = clampPercent(visibleTupai?.level_lapar);
  const canFeed = !!visibleTupai && visibleTupai.status !== "sleeping" && hunger < 100;
  const canSleep = !!visibleTupai && visibleTupai.status !== "sleeping" && stamina < ACTION_THRESHOLD;
  const petImage = (() => {
    if (!visibleTupai) return "/Asset/squirrel/squirrel-normal.svg";

    if (visibleTupai.status === "sleeping") {
      return "/Asset/squirrel/squirrel-exhausted-light.svg";
    }

    if (hunger < 30) {
      return "/Asset/squirrel/squirrel-hungry.svg";
    }

    if (stamina < 30) {
      return "/Asset/squirrel/squirrel-exhausted-light.svg";
    }

    if (hunger >= 100 && stamina >= 100) {
      return "/Asset/squirrel/squirrel-happy.svg";
    }

    return "/Asset/squirrel/squirrel-normal.svg";
  })();
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
            label={`${petLevel} Hari`}
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
                petualangan dan mengumpulkan koin hadiah.
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
                        Peliharaanmu
                      </h2>
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
          <Image
            src="/Asset/icon/icon-chart.svg"
            alt="Misi Icon"
            width={24}
            height={24}
          />

          <h3 className="text-[22px] font-semibold text-slate-950 dark:text-white">
            Misi Harian Tupai
          </h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {missions.length > 0 ? (
            missions.map((misi, index) => (
              <MissionCard
                key={index}
                misi={misi}
                onClaim={handleClaimMission}
                isLoading={isActionLoading}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Image
                src="/Asset/icon/icon-chart.svg"
                alt="Misi Icon"
                width={40}
                height={40}
                className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
              />
              <p className="text-slate-500 dark:text-slate-400">
                Tidak ada misi hari ini. Coba lagi besok!
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4 pb-8">
        <div className="flex items-center gap-2">
          <Image src="/Asset/icon/icon-voucher.svg" alt="Hadiah Icon" width={24} height={24} />
          <h3 className="text-[22px] font-semibold text-slate-950 dark:text-white">
            Tukar Koin & Dapatkan Hadiah Voucher!
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
