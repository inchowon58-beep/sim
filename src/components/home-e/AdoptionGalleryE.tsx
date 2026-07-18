"use client";

import { useState } from "react";
import Image from "next/image";
import type { Com2petAdoptionItem } from "@/lib/com2pet-adoption";
import { useSiteConfig } from "@/components/SiteConfigProvider";

type Tab = "dog" | "cat";

interface AdoptionGalleryEProps {
  dogs: Com2petAdoptionItem[];
  cats: Com2petAdoptionItem[];
  updatedAt?: string | null;
}

export default function AdoptionGalleryE({
  dogs,
  cats,
  updatedAt,
}: AdoptionGalleryEProps) {
  const site = useSiteConfig();
  const [tab, setTab] = useState<Tab>("dog");
  const items = tab === "dog" ? dogs : cats;

  return (
    <section id="protected" className="home-e-section py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
              Protected Pets
            </p>
            <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900 mb-3">
              보호중인 아이들
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              파양으로 입소한 아이들이 새 가족을 기다리고 있습니다.
              {site.brandName}에서 먼저 확인하고, 상담 후 매칭을 진행해 주세요.
            </p>
            {updatedAt && (
              <p className="text-[11px] text-slate-400 mt-2">
                목록 업데이트:{" "}
                {new Date(updatedAt).toLocaleString("ko-KR", {
                  timeZone: "Asia/Seoul",
                })}
              </p>
            )}
          </div>

          <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1 self-start">
            <button
              type="button"
              onClick={() => setTab("dog")}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition ${
                tab === "dog"
                  ? "bg-[var(--e-accent)] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              강아지
            </button>
            <button
              type="button"
              onClick={() => setTab("cat")}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition ${
                tab === "cat"
                  ? "bg-[var(--e-accent)] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              고양이
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="home-e-card group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={`${item.breed} ${item.name} 보호중`}
                  fill
                  className="home-e-photo object-cover group-hover:scale-105 transition duration-500"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[var(--e-accent)] shadow-sm">
                  {item.branch}
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {item.breed} · {item.name}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {tab === "dog" ? "강아지" : "고양이"} · 새 가족 찾는 중
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
