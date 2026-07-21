from __future__ import annotations

from typing import Any

import requests


def submit_indexnow(
    *,
    host: str,
    key: str,
    key_location: str,
    url_list: list[str],
    endpoint: str = "https://searchadvisor.naver.com/indexnow",
    chunk_size: int = 10000,
) -> dict[str, Any]:
    if not key:
        raise ValueError("INDEXNOW_KEY 가 .env에 없습니다. (건너뛰려면 GUI에서 IndexNow 체크 해제)")
    if not url_list:
        raise ValueError("제출할 URL이 없습니다.")

    results: list[dict[str, Any]] = []
    for i in range(0, len(url_list), chunk_size):
        chunk = url_list[i : i + chunk_size]
        payload = {
            "host": host,
            "key": key,
            "keyLocation": key_location,
            "urlList": chunk,
        }
        res = requests.post(
            endpoint,
            json=payload,
            headers={"Content-Type": "application/json; charset=utf-8"},
            timeout=60,
        )
        results.append(
            {
                "status_code": res.status_code,
                "count": len(chunk),
                "body": res.text[:500],
            }
        )
    return {"endpoint": endpoint, "chunks": results, "total": len(url_list)}
