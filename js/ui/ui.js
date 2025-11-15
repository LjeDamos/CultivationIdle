import { State, logEvent, gainResource, setRace } from '../core/state.js';
import { CONSTANTS, SKILLS, RACES, TRAITS_POOL } from '../data/config.js';
import { doMeditateClick, useStoneToQi } from '../systems/skills.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

export function bindUI() {
  // Tabs
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.locked === 'true') return;
      $$('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      State.ui.currentTab = btn.dataset.tab;
      updatePanels();
    });
  });

  // Overview actions
  $('#meditateBtn').addEventListener('click', () => {
    doMeditateClick();
    logEvent('Meditated.');
    updateOverview();
  });
  $('#convertStoneBtn').addEventListener('click', () => {
    useStoneToQi();
    logEvent('Converted 1 Spirit Stone into Qi.');
    updateOverview();
  });

  // Traits
  $('#traitsRerollBtn').addEventListener('click', () => {
    rollTraitOptions();
    renderTraitDraft();
  });
  $('#traitsConfirmBtn').addEventListener('click', () => {
    const chosen = $$('#panel-traits input[type=checkbox]:checked').map(i => i.value);
    if (chosen.length !== 3) {
      logEvent('Choose exactly 3 traits.');
      return;
    }
    State.run.traitsChosen = State.run.traitOptions.filter(t => chosen.includes(t.id));
    logEvent('Traits confirmed.');
  });

  // Settings
  $('#hardResetBtn').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
  });
  $('#autosaveSec').addEventListener('change', (e) => {
    const v = Math.max(5, Math.min(120, Number(e.target.value) || 15));
    State.autosaveSec = v;
  });

  // Save/export/import via global events
  window.addEventListener('do-autosave', () => {
    const ev = new CustomEvent('manual-save');
    window.dispatchEvent(ev);
  });
  $('#saveBtn').addEventListener('click', () => window.dispatchEvent(new CustomEvent('manual-save')));
  $('#exportBtn').addEventListener('click', () => {
    const ev = new CustomEvent('manual-export');
    window.dispatchEvent(ev);
  });
  $('#importBtn').addEventListener('click', async () => {
    const s = prompt('Paste exported save string:');
    if (!s) return;
    const ev = new CustomEvent('manual-import', { detail: s });
    window.dispatchEvent(ev);
  });
}

export function initialRaceFlowIfNeeded() {
  if (!State.run?.raceChosenOnce) {
    openRaceModal();
    renderRaceChoices();
  }
}

function openRaceModal() { $('#raceModal').classList.remove('hidden'); }
function closeRaceModal() { $('#raceModal').classList.add('hidden'); }

function renderRaceChoices() {
  const host = $('#raceChoices');
  host.innerHTML = '';
  for (const r of RACES) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <label class="row">
        <input type="radio" name="racePick" value="${r.id}" ${r.id === State.character.race ? 'checked' : ''}/>
        <span>${r.name}</span>
      </label>
      <div class="row"><span>${r.desc}</span><span></span></div>
    `;
    host.appendChild(div);
  }
  $('#raceConfirmBtn').onclick = () => {
    const sel = host.querySelector('input[name=racePick]:checked')?.value || 'human';
    setRace(sel);
    State.run.raceChosenOnce = true;
    closeRaceModal();
  };
}

function rollTraitOptions() {
  const pool = [...TRAITS_POOL];
  pool.sort(() => Math.random() - 0.5);
  State.run.traitOptions = pool.slice(0, 9);
}

function renderTraitDraft() {
  const host = $('#traitsDraft');
  host.innerHTML = '';
  State.run.traitOptions.forEach(t => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <label class="row" data-tooltip="${t.desc}">
        <input type="checkbox" value="${t.id}" />
        <span>${t.name}</span>
        <span>${t.id}</span>
      </label>
    `;
    host.appendChild(div);
  });
}

export function updatePanels() {
  $$('.panel').forEach(p => p.classList.add('hidden'));
  $(`#panel-${State.ui.currentTab}`)?.classList.remove('hidden');
  // Lock state on tabs
  $('#tab-skills').dataset.locked = String(!State.ui.unlocks.skills);
  $('#tab-traits').dataset.locked = String(!State.ui.unlocks.traits);
  $('#tab-races').dataset.locked = String(!State.ui.unlocks.races);
  $('#tab-log').dataset.locked = String(!State.ui.unlocks.log);
  renderSkillsList();
  renderLog();
}

function renderSkillsList() {
  const host = $('#skillsList');
  host.innerHTML = '';
  for (const meta of SKILLS) {
    const inst = State.skills[meta.id];
    if (inst.locked) continue;
    const nextReq = (inst.level + 1) ** 2 * 10;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="row">
        <span data-tooltip="${meta.desc}">${meta.name}</span>
        <span>Lv ${inst.level}</span>
      </div>
      <div class="row">
        <span>XP</span>
        <span>${inst.xp.toFixed(1)} / ${nextReq.toFixed(1)}</span>
      </div>
    `;
    host.appendChild(card);
  }
}

export function renderLog() {
  const host = $('#logList');
  host.innerHTML = '';
  State.ui.log.slice(0, 100).forEach(e => {
    const div = document.createElement('div');
    div.className = 'entry';
    div.textContent = new Date(e.t).toLocaleTimeString() + ' — ' + e.text;
    host.appendChild(div);
  });
}

export function updateOverview() {
  $('#qiValue').textContent = State.resources.qi.toFixed(1);
  $('#stonesValue').textContent = State.resources.stones.toFixed(0);
  $('#charLevel').textContent = State.character.level.toString();
  $('#ageValue').textContent = State.character.ageYears.toFixed(2);
  $('#raceValue').textContent = State.character.race;
}
