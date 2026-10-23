import { test } from 'node:test';
import assert from 'node:assert/strict';
import { replaceSection, pickTop, renderTable, renderLangs } from '../scripts/update-readme.mjs';

const repo = (name, stars, extra = {}) => ({
  name, html_url: `https://github.com/juninmd/${name}`, language: 'Rust', description: 'a|b',
  stargazers_count: stars, pushed_at: '2026-01-01', fork: false, archived: false, private: false, ...extra,
});

test('replaceSection troca apenas o miolo', () => {
  assert.equal(replaceSection('x<!--A:START-->old<!--A:END-->y', 'A', 'new'), 'x<!--A:START-->\nnew\n<!--A:END-->y');
  assert.throws(() => replaceSection('sem marcador', 'A', 'n'), /não encontrado/);
});

test('pickTop ignora forks, arquivados, privados e o repo do perfil', () => {
  const list = [repo('a', 1), repo('b', 9, { fork: true }), repo('c', 5, { archived: true }),
    repo('d', 7, { private: true }), repo('juninmd', 99), repo('e', 3)];
  assert.deepEqual(pickTop(list).map((r) => r.name), ['e', 'a']);
});

test('renderTable escapa pipes e trata descrição vazia', () => {
  const t = renderTable([repo('a', 2), repo('b', 1, { description: null })]);
  assert.match(t, /a\\\|b/);
  assert.match(t, /\| — \|$/m);
});

test('renderLangs gera barras proporcionais', () => {
  const out = renderLangs([repo('a', 0), repo('b', 0), repo('c', 0, { language: 'Go' })]);
  assert.match(out, /Rust\s+█{20} 2/);
  assert.match(out, /Go\s+█{10} 1/);
});
