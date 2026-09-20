import { readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { marked } from "marked";

const root = process.cwd();
const sourceName = process.argv[2] ?? "TEORIA_DO_NAUKI.md";
const outputStem = process.argv[3] ?? "TEORIA_DO_NAUKI_DRUK";
const documentTitle =
  process.argv[4] ?? "AI Image Toolkit — teoria do nauki";
const coverTitle =
  process.argv[5] ?? "AI Image Toolkit<br>Teoria do nauki i pracy";
const coverSubtitle =
  process.argv[6] ??
  "Architektura projektu, fundamenty web developmentu, bezpieczeństwo, testowanie, backend, bazy danych, DevOps i przygotowanie do rozmów.";
const sourcePath = path.join(root, sourceName);
const htmlPath = path.join(root, `${outputStem}.html`);
const pdfPath = path.join(root, `${outputStem}.pdf`);
const chromePath =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const markdown = await readFile(sourcePath, "utf8");

marked.setOptions({
  gfm: true,
  breaks: false,
});

const body = await marked.parse(markdown);
const generatedAt = new Intl.DateTimeFormat("pl-PL", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(new Date());

const html = `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${documentTitle}</title>
  <style>
    @page {
      size: A4;
      margin: 19mm 17mm 20mm;
    }

    * {
      box-sizing: border-box;
    }

    html {
      font-size: 10.6pt;
      color: #172033;
      background: #fff;
    }

    body {
      margin: 0;
      font-family: "Segoe UI", Arial, sans-serif;
      line-height: 1.48;
      text-rendering: optimizeLegibility;
    }

    .cover {
      min-height: 255mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
      page-break-after: always;
      position: relative;
      overflow: hidden;
      padding: 22mm 14mm;
      color: #fff;
      background:
        radial-gradient(circle at 80% 18%, rgba(114, 137, 255, .48), transparent 34%),
        radial-gradient(circle at 16% 82%, rgba(93, 223, 190, .3), transparent 32%),
        linear-gradient(145deg, #111b3c, #273b85 58%, #37236f);
    }

    .cover::after {
      content: "";
      position: absolute;
      inset: 12mm;
      border: 1px solid rgba(255,255,255,.3);
      border-radius: 7mm;
      pointer-events: none;
    }

    .cover-label {
      margin-bottom: 12mm;
      font-size: 11pt;
      font-weight: 700;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: #b8caff;
    }

    .cover h1 {
      max-width: 155mm;
      margin: 0;
      font-size: 34pt;
      line-height: 1.06;
      letter-spacing: -.035em;
      color: #fff;
    }

    .cover p {
      max-width: 145mm;
      margin: 10mm 0 0;
      font-size: 15pt;
      line-height: 1.5;
      color: #e1e8ff;
    }

    .cover-meta {
      margin-top: 24mm;
      color: #bdc9ec;
      font-size: 10pt;
    }

    main {
      max-width: 176mm;
      margin: 0 auto;
    }

    main > h1:first-child {
      display: none;
    }

    h1, h2, h3, h4 {
      color: #152652;
      font-weight: 750;
      line-height: 1.2;
      page-break-after: avoid;
      break-after: avoid-page;
    }

    h1 {
      margin: 0 0 9mm;
      font-size: 25pt;
      letter-spacing: -.025em;
    }

    h2 {
      margin: 12mm 0 4mm;
      padding-bottom: 2.5mm;
      border-bottom: 1.5px solid #b9c7e8;
      font-size: 18pt;
      letter-spacing: -.015em;
    }

    h2:not(:first-of-type) {
      break-before: page;
      page-break-before: always;
    }

    h3 {
      margin: 7mm 0 2.5mm;
      font-size: 13.5pt;
    }

    h4 {
      margin: 5mm 0 2mm;
      font-size: 11.5pt;
    }

    p {
      margin: 0 0 3.2mm;
      orphans: 3;
      widows: 3;
    }

    ul, ol {
      margin: 2mm 0 4mm;
      padding-left: 7mm;
    }

    li {
      margin: 1.1mm 0;
      break-inside: avoid;
    }

    strong {
      color: #101b36;
    }

    a {
      color: #264fa3;
      text-decoration: none;
    }

    blockquote {
      margin: 5mm 0;
      padding: 4mm 5mm;
      border-left: 4px solid #4e6fc3;
      border-radius: 0 3mm 3mm 0;
      background: #f0f4fc;
      color: #34456d;
      break-inside: avoid;
    }

    blockquote p:last-child {
      margin-bottom: 0;
    }

    code {
      padding: .25mm 1mm;
      border-radius: 1mm;
      background: #eef2f8;
      color: #243b70;
      font-family: "Cascadia Mono", Consolas, monospace;
      font-size: 9.2pt;
    }

    pre {
      margin: 4mm 0 5mm;
      padding: 4mm;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
      border: 1px solid #d5ddec;
      border-radius: 2.5mm;
      background: #111827;
      color: #e8eefc;
      line-height: 1.42;
      break-inside: avoid;
    }

    pre code {
      padding: 0;
      background: transparent;
      color: inherit;
      font-size: 8.6pt;
    }

    table {
      width: 100%;
      margin: 4mm 0 6mm;
      border-collapse: collapse;
      font-size: 9.2pt;
      break-inside: avoid;
    }

    th, td {
      padding: 2.4mm 2.8mm;
      border: 1px solid #ccd5e7;
      text-align: left;
      vertical-align: top;
    }

    th {
      background: #e9effa;
      color: #152652;
      font-weight: 700;
    }

    tr:nth-child(even) td {
      background: #f8faff;
    }

    hr {
      height: 1px;
      margin: 8mm 0;
      border: 0;
      background: #d6deec;
    }

    input[type="checkbox"] {
      margin-right: 2mm;
    }

    .print-note {
      margin: 0 0 8mm;
      padding: 4mm 5mm;
      border-radius: 3mm;
      background: #edf7f4;
      color: #244d46;
      font-size: 9.5pt;
    }

    @media print {
      a {
        color: inherit;
      }
    }
  </style>
</head>
<body>
  <section class="cover">
    <div class="cover-label">Podręcznik web developera</div>
    <h1>${coverTitle}</h1>
    <p>${coverSubtitle}</p>
    <div class="cover-meta">
      Dawid Frankowicz · Wersja wygenerowana ${generatedAt}
    </div>
  </section>
  <main>
    <div class="print-note">
      Dokument przygotowany do druku w formacie A4. Rozdziały rozpoczynają się
      na nowych stronach, aby ułatwić naukę i robienie notatek.
    </div>
    ${body}
  </main>
</body>
</html>`;

await writeFile(htmlPath, html, "utf8");

await new Promise((resolve, reject) => {
  const chrome = spawn(
    chromePath,
    [
      "--headless",
      "--disable-gpu",
      "--disable-software-rasterizer",
      "--no-sandbox",
      "--no-pdf-header-footer",
      `--print-to-pdf=${pdfPath}`,
      htmlPath,
    ],
    { stdio: "inherit" },
  );

  chrome.on("error", reject);
  chrome.on("exit", (code) => {
    if (code === 0) resolve();
    else reject(new Error(`Chrome exited with code ${code}`));
  });
});

console.log(pdfPath);
