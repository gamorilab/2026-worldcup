import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const COUNTRY_CODES = [
  "ar",
  "at",
  "au",
  "ba",
  "be",
  "br",
  "ca",
  "cd",
  "ch",
  "ci",
  "co",
  "cw",
  "cv",
  "cz",
  "de",
  "dz",
  "ec",
  "eg",
  "es",
  "fr",
  "gb",
  "gh",
  "hr",
  "ht",
  "iq",
  "ir",
  "jo",
  "jp",
  "kr",
  "ma",
  "mx",
  "nl",
  "no",
  "nz",
  "pa",
  "pt",
  "py",
  "qa",
  "sa",
  "se",
  "sn",
  "tn",
  "tr",
  "us",
  "uy",
  "uz",
  "za",
];

async function downloadFlag(code, targetDir) {
  const url = `https://flagcdn.com/w80/${code}.png`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed ${code}: ${response.status}`);
  }

  const data = Buffer.from(await response.arrayBuffer());
  await writeFile(join(targetDir, `${code}.png`), data);
}

async function main() {
  const targetDir = join(process.cwd(), "public", "flags");
  await mkdir(targetDir, { recursive: true });

  for (const code of COUNTRY_CODES) {
    await downloadFlag(code, targetDir);
  }

  const transparentPngBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WkQ7ZYAAAAASUVORK5CYII=";
  await writeFile(
    join(targetDir, "placeholder.png"),
    Buffer.from(transparentPngBase64, "base64"),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
