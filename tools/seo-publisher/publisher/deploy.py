from __future__ import annotations

import subprocess
from pathlib import Path


def _run(cmd: list[str], cwd: Path) -> str:
    proc = subprocess.run(
        cmd,
        cwd=str(cwd),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if proc.returncode != 0:
        raise RuntimeError(
            f"명령 실패: {' '.join(cmd)}\n{proc.stdout}\n{proc.stderr}"
        )
    return (proc.stdout or "") + (proc.stderr or "")


def deploy_to_vercel_git(
    *,
    repo_root: Path,
    paths: list[Path],
    message: str,
    remote: str = "origin",
    branch_main: str = "main",
    branch_production: str = "production",
    push: bool = True,
) -> str:
    """생성 파일을 git add → commit → push(main + production) 로 Vercel 배포."""
    rels: list[str] = []
    for p in paths:
        p = p.resolve()
        try:
            rels.append(str(p.relative_to(repo_root.resolve())))
        except ValueError:
            raise RuntimeError(f"저장소 밖 경로입니다: {p}")

    logs: list[str] = []
    _run(["git", "add", "--", *rels], repo_root)
    status = _run(["git", "status", "--porcelain", "--", *rels], repo_root)
    if not status.strip():
        logs.append("변경된 파일 없음 (이미 커밋됨). push만 시도합니다." if push else "변경 없음.")
    else:
        _run(["git", "commit", "-m", message], repo_root)
        logs.append(f"commit: {message}")

    if push:
        logs.append(_run(["git", "push", remote, branch_main], repo_root))
        # production 트래킹 (기존 배포 패턴)
        try:
            logs.append(
                _run(["git", "push", remote, f"{branch_main}:{branch_production}"], repo_root)
            )
        except RuntimeError as e:
            logs.append(f"production push 경고: {e}")
    return "\n".join(logs)
