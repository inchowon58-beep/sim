import { getSiteConfig, phoneToTel } from "@/lib/site-config";
import { showCompanyContact } from "@/lib/exposure-mode";

export default async function ContactE() {
  const site = await getSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <section id="contact" className="home-e-section py-16 lg:py-24 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-4">
            Contact
          </p>
          <h2 className="home-e-display text-2xl sm:text-3xl mb-4 leading-snug">
            {site.brandName}
            <span className="block text-slate-400 font-normal text-xl mt-2">
              강아지 파양 · 무료분양 상담
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            파양 입소·무료분양 절차와 입소 비용을 안내해 드립니다.
            <br />
            방문은 사전 예약제로 진행됩니다.
          </p>

          <dl className="space-y-5 text-sm">
            {showCompany && (
              <div>
                <dt className="text-[11px] tracking-wider uppercase text-slate-500 mb-1">
                  Phone
                </dt>
                <dd>
                  <a
                    href={`tel:${phoneToTel(site.phone)}`}
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 transition tabular-nums"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="text-[11px] tracking-wider uppercase text-slate-500 mb-1">
                Homepage
              </dt>
              <dd className="text-slate-300">{site.url.replace(/^https?:\/\//, "")}</dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-wider uppercase text-slate-500 mb-1">
                Service
              </dt>
              <dd className="text-slate-300">강아지 파양 · 무료분양 · 입소 케어 · 입양 매칭</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
