"""SEO 대량 발행 GUI — 도메인 선택 → 키워드 → JSON 생성 → Vercel 배포 → IndexNow"""

from __future__ import annotations

import sys
import threading
import traceback
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
        self.geometry("780x700")
        self.minsize(660, 560)

        frm = ttk.Frame(self, padding=12)
        frm.pack(fill=tk.BOTH, expand=True)

        site_row = ttk.Frame(frm)
        site_row.pack(fill=tk.X, pady=(0, 8))
        ttk.Label(site_row, text="발행 도메인").pack(side=tk.LEFT)
        self.site_var = tk.StringVar()
        self.site_combo = ttk.Combobox(
            site_row, textvariable=self.site_var, state="readonly", width=48
        )
        self.site_combo.pack(side=tk.LEFT, padx=(8, 0), fill=tk.X, expand=True)
        ttk.Button(site_row, text="새로고침", command=self.reload_sites).pack(
            side=tk.LEFT, padx=(8, 0)
        )

        ttk.Label(frm, text="키워드 등록 (한 줄에 하나, 또는 쉼표 구분)").pack(anchor=tk.W)
        self.text = scrolledtext.ScrolledText(frm, height=14, font=("Consolas", 11))
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

        ttk.Label(frm, text="로그").pack(anchor=tk.W)
        self.log = scrolledtext.ScrolledText(frm, height=12, font=("Consolas", 10), state=tk.DISABLED)
        self.log.pack(fill=tk.BOTH, expand=True, pady=(4, 0))

        self.reload_sites()

    def append_log(self, msg: str) -> None:
        self.log.configure(state=tk.NORMAL)
        self.log.insert(tk.END, msg + "\n")
        self.log.see(tk.END)
        self.log.configure(state=tk.DISABLED)

    def reload_sites(self) -> None:
        try:
            cfg = load_config()
            labels = [
                f"{s.hostname}  ·  {s.brand_name}  ·  design {s.site_design}"
                for s in cfg.sites
            ]
            self._site_hosts = [s.hostname for s in cfg.sites]
            self.site_combo["values"] = labels
            if labels:
                self.site_combo.current(0)
            self.append_log(f"sites.json={cfg.sites_path} ({len(cfg.sites)}개)")
            self.append_log(f"출력 루트={cfg.seo_static_root}")
        except Exception as e:
            self._site_hosts = []
            self.append_log(f"설정 로드 경고: {e}")

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

        self.run_btn.configure(state=tk.DISABLED)
        self.append_log(f"--- 실행 시작 ({hostname}) ---")

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
                )
                self.after(0, lambda: self.on_done(result))
            except Exception:
                err = traceback.format_exc()
                self.after(0, lambda: self.on_error(err))

        threading.Thread(target=worker, daemon=True).start()

    def on_done(self, result: dict) -> None:
        self.run_btn.configure(state=tk.NORMAL)
        self.append_log(f"도메인: {result.get('hostname')} ({result.get('brand_name')})")
        self.append_log(f"디자인: {result.get('site_design')}")
        self.append_log(f"생성: {result['generated']}개")
        self.append_log(f"JSON: {result['pages_dir']}")
        self.append_log(f"sitemap 총 URL: {result['sitemap_total']}")
        if result.get("urls"):
            self.append_log(f"예: {result['urls'][0]}")
        if result.get("deploy_log"):
            self.append_log(result["deploy_log"])
        if result.get("indexnow"):
            self.append_log(f"IndexNow: {result['indexnow']}")
        self.append_log("--- 완료 ---")
        messagebox.showinfo(
            "완료",
            f"{result.get('hostname')}\n{result['generated']}개 페이지 처리 완료\n"
            f"URL: /guide/{{slug}}",
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
