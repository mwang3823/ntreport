(() => {
  'use strict';

  const D = window.REPORT_DATA || {};
  const META = D._meta || {};
  const NAM = +(META.nam || new Date().getFullYear());

  /* ---------------- Định dạng ---------------- */
  const num = v => { const n = Number(String(v ?? '').replace('%', '').trim()); return isFinite(n) ? n : 0; };
  const fmt = (n, d = 0) => Number(n).toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = (v, d = 2) => fmt(num(v), d) + '%';
  const ty = (n, d = 2) => fmt(n / 1e9, d) + ' tỷ';
  const abbr = n => {
    const a = Math.abs(n);
    if (a >= 1e9) return fmt(n / 1e9, 1) + ' tỷ';
    if (a >= 1e6) return fmt(n / 1e6, 1) + 'tr';
    if (a >= 1e3) return fmt(n / 1e3, a >= 1e4 ? 0 : 1) + 'k';
    return fmt(n, n % 1 ? 1 : 0);
  };
  const arr = x => Array.isArray(x) ? x : [];
  const first = x => Array.isArray(x) ? (x[0] || {}) : (x || {});
  const PH = {
    'BINH THOI': 'Bình Thới', 'DIEN HONG': 'Diên Hồng', 'HOA BINH': 'Hòa Bình', 'HOA HUNG': 'Hòa Hưng',
    'MINH PHUNG': 'Minh Phụng', 'PHU THO': 'Phú Thọ', 'TAN PHU': 'Tân Phú', 'VUON LAI': 'Vườn Lài'
  };
  const ph = s => PH[String(s || '').trim().toUpperCase()] || (String(s || '').trim() ? s : 'Khác');
  const PAL = ['#0171CC', '#04ABED', '#3B66D6', '#92DFFF', '#0C2F55', '#11B482', '#F39200', '#D86FF3', '#5AA0FE', '#AC943A'];
  const C = { prev: '#0171CC', cur: '#0C2F55', good: '#00A651', bad: '#D70000', orange: '#F39200' };
  const cnt = (v, dec = 0, suf = '') => `<span class="cnt" data-to="${v}" data-dec="${dec}" data-suf="${suf}">${fmt(v, dec)}${suf}</span>`;

  /* ---------------- Icon ---------------- */
  const ICONS = {
    drop: '<path d="M12 3c-3.5 4.5-6 7.8-6 11a6 6 0 0 0 12 0c0-3.2-2.5-6.5-6-11z"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4.6a3 3 0 0 1 0 6M18 14.2c1.9.7 3 2.8 3 5.8"/>',
    chart: '<path d="M4 20V11M10 20V5M16 20v-8M21 20H3"/>',
    money: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9.5v5M18 9.5v5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>',
    headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.2"/><rect x="17" y="14" width="4" height="6" rx="1.2"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',
    db: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/>',
    report: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M8 16.5v-4M12 16.5v-9M16 16.5v-6"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.2"/><path d="M10.5 18h3"/>',
    swap: '<path d="M4 8h15l-3.5-3.5M20 16H5l3.5 3.5"/>',
    tag: '<path d="M3 12V3.5h8.5L21 13l-8 8z"/><circle cx="7.5" cy="7.5" r="1.4"/>',
    refresh: '<path d="M20 11.5a8 8 0 1 1-2.3-5.6"/><path d="M20.5 4v5h-5"/>',
    back: '<path d="M15 18l-6-6 6-6"/>',
    home: '<path d="M3.5 11L12 4l8.5 7v9h-17z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    filter: '<path d="M3 5h18l-7 8.2V19l-4 2v-7.8z"/>',
    bill: '<path d="M6 2.5h12v19l-3-2-3 2-3-2-3 2z"/><path d="M9 7.5h6M9 11h6M9 14.5h4"/>',
    plus: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/>',
    move: '<path d="M4 12h15M15 7.5l4.5 4.5-4.5 4.5"/>',
    wallet: '<path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H3z"/><path d="M3 7l12-4v4"/><circle cx="16.5" cy="13.5" r="1.2"/>',
    id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M5.8 16c.6-1.5 1.8-2.1 3.2-2.1s2.6.6 3.2 2.1M14.5 10h4M14.5 13.5h4"/>',
    shield: '<path d="M12 3l8 3.5v5.5c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6.5z"/><path d="M8.8 12l2.2 2.2 4.4-4.4"/>',
    tool: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3z"/><path d="M14.5 6.5L17 4l3 3-2.5 2.5"/>'
  };
  const ic = (name, cls = 'icon') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  /* ---------------- Biểu đồ SVG ---------------- */
  function scaleMax(v) {
    if (v <= 0) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const s = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(m => m * p >= v);
    return s * p;
  }

  function barChart({ labels, series, w = 320, h = 150, fmtAxis = abbr, vals = false, legend = true, line, lineFmt = abbr, minY = 0 }) {
    const pl = 36, pr = line ? 38 : 6, pt = vals ? 16 : 8, pb = 18;
    const iw = w - pl - pr, ih = h - pt - pb, n = labels.length;
    const max = scaleMax(Math.max(...series.flatMap(s => s.values), 0));
    const span = max - minY || 1;
    const y = v => pt + ih - (Math.max(v, minY) - minY) / span * ih;
    const gw = iw / n, bw = Math.min(gw * .78 / series.length, 16);
    let s = `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">`;
    for (let i = 0; i <= 3; i++) {
      const v = minY + span * i / 3, yy = y(v);
      s += `<line class="grid" x1="${pl}" x2="${w - pr}" y1="${yy}" y2="${yy}"/><text x="${pl - 5}" y="${yy + 3}" text-anchor="end" font-size="9">${fmtAxis(v)}</text>`;
    }
    labels.forEach((lb, i) => {
      const gx = pl + gw * i + (gw - bw * series.length) / 2;
      series.forEach((se, j) => {
        const v = se.values[i] || 0, x = gx + j * bw, yy = y(v), bh = pt + ih - yy;
        if (bh > 0) s += `<rect class="bar" x="${x + .5}" y="${yy}" width="${bw - 1}" height="${bh}" rx="2" fill="${se.color}" style="transition-delay:${(i * 30 + j * 60)}ms"><title>${se.name} · ${lb}: ${fmt(v, v % 1 ? 2 : 0)}</title></rect>`;
        if (vals && v) s += `<text class="lbl" x="${x + bw / 2}" y="${yy - 3}" text-anchor="middle" font-size="8.5">${fmtAxis(v)}</text>`;
      });
      if (n <= 14 || i % 2 === 0) s += `<text x="${pl + gw * i + gw / 2}" y="${h - 5}" text-anchor="middle" font-size="9.5">${lb}</text>`;
    });
    if (line) {
      const lmax = scaleMax(Math.max(...line.values, 0));
      const ly = v => pt + ih - v / lmax * ih;
      const pts = line.values.map((v, i) => [pl + gw * i + gw / 2, ly(v)]);
      s += `<path class="line" d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')}" stroke="${line.color}"/>`;
      pts.forEach((p, i) => { s += `<circle class="dot" cx="${p[0]}" cy="${p[1]}" r="2.6" fill="${line.color}"><title>${line.name} · ${labels[i]}: ${fmt(line.values[i])}</title></circle>`; });
      for (let i = 0; i <= 3; i++) s += `<text x="${w - pr + 5}" y="${ly(lmax * i / 3) + 3}" font-size="9" fill="${line.color}">${lineFmt(lmax * i / 3)}</text>`;
    }
    s += '</svg>';
    if (legend) s += legendHtml([...series, ...(line ? [line] : [])]);
    return s;
  }

  function lineChart({ labels, series, w = 320, h = 150, fmtAxis = v => fmt(v, 1), legend = true, minY }) {
    const pl = 34, pr = 8, pt = 8, pb = 18, iw = w - pl - pr, ih = h - pt - pb, n = labels.length;
    const all = series.flatMap(s => s.values.filter(v => v != null));
    const lo = minY ?? Math.floor(Math.min(...all) - .5), hi = Math.ceil(Math.max(...all) + .3);
    const y = v => pt + ih - (v - lo) / (hi - lo || 1) * ih;
    const x = i => pl + (n === 1 ? iw / 2 : iw * i / (n - 1));
    let s = `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">`;
    for (let i = 0; i <= 3; i++) {
      const v = lo + (hi - lo) * i / 3, yy = y(v);
      s += `<line class="grid" x1="${pl}" x2="${w - pr}" y1="${yy}" y2="${yy}"/><text x="${pl - 5}" y="${yy + 3}" text-anchor="end" font-size="9">${fmtAxis(v)}</text>`;
    }
    labels.forEach((lb, i) => { s += `<text x="${x(i)}" y="${h - 5}" text-anchor="middle" font-size="9.5">${lb}</text>`; });
    series.forEach(se => {
      const pts = se.values.map((v, i) => v == null ? null : [x(i), y(v)]).filter(Boolean);
      s += `<path class="line" d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')}" stroke="${se.color}"/>`;
      pts.forEach((p, i) => { s += `<circle class="dot" cx="${p[0]}" cy="${p[1]}" r="2.6" fill="${se.color}"><title>${se.name}: ${fmt(se.values[i], 2)}</title></circle>`; });
    });
    s += '</svg>';
    if (legend) s += legendHtml(series);
    return s;
  }

  function legendHtml(series) {
    return `<div class="legend" style="margin-top:6px">${series.map(s => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join('')}</div>`;
  }

  function donut({ items, size = 200, thick = 28, center = '', sub = '', legend = false }) {
    items = items.filter(i => i.value > 0);
    const total = items.reduce((a, b) => a + b.value, 0) || 1;
    const r = (size - thick) / 2, Cc = 2 * Math.PI * r;
    let acc = 0;
    let s = `<svg class="chart" viewBox="0 0 ${size} ${size}" role="img"><g transform="rotate(-90 ${size / 2} ${size / 2})">`;
    s += `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#EEF4FA" stroke-width="${thick}"/>`;
    items.forEach((it, i) => {
      const L = Math.max(it.value / total * Cc - 1.5, .5);
      s += `<circle class="seg" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${it.color || PAL[i % PAL.length]}" stroke-width="${thick}" style="stroke-dasharray:0 ${Cc};stroke-dashoffset:${-acc};--da:${L} ${Cc - L};transition-delay:${i * 90}ms"><title>${it.label}: ${fmt(it.value)} (${fmt(it.value / total * 100, 1)}%)</title></circle>`;
      acc += it.value / total * Cc;
    });
    s += `</g></svg><div class="center"><div><b>${center}</b><small>${sub}</small></div></div>`;
    if (legend) s += `<div class="legend" style="justify-content:center;margin-top:8px">${items.map((it, i) => `<span><i style="background:${it.color || PAL[i % PAL.length]}"></i>${it.label} · ${fmt(it.value)}</span>`).join('')}</div>`;
    return s;
  }

  function hbar(items, { color = '#0171CC', limit = 6 } = {}) {
    items = items.slice(0, limit);
    const max = Math.max(...items.map(i => i.value), 1);
    return items.map(i => `<div class="r"><b>${i.label}</b><span>${i.display ?? fmt(i.value)}</span><div class="track"><i style="--w:${(i.value / max).toFixed(3)};background:${i.color || color}"></i></div></div>`).join('');
  }

  const meter = (label, tile, ratio) => `<div class="row"><span>${label}</span><b style="color:var(--navy)">${tile}</b></div><div class="bar"><i style="--w:${Math.min(ratio, 1).toFixed(3)}"></i></div>`;
  const stat = (label, val, cls = '') => `<div class="stat"><small>${label}</small><b class="${cls}">${val}</b></div>`;

  /* ---------------- Tập dữ liệu ---------------- */
  const byKy = (rows, k) => arr(rows).slice().sort((a, b) => num(a[k]) - num(b[k]));
  const kyLabels = n => Array.from({ length: n }, (_, i) => String(i + 1));

  const bdDT = byKy(D.bdDoanhThu, 'Ky');
  const bdSL = byKy(D.bdSanLuong, 'KyDocSo');
  const bdGB = byKy(D.bdGBBQ, 'KY');
  const bdTTN = byKy(D.bdTTN, 'KY');
  const ttnNam = byKy(D.ttnNam, 'KY');
  const ttnVung = byKy(D.ttnVung, 'KY');
  const hd0 = byKy(D.hd0, 'KY'), hd14 = byKy(D.hd14, 'KY');
  const dtDot = byKy(D.dtDot, 'DOT');

  const kh = D.kh || {};
  const sl = first(D.sanLuong), dt = first(D.doanhThu), gb = first(D.gbbq), ttn = first(D.ttn), th = first(D.thuHo);
  const thucThu = first(D.tyLeThucThu), cccd = first(D.cccd), gm = first(D.ganMoi), doi = first(D.doi);
  const tn = first(D.thayNho), tl = first(D.thayLon), dv = first(D.dvkh), kt = first(D.ktks);
  const app = D.app || {}, hc = first(D.hoanCong), ct = first(D.ttnChuanThu);
  const sum = (rows, k) => arr(rows).reduce((a, r) => a + num(r[k]), 0);

  const ovSeries = {
    dt: { unit: 'Tỷ VNĐ', prev: bdDT.map(r => num(r.Tongdanhthucu) / 1e9), cur: bdDT.map(r => num(r.Tongdoanhthumoi) / 1e9),
      tPrev: ty(sum(bdDT, 'Tongdanhthucu'), 1), tCur: ty(sum(bdDT, 'Tongdoanhthumoi'), 1) },
    gb: { unit: 'Nghìn VNĐ', prev: bdGB.map(r => num(r.GBBQCU) / 1e3), cur: bdGB.map(r => num(r.GBBQMOI) / 1e3),
      tPrev: fmt(sum(bdDT, 'Tongdanhthucu') / (sum(bdSL, 'TONGSLCU') || 1) / 1e3, 1) + ' nghìn',
      tCur: fmt(sum(bdDT, 'Tongdoanhthumoi') / (sum(bdSL, 'TONGSLMOI') || 1) / 1e3, 1) + ' nghìn' },
    sl: { unit: 'Triệu', prev: bdSL.map(r => num(r.TONGSLCU) / 1e6), cur: bdSL.map(r => num(r.TONGSLMOI) / 1e6),
      tPrev: fmt(sum(bdSL, 'TONGSLCU') / 1e6, 1) + ' triệu', tCur: fmt(sum(bdSL, 'TONGSLMOI') / 1e6, 1) + ' triệu' }
  };

  const KPIS = [
    { k: 'kh', color: '#D2AC6C', icon: 'users', t: 'Khách hàng', v: fmt(num(kh.Tongsoluongkh)), n: 'Số lượng khách hàng' },
    { k: 'sl', color: '#00C0DA', icon: 'drop', t: 'Sản lượng', v: fmt(num(sl.TongSanLuong)), n: `Tổng sản lượng ${NAM} (m3)` },
    { k: 'dt', color: '#00AD26', icon: 'money', t: 'Doanh thu', v: fmt(num(dt.TongDoanhthu)), n: `Tổng doanh thu ${NAM} (VNĐ)` },
    { k: 'tt', color: '#007257', icon: 'chart', t: 'Tỷ lệ thực thu', v: thucThu.soLieu ? pct(thucThu.soLieu) : '--', n: `Tỷ lệ thực thu ${NAM}` },
    { k: 'ttn', color: '#D70000', icon: 'drop', t: 'Thất thoát nước', v: fmt(num(ttn.TTN), 2), n: 'Tỷ lệ thất thoát nước (%)' },
    { k: 'gb', color: '#11B482', icon: 'tag', t: 'Giá bán bình quân', v: fmt(num(gb.GBBQ)), n: 'Giá bán bình quân' },
    { k: 'th', color: '#1A7FC1', icon: 'wallet', t: 'Thu hộ tiền nước', v: fmt(num(th.ThuHoTienNuoc)), n: `Tổng thu hộ ${NAM}` },
    { k: 'cc', color: '#6A5ACD', icon: 'id', t: 'Định danh CCCD', v: fmt(num(cccd.SLTONG)), n: 'Số lượng định danh CCCD' },
    { k: 'gm', color: '#F39200', icon: 'plus', t: 'Gắn mới ĐHN', v: fmt(num(gm.SLGM)), n: 'Số lượng gắn mới ĐHN' },
    { k: 'doi', color: '#D86FF3', icon: 'move', t: 'Dời ĐHN', v: fmt(num(doi.SLND)), n: 'Số lượng dời ĐHN' },
    { k: 'tn', color: '#0171CC', icon: 'swap', t: 'Thay ĐHN cỡ nhỏ', v: fmt(num(tn.DHNCoNho)), n: 'Số lượng thay ĐHN cỡ nhỏ' },
    { k: 'tl', color: '#054D8E', icon: 'swap', t: 'Thay ĐHN cỡ lớn', v: fmt(num(tl.DHNCoLon)), n: 'Số lượng thay ĐHN cỡ lớn' },
    { k: 'dv', color: '#AC943A', icon: 'headset', t: 'Hồ sơ DVKH', v: fmt(num(dv.SOLUONG)), n: 'Số lượng hồ sơ DVKH' },
    { k: 'kt', color: '#5AA0FE', icon: 'shield', t: 'Hồ sơ KTKS', v: fmt(num(kt.SOLUONG)), n: 'Số lượng hồ sơ KTKS' },
    { k: 'hd', color: '#2E8B57', icon: 'bill', t: 'Hóa đơn', rows: [`0m³: ${fmt(sum(hd0, 'SOLUONG'))}`, `1->4m³: ${fmt(sum(hd14, 'SOLUONG'))}`] },
    { k: 'app', color: '#006978', icon: 'phone', t: 'KH tải app Sawaco', v: fmt(num(app.SLTONG)), n: `Tổng KH: ${fmt(num(app.SLKHACHHANG))}` },
    { k: 'hc', color: '#8B4513', icon: 'tool', t: 'Hoàn công sửa bể', v: fmt(num(hc.SoLuongHoanCongSuaBe)), n: `Tổng báo bể: ${fmt(num(hc.SoLuongBaoBe))}` }
  ];

  const TABS = ['Khách hàng', 'Sản lượng', 'Doanh thu', 'Thất thoát nước', 'Giá bán bình quân', 'Thu hộ tiền nước', 'Định danh',
    'Gắn mới ĐHN', 'Dời ĐHN', 'Thay ĐHN', 'Hồ sơ DVKH', 'Hồ sơ KTKS', 'Hóa đơn', 'KH đã tải app Sawaco'];

  /* ---------------- Màn hình điện thoại ---------------- */
  const statusBar = '<div class="sb"><span>9:41</span><span>●●● ▮</span></div>';
  const navBar = `<div class="navbar"><span>${ic('home', '')}</span><span class="on">${ic('chart', '')}</span><span>${ic('user', '')}</span></div>`;
  const tabsBar = active => `<div class="m-tabs"><div class="m-tabs-track">${TABS.map(t => `<span class="m-tab${t === active ? ' on' : ''}">${t}</span>`).join('')}</div></div>`;

  function ovPlot(key) {
    const s = ovSeries[key];
    return barChart({ labels: kyLabels(12), w: 270, h: 112, legend: false, fmtAxis: v => fmt(v, v < 10 && v % 1 ? 1 : 0),
      series: [{ name: `Năm ${NAM - 1}`, color: C.prev, values: s.prev }, { name: `Năm ${NAM}`, color: C.cur, values: s.cur }] });
  }
  function ovLegend(key) {
    const s = ovSeries[key];
    return `<span><i style="background:${C.prev}"></i>Năm ${NAM - 1}: ${s.tPrev}</span><span><i style="background:${C.cur}"></i>Năm ${NAM}: ${s.tCur}</span>`;
  }

  function buildOverview(el) {
    el.innerHTML = `${statusBar}<div class="appbar">Báo cáo tổng quan</div>
      <div class="scr-body"><div class="scr-scroll">
        <div class="m-card ov-chart">
          <div class="m-title">BÁO CÁO SO SÁNH THEO NĂM</div>
          <div class="m-chips"><span class="m-chip" data-k="dt">Doanh thu</span><span class="m-chip on" data-k="gb">Giá bán bình quân</span><span class="m-chip" data-k="sl">Sản lượng</span></div>
          <div class="m-unit">Đơn vị: <span class="u">${ovSeries.gb.unit}</span></div>
          <div class="ov-plot drawn">${ovPlot('gb')}</div>
          <div class="m-legend">${ovLegend('gb')}</div>
        </div>
        <div class="kpi-grid">${KPIS.map(k => `<div class="kpi" data-k="${k.k}" style="background:${k.color}">
          <div class="k-head">${ic(k.icon, '')}${k.t}</div>
          ${k.rows ? `<div class="k-rows">${k.rows.map(r => `<span>${r}</span>`).join('')}</div>` : `<div class="k-val">${k.v}</div><div class="k-note">${k.n}</div>`}
          <span class="tap"></span></div>`).join('')}</div>
      </div></div>${navBar}`;
    el.querySelectorAll('.m-chip').forEach(ch => ch.addEventListener('click', () => {
      el.querySelectorAll('.m-chip').forEach(c => c.classList.toggle('on', c === ch));
      const k = ch.dataset.k, plot = el.querySelector('.ov-plot');
      el.querySelector('.u').textContent = ovSeries[k].unit;
      el.querySelector('.m-legend').innerHTML = ovLegend(k);
      plot.classList.remove('drawn'); plot.innerHTML = ovPlot(k);
      requestAnimationFrame(() => requestAnimationFrame(() => plot.classList.add('drawn')));
    }));
  }

  function buildDetail(el) {
    const dtRatio = num(dt.TongDoanhthu) / (num(dt.KeHoach) || 1);
    const tnRatio = num(tn.DHNCoNho) / (num(tn.KeHoach) || 1), tlRatio = num(tl.DHNCoLon) / (num(tl.KeHoach) || 1);
    const tnItems = arr(D.thayNhoPhuong).map(r => ({ label: ph(r.PHUONG), value: num(r.SOLUONG) }));
    const tlItems = arr(D.thayLonPhuong).map(r => ({ label: ph(r.PHUONG), value: num(r.SOLUONG) }));
    el.innerHTML = `${statusBar}<div class="appbar">${ic('back', 'back')}Báo cáo tổng quan</div>${tabsBar('Khách hàng')}
      <div class="scr-body"><div class="scr-scroll" style="position:relative">
        <div class="d-frame d-skel show"><div class="skel" style="position:relative;opacity:1;inset:auto"><i></i><i></i><i class="big"></i><i></i><i class="big"></i></div></div>
        <div class="d-frame d-dt">
          <div class="m-kpi-banner" style="background:#00AD26">
            <div class="row"><small>Tổng doanh thu ${NAM} (VNĐ)</small><small>Tỷ lệ thực hiện</small></div>
            <div class="row"><b>${fmt(num(dt.TongDoanhthu))}</b><b>${pct(dt.Tile)}</b></div>
            <small>Kế hoạch ${NAM}: ${fmt(num(dt.KeHoach))}</small>
            <div class="m-bar"><i style="transform:scaleX(${Math.min(dtRatio, 1)})"></i></div>
          </div>
          <div class="m-card" style="margin-top:8px">
            <div class="m-card-head"><div class="t"><b>Doanh thu theo kỳ</b><small>Đơn vị: tỷ VNĐ</small></div></div>
            <div class="m-seg"><span class="on">Biểu đồ</span><span>Bảng</span></div>
            <div class="drawn" style="margin-top:4px">${barChart({ labels: kyLabels(12), w: 270, h: 120, legend: true, fmtAxis: v => fmt(v, 0),
              series: [{ name: `${NAM - 1}`, color: C.prev, values: ovSeries.dt.prev }, { name: `${NAM}`, color: C.cur, values: ovSeries.dt.cur }] })}</div>
          </div>
        </div>
        <div class="d-frame d-thay">
          <div class="m-seg" style="display:flex;width:100%;margin:0 0 8px"><span class="seg-nho on" style="flex:1;text-align:center">Cỡ nhỏ</span><span class="seg-lon" style="flex:1;text-align:center">Cỡ lớn</span></div>
          <div class="thay-nho">
            <div class="m-kpi-banner" style="background:#0171CC">
              <div class="row"><small>Số lượng thay ĐHN cỡ nhỏ</small><small>Tỷ lệ</small></div>
              <div class="row"><b>${fmt(num(tn.DHNCoNho))}</b><b>${pct(tn.Tile)}</b></div>
              <small>Kế hoạch: ${fmt(num(tn.KeHoach))}</small><div class="m-bar"><i style="transform:scaleX(${Math.min(tnRatio, 1)})"></i></div>
            </div>
            <div class="m-card drawn" style="margin-top:8px"><div class="m-card-head"><div class="t"><b>Phân bổ thay ĐHN cỡ nhỏ theo phường</b><small>Năm ${NAM}</small></div></div>
              <div class="donut-wrap" style="max-width:150px;margin-top:6px">${donut({ items: tnItems, size: 150, thick: 22, center: fmt(num(tn.DHNCoNho)), sub: 'Tổng' })}</div></div>
          </div>
          <div class="thay-lon" style="display:none">
            <div class="m-kpi-banner" style="background:#054D8E">
              <div class="row"><small>Số lượng thay ĐHN cỡ lớn</small><small>Tỷ lệ</small></div>
              <div class="row"><b>${fmt(num(tl.DHNCoLon))}</b><b>${pct(tl.Tile)}</b></div>
              <small>Kế hoạch: ${fmt(num(tl.KeHoach))}</small><div class="m-bar"><i style="transform:scaleX(${Math.min(tlRatio, 1)})"></i></div>
            </div>
            <div class="m-card drawn" style="margin-top:8px"><div class="m-card-head"><div class="t"><b>Phân bổ thay ĐHN cỡ lớn theo phường</b><small>Năm ${NAM}</small></div></div>
              <div class="donut-wrap" style="max-width:150px;margin-top:6px">${donut({ items: tlItems, size: 150, thick: 22, center: fmt(num(tl.DHNCoLon)), sub: 'Tổng' })}</div></div>
          </div>
        </div>
      </div></div>${navBar}`;
  }

  function buildFilter(el) {
    const ky = META.ky;
    el.innerHTML = `${statusBar}<div class="appbar">${ic('back', 'back')}Báo cáo tổng quan</div>${tabsBar('Doanh thu')}
      <div class="scr-body"><span class="refresh-spin"></span><div class="scr-scroll">
        <div class="m-kpi-banner" style="background:#00AD26"><div class="row"><small>Tổng doanh thu ${NAM} (VNĐ)</small><small>Tỷ lệ</small></div>
          <div class="row"><b>${fmt(num(dt.TongDoanhthu))}</b><b>${pct(dt.Tile)}</b></div></div>
        <div class="m-card">
          <div class="m-card-head"><div class="t"><b>Doanh thu theo đợt</b><small>Kỳ ${ky} - Năm ${NAM} - Tất cả phường · tỷ VNĐ</small></div><span class="m-filter">${ic('filter', '')}</span></div>
          <div class="m-seg"><span class="on">Biểu đồ</span><span>Bảng</span></div>
          <div class="ld drawn" style="position:relative;margin-top:4px">${barChart({ labels: dtDot.map(r => r.DOT), w: 270, h: 150, fmtAxis: v => fmt(v, 1),
            series: [{ name: `${ky}/${NAM - 1}`, color: '#92DFFF', values: dtDot.map(r => num(r.LASTYEAR) / 1e9) },
              { name: `${ky}/${NAM}`, color: C.cur, values: dtDot.map(r => num(r.THISYEAR) / 1e9) },
              { name: `${ky - 1}/${NAM}`, color: C.prev, values: dtDot.map(r => num(r.LASTPERIOD) / 1e9) }] })}
            <div class="skel"><i></i><i class="big"></i><i></i></div></div>
        </div>
        <div class="m-card"><div class="m-card-head"><div class="t"><b>Doanh thu theo kỳ</b><small>Đơn vị: tỷ VNĐ</small></div></div></div>
      </div>
      <div class="sheet-dim"></div>
      <div class="sheet">
        <h5>Bộ lọc <span>✕</span></h5>
        <div class="f-row"><label>Năm</label><div>${NAM}<span>▾</span></div></div>
        <div class="f-row"><label>Kỳ</label><div>Kỳ ${ky}<span>▾</span></div></div>
        <div class="f-row"><label>Phường</label><div>Tất cả<span>▾</span></div></div>
        <div class="f-btns"><span>Xóa filter</span><span class="apply">Áp dụng</span></div>
      </div></div>${navBar}`;
  }

  /* ---------------- Giá trị hiển thị ---------------- */
  const V = {
    srcNote: () => META.fetchedAt ? `Số liệu thật từ hệ thống PHUWACO, cập nhật lúc ${META.fetchedAt}.` : 'Chưa có số liệu, chạy update_data.py để lấy dữ liệu.',
    'kh.total': () => `${cnt(num(kh.Tongsoluongkh))} <small>KH</small>`,
    'sl.total': () => `${cnt(num(sl.TongSanLuong))} <small>m³</small>`,
    'sl.meter': () => meter(`Kế hoạch ${fmt(num(sl.KeHoach))} m³`, pct(sl.Tile), num(sl.Tile) / 100),
    'dt.total': () => fmt(num(dt.TongDoanhthu)),
    'dt.note': () => `Tổng doanh thu ${NAM} (VNĐ)`,
    'dt.short': () => `${cnt(num(dt.TongDoanhthu) / 1e9, 2)} <small>tỷ VNĐ</small>`,
    'dt.meter': () => meter(`Kế hoạch ${ty(num(dt.KeHoach), 1)}`, pct(dt.Tile), num(dt.Tile) / 100),
    'gbbq.total': () => `${cnt(num(gb.GBBQ))} <small>đ/m³</small>`,
    'gbbq.meter': () => meter(`Kế hoạch ${fmt(num(gb.KeHoach))} đ/m³`, pct(gb.Tile), num(gb.Tile) / 100),
    'thayNho.total': () => fmt(num(tn.DHNCoNho)),
    'thayLon.total': () => fmt(num(tl.DHNCoLon)),
    'ttn.sub': () => `Năm ${NAM} · lũy kế đến kỳ ${META.ky}`,
    'ttn.val': () => cnt(num(ttn.TTN), 2, '%'),
    'ttn.kh': () => fmt(num(ttn.KeHoach), 0) + '%',
    'ttn.tile': () => pct(ttn.Tile),
    'ttnKy.sub': () => `Năm ${NAM} · cột: tỷ lệ thất thoát (%) · đường: lượng nước thất thoát (m³)`,
    'ct.sub': () => `Báo cáo kỳ ${D.kyChuanThu || META.ky}/${NAM} · kỳ mới nhất đã có số liệu`,
    'ct.stats': () => [stat('TTN kỳ', pct(ct.TTN_KY)), stat('TTN kỳ theo ngày', pct(ct.TTN_KYNGAY)), stat('TTN lũy kế', pct(ct.TTN_LUYKE)),
      stat('TTN lũy kế theo ngày', pct(ct.TTN_LUYKENGAY)), stat('Tỷ lệ thực hiện', pct(ct.TYLETHUCHIEN), 'good')].join(''),
    'dma.sub': () => `Tỷ lệ TTN DMA kỳ ${D.kyDma || META.ky}/${NAM} · TTN Vùng 1, Vùng 2 từng kỳ`,
    'be.sub': () => `Năm ${NAM} · thống kê nguyên nhân theo loại bể`,
    'gm.stats': () => [stat('Gắn mới ĐHN', cnt(num(gm.SLGM))), stat('Kế hoạch', fmt(num(gm.KeHoach))), stat('Tỷ lệ', pct(gm.Tile, 0), num(gm.Tile) >= 100 ? 'good' : '')].join(''),
    'thayNho.stats': () => [stat('Thay cỡ nhỏ', cnt(num(tn.DHNCoNho))), stat('Kế hoạch', fmt(num(tn.KeHoach))), stat('Tỷ lệ', pct(tn.Tile))].join(''),
    'thayLon.stats': () => [stat('Thay cỡ lớn', cnt(num(tl.DHNCoLon))), stat('Kế hoạch', fmt(num(tl.KeHoach))), stat('Tỷ lệ', pct(tl.Tile), num(tl.Tile) >= 100 ? 'good' : '')].join(''),
    'dvkh.legend': () => `<span><i style="background:${C.good}"></i>Đã xử lý ${fmt(num(dv.DAXL))}</span><span><i style="background:${C.bad}"></i>Chưa xử lý ${fmt(num(dv.CHUAXL))}</span>`,
    'ktks.legend': () => `<span><i style="background:${C.good}"></i>Đã xử lý ${fmt(num(kt.DAXL))}</span><span><i style="background:${C.bad}"></i>Chưa xử lý ${fmt(num(kt.CHUAXL))}</span>`,
    'cxl.sub': () => { const t = sum(D.dvkhCXL, 'SoLuong'); return `01/01/${NAM} – ${String(META.fetchedAt || '').split(' ')[0]} · ${fmt(t)} đơn chưa xử lý`; },
    'thuHo.stats': () => [stat('Tổng thu hộ', `${cnt(num(th.ThuHoTienNuoc) / 1e9, 2)} tỷ`), stat('Tỷ lệ thực hiện', pct(th.Tile)), stat('Đơn vị thu', fmt(arr(D.bdThuHo).length))].join(''),
    'hd0.total': () => cnt(sum(hd0, 'SOLUONG')),
    'hd14.total': () => cnt(sum(hd14, 'SOLUONG')),
    'cccd.stats': () => [stat('Tổng số CCCD', cnt(num(cccd.SLTONG))), stat('QLGT 1', `${fmt(num(cccd.SLQLGT1))} · ${cccd.TILEQLGT1 || ''}`), stat('QLGT 2', `${fmt(num(cccd.SLQLGT2))} · ${cccd.TILEQLGT2 || ''}`)].join(''),
    'app.stats': () => { const t = num(app.SLTONG), k = num(app.SLKHACHHANG); return [stat('Đã tải app', cnt(t)), stat('Tổng khách hàng', fmt(k)), stat('Tỷ lệ tải app', fmt(t / (k || 1) * 100, 2) + '%')].join(''); }
  };

  /* ---------------- Biểu đồ theo slot ---------------- */
  const phItems = (rows, k = 'SOLUONG') => arr(rows).map(r => ({ label: ph(r.PHUONG), value: num(r[k]) })).sort((a, b) => b.value - a.value);
  const CH = {
    khPhuong: () => hbar([...arr(kh.DsQLGT1), ...arr(kh.DsQLGT2)].map(r => ({ label: `${ph(r.PHUONG)} · ${r.PHONG.replace('QLGT', 'QLGT ')}`, value: num(r.SO_LUONG) })).sort((a, b) => b.value - a.value), { color: '#D2AC6C', limit: 5 }),
    slKy: () => barChart({ labels: kyLabels(12), w: 280, h: 120, fmtAxis: v => fmt(v, 1),
      series: [{ name: `${NAM - 1} (tr m³)`, color: '#92DFFF', values: bdSL.map(r => num(r.TONGSLCU) / 1e6) }, { name: `${NAM}`, color: '#00A0B8', values: bdSL.map(r => num(r.TONGSLMOI) / 1e6) }] }),
    dtKy: () => barChart({ labels: kyLabels(12), w: 280, h: 120, fmtAxis: v => fmt(v, 0),
      series: [{ name: `${NAM - 1} (tỷ)`, color: '#A8E6B7', values: ovSeries.dt.prev }, { name: `${NAM}`, color: '#00AD26', values: ovSeries.dt.cur }] }),
    gbbqKy: () => lineChart({ labels: kyLabels(bdGB.filter(r => num(r.GBBQMOI)).length || 12), w: 280, h: 120, fmtAxis: v => fmt(v, 1),
      series: [{ name: `${NAM - 1} (nghìn đ/m³)`, color: '#92DFFF', values: bdGB.filter(r => num(r.GBBQMOI)).map(r => num(r.GBBQCU) / 1e3) },
        { name: `${NAM}`, color: '#11B482', values: bdGB.filter(r => num(r.GBBQMOI)).map(r => num(r.GBBQMOI) / 1e3) }] }),
    ttn2y: () => barChart({ labels: kyLabels(12), w: 560, h: 170, fmtAxis: v => fmt(v, 1) + '%',
      series: [{ name: `Năm ${NAM - 1}`, color: C.prev, values: bdTTN.map(r => num(r.TTNCU)) }, { name: `Năm ${NAM}`, color: '#D70000', values: bdTTN.map(r => num(r.TTNMOI)) }] }),
    ttnCombo: () => barChart({ labels: ttnNam.map(r => 'Kỳ ' + r.KY), w: 560, h: 220, fmtAxis: v => fmt(v, 1) + '%',
      series: [{ name: 'Tỷ lệ thất thoát (%)', color: '#04ABED', values: ttnNam.map(r => num(r.TYLETHATTHOAT)) }],
      line: { name: 'Lượng nước thất thoát (m³)', color: C.orange, values: ttnNam.map(r => num(r.LUONGNUOCTHATTHOAT)) } }),
    dmaDonut: () => {
      const col = { '20-25%': '#D70000', '15-20%': '#F39200', '10-15%': '#F7B51E', '5-10%': '#04ABED', '0-5%': '#0171CC' };
      const items = arr(D.dma).map(r => ({ label: r.KHOANG, value: num(r.SO_DMA), color: col[r.KHOANG] }));
      return donut({ items, size: 190, center: fmt(items.reduce((a, b) => a + b.value, 0)), sub: 'DMA', legend: true });
    },
    vungLine: () => lineChart({ labels: ttnVung.map(r => 'Kỳ ' + r.KY), w: 340, h: 190, fmtAxis: v => fmt(v, 1) + '%',
      series: [{ name: 'Vùng 1', color: '#04ABED', values: ttnVung.map(r => num(r.VUNG_1)) }, { name: 'Vùng 2', color: '#3B66D6', values: ttnVung.map(r => num(r.VUNG_2)) },
        { name: 'Tổng vùng', color: C.cur, values: ttnVung.map(r => num(r.TONG_VUNG)) }] }),
    beCause: () => arr(D.nguyenNhanBe).map(g => `<div><div class="legend" style="margin-bottom:8px"><b style="color:var(--navy);font-size:15px">${g.LOAI_BE} · ${fmt(num(g.TONG))} điểm</b></div>
      <div class="hbar">${hbar(arr(g.CHI_TIET).map(c => ({ label: String(c.NGUYENNHAN).replace(/^-\s*/, ''), value: num(c.SO_LUONG) })), { color: g.LOAI_BE.includes('ngầm') ? '#0171CC' : '#04ABED', limit: 5 })}</div></div>`).join(''),
    gmDonut: () => donut({ items: phItems(D.ganMoiPhuong), size: 180, center: fmt(num(gm.SLGM)), sub: 'Gắn mới' }),
    gmCo: () => hbar(arr(D.ganMoiCo).map(r => ({ label: r.CODHN ? `Cỡ ${r.CODHN}` : 'Khác', value: num(r.SOLUONG) })).sort((a, b) => b.value - a.value), { color: '#F39200' }),
    doiDonut: () => donut({ items: phItems(D.doiPhuong), size: 180, center: fmt(num(doi.SLND)), sub: 'Dời ĐHN' }),
    doiBar: () => hbar(phItems(D.doiPhuong), { color: '#D86FF3' }),
    thayNhoDonut: () => donut({ items: phItems(D.thayNhoPhuong), size: 180, center: fmt(num(tn.DHNCoNho)), sub: 'Cỡ nhỏ' }),
    thayNhoBar: () => hbar(phItems(D.thayNhoPhuong), { limit: 5 }),
    thayLonDonut: () => donut({ items: phItems(D.thayLonPhuong), size: 180, center: fmt(num(tl.DHNCoLon)), sub: 'Cỡ lớn' }),
    thayLonBar: () => hbar(phItems(D.thayLonPhuong), { color: '#054D8E', limit: 5 }),
    dvkhDonut: () => donut({ items: [{ label: 'Đã xử lý', value: num(dv.DAXL), color: C.good }, { label: 'Chưa xử lý', value: num(dv.CHUAXL), color: C.bad }], size: 180, center: fmt(num(dv.SOLUONG)), sub: 'Hồ sơ DVKH' }),
    ktksDonut: () => donut({ items: [{ label: 'Đã xử lý', value: num(kt.DAXL), color: C.good }, { label: 'Chưa xử lý', value: num(kt.CHUAXL), color: C.bad }], size: 180, center: fmt(num(kt.SOLUONG)), sub: 'Hồ sơ KTKS' }),
    cxlBar: () => {
      const m = {};
      arr(D.dvkhCXL).forEach(r => { const k = String(r.NoiDung).replace(/\s+/g, ' ').trim(); m[k] = (m[k] || 0) + num(r.SoLuong); });
      const t = Object.values(m).reduce((a, b) => a + b, 0) || 1;
      return hbar(Object.entries(m).map(([label, value]) => ({ label, value, display: `${fmt(value)} · ${fmt(value / t * 100, 1)}%` })).sort((a, b) => b.value - a.value), { color: C.bad, limit: 6 });
    },
    thuHoBar: () => hbar(arr(D.bdThuHo).map(r => ({ label: r.DONVITHU, value: num(r.DOANHTHU), display: `${ty(num(r.DOANHTHU))} · ${fmt(num(r.TILE), 2)}%` })).sort((a, b) => b.value - a.value), { color: '#1A7FC1', limit: 6 }),
    hd0Bar: () => barChart({ labels: hd0.map(r => 'Kỳ ' + r.KY), w: 560, h: 170, vals: true, legend: false, series: [{ name: 'Hóa đơn 0m³', color: '#2E8B57', values: hd0.map(r => num(r.SOLUONG)) }] }),
    hd14Bar: () => barChart({ labels: hd14.map(r => 'Kỳ ' + r.KY), w: 560, h: 170, vals: true, legend: false, series: [{ name: 'Hóa đơn 1–4m³', color: '#0171CC', values: hd14.map(r => num(r.SOLUONG)) }] }),
    cccdBar: () => hbar(arr(D.cccdPhuong).map(r => ({ label: ph(r.PHUONG), value: num(r.SOLUONG), display: `${fmt(num(r.SOLUONG))} · ${r.TILE}` })).sort((a, b) => b.value - a.value), { color: '#6A5ACD', limit: 8 }),
    appDonut: () => donut({ items: arr(app.TILE).map(r => ({ label: ph(r.PHUONG), value: num(r.SOLUONG) })), size: 180, center: fmt(num(app.SLTONG)), sub: 'Đã tải app' }),
    appBar: () => hbar(arr(app.TILE).map(r => ({ label: ph(r.PHUONG), value: num(r.SOLUONG), display: `${fmt(num(r.SOLUONG))} · ${r.TILE}` })), { color: '#006978', limit: 6 }),
    vizBar: () => CH.dtKy(),
    vizCombo: () => barChart({ labels: ttnNam.map(r => r.KY), w: 280, h: 130, legend: false, fmtAxis: v => fmt(v, 0) + '%',
      series: [{ name: 'Tỷ lệ TT', color: '#04ABED', values: ttnNam.map(r => num(r.TYLETHATTHOAT)) }],
      line: { name: 'Lượng TT', color: C.orange, values: ttnNam.map(r => num(r.LUONGNUOCTHATTHOAT)) } }),
    vizDonut: () => CH.dmaDonut().replace(/<div class="legend"[\s\S]*$/, ''),
    vizTable: () => {
      const rows = dtDot.slice(0, 4), tr = n => fmt(n / 1e6, 0);
      const d = r => num(r.THISYEAR) - num(r.LASTYEAR);
      const tot = k => rows.reduce((a, r) => a + num(r[k]), 0);
      const sign = v => `<span class="${v >= 0 ? 'up' : 'down'}">${v >= 0 ? '▲' : '▼'} ${tr(Math.abs(v))}</span>`;
      return `<table class="mini-table"><thead><tr><th>Đợt</th><th>${META.ky}/${NAM - 1}</th><th>${META.ky}/${NAM}</th><th>+/-</th></tr></thead><tbody>
        ${rows.map(r => `<tr><td>${r.DOT}</td><td>${tr(num(r.LASTYEAR))}</td><td>${tr(num(r.THISYEAR))}</td><td>${sign(d(r))}</td></tr>`).join('')}
        <tr class="tc"><td>TC</td><td>${tr(tot('LASTYEAR'))}</td><td>${tr(tot('THISYEAR'))}</td><td>${sign(tot('THISYEAR') - tot('LASTYEAR'))}</td></tr></tbody></table>
        <small class="tag-demo">Triệu VNĐ · 4 đợt đầu</small>`;
    },
    stateBar: () => barChart({ labels: kyLabels(12), w: 640, h: 150, legend: false, fmtAxis: v => fmt(v, 0),
      series: [{ name: `${NAM - 1} (tỷ)`, color: C.prev, values: ovSeries.dt.prev }, { name: `${NAM}`, color: C.cur, values: ovSeries.dt.cur }] }),
    stateBar2: () => CH.stateBar()
  };

  /* ---------------- Render ---------------- */
  document.querySelectorAll('[data-ic]').forEach(el => { el.outerHTML = ic(el.dataset.ic); });
  document.querySelectorAll('[data-screen]').forEach(el => {
    ({ overview: buildOverview, detail: buildDetail, filter: buildFilter })[el.dataset.screen]?.(el);
  });
  document.querySelectorAll('[data-v]').forEach(el => { const f = V[el.dataset.v]; if (f) el.innerHTML = f(); });
  document.querySelectorAll('[data-chart]').forEach(el => { const f = CH[el.dataset.chart]; if (f) el.innerHTML = f(); });
  document.querySelectorAll('svg.chart .line').forEach(p => {
    const L = p.getTotalLength ? p.getTotalLength() : 1000;
    p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
  });
  const chips = document.getElementById('s5-chips');
  if (chips) chips.innerHTML = TABS.map(t => `<span data-t="${t}">${t}</span>`).join('');

  /* ---------------- Đếm số ---------------- */
  function countUp(el) {
    if (el._done) return; el._done = true;
    const to = +el.dataset.to, dec = +el.dataset.dec, suf = el.dataset.suf || '';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(to, dec) + suf; return; }
    const t0 = performance.now(), dur = 1100;
    const tick = t => { const k = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(to * e, dec) + suf; if (k < 1 && el._done) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  function resetCount(el) { el._done = false; el.textContent = fmt(0, +el.dataset.dec) + (el.dataset.suf || ''); }

  /* ---------------- Engine cuộn theo bước ---------------- */
  const INF = 1e9;
  const range = (s, exact) => {
    s = String(s).trim();
    if (s.startsWith('=')) { const k = +s.slice(1); return [k, k]; }
    if (s.includes('-')) { const [a, b] = s.split('-'); return [+a, b === '' ? INF : +b]; }
    return exact ? [+s, +s] : [+s, INF];
  };
  const inR = (r, k) => k >= r[0] && k <= r[1];

  const scenes = [...document.querySelectorAll('.scene')].map((el, idx) => {
    const steps = +el.dataset.steps || 0, band = +(el.dataset.band || 55);
    el.style.height = `calc(100vh + ${(steps + 1) * band}vh)`;
    return {
      el, idx, id: el.id, steps, step: null,
      at: [...el.querySelectorAll('[data-at]')].map(e => ({ e, r: range(e.dataset.at, false) })),
      focus: [...el.querySelectorAll('[data-focus]')].map(e => ({ e, r: range(e.dataset.focus, true) })),
      dims: [...el.querySelectorAll('[data-dim]')],
      cls: [...el.querySelectorAll('[data-cls]')].map(e => ({
        e, rules: e.dataset.cls.split(';').map(x => x.trim()).filter(Boolean).map(x => {
          const i = x.lastIndexOf(':'); return { names: x.slice(0, i).trim().split(/\s+/), r: range(x.slice(i + 1), false) };
        })
      })),
      cnts: [...el.querySelectorAll('.cnt')]
    };
  });

  function apply(sc, k) {
    sc.at.forEach(({ e, r }) => { const on = inR(r, k); e.classList.toggle('is-in', on); e.classList.toggle('drawn', on); });
    sc.focus.forEach(({ e, r }) => e.classList.toggle('is-focus', inR(r, k)));
    sc.dims.forEach(d => d.classList.toggle('has-focus', !!d.querySelector('[data-focus].is-focus')));
    sc.cls.forEach(({ e, rules }) => {
      const want = {};
      rules.forEach(({ names, r }) => names.forEach(n => { want[n] = want[n] || inR(r, k); }));
      Object.entries(want).forEach(([n, on]) => e.classList.toggle(n, on));
    });
    sc.cnts.forEach(c => {
      const host = c.closest('[data-at]');
      const visible = k >= 0 && (!host || !sc.el.contains(host) || host.classList.contains('is-in'));
      if (visible) countUp(c); else resetCount(c);
    });
    HOOKS[sc.id]?.(k, sc);
  }

  /* ---------------- Hook riêng từng scene ---------------- */
  const centerTab = (scr, name) => {
    const tabs = scr.querySelector('.m-tabs'), track = scr.querySelector('.m-tabs-track');
    let target = null;
    track.querySelectorAll('.m-tab').forEach(t => { const on = t.textContent === name; t.classList.toggle('on', on); if (on) target = t; });
    if (!target) return;
    const off = Math.max(0, Math.min(target.offsetLeft - (tabs.clientWidth - target.offsetWidth) / 2, track.scrollWidth - tabs.clientWidth));
    track.style.transform = `translateX(${-off}px)`;
  };

  function drawS5Connector(k) {
    const grid = document.getElementById('s5-grid'), svg = document.getElementById('s5-conn');
    if (!grid || !svg) return;
    if (k < 2 || innerWidth <= 860) { svg.innerHTML = ''; return; }
    const from = document.getElementById(k >= 6 ? 's5-kpi-lon' : k === 5 ? 's5-kpi-nho' : 's5-kpi-dt');
    const tab = document.querySelector('#s5-scr .m-tab.on');
    if (!from || !tab) return;
    const g = grid.getBoundingClientRect(), a = from.getBoundingClientRect(), b = tab.getBoundingClientRect();
    const x1 = a.right - g.left + 4, y1 = a.top + a.height / 2 - g.top;
    const x2 = b.left + b.width / 2 - g.left, y2 = b.bottom - g.top + 2;
    const mx = (x1 + x2) / 2;
    svg.innerHTML = `<path d="M${x1} ${y1} C ${mx} ${y1}, ${x2} ${y1}, ${x2} ${y2}" style="animation:march 1s linear infinite"/><circle cx="${x1}" cy="${y1}" r="4"/><circle cx="${x2}" cy="${y2}" r="4"/>`;
  }

  const HOOKS = {
    s3: k => drawLinks(k),
    s4: k => {
      const scr = document.getElementById('s4-scr'); if (!scr) return;
      const scroll = scr.querySelector('.scr-scroll'), grid = scr.querySelector('.kpi-grid');
      scroll.style.transform = k >= 3 ? `translateY(${-Math.min(scr.querySelector('.ov-chart').offsetHeight + 8, 220)}px)` : '';
      if (k === 3 && !grid.classList.contains('replay')) {
        grid.classList.add('replay');
        grid.querySelectorAll('.kpi').forEach((c, i) => { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = `rise .55s var(--ease-out) ${i * 45}ms both`; });
      }
      if (k < 3) grid.classList.remove('replay');
      scr.querySelector('.kpi[data-k="dt"]').classList.toggle('selected', k >= 4);
      document.getElementById('s4-zoom').classList.toggle('zoom', k >= 5);
    },
    s5: k => {
      const scr = document.getElementById('s5-scr'); if (!scr) return;
      const tab = k >= 5 ? 'Thay ĐHN' : k >= 3 ? 'Doanh thu' : 'Khách hàng';
      centerTab(scr, tab);
      scr.querySelectorAll('.m-tab').forEach(t => { t.style.opacity = k >= 3 && !t.classList.contains('on') ? .45 : ''; });
      const show = k >= 5 ? 'd-thay' : k >= 4 ? 'd-dt' : 'd-skel';
      scr.querySelectorAll('.d-frame').forEach(f => f.classList.toggle('show', f.classList.contains(show)));
      scr.querySelector('.seg-nho').classList.toggle('on', k < 6);
      scr.querySelector('.seg-lon').classList.toggle('on', k >= 6);
      scr.querySelector('.thay-nho').style.display = k >= 6 ? 'none' : '';
      scr.querySelector('.thay-lon').style.display = k >= 6 ? '' : 'none';
      document.querySelectorAll('#s5-chips span').forEach(s => s.classList.toggle('hl', s.dataset.t === tab && k >= 3));
      requestAnimationFrame(() => setTimeout(() => drawS5Connector(k), 900));
    },
    s6: k => {
      const scr = document.getElementById('s6-scr'); if (!scr) return;
      centerTab(scr, 'Doanh thu');
      scr.querySelector('.m-filter').classList.toggle('pulse', k >= 1 && k <= 2);
      const sheet = scr.querySelector('.sheet');
      sheet.classList.toggle('fields', k >= 3);
      sheet.classList.toggle('apply-hl', k === 4);
      const ld = scr.querySelector('.ld');
      ld.classList.toggle('loading', k === 5);
      ld.classList.toggle('drawn', k <= 4 || k >= 6);
    }
  };

  /* ---------------- Sơ đồ S3 ---------------- */
  function drawLinks(k) {
    const dg = document.getElementById('diagram'), svg = document.getElementById('links');
    if (!dg || !svg) return;
    const hub = dg.querySelector('[data-link-hub]');
    if (!svg._built) {
      const g = dg.getBoundingClientRect(), h = hub.getBoundingClientRect();
      const hc = { x: h.left + h.width / 2 - g.left, y: h.top + h.height / 2 - g.top, r: h.width / 2 + 16 };
      svg.setAttribute('viewBox', `0 0 ${g.width} ${g.height}`);
      svg.innerHTML = [...dg.querySelectorAll('[data-link]')].map(c => {
        const r = c.getBoundingClientRect();
        const left = r.left + r.width / 2 - g.left < hc.x;
        const x1 = left ? r.right - g.left : r.left - g.left, y1 = r.top + r.height / 2 - g.top;
        const ang = Math.atan2(y1 - hc.y, x1 - hc.x);
        const x2 = hc.x + Math.cos(ang) * hc.r, y2 = hc.y + Math.sin(ang) * hc.r;
        const cx = (x1 + x2) / 2;
        return `<path data-k="${c.dataset.link}" d="M${x1.toFixed(1)} ${y1.toFixed(1)} C ${cx.toFixed(1)} ${y1.toFixed(1)}, ${cx.toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}"/>
          <circle class="head-dot" data-k="${c.dataset.link}" cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="5"/>`;
      }).join('');
      svg.querySelectorAll('path').forEach(p => { const L = p.getTotalLength(); p._L = L; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
      svg._built = true;
    }
    svg.querySelectorAll('path').forEach(p => {
      const kk = +p.dataset.k, on = k >= kk;
      if (on) { p.style.strokeDashoffset = 0; } else { p.classList.remove('flowing'); p.style.strokeDasharray = p._L; p.style.strokeDashoffset = p._L; }
      const flow = on && (k === kk || k >= 6);
      clearTimeout(p._t);
      if (flow) p._t = setTimeout(() => p.classList.add('flowing'), 1000);
      else if (on) { p.classList.remove('flowing'); p.style.strokeDasharray = p._L; p.style.strokeDashoffset = 0; }
      p.style.opacity = on && k < 6 && k !== kk ? .45 : 1;
    });
    svg.querySelectorAll('.head-dot').forEach(d => d.classList.toggle('is-in', k >= +d.dataset.k));
  }

  /* ---------------- Vòng lặp cuộn ---------------- */
  let tops = [], vh = innerHeight;
  function measure() {
    vh = innerHeight;
    tops = scenes.map(s => ({ top: s.el.offsetTop, h: s.el.offsetHeight }));
    const svg = document.getElementById('links'); if (svg) svg._built = false;
  }

  const dotsNav = document.getElementById('dots');
  scenes.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', s.el.dataset.title);
    b.innerHTML = `<span>${String(i + 1).padStart(2, '0')} · ${s.el.dataset.title}</span>`;
    b.addEventListener('click', () => go(tops[i].top));
    dotsNav.appendChild(b);
  });
  document.getElementById('total').textContent = String(scenes.length).padStart(2, '0');

  let current = -1, ticking = false;
  function update() {
    ticking = false;
    const y = scrollY, docH = document.documentElement.scrollHeight - vh;
    document.documentElement.style.setProperty('--scroll', (docH > 0 ? y / docH : 0).toFixed(4));
    scenes.forEach((sc, i) => {
      const { top, h } = tops[i], len = h - vh, band = len / (sc.steps + 1), dy = y - top;
      const k = dy < -vh * .5 || dy > h - vh * .4 ? -1 : Math.max(0, Math.min(sc.steps, Math.floor(dy / band)));
      sc.el.style.setProperty('--p', Math.max(0, Math.min(1, dy / (len || 1))).toFixed(4));
      if (k !== sc.step) { sc.step = k; apply(sc, k); }
    });
    const mid = y + vh / 2;
    const ci = Math.max(0, tops.findIndex(t => mid >= t.top && mid < t.top + t.h));
    if (ci !== current) {
      current = ci;
      document.getElementById('cur').textContent = String(ci + 1).padStart(2, '0');
      [...dotsNav.children].forEach((b, i) => b.classList.toggle('on', i === ci));
      fillNotes();
    }
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measure(); scenes.forEach(s => { s.step = null; }); update(); });

  /* ---------------- Điều khiển bằng phím ---------------- */
  function stops() {
    const out = [];
    scenes.forEach((sc, i) => {
      const { top, h } = tops[i], band = (h - vh) / (sc.steps + 1);
      for (let k = 0; k <= sc.steps; k++) out.push(Math.round(top + (k ? band * k + band * .3 : 0)));
    });
    return out;
  }
  function go(t) { scrollTo({ top: t, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
  function next(dir) {
    const s = stops(), y = scrollY;
    const t = dir > 0 ? s.find(v => v > y + 8) : [...s].reverse().find(v => v < y - 8);
    if (t != null) go(t);
  }
  addEventListener('keydown', e => {
    if (e.target.closest('input, textarea')) return;
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); next(e.shiftKey && k === ' ' ? -1 : 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); next(-1); }
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(document.documentElement.scrollHeight); }
    else if (k === 'n' || k === 'N') toggleNotes();
    else if (k === 'f' || k === 'F') toggleFull();
  });

  /* ---------------- Kịch bản & toàn màn hình ---------------- */
  const notes = document.getElementById('notes');
  function fillNotes() {
    const sc = scenes[current]; if (!sc) return;
    const tpl = sc.el.querySelector('template.note');
    document.getElementById('notes-title').textContent = `${String(current + 1).padStart(2, '0')} · ${sc.el.dataset.title}`;
    document.getElementById('notes-body').innerHTML = tpl ? tpl.innerHTML : '';
  }
  function toggleNotes() { notes.classList.toggle('open'); }
  function toggleFull() {
    try {
      if (document.fullscreenElement) document.exitFullscreen?.();
      else document.documentElement.requestFullscreen?.().catch(() => {});
    } catch (_) { /* không hỗ trợ */ }
  }
  document.getElementById('btn-notes').addEventListener('click', toggleNotes);
  document.getElementById('notes-close').addEventListener('click', toggleNotes);
  document.getElementById('btn-full').addEventListener('click', toggleFull);

  measure();
  update();
  (document.fonts?.ready || Promise.resolve()).then(() => { measure(); scenes.forEach(s => { s.step = null; }); update(); });
})();
