import { NextRequest, NextResponse } from "next/server";
import { backupFetch } from "../../../lib/inquiry-backup";

async function sendDiscordNotification(inquiry: {
  name: string;
  phone: string;
  message: string;
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Discord webhook URL is not configured");
  }

  const embed = {
    embeds: [
      {
        title: "새로운 상담 문의가 접수되었습니다!",
        color: 0x3ecdc6,
        fields: [
          {
            name: "이름",
            value: inquiry.name,
            inline: true,
          },
          {
            name: "전화번호",
            value: inquiry.phone,
            inline: true,
          },
          {
            name: "상담문의",
            value: inquiry.message,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "청소대행끗",
        },
      },
    ],
  };

  const response = await backupFetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(embed),
  });

  if (!response.ok) {
    throw new Error(`Discord webhook failed: ${response.status}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    await sendDiscordNotification({ name, phone, message });

    return NextResponse.json(
      { message: "문의가 성공적으로 접수되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing inquiry:", error);
    return NextResponse.json(
      { error: "문의 접수 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
