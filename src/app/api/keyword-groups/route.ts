import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createKeywordGroup,
  deactivateKeywordGroup,
  getAllKeywordGroupsIncludingInactive,
  updateKeywordGroup,
} from "@/lib/keyword-groups";
import type { CreateKeywordGroupInput } from "@/types/keyword-group";

export async function GET() {
  const groups = await getAllKeywordGroupsIncludingInactive();
  return NextResponse.json({ groups: groups.filter((g) => g.active) });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateKeywordGroupInput;
    const entry = await createKeywordGroup(body);
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id 쿼리가 필요합니다." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const entry = await updateKeywordGroup(id, body);
    if (!entry) {
      return NextResponse.json({ error: "그룹을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ entry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id 쿼리가 필요합니다." }, { status: 400 });
  }

  const ok = await deactivateKeywordGroup(id);
  if (!ok) {
    return NextResponse.json({ error: "그룹을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ message: "그룹이 비활성화되었습니다." });
}
