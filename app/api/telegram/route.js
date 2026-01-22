export async function POST(req) {
  try {
    const body = await req.json();

    const movieName = body?.movieName || "Unknown";
    const movieUrl = body?.movieUrl || "";
    const photoUrl = body?.photoUrl || "";

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!botToken || !chatId) {
      return Response.json(
        { ok: false, error: "Telegram env missing" },
        { status: 500 }
      );
    }

    // Caption format: name then url
    const caption = `🎬 Movie Request\n\n📌 Name: ${movieName}\n🔗 URL: ${movieUrl || "Not provided"}`;

    // If photo available → sendPhoto
    if (photoUrl) {
      const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

      const tgRes = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          photo: photoUrl,
          caption
        })
      });

      const data = await tgRes.json();
      return Response.json({ ok: true, data });
    }

    // Else → sendMessage
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const tgRes = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: caption
      })
    });

    const data = await tgRes.json();
    return Response.json({ ok: true, data });
  } catch (e) {
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
