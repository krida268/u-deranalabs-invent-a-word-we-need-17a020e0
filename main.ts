// Wavegret — a coined word for a feeling English never named.
// Writes the one-line definition to /output/entry.txt (or argv[2]).
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const ENTRY =
  "Wavegret — the embarrassment of waving back at someone who was waving at the person behind you.";

// Resolve the output target: a directory means entry.txt inside it,
// a path ending in .txt is taken as the file itself.
function resolveTarget(argv: string[]): string {
  const raw = argv[2];
  if (!raw) return "/output/entry.txt";
  const abs = resolve(raw);
  // An existing directory, or a path with no .txt suffix, is a folder.
  if (raw.endsWith("/") || !raw.endsWith(".txt")) return join(abs, "entry.txt");
  if (existsSync(abs) && statSync(abs).isDirectory()) return join(abs, "entry.txt");
  return abs;
}

function main(): void {
  // Gate: one line, 1 to 140 characters, not only whitespace.
  if (ENTRY.length < 1 || ENTRY.length > 140) {
    throw new Error(`entry is ${ENTRY.length} characters, gate needs 1-140`);
  }
  if (!ENTRY.trim() || ENTRY.includes("\n")) {
    throw new Error("entry must be a single non-blank line");
  }
  const target = resolveTarget(process.argv);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, ENTRY, "utf8");
  console.log(`wrote ${target} (${ENTRY.length} characters)`);
}

main();
