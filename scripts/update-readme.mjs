// Atualiza as seções dinâmicas do README (entre marcadores) com dados da API do GitHub.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const USER = 'juninmd';
const README = new URL('../README.md', import.meta.url);

/** Troca o conteúdo entre `<!--NAME:START-->` e `<!--NAME:END-->`. */
export function replaceSection(text, name, body) {
  const re = new RegExp(`(<!--${name}:START-->)[\\s\\S]*?(<!--${name}:END-->)`);
  if (!re.test(text)) throw new Error(`Marcador ${name} não encontrado`);
  return text.replace(re, `$1\n${body}\n$2`);
}

/** Filtra repos públicos próprios e ordena por estrelas (desempate: push mais recente). */
export function pickTop(repos, n = 6) {
  return repos
    .filter((r) => !r.fork && !r.archived && !r.private && r.name !== USER)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || b.pushed_at.localeCompare(a.pushed_at))
    .slice(0, n);
}

/** Linhas de tabela markdown para os repositórios. */
export function renderTable(repos) {
  const rows = repos.map((r) => {
    const desc = (r.description || '—').replace(/\|/g, '\\|');
    return `| [**${r.name}**](${r.html_url}) | ${r.language || '—'} | ⭐ ${r.stargazers_count} | ${desc} |`;
  });
  return ['| Repo | Linguagem | Stars | Descrição |', '|---|---|---|---|', ...rows].join('\n');
}

/** Distribuição de linguagens como barras de texto. */
export function renderLangs(repos, n = 6) {
  const count = {};
  for (const r of repos) if (r.language && !r.fork && !r.private) count[r.language] = (count[r.language] || 0) + 1;
  const top = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, n);
  const max = top[0]?.[1] || 1;
  const lines = top.map(([l, c]) => `${l.padEnd(12)} ${'█'.repeat(Math.max(1, Math.round((c / max) * 20)))} ${c}`);
  return '```text\n' + lines.join('\n') + '\n```';
}

async function fetchRepos() {
  const headers = { 'User-Agent': USER, Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&page=${page}&type=owner`, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

async function main() {
  const repos = (await fetchRepos()).filter((r) => !r.private);
  let md = await readFile(README, 'utf8');
  md = replaceSection(md, 'TOP', renderTable(pickTop(repos)));
  md = replaceSection(md, 'LANGS', renderLangs(repos));
  md = replaceSection(md, 'COUNT', `**${repos.length}** repositórios públicos · atualizado em ${new Date().toISOString().slice(0, 10)}`);
  await writeFile(README, md);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
