import { NextRequest, NextResponse } from "next/server";
import { supabase, Inquiry } from "@/lib/supabase";

function verifyPassword(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const password = authHeader.replace("Bearer ", "");
  return password === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "데이터를 불러오는 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ inquiries: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "데이터를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID와 상태를 입력해주세요." },
        { status: 400 }
      );
    }

    const validStatuses: Inquiry["status"][] = ["대기중", "연락완료", "상담완료"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "유효하지 않은 상태입니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "상태 업데이트 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "문의를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "상태가 업데이트되었습니다.", inquiry: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "상태 업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID를 입력해주세요." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "삭제 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "문의가 삭제되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
