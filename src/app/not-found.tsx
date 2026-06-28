import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>404</h1>
      <p>요청하신 키워드 페이지를 찾을 수 없습니다.</p>
      <p>
        <Link href="/">홈으로 돌아가기</Link>
      </p>
    </main>
  );
}
