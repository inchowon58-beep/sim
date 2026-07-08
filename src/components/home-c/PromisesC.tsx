import { getResolvedSiteConfig } from "@/utils/siteConfig";

const DEFAULT_PROMISES = [
  {
    num: "01",
    title: "현실적인 입소 비용",
    description:
      "모든 사설 보호소에는 관리 비용이 발생합니다. 항목별로 투명하게 안내하며, 고객이 납득할 수 있는 수준의 입소 비용만 받습니다.",
  },
  {
    num: "02",
    title: "아이 중심의 환경",
    description:
      "과밀 수용 없이 고양이·소형견·중대형견 각각에 맞는 넓고 쾌적한 공간에서 케어합니다.",
  },
  {
    num: "03",
    title: "쾌적한 웰빙 케어",
    description:
      "산책, 놀이, 목욕, 미용, 건강검진 등 다양한 프로그램으로 입소 아이가 편안한 일상을 보냅니다.",
  },
  {
    num: "04",
    title: "주인의 마음을 생각하는 투명함",
    description:
      "입소된 아이의 생활 사진을 정기적으로 공유합니다. 방문 미팅과 상담을 언제든 환영합니다.",
  },
  {
    num: "05",
    title: "광범위한 분양·입양 매칭",
    description:
      "신원 확인과 심층 상담을 거쳐 아이를 사랑할 수 있는 가족에게 연결합니다.",
  },
  {
    num: "06",
    title: "입양 후 사후 관리",
    description:
      "분양·입양 이후에도 아이의 적응 상태를 확인합니다. 다시 함께하기 어려운 경우에도 책임지고 상담합니다.",
  },
];

export default async function PromisesC() {
  const { tenantUi } = await getResolvedSiteConfig();
  const promises = tenantUi?.promises?.length ? tenantUi.promises : DEFAULT_PROMISES;

  return (
    <section id="promises" className="home-c-section py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">Our Promises</p>
        <h2 className="home-c-editorial text-3xl sm:text-4xl font-light text-stone-900 mb-4">
          여섯 가지 특별함
        </h2>
        <p className="text-stone-500 text-sm mb-16">
          3,200건 이상의 분양·입양 매칭, 97% 입소 만족도를 바탕으로 운영합니다.
        </p>

        <div className="space-y-16 lg:space-y-20">
          {promises.map((item) => (
            <article key={item.num} className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start border-t border-stone-100 pt-10 first:border-t-0 first:pt-0">
              <p className="lg:col-span-2 text-sm text-stone-400 font-medium">{item.num}</p>
              <div className="lg:col-span-10">
                <p className="text-xs text-stone-400 mb-2">— 특별함 {item.num}</p>
                <h3 className="text-xl sm:text-2xl font-medium text-stone-900 mb-4">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed max-w-xl">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
