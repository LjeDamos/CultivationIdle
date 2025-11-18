import { gameState } from './state.js';
import { RACES, TRAITS, SKILLS } from './config.js';
import { getLifespanBreakdown, getCharacterLevel, getSkillPrestigeMult, getAttributeBreakdown } from './logic.js';

const els = {
    age: document.getElementById('age-display'),
    lifespan: document.getElementById('lifespan-display'),
    attrs: document.getElementById('attributes-list'),
    skills: document.getElementById('skills-list'),
    log: document.getElementById('message-log'),
    charLevel: document.getElementById('char-level'),
    tooltip: document.getElementById('tooltip'),
    pauseBtn: document.getElementById('btn-pause')
};

let lastMsg = null;
let lastMsgCount = 1;
let activeTooltipGenerator = null;

export function logMessage(msg, type = "normal") {
    if (lastMsg && lastMsg.text === msg) {
        lastMsgCount++;
        lastMsg.el.querySelector('.log-count').textContent = `(${lastMsgCount}) `;
        return;
    }

    const div = document.createElement('div');
    div.className = `log-entry ${type}`;
    div.innerHTML = `<span class="log-count"></span>${msg}`;
    els.log.prepend(div);
    
    if (els.log.children.length > 50) els.log.lastChild.remove();

    lastMsg = { text: msg, el: div };
    lastMsgCount = 1;
}

export function updatePauseButton() {
    els.pauseBtn.textContent = gameState.isPaused ? "Resume" : "Pause";
    els.pauseBtn.style.borderColor = gameState.isPaused ? "var(--danger)" : "#555";
}

export function renderStats() {
    // Tooltip Realtime Update
    if (!els.tooltip.classList.contains('hidden') && activeTooltipGenerator) {
        els.tooltip.innerHTML = activeTooltipGenerator();
    }

    // Age & Lifespan
    const ageY = Math.floor(gameState.ageInDays / 365);
    const ageD = Math.floor(gameState.ageInDays % 365);
    els.age.textContent = `Age: ${ageY} Years ${ageD} Days`;
    
    const lifeData = getLifespanBreakdown();
    const maxLife = Math.floor(lifeData.total);
    els.lifespan.textContent = `~Lifespan: ${maxLife} Years`;

    // Lifespan Tooltip Generator
    const lifespanGen = () => {
        const ld = getLifespanBreakdown();
        let html = `<strong>Lifespan Breakdown</strong><hr/>`;
        html += `Base (${ld.raceName}): ${ld.base} Years<br/>`;
        
        if (ld.vitBonus > 0) {
            html += `VIT Bonus: +${ld.vitBonus.toFixed(1)} Years<br/>`;
            if(ld.vitEffSources.length > 0) {
                 html += `<span style="color:#aaa; font-size:0.85em; margin-left:10px;">↳ Efficiency Modifiers:</span><br/>`;
                 ld.vitEffSources.forEach(src => {
                     const sign = src.val >= 0 ? '+' : '';
                     const pct = (src.val * 100).toFixed(0);
                     html += `<span style="color:#aaa; font-size:0.85em; margin-left:15px;">${src.name}: ${sign}${pct}%</span><br/>`;
                 });
            }
        }

        if (ld.flatSources.length > 0) {
            html += `<hr/>Traits:<br/>`;
            ld.flatSources.forEach(src => {
                const sign = src.val >= 0 ? '+' : '';
                html += `${src.name}: ${sign}${src.val} Years<br/>`;
            });
        }
        
        html += `<hr/><strong>Total: ${Math.floor(ld.total)} Years</strong>`;
        return html;
    };
    
    els.lifespan.onmouseenter = (e) => showTooltip(e, lifespanGen);
    els.lifespan.onmouseleave = hideTooltip;

    // Attributes
    els.charLevel.textContent = getCharacterLevel();

    const attrKeys = Object.keys(gameState.attributes);
    if (els.attrs.children.length === 0) {
        for (let key of attrKeys) {
            const row = document.createElement('div');
            row.className = 'stat-row';
            row.id = `attr-row-${key}`;
            row.innerHTML = `<span>${key}</span> <span class="val"></span>`;
            els.attrs.appendChild(row);
        }
    }

    for (let key of attrKeys) {
        const bd = getAttributeBreakdown(key);
        const row = document.getElementById(`attr-row-${key}`);
        if(row) {
            row.querySelector('.val').textContent = bd.effective.toFixed(1);
            
            // Attribute Tooltip Generator
            const attrGen = () => {
                const data = getAttributeBreakdown(key);
                let html = `<strong>${key}</strong><br/><small>${data.desc}</small><hr/>`;
                
                html += `Base (${data.raceName}): ${data.base.toFixed(1)}<br/>`;
                if (data.trained > 0) html += `Trained: ${data.trained.toFixed(1)}<br/>`;
                
                html += `Raw Value: ${(data.base + data.trained).toFixed(1)}<br/>`;
                
                if (data.traitSources.length > 0) {
                    html += `<hr/>Multipliers:<br/>`;
                    data.traitSources.forEach(src => {
                        const sign = src.val >= 0 ? '+' : '';
                        const pct = (src.val * 100).toFixed(0);
                        html += `- ${src.name}: ${sign}${pct}%<br/>`;
                    });
                }
                
                html += `<hr/>Effective: ${data.effective.toFixed(1)}`;
                return html;
            };

            row.onmouseenter = (e) => showTooltip(e, attrGen);
            row.onmouseleave = hideTooltip;
        }
    }
}

export function renderSkills() {
    for (let [id, conf] of Object.entries(SKILLS)) {
        let card = document.getElementById(`skill-card-${id}`);
        const skillData = gameState.skills[id] || { level: 0, xp: 0, maxXp: 100 };
        
        // Calculate Prestige Multiplier Badge
        const pMult = getSkillPrestigeMult(id);
        const multHtml = pMult > 1 ? `<span style="color:var(--accent); font-size:0.8rem; margin-left:5px;">(x${pMult.toFixed(1)})</span>` : '';
        
        // Calculate Max Level Badge
        const maxLvl = gameState.meta.maxSkillLevels[id] || 0;
        const maxLvlHtml = maxLvl > 0 ? `<span style="color:var(--accent); font-size:0.8rem; margin-left:5px;">(Max ${maxLvl})</span>` : '';

        if (!card) {
            card = document.createElement('div');
            card.id = `skill-card-${id}`;
            card.className = 'skill-card';
            card.innerHTML = `
                <div class="skill-header">
                    <span>${conf.name} ${multHtml} <small>[${conf.attr}]</small></span>
                    <span class="lvl">Lv. ${skillData.level}${maxLvlHtml}</span>
                </div>
                <div class="progress-bar"><div class="progress-fill"></div></div>
                <button class="btn-train">Train</button>
            `;
            
            card.querySelector('.btn-train').onclick = () => {
                if (gameState.activeSkill === id) {
                    gameState.activeSkill = null;
                } else {
                    gameState.activeSkill = id;
                }
                renderSkills();
            };
            els.skills.appendChild(card);
        } else {
            // Update dynamic header parts
            card.querySelector('.skill-header span:first-child').innerHTML = `${conf.name} ${multHtml} <small>[${conf.attr}]</small>`;
        }

        // Update Level Display
        card.querySelector('.lvl').innerHTML = `Lv. ${skillData.level}${maxLvlHtml}`;

        const pct = (skillData.xp / skillData.maxXp) * 100;
        card.querySelector('.progress-fill').style.width = `${pct}%`;
        
        const btn = card.querySelector('.btn-train');
        if (gameState.activeSkill === id) {
            btn.textContent = "Training...";
            btn.style.borderColor = "var(--accent)";
            btn.style.color = "var(--accent)";
        } else {
            btn.textContent = "Train";
            btn.style.borderColor = "#555";
            btn.style.color = "#fff";
        }
    }
}

// --- Tooltip Logic ---
function showTooltip(e, contentGenerator) {
    activeTooltipGenerator = contentGenerator;
    els.tooltip.innerHTML = activeTooltipGenerator(); 
    els.tooltip.classList.remove('hidden');
    moveTooltip(e);
}

function moveTooltip(e) {
    let x = e.clientX + 15;
    let y = e.clientY + 15;
    if (x + 220 > window.innerWidth) x = e.clientX - 230;
    // Prevent going off bottom
    if (y + els.tooltip.offsetHeight > window.innerHeight) y = e.clientY - els.tooltip.offsetHeight - 10;
    
    els.tooltip.style.left = x + 'px';
    els.tooltip.style.top = y + 'px';
}

function hideTooltip() {
    activeTooltipGenerator = null;
    els.tooltip.classList.add('hidden');
}

window.addEventListener('mousemove', (e) => {
    if (!els.tooltip.classList.contains('hidden')) {
        moveTooltip(e);
    }
});