/**
 * SEO Title Generator (Shopify) — Högert naming standard
 */
(function () {
  "use strict";

  const BRAND = "Högert";
  const DASH = " – ";
  const BANNED_WORDS = ["profesjonalny", "profesjonalna", "profesjonalne", "premium", "najlepszy", "najlepsza", "najlepsze", "hit", "bestseller"];

  function safeStr(v) { return (v == null ? "" : String(v)).trim(); }
  function normalizeSpaces(s) { return safeStr(s).replace(/\s+/g, " ").trim(); }
  function stripHtml(html) { return safeStr(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(); }
  
  function toTitleCasePl(str) {
    const KEEP = new Set(["VDE", "EN", "FFP1", "FFP2", "FFP3", "SNR", "COB", "LED", "USB", "CrV", "S2", "IP", "IP54", "IP65"]);
    const words = normalizeSpaces(str).split(" ");
    return words.map(w => {
      const clean = w.replace(/[()]/g, "");
      if (KEEP.has(clean)) return w;
      if (/^(PH|PZ|SL|TX)\d+$/i.test(clean)) return w.toUpperCase();
      if (/^(HEX|TORX)$/i.test(clean)) return w.toUpperCase();
      if (/[0-9]/.test(clean)) return w;
      return clean.length ? (clean[0].toUpperCase() + clean.slice(1).toLowerCase()) : w;
    }).join(" ");
  }

  function removeBannedWords(s) {
    let out = ` ${s} `;
    for (const w of BANNED_WORDS) {
      const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      out = out.replace(re, " ");
    }
    return normalizeSpaces(out);
  }

  function clampRanges(mode) {
    if (mode === "marketplace") return { min: 120, max: 170 };
    return { min: 70, max: 110 };
  }

  const TYPE_RULES = [
    { re: /(wkrętak|wkretak|śrubokręt|srubokret)/i, type: "Wkrętak" },
    { re: /(szczypce|kombinerki|obcęgi|obcegi|zaciskarka|ściągacz izolacji|sciagacz izolacji)/i, type: "Szczypce" },
    { re: /(klucz.*płaski|klucz.*plaski|klucz.*oczkowy|płasko-oczkowy|plasko-oczkowy|nastawny|imbus|torx)/i, type: "Klucz" },
    { re: /(nasadka|grzechotka|przedłużk|przedluzk|zestaw nasadek)/i, type: "Nasadki/Grzechotka" },
    { re: /(młotek|mlotek|przecinak|punktak)/i, type: "Młotek/Przecinak" },
    { re: /(taśma miernicza|tasma miernicza|poziomnica|suwmiarka)/i, type: "Narzędzia pomiarowe" },
    { re: /(opaska zaciskowa|wkręty|wkret(y)?|kołki|kolki)/i, type: "Akcesoria montażowe" },
    { re: /(latarka|czołówka|czolowka|lampa robocza|naświetlacz|naswietlacz)/i, type: "Oświetlenie" },
    { re: /(rękawice|rekawice)/i, type: "Rękawice robocze" },
    { re: /(okulary|przyłbica|przylbica)/i, type: "Okulary ochronne" },
    { re: /(nauszniki|zatyczki)/i, type: "Ochrona słuchu" },
    { re: /(maska|półmaska|polmaska|filtr|ffp[123])/i, type: "Maska/Półmaska" },
  ];

  function detectType(product) {
    const hay = normalizeSpaces([
      safeStr(product["podkategoria 2"]),
      safeStr(product["podkategoria2"]),
      safeStr(product["podkategoria 1"]),
      safeStr(product["podkategoria 3"]),
      safeStr(product["kategoria"]),
      safeStr(product["nazwa"]),
      safeStr(product["opis"])
    ].join(" "));
    for (const r of TYPE_RULES) {
      if (r.re.test(hay)) return r.type;
    }
    return "Produkt";
  }

  function detectLineOrModel(name) {
    const n = normalizeSpaces(name);
    const first = n.split(" ")[0] || "";
    if (/^[A-Z0-9]{3,}$/.test(first) && first !== "HÖGERT" && first !== "HOGERT") {
      return first[0].toUpperCase() + first.slice(1).toLowerCase();
    }
    return "";
  }

  function findAll(re, text) {
    const out = [];
    let m;
    const t = safeStr(text);
    while ((m = re.exec(t)) !== null) {
      out.push(m[0]);
      if (!re.global) break;
    }
    return out;
  }

  function detectKeyParams(product) {
    const name = safeStr(product.nazwa || product["nazwa"]);
    const desc = stripHtml(product.opis || product["opis"] || "");
    const hay = `${name} ${desc}`;

    const mm = findAll(/\b\d{2,4}\s?mm\b/gi, hay).map(x => x.replace(/\s+/g, " ").toLowerCase());
    const meters = findAll(/\b\d+(?:[.,]\d+)?\s?m\b/gi, hay).map(x => x.replace(/\s+/g, " ").toLowerCase());

    const bits = [];
    bits.push(...findAll(/\bPH\d+\b/gi, hay).map(x => x.toUpperCase()));
    bits.push(...findAll(/\bPZ\d+\b/gi, hay).map(x => x.toUpperCase()));
    bits.push(...findAll(/\bTX\d+\b/gi, hay).map(x => x.toUpperCase()));
    bits.push(...findAll(/\bSL\s?\d+(?:[.,]\d+)?\b/gi, hay).map(x => normalizeSpaces(x).toUpperCase()));
    bits.push(...findAll(/\bHEX\s?\d+(?:[.,]\d+)?\b/gi, hay).map(x => normalizeSpaces(x).toUpperCase()));

    const drive = findAll(/\b(?:1\/2|3\/8|1\/4)\s?"\b/gi, hay).map(x => x.replace(/\s+/g, ""));

    const qty = [];
    qty.push(...findAll(/\b\d+\s?el\.\b/gi, hay).map(x => normalizeSpaces(x).toLowerCase()));
    qty.push(...findAll(/\b\d+\s?szt\.\b/gi, hay).map(x => normalizeSpaces(x).toLowerCase()));
    qty.push(...findAll(/\b\d+\s?par\/op\b/gi, hay).map(x => normalizeSpaces(x).toLowerCase()));

    const mats = [];
    if (/\bCrV\b/i.test(hay)) mats.push("CrV");
    if (/\bS2\b/i.test(hay)) mats.push("S2");
    if (/\blateks(em)?\b/i.test(hay)) mats.push("Lateks");
    if (/\bnitryl(owe|owy|owa|)\b/i.test(hay)) mats.push("Nitryl");
    if (/\bPU\b/i.test(hay)) mats.push("PU");

    const colors = [];
    if (/\bczerwone\/czarne\b/i.test(hay) || /\bczerwono[-\s]?czarn\w*\b/i.test(hay)) colors.push("Czerwono-czarne");
    if (/\bczarn\w*\b/i.test(hay)) colors.push("Czarny");
    if (/\bbezbarwne\b/i.test(hay) || /\bprzezroczyst\w*\b/i.test(hay)) colors.push("Bezbarwne");

    const gloveSize = [];
    const m1 = hay.match(/\b(?:rozmiar\s*)?(\d{1,2})\b/i);
    if (m1 && /\brękawice|rekawice\b/i.test(hay)) gloveSize.push(m1[1]);

    const param1Candidates = [...bits, ...drive, ...mm, ...meters];
    const param2Candidates = [...mats];
    const variantCandidates = [...colors, ...qty, ...gloveSize];

    return {
      param1: uniqueKeepOrder(param1Candidates)[0] || "",
      param2: uniqueKeepOrder(param2Candidates)[0] || "",
      variants: uniqueKeepOrder(variantCandidates)
    };
  }

  function uniqueKeepOrder(arr) {
    const seen = new Set();
    const out = [];
    for (const x of arr) {
      const v = safeStr(x);
      if (!v) continue;
      const key = v.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(v);
    }
    return out;
  }

  function detectStandards(product) {
    const name = safeStr(product.nazwa || product["nazwa"]);
    const desc = stripHtml(product.opis || product["opis"] || "");
    const hay = `${name} ${desc}`;
    const std = [];

    if (/\bVDE\b/i.test(hay)) std.push("VDE");

    const en166 = hay.match(/\bEN\s?166(?::\d{4})?\b/i);
    if (en166) std.push(en166[0].toUpperCase().replace(/\s+/g, " "));

    const en170 = hay.match(/\bEN\s?170\b/i);
    if (en170) std.push(en170[0].toUpperCase().replace(/\s+/g, " "));

    const en388 = hay.match(/\bEN\s?388\b/i);
    if (en388) {
      const level = hay.match(/\bEN\s?388\b[^0-9A-Z]*([0-9X]{4,6}[A-Z]?)\b/i);
      if (level) std.push(`EN 388 ${level[1].toUpperCase()}`);
      else std.push("EN 388");
    }

    const ffp = hay.match(/\bFFP[123]\b/i);
    if (ffp) std.push(ffp[0].toUpperCase());

    const snr = hay.match(/\bSNR\s?\d{2}\s?dB\b/i);
    if (snr) std.push(normalizeSpaces(snr[0]).toUpperCase().replace("DB", "dB"));

    return uniqueKeepOrder(std);
  }

  function buildTitleParts(product, mode) {
    const name = safeStr(product.nazwa || product["nazwa"]);
    const type = detectType(product);
    const line = detectLineOrModel(name);
    const { param1, param2, variants } = detectKeyParams(product);
    const standards = detectStandards(product);

    const commonItems = uniqueKeepOrder([line, param1, param2]).filter(Boolean);
    const commonBlock = commonItems.length ? commonItems.join(", ") : "";
    const variantBlock = variants.slice(0, 2).join(", ");

    const blocks = [];
    blocks.push(`${BRAND} ${type}`.trim());
    if (commonBlock) blocks.push(commonBlock);
    if (variantBlock) blocks.push(variantBlock);
    if (standards.length) blocks.push(standards.join(", "));

    return { blocks };
  }

  function joinBlocks(blocks) {
    return blocks.filter(Boolean).join(DASH);
  }

  function shortenByRules(blocks, mode) {
    const { max } = clampRanges(mode);
    let current = joinBlocks(blocks);
    if (current.length <= max) return blocks;

    if (blocks.length >= 4) {
      const stdBlock = blocks[blocks.length - 1];
      const mustKeepStd = /\bFFP[123]\b/i.test(stdBlock) || /\bSNR\b/i.test(stdBlock);
      if (!mustKeepStd) {
        const b = blocks.slice(0, -1);
        if (joinBlocks(b).length <= max) return b;
        blocks = b;
      }
    }

    if (blocks.length >= 3) {
      const v = blocks[2];
      const parts = v.split(",").map(x => normalizeSpaces(x));
      const mustKeep = parts.find(p => /\b\d+\s?(el\.|szt\.|par\/op)\b/i.test(p)) || "";
      const first = parts[0] || "";
      const newV = uniqueKeepOrder([mustKeep, first]).filter(Boolean).slice(0, 1).join(", ");
      const b = blocks.slice();
      b[2] = newV || b[2];
      if (joinBlocks(b).length <= max) return b;
      blocks = b;
    }

    if (blocks.length >= 2) {
      const common = blocks[1];
      const items = common.split(",").map(x => normalizeSpaces(x)).filter(Boolean);
      if (items.length >= 2) {
        const b = blocks.slice();
        b[1] = items.slice(0, 2).join(", ");
        if (joinBlocks(b).length <= max) return b;
        blocks = b;
      }
      if (items.length >= 1) {
        const b2 = blocks.slice();
        b2[1] = items.slice(0, 1).join(", ");
        if (joinBlocks(b2).length <= max) return b2;
        blocks = b2;
      }
    }

    return blocks;
  }

  function sanitizeTitle(s) {
    let out = removeBannedWords(s);
    out = out.replace(/[^\p{L}\p{N}\s\/",.\-–%²³°]/gu, " ");
    out = normalizeSpaces(out);
    out = out.replace(/\b(\w+)\s+\1\b/gi, "$1");
    out = normalizeSpaces(out);
    return out;
  }

  function generateSeoTitle(product, mode = "shop") {
    const p = product || {};
    const { blocks } = buildTitleParts(p, mode);
    const shortenedBlocks = shortenByRules(blocks, mode);
    let title = joinBlocks(shortenedBlocks);
    title = sanitizeTitle(title);
    title = toTitleCasePl(title);
    if (!title.startsWith(BRAND)) return `${BRAND} ${detectType(p)}`;
    return title;
  }

  window.generateSeoTitle = generateSeoTitle;
})();
