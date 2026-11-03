(() => {
  const D = window.BITGYEOL_DATA;
  if (!D) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const colors = {vitc:'#8058bd', glutathione:'#58a26e', greentea:'#d39b43', aronia:'#d56e93'};
  const names = {vitc:'비타민 C',glutathione:'글루타티온 함유 시료',greentea:'녹차',aronia:'아로니아'};
  const fmt = n => `${n > 0 ? '+' : ''}${Number(n).toFixed(2)}%`;
  const changeFor = (id, amount) => D.finalChanges.find(x => x.amount === Number(amount))?.[id];
  const getRGB = rgb => `(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const rgbCSS = rgb => `rgb(${rgb.r},${rgb.g},${rgb.b})`;

  // Responsive mobile navigation
  const menu = $('menuToggle'), nav = $('mainNav');
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); menu.setAttribute('aria-expanded','false');
  }));
  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) nav.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    }), {rootMargin:'-25% 0px -65% 0px'});
    sections.forEach(s => observer.observe(s));
  }

  // RGB data table and filters
  function renderTable() {
    const sample = $('sampleFilter').value, amount = $('amountFilter').value, q = $('dataSearch').value.trim().toLowerCase();
    const rows = D.samples.filter(s => (sample === 'all' || s.id === sample) && (amount === 'all' || s.amount === Number(amount)) && s.name.toLowerCase().includes(q));
    $('rgbTableBody').innerHTML = rows.map(s => `<tr>
      <td><button class="text-link" data-material="${s.id}">${esc(s.name)}</button></td>
      <td>${s.amount.toFixed(1)}</td><td>${s.rgb.r}</td><td>${s.rgb.g}</td><td>${s.rgb.b}</td>
      <td><span class="rgb-swatch" style="background:${rgbCSS(s.rgb)}" title="${getRGB(s.rgb)}"></span></td>
      <td><button class="detail-btn" data-material="${s.id}">시료 보기 ↗</button></td></tr>`).join('');
    $('dataCount').textContent = `총 ${rows.length}개 측정값 표시 · 제공된 최종 데이터 12개 중 필터 결과`;
    // Event delegation keeps the sample-detail action reliable after filters redraw the table.
    $('rgbTableBody').querySelectorAll('[data-material]').forEach(b => b.addEventListener('click', e => {
      e.preventDefault();
      showSample(b.dataset.material);
      history.replaceState(null, '', '#samples');
      $('samples').scrollIntoView({behavior:'smooth', block:'start'});
    }));
  }
  ['sampleFilter','amountFilter','dataSearch'].forEach(id => $(id).addEventListener(id === 'dataSearch' ? 'input' : 'change', renderTable));
  $('resetFilters').addEventListener('click', () => { $('sampleFilter').value='all'; $('amountFilter').value='all'; $('dataSearch').value=''; renderTable(); });
  $('controlRgb').textContent = getRGB(D.control.rgb);
  $('blankRgb').textContent = getRGB(D.blank.rgb);
  renderTable();

  // The final provided values are kept as the displayed result series; computed values are independently checked.
  function calculate(g, control) { return ((g-control)/control)*100; }
  const computed = D.samples.map(s => ({...s, computed:calculate(s.rgb.g,D.controlG)}));
  window.BITGYEOL_VALIDATE = computed.map(s => ({sample:s.name, amount:s.amount, calculated:Number(s.computed.toFixed(2)), supplied:changeFor(s.id,s.amount)}));
  const allMatch = window.BITGYEOL_VALIDATE.every(x => x.calculated === x.supplied);
  console.info('빛결 G 변화율 검증:', window.BITGYEOL_VALIDATE, '일치:', allMatch);

  $('changeTableBody').innerHTML = D.finalChanges.map(row => `<tr><td><strong>${row.amount.toFixed(1)}</strong></td>${['vitc','glutathione','greentea','aronia'].map(id => `<td style="color:${colors[id]};font-weight:800">${fmt(row[id])}</td>`).join('')}</tr>`).join('');

  // SVG line chart: values include both negative and positive range, and zero baseline is emphasized.
  function drawChart() {
    const svg = $('changeChart'), W=820, H=430, m={l:68,r:28,t:40,b:64}, pw=W-m.l-m.r, ph=H-m.t-m.b;
    const minY=-80,maxY=20, xVals=[0.5,1.0,1.5];
    const x = v => m.l + (v-0.5)/(1.5-0.5)*pw;
    const y = v => m.t + (maxY-v)/(maxY-minY)*ph;
    let out = '';
    [-80,-60,-40,-20,0,20].forEach(t => {
      const yy=y(t), zero=t===0;
      out += `<line x1="${m.l}" y1="${yy}" x2="${W-m.r}" y2="${yy}" stroke="${zero?'#7655b7':'#e8e2ed'}" stroke-width="${zero?2.5:1}" ${zero?'':'stroke-dasharray="3 5"'}/>`;
      out += `<text x="${m.l-12}" y="${yy+4}" text-anchor="end" font-size="12" fill="${zero?'#503786':'#81798c'}">${t}%</text>`;
    });
    xVals.forEach(v => {
      const xx=x(v);
      out += `<line x1="${xx}" y1="${m.t}" x2="${xx}" y2="${H-m.b}" stroke="#f0ebf4" stroke-width="1"/>`;
      out += `<text x="${xx}" y="${H-m.b+27}" text-anchor="middle" font-size="13" fill="#625a70">${v.toFixed(1)} g</text>`;
    });
    out += `<text x="${W/2}" y="${H-12}" text-anchor="middle" font-size="13" font-weight="700" fill="#625a70">시료량 (g)</text>`;
    out += `<text transform="translate(19 ${H/2}) rotate(-90)" text-anchor="middle" font-size="13" font-weight="700" fill="#625a70">G 채널 상대 변화율 (%)</text>`;
    const offsets = {vitc:-14,glutathione:15,greentea:-4,aronia:-8};
    ['vitc','glutathione','greentea','aronia'].forEach(id => {
      const points = D.finalChanges.map(row => ({amount:row.amount,value:row[id]}));
      out += `<polyline points="${points.map(p=>`${x(p.amount)},${y(p.value)}`).join(' ')}" fill="none" stroke="${colors[id]}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
      points.forEach(p => {
        const xx=x(p.amount), yy=y(p.value), labelY=yy+offsets[id];
        out += `<circle cx="${xx}" cy="${yy}" r="5" fill="#fff" stroke="${colors[id]}" stroke-width="3"/>`;
        out += `<text x="${xx}" y="${labelY}" text-anchor="middle" font-size="11.5" font-weight="800" fill="${colors[id]}" stroke="#fff" stroke-width="3.5" paint-order="stroke">${fmt(p.value)}</text>`;
      });
    });
    svg.innerHTML = out;
    $('chartLegend').innerHTML = ['vitc','glutathione','greentea','aronia'].map(id => `<span class="legend-item"><i class="legend-line" style="background:${colors[id]}"></i>${names[id]}</span>`).join('');
  }
  drawChart();

  // Sample details
  function showSample(id) {
    const mat = D.materials.find(m => m.id === id);
    if (!mat) return;
    const samples = D.samples.filter(s => s.id === id);
    const source = mat.source ? `<a href="${esc(mat.source)}" target="_blank" rel="noopener">관련 자료 열기 ↗</a>` : `<span class="muted">추가 자료 필요 — 제품의 정확한 성분표 및 글루타티온 관련 문헌을 확인한 뒤 등록할 예정입니다.</span>`;
    $('materialContent').innerHTML = `<div class="material-head"><div><span class="section-label">SAMPLE PROFILE</span><h3>${esc(mat.name)}</h3><p>${esc(mat.type)} · ${esc(mat.form)}</p></div><span class="material-badge">측정값 3개</span></div>
      <div class="material-grid">
      <article class="material-item"><h4>주요 항산화 성분</h4><p>${esc(mat.components)}</p></article>
      <article class="material-item"><h4>알려진 작용 원리</h4><p>${esc(mat.mechanism)}</p></article>
      <article class="material-item"><h4>본 실험의 시료량</h4><p>0.5 g, 1.0 g, 1.5 g · 증류수 기준량 10 mL</p></article>
      <article class="material-item"><h4>활용 가능성</h4><p>${esc(mat.use)}</p></article></div>
      <div class="material-table table-wrap"><table><thead><tr><th>시료량 (g)</th><th>R</th><th>G</th><th>B</th><th>G 상대 변화율</th><th>측정 색상</th></tr></thead><tbody>${samples.map(s=>`<tr><td>${s.amount.toFixed(1)}</td><td>${s.rgb.r}</td><td>${s.rgb.g}</td><td>${s.rgb.b}</td><td style="font-weight:800;color:${colors[id]}">${fmt(changeFor(id,s.amount))}</td><td><span class="rgb-swatch" style="background:${rgbCSS(s.rgb)}"></span></td></tr>`).join('')}</tbody></table></div>
      <div class="material-source"><strong>관련 문헌 및 자료:</strong> ${source}</div>`;
    document.querySelectorAll('.sample-tab').forEach(b=>b.classList.toggle('active',b.dataset.sample===id));
  }
  window.bitgyeolShowSample = showSample;
  document.querySelectorAll('.sample-tab').forEach(b=>b.addEventListener('click',()=>showSample(b.dataset.sample)));
  showSample('vitc');

  // References

  // Calculator
  $('calcForm').addEventListener('submit', e => {
    e.preventDefault();
    const control=Number($('controlGInput').value), sample=Number($('sampleGInput').value), result=$('calcResult');
    if (!Number.isFinite(control) || !Number.isFinite(sample)) { result.innerHTML='두 값을 모두 입력해 주세요.'; return; }
    if (control === 0) { result.innerHTML='<strong>계산할 수 없습니다.</strong><small>대조군 G값이 0이면 0으로 나누게 되므로 상대 변화율을 계산할 수 없습니다.</small>'; return; }
    const val=calculate(sample,control);
    result.innerHTML=`상대 변화율: <strong>${fmt(val)}</strong><small>((${sample} − ${control}) ÷ ${control}) × 100</small><small>${val>0?'시료 G값이 대조군보다 높습니다.':val<0?'시료 G값이 대조군보다 낮습니다.':'시료 G값과 대조군 G값이 같습니다.'} 실제 DPPH 소거율을 뜻하지는 않습니다.</small>`;
  });

  // Research records: same-name samples with 3+ valid measurements and 2+ amounts get an automatic graph.
  const records = [];
  const recordColors = ['#7655b7','#4f986e','#d58b4c','#c56b91','#4d8da8','#8a7a55'];
  function drawRecordChart() {
    const grouped = new Map();
    records.forEach(record => {
      if (!record.isValid) return;
      const key = record.sampleName.trim().toLocaleLowerCase();
      if (!grouped.has(key)) grouped.set(key, {name:record.sampleName.trim(), points:[]});
      grouped.get(key).points.push({x:Number(record.amount), y:Number(record.relativeChange)});
    });
    const series = [...grouped.values()].map(s => {
      const byAmount = new Map();
      s.points.forEach(p => {
        if (!byAmount.has(p.x)) byAmount.set(p.x, []);
        byAmount.get(p.x).push(p.y);
      });
      const points = [...byAmount.entries()].map(([x, ys]) => ({x, y:ys.reduce((a,b)=>a+b,0)/ys.length, repeats:ys.length})).sort((a,b)=>a.x-b.x);
      return {name:s.name, count:s.points.length, points};
    }).filter(s=>s.count>=3 && s.points.length>=2);
    const panel=$('recordChartPanel'), svg=$('recordChart'), legend=$('recordChartLegend');
    if (!series.length) { panel.hidden=true; return; }
    panel.hidden=false;
    const all=series.flatMap(s=>s.points), minX=Math.min(...all.map(p=>p.x)), maxX=Math.max(...all.map(p=>p.x));
    let minY=Math.min(0,...all.map(p=>p.y)), maxY=Math.max(0,...all.map(p=>p.y));
    if (minY===maxY) { minY-=1; maxY+=1; }
    const yPad=(maxY-minY)*.12; minY-=yPad; maxY+=yPad;
    const W=820,H=430,m={l:78,r:28,t:34,b:66},pw=W-m.l-m.r,ph=H-m.t-m.b;
    const x=p=>m.l+(maxX===minX?.5:(p-minX)/(maxX-minX))*pw;
    const y=v=>m.t+(maxY-v)/(maxY-minY)*ph;
    let out='';
    for(let i=0;i<=4;i++){const v=minY+(maxY-minY)*i/4, yy=y(v), isZero=Math.abs(v)<(maxY-minY)/1000;const dash=isZero?'':'stroke-dasharray="3 5"';out+=`<line x1="${m.l}" y1="${yy}" x2="${W-m.r}" y2="${yy}" stroke="${isZero?'#8a79a5':'#eee8f3'}" stroke-width="${isZero?2:1}" ${dash}/><text x="${m.l-12}" y="${yy+4}" text-anchor="end" font-size="12" fill="#777184">${v.toFixed(1)}%</text>`;}
    const xTicks=[...new Set(all.map(p=>p.x))].sort((a,b)=>a-b);
    xTicks.forEach(v=>{const xx=x(v);out+=`<line x1="${xx}" y1="${m.t}" x2="${xx}" y2="${H-m.b}" stroke="#f1edf4"/><text x="${xx}" y="${H-m.b+23}" text-anchor="middle" font-size="12" fill="#777184">${v} g</text>`;});
    out+=`<line x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${H-m.b}" stroke="#b9afc5"/><line x1="${m.l}" y1="${H-m.b}" x2="${W-m.r}" y2="${H-m.b}" stroke="#b9afc5"/>`;
    out+=`<text x="${m.l+pw/2}" y="${H-14}" text-anchor="middle" font-size="13" font-weight="700" fill="#625a70">시료량 (g)</text><text transform="translate(20 ${H/2}) rotate(-90)" text-anchor="middle" font-size="13" font-weight="700" fill="#625a70">G 채널 상대 변화율 (%)</text>`;
    series.forEach((s,i)=>{const color=recordColors[i%recordColors.length],pts=s.points;out+=`<polyline points="${pts.map(p=>`${x(p.x)},${y(p.y)}`).join(' ')}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;pts.forEach(p=>{out+=`<circle cx="${x(p.x)}" cy="${y(p.y)}" r="5" fill="${color}" stroke="#fff" stroke-width="2"/><text x="${x(p.x)}" y="${y(p.y)-11}" text-anchor="middle" font-size="11" font-weight="700" fill="${color}">${p.y.toFixed(2)}%</text>${p.repeats>1?`<text x="${x(p.x)}" y="${y(p.y)+20}" text-anchor="middle" font-size="10" fill="#777184">평균 ${p.repeats}회</text>`:''}`;});});
    svg.innerHTML=out;
    legend.innerHTML=series.map((s,i)=>`<span class="legend-item"><i class="legend-line" style="background:${recordColors[i%recordColors.length]}"></i>${esc(s.name)} (${s.count}건)</span>`).join('');
  }
  $('recordForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const record = Object.fromEntries(f.entries());
    record.sampleName = record.sampleName.trim();
    const amount = Number(record.amount), control = Number(record.controlG);
    const rgbValid = ['r','g','b'].every(k => record[k] !== '' && Number.isInteger(Number(record[k])) && Number(record[k]) >= 0 && Number(record[k]) <= 255);
    const valid = record.sampleName !== '' && Number.isFinite(amount) && amount > 0 && rgbValid && Number.isFinite(control) && control > 0 && record.g !== '';
    if (!valid) {
      $('recordPreview').hidden=false;
      $('recordPreview').textContent='그래프용 기록 조건을 확인해 주세요. 시료명, 0보다 큰 시료량, 0~255 범위의 정수 R·G·B 값, 0보다 큰 대조군 G값이 필요합니다.';
      return;
    }
    record.relativeChange = calculate(Number(record.g),control).toFixed(2);
    record.isValid = true;
    records.push(record);
    const sameNameCount = records.filter(r=>r.isValid && r.sampleName.trim().toLocaleLowerCase()===record.sampleName.toLocaleLowerCase()).length;
    const distinctAmounts = new Set(records.filter(r=>r.isValid && r.sampleName.trim().toLocaleLowerCase()===record.sampleName.toLocaleLowerCase()).map(r=>Number(r.amount))).size;
    $('recordPreview').hidden = false;
    $('recordPreview').innerHTML = `<strong>임시 기록 ${records.length}건째가 추가되었습니다.</strong><br>${esc(record.sampleName)} · ${esc(record.amount)} g · RGB (${record.r}, ${record.g}, ${record.b})<br>G 채널 상대 변화율: ${fmt(Number(record.relativeChange))}<br><small>동일 시료 기록 ${sameNameCount}건 · 서로 다른 시료량 ${distinctAmounts}종류. 그래프는 기록 3건 이상 및 시료량 2종류 이상일 때 표시됩니다.</small>`;
    $('downloadCsv').disabled = false;
    drawRecordChart();
  });
  $('downloadCsv').addEventListener('click', () => {
    if (!records.length) return;
    const headers = ['sampleName','amount','date','r','g','b','controlG','relativeChange','conditions','source'];
    const labels = ['시료명','시료량(g)','측정 날짜','R','G','B','대조군 G값','G 채널 상대 변화율(%)','측정 조건 및 메모','참고 자료 URL'];
    const quote = value => `"${String(value ?? '').replace(/"/g,'""')}"`;
    const csv = '\uFEFF' + [labels, ...records.map(r=>headers.map(h=>r[h]??''))].map(row=>row.map(quote).join(',')).join('\r\n');
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url;a.download='bitgyeol-research-records.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  });
})();
