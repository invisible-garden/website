import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import "dotenv/config";

/**
 * Downloads every image attachment from a Discord channel, for the recap page
 * photo selects. Written to the plan in mb/discord-photo-download.md, using a
 * bot token rather than a user token, which Discord's terms forbid.
 *
 *   DISCORD_BOT_TOKEN=... pnpm photos:discord <channel-id> [--since 2024-09-01]
 *
 * Setup, five minutes in the Discord admin UI:
 *   1. discord.com/developers, New Application, Bot, Reset Token
 *   2. OAuth2 URL Generator, scope `bot`, permissions "Read Messages/View
 *      Channels" and "Read Message History", open the URL, invite to the server
 *   3. Developer Mode on, right-click the photo channel, Copy Channel ID
 *
 * Files land in data/discord/<channel-id>/ with the message date and author in
 * the name, so photographers can be credited. That folder is gitignored: this
 * is the archive, only selects reach the site.
 */
const API = "https://discord.com/api/v10";

interface Attachment {
  id: string;
  filename: string;
  url: string;
  content_type?: string;
  width?: number;
  height?: number;
}

interface Message {
  id: string;
  timestamp: string;
  author: { username: string };
  attachments: Attachment[];
}

function safe(name: string): string {
  return name.replace(/[^\w.-]+/g, "-").slice(0, 80);
}

async function main() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const channel = process.argv[2];
  if (!token || !channel) {
    console.error(
      "Usage: DISCORD_BOT_TOKEN=... pnpm photos:discord <channel-id> [--since YYYY-MM-DD]",
    );
    process.exit(1);
  }
  const sinceArg = process.argv.indexOf("--since");
  const since =
    sinceArg > -1 ? new Date(`${process.argv[sinceArg + 1]}T00:00:00Z`) : null;

  const out = path.join(process.cwd(), "data", "discord", channel);
  await mkdir(out, { recursive: true });

  const headers = { Authorization: `Bot ${token}` };
  const index: {
    file: string;
    author: string;
    date: string;
    width?: number;
    height?: number;
  }[] = [];
  let before: string | undefined;
  let scanned = 0;
  let saved = 0;

  for (;;) {
    const url = new URL(`${API}/channels/${channel}/messages`);
    url.searchParams.set("limit", "100");
    if (before) url.searchParams.set("before", before);

    const response = await fetch(url, { headers });
    if (response.status === 429) {
      const retry = Number(response.headers.get("retry-after") ?? "5");
      console.log(`  rate limited, waiting ${retry}s`);
      await new Promise((resolve) => setTimeout(resolve, retry * 1000));
      continue;
    }
    if (!response.ok) {
      throw new Error(`Discord ${response.status}: ${await response.text()}`);
    }
    const messages = (await response.json()) as Message[];
    if (messages.length === 0) break;

    for (const message of messages) {
      scanned += 1;
      const date = new Date(message.timestamp);
      if (since && date < since) continue;
      for (const attachment of message.attachments) {
        if (!attachment.content_type?.startsWith("image/")) continue;
        const name = `${date.toISOString().slice(0, 10)}_${safe(message.author.username)}_${safe(attachment.filename)}`;
        const file = await fetch(attachment.url);
        if (!file.ok) {
          console.log(`  failed: ${attachment.filename} ${file.status}`);
          continue;
        }
        await writeFile(
          path.join(out, name),
          Buffer.from(await file.arrayBuffer()),
        );
        index.push({
          file: name,
          author: message.author.username,
          date: date.toISOString(),
          width: attachment.width,
          height: attachment.height,
        });
        saved += 1;
        if (saved % 25 === 0) console.log(`  ${saved} images`);
      }
    }
    before = messages.at(-1)?.id;
  }

  await writeFile(
    path.join(out, "index.json"),
    JSON.stringify(
      { channel, downloadedAt: new Date().toISOString(), images: index },
      null,
      2,
    ),
  );
  console.log(`scanned ${scanned} messages, saved ${saved} images to ${out}`);
  console.log("index.json holds author and date per file, for credits");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
