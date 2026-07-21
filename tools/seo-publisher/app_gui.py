"""SEO 대량 발행 GUI — 도메인·업체명·이미지 URL → 키워드 → 생성 URL 확인"""

from __future__ import annotations

import sys
import threading
import traceback
import webbrowser
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext, ttk

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))


def _load_env() -> None:
    candidates = [ROOT / ".env"]
    if getattr(sys, "frozen", False):
        candidates.insert(0, Path(sys.executable).resolve().parent / ".env")
    for p in candidates:
        if p.exists():
            load_dotenv(p)
            return
    load_dotenv(ROOT / ".env")


_load_env()

from publisher.config import load_config  # noqa: E402
from publisher.pipeline import run_pipeline  # noqa: E402


class PublisherApp(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("SEO 대량 발행 (도메인별 · Vercel)")
        self.geometry("820x780")
        self.minsize(700, 640)

        frm = ttk.Frame(self, padding=12)
        frm.pack(fill=tk.BOTH, expand=True)

        site_row = ttk.Frame(frm)
        site_row.pack(fill=tk.X, pady=(0, 6))
        ttk.Label(site_row, text="발행 도메인").pack(side=tk.LEFT)
        self.site_var = tk.StringVar()
        self.site_combo = ttk.Combobox(
            site_row, textvariable=self.site_var, state="readonly", width=48
        )
        self.site_combo.pack(side=tk.LEFT, padx=(8, 0), fill=tk.X, expand=True)
        self.site_combo.bind("<<ComboboxSelected>>", lambda _e: self.fill_site_fields())
        ttk.Button(site_row, text="새로고침", command=self.reload_sites).pack(
            side=tk.LEFT, padx=(8, 0)
        )

        meta = ttk.LabelFrame(frm, text="업체 · 이미지 (이번 발행에 적용)", padding=8)
        meta.pack(fill=tk.X, pady=(0, 8))

        r1 = ttk.Frame(meta)
        r1.pack(fill=tk.X, pady=2)
        ttk.Label(r1, text="업체명", width=10).pack(side=tk.LEFT)
        self.company_var = tk.StringVar()
        ttk.Entry(r1, textvariable=self.company_var).pack(
            side=tk.LEFT, fill=tk.X, expand=True, padx=(4, 0)
        )

        r2 = ttk.Frame(meta)
        r2.pack(fill=tk.X, pady=2)
        ttk.Label(r2, text="브랜드명", width=10).pack(side=tk.LEFT)
        self.brand_var = tk.StringVar()
        ttk.Entry(r2, textvariable=self.brand_var).pack(
            side=tk.LEFT, fill=tk.X, expand=True, padx=(4, 0)
        )

        r3 = ttk.Frame(meta)
        r3.pack(fill=tk.X, pady=2)
        ttk.Label(r3, text="전화", width=10).pack(side=tk.LEFT)
        self.phone_var = tk.StringVar()
        ttk.Entry(r3, textvariable=self.phone_var).pack(
            side=tk.LEFT, fill=tk.X, expand=True, padx=(4, 0)
        )

        r4 = ttk.Frame(meta)
        r4.pack(fill=tk.X, pady=2)
        ttk.Label(r4, text="이미지 URL", width=10).pack(side=tk.LEFT)
        self.image_var = tk.StringVar()
        ttk.Entry(r4, textvariable=self.image_var).pack(
            side=tk.LEFT, fill=tk.X, expand=True, padx=(4, 0)
        )

        ttk.Label(
            meta,
            text="이미지: 폴더 URL → 개수 자동 확인 후 랜덤 (01.webp~)  /  파일 URL → 고정 1장",
            foreground="#555",
        ).pack(anchor=tk.W, pady=(4, 0))

        ttk.Label(frm, text="키워드 등록 (한 줄에 하나, 또는 쉼표 구분)").pack(anchor=tk.W)
        self.text = scrolledtext.ScrolledText(frm, height=10, font=("Consolas", 11))
        self.text.pack(fill=tk.BOTH, expand=True, pady=(4, 8))

        row = ttk.Frame(frm)
        row.pack(fill=tk.X, pady=4)
        ttk.Button(row, text="TXT 불러오기", command=self.load_txt).pack(side=tk.LEFT)
        ttk.Label(row, text="최대 개수").pack(side=tk.LEFT, padx=(12, 4))
        self.count_var = tk.StringVar(value="1000")
        ttk.Entry(row, textvariable=self.count_var, width=8).pack(side=tk.LEFT)

        opts = ttk.Frame(frm)
        opts.pack(fill=tk.X, pady=4)
        self.deploy_var = tk.BooleanVar(value=True)
        self.indexnow_var = tk.BooleanVar(value=True)
        self.push_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(opts, text="Vercel 배포 (git commit/push)", variable=self.deploy_var).pack(
            side=tk.LEFT
        )
        ttk.Checkbutton(opts, text="IndexNow 요청", variable=self.indexnow_var).pack(
            side=tk.LEFT, padx=(12, 0)
        )
        ttk.Checkbutton(opts, text="원격 push", variable=self.push_var).pack(
            side=tk.LEFT, padx=(12, 0)
        )

        btns = ttk.Frame(frm)
        btns.pack(fill=tk.X, pady=8)
        self.run_btn = ttk.Button(btns, text="생성 · 배포 · IndexNow 실행", command=self.start)
        self.run_btn.pack(side=tk.LEFT)
        ttk.Button(btns, text="생성만", command=lambda: self.start(generate_only=True)).pack(
            side=tk.LEFT, padx=8
        )
        ttk.Button(btns, text="첫 URL 열기", command=self.open_first_url).pack(side=tk.LEFT, padx=8)
        ttk.Button(btns, text="URL 복사", command=self.copy_urls).pack(side=tk.LEFT)

        ttk.Label(frm, text="생성 URL (확인용)").pack(anchor=tk.W)
        self.urls_box = scrolledtext.ScrolledText(frm, height=6, font=("Consolas", 10))
        self.urls_box.pack(fill=tk.BOTH, expand=False, pady=(4, 8))

        ttk.Label(frm, text="로그").pack(anchor=tk.W)
        self.log = scrolledtext.ScrolledText(frm, height=8, font=("Consolas", 10), state=tk.DISABLED)
        self.log.pack(fill=tk.BOTH, expand=True, pady=(4, 0))

        self._last_urls: list[str] = []
        self._sites_by_host: dict = {}
        self.reload_sites()

    def append_log(self, msg: str) -> None:
        self.log.configure(state=tk.NORMAL)
        self.log.insert(tk.END, msg + "\n")
        self.log.see(tk.END)
        self.log.configure(state=tk.DISABLED)

    def set_urls(self, urls: list[str]) -> None:
        self._last_urls = list(urls)
        self.urls_box.delete("1.0", tk.END)
        if urls:
            self.urls_box.insert(tk.END, "\n".join(urls))
        else:
            self.urls_box.insert(tk.END, "(생성된 URL 없음)")

    def reload_sites(self) -> None:
        try:
            cfg = load_config()
            self._sites_by_host = {s.hostname: s for s in cfg.sites}
            labels = [
                f"{s.hostname}  ·  {s.company_name or s.brand_name}  ·  design {s.site_design}"
                for s in cfg.sites
            ]
            self._site_hosts = [s.hostname for s in cfg.sites]
            self.site_combo["values"] = labels
            if labels:
                self.site_combo.current(0)
                self.fill_site_fields()
            self.append_log(f"sites.json={cfg.sites_path} ({len(cfg.sites)}개)")
            self.append_log(f"출력 루트={cfg.seo_static_root}")
            self.append_log(
                "기본 이미지: sites.json imageUrl / imageCdn 없으면 테넌트 CDN 01~20.webp"
            )
        except Exception as e:
            self._site_hosts = []
            self._sites_by_host = {}
            self.append_log(f"설정 로드 경고: {e}")

    def fill_site_fields(self) -> None:
        host = self.selected_hostname()
        if not host:
            return
        site = self._sites_by_host.get(host)
        if not site:
            return
        self.company_var.set(site.company_name or site.brand_name)
        self.brand_var.set(site.brand_name)
        self.phone_var.set(site.phone)
        self.image_var.set(site.image_url or "")

    def selected_hostname(self) -> str | None:
        idx = self.site_combo.current()
        if idx < 0 or not getattr(self, "_site_hosts", None):
            return None
        return self._site_hosts[idx]

    def load_txt(self) -> None:
        path = filedialog.askopenfilename(
            title="키워드 TXT",
            filetypes=[("Text", "*.txt"), ("All", "*.*")],
        )
        if not path:
            return
        content = Path(path).read_text(encoding="utf-8")
        self.text.delete("1.0", tk.END)
        self.text.insert(tk.END, content)

    def open_first_url(self) -> None:
        if not self._last_urls:
            messagebox.showinfo("안내", "먼저 페이지를 생성하세요.")
            return
        webbrowser.open(self._last_urls[0])

    def copy_urls(self) -> None:
        text = self.urls_box.get("1.0", tk.END).strip()
        if not text or text.startswith("("):
            messagebox.showinfo("안내", "복사할 URL이 없습니다.")
            return
        self.clipboard_clear()
        self.clipboard_append(text)
        messagebox.showinfo("완료", f"URL {len(text.splitlines())}개를 클립보드에 복사했습니다.")

    def start(self, generate_only: bool = False) -> None:
        raw = self.text.get("1.0", tk.END)
        if not raw.strip():
            messagebox.showwarning("안내", "키워드를 입력하세요.")
            return
        hostname = self.selected_hostname()
        if not hostname:
            messagebox.showwarning("안내", "발행할 도메인을 선택하세요. sites.json을 확인하세요.")
            return
        try:
            count_raw = self.count_var.get().strip()
            count = int(count_raw) if count_raw else None
        except ValueError:
            messagebox.showerror("오류", "최대 개수는 숫자여야 합니다.")
            return

        company = self.company_var.get().strip()
        brand = self.brand_var.get().strip()
        phone = self.phone_var.get().strip()
        image_url = self.image_var.get().strip()

        self.run_btn.configure(state=tk.DISABLED)
        self.append_log(f"--- 실행 시작 ({hostname}) ---")
        self.append_log(f"업체명={company or '(없음)'} / 브랜드={brand or '(없음)'}")
        self.append_log(f"이미지={image_url or '(기본 CDN)'}")

        def worker() -> None:
            try:
                cfg = load_config()
                result = run_pipeline(
                    cfg=cfg,
                    hostname=hostname,
                    keyword_text=raw,
                    count=count,
                    do_deploy=False if generate_only else self.deploy_var.get(),
                    do_indexnow=False if generate_only else self.indexnow_var.get(),
                    push=False if generate_only else self.push_var.get(),
                    brand_name=brand or None,
                    company_name=company or None,
                    phone=phone or None,
                    image_url=image_url if image_url else "",
                )
                self.after(0, lambda: self.on_done(result))
            except Exception:
                err = traceback.format_exc()
                self.after(0, lambda: self.on_error(err))

        threading.Thread(target=worker, daemon=True).start()

    def on_done(self, result: dict) -> None:
        self.run_btn.configure(state=tk.NORMAL)
        urls = result.get("urls") or []
        self.set_urls(urls)
        self.append_log(f"도메인: {result.get('hostname')}")
        self.append_log(f"업체명: {result.get('company_name')}")
        img = result.get("image_info") or {}
        if img.get("mode") == "cdn_random":
            self.append_log(
                f"이미지 CDN: {img.get('cdnBase')} ({img.get('imageCount')}장 · 랜덤)"
            )
        elif img.get("mode") == "single":
            self.append_log(f"이미지: {img.get('url')} (고정)")
        else:
            self.append_log("이미지: 사이트 기본 CDN (imageIndex)")
        self.append_log(f"생성: {result['generated']}개")
        self.append_log(f"URL 목록 파일: {result.get('last_urls_file')}")
        for u in urls[:20]:
            self.append_log(f"  {u}")
        if len(urls) > 20:
            self.append_log(f"  ... 외 {len(urls) - 20}개 (위 URL 상자 참고)")
        if result.get("deploy_log"):
            self.append_log(result["deploy_log"])
        if result.get("indexnow"):
            self.append_log(f"IndexNow: {result['indexnow']}")
        self.append_log("--- 완료 ---")
        preview = urls[0] if urls else ""
        messagebox.showinfo(
            "완료",
            f"{result.get('company_name') or result.get('hostname')}\n"
            f"{result['generated']}개 생성\n\n"
            f"{preview}",
        )

    def on_error(self, err: str) -> None:
        self.run_btn.configure(state=tk.NORMAL)
        self.append_log(err)
        messagebox.showerror("오류", err.splitlines()[-1] if err else "실패")


def main() -> None:
    app = PublisherApp()
    app.mainloop()


if __name__ == "__main__":
    main()
