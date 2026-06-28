/** 관리자 페이지 경로 (noindex, 프록시 제외) */
export function getAdminPath(): string {
  const path = process.env.ADMIN_PATH?.trim() || "/admin";
  return path.startsWith("/") ? path : `/${path}`;
}

export function isAdminPath(pathname: string): boolean {
  const admin = getAdminPath();
  return pathname === admin || pathname.startsWith(`${admin}/`);
}
