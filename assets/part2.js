/* 3D 打印入门课 —— 第 7 到 12 章 */
(function () {
  "use strict";
  var P = window.P3D; if (!P) return;
  var $ = P.$, each = P.each, press = P.press, setNote = P.setNote, el = P.el;
  function guard(name, fn) { try { fn(); } catch (e) { P.errors.push(name + ": " + e.message); if (window.console) console.error(name, e); } }

  /* ---------- 第 8 章：材料（不需要 3D） ---------- */
  guard("ch8", function () {
    var MAT = {
      pla: { name: "PLA", sub: "最好打的入门材料", desc: "原料来自玉米淀粉之类的植物。温度低、不翘边、气味小，绝大多数摆件和日常小物都用它。缺点是不耐热，夏天放在车里会变形。", noz: [190, 230], bed: [45, 65], ease: 5, strong: 3, heat: "约 55 ℃ 开始变软", feel: "硬，受力大了会脆断", notes: ["新手从它开始，用默认设置就能打好", "打印时可以开着门，反而散热更好", "受潮后会拉丝、表面发毛，开封后尽量放在 AMS 里"] },
      petg: { name: "PETG", sub: "更耐用，稍微难一点", desc: "比 PLA 更有韧性、更耐热，不容易摔碎，适合做要受力或者放在室外的零件。代价是更容易拉丝，表面不如 PLA 干净。", noz: [230, 260], bed: [70, 80], ease: 4, strong: 4, heat: "约 70 ℃", feel: "有韧性，能弯一点不断", notes: ["很容易吸潮，受潮后拉丝严重，打之前最好烘干", "和打印板粘得很牢，取件时等板子完全凉透", "细丝比 PLA 多，属于正常现象"] },
      tpu: { name: "TPU", sub: "像橡胶一样软", desc: "打出来的东西能弯能压，适合做手机壳、垫脚、密封圈。因为线本身是软的，送料时容易在管子里打弯，所以要打得很慢。", noz: [220, 240], bed: [30, 45], ease: 2, strong: 3, heat: "约 60 到 80 ℃", feel: "柔软有弹性", notes: ["在这台机器上用主喷嘴打，不容易堵", "太软的 TPU（硬度 95A 及以下）不能放进 AMS，要从外面单独送料", "非常容易吸潮，打之前烘干"] },
      abs: { name: "ABS", sub: "耐热结实，但要求高", desc: "乐高积木用的就是这种塑料。耐热、耐冲击，适合做功能零件。但它冷却时收缩厉害，很容易翘边开裂，必须关着门在热的腔体里打。", noz: [240, 270], bed: [90, 100], ease: 2, strong: 4, heat: "约 95 ℃", feel: "硬而韧", notes: ["打印时有刺鼻气味，必须通风，最好把废气排到室外", "全程关门关盖，让腔体保持温热", "大而平的零件容易翘边，要加裙边"] },
      asa: { name: "ASA", sub: "能放在户外的 ABS", desc: "性能和 ABS 接近，多了耐晒这一条：长期日晒不容易发黄变脆。做户外用的支架、外壳时选它。打印要求和 ABS 一样高。", noz: [240, 270], bed: [90, 100], ease: 2, strong: 4, heat: "约 95 ℃", feel: "硬而韧", notes: ["同样有气味，同样需要通风和封闭的腔体", "同样容易翘边", "户外用的东西优先考虑它"] }
    };
    var card = $("matCard");
    function temp(label, range, lo, hi) {
      var w = el("div", "temp"), lab = el("div", "lab"); lab.appendChild(el("span", "", label)); lab.appendChild(el("b", "", range[0] + "–" + range[1] + " ℃")); w.appendChild(lab);
      var bar = el("div", "bar"), i = el("i"); i.style.left = (range[0] - lo) / (hi - lo) * 100 + "%"; i.style.width = (range[1] - range[0]) / (hi - lo) * 100 + "%"; bar.appendChild(i); w.appendChild(bar);
      var sc = el("div", "scale"); sc.appendChild(el("span", "", lo + " ℃")); sc.appendChild(el("span", "", hi + " ℃")); w.appendChild(sc); return w;
    }
    function dots(n) { var d = el("span", "dots"); d.setAttribute("aria-label", n + " / 5"); for (var i = 0; i < 5; i++) d.appendChild(el("i", i < n ? "on" : "")); return d; }
    function show(k) {
      var m = MAT[k]; card.textContent = "";
      var left = el("div"); left.appendChild(el("h3", "", m.name + "：" + m.sub)); left.appendChild(el("p", "", m.desc));
      left.appendChild(temp("喷嘴温度", m.noz, 180, 280)); left.appendChild(temp("热床温度", m.bed, 20, 110)); card.appendChild(left);
      var dl = el("dl", "props");
      [["好不好打", dots(m.ease)], ["结实程度", dots(m.strong)], ["耐热", m.heat], ["手感", m.feel]].forEach(function (p) { dl.appendChild(el("dt", "", p[0])); var dd = el("dd"); if (typeof p[1] === "string") dd.textContent = p[1]; else dd.appendChild(p[1]); dl.appendChild(dd); });
      dl.appendChild(el("dt", "", "要注意")); var dd = el("dd"), ul = el("ul"); ul.style.margin = "0"; ul.style.paddingLeft = "1.1em"; m.notes.forEach(function (n) { ul.appendChild(el("li", "", n)); }); dd.appendChild(ul); dl.appendChild(dd);
      card.appendChild(dl);
      each($("matBtns").children, function (b) { b.setAttribute("aria-pressed", b.dataset.m === k ? "true" : "false"); });
      if (P.m.m8) P.m.m8.set("fil1", k);
    }
    Object.keys(MAT).forEach(function (k) { var b = el("button", "", MAT[k].name); b.type = "button"; b.dataset.m = k; b.addEventListener("click", function () { show(k); }); $("matBtns").appendChild(b); });
    show("pla");
  });

  /* ---------- 第 12 章：维护清单（不需要 3D） ---------- */
  guard("ch12", function () {
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem("p3d-todo") || "{}") || {}; } catch (e) { saved = {}; }
    each(document.querySelectorAll("#todo input[type=checkbox]"), function (c) {
      c.checked = !!saved[c.id];
      c.addEventListener("change", function () { saved[c.id] = c.checked ? 1 : 0; try { localStorage.setItem("p3d-todo", JSON.stringify(saved)); } catch (e) {} });
    });
    each(document.querySelectorAll("#todo button[data-part]"), function (b) {
      b.addEventListener("click", function () { $("ch1").scrollIntoView(); if (P.hooks.selectPart) P.hooks.selectPart(b.dataset.part); });
    });
  });

  if (!P.ok) return;
  var mat = P.mat, sh = P.sh, rb = P.rb, cyl = P.cyl, C = P.C, PI = P.PI;

  /* ---------- 第 7 章：第一层 ---------- */
  guard("ch7", function () {
    var s = P.makeStage("st7", [13, 8, 23], [0, 2.2, 0], 12);
    P.plate(s.scene, 15);
    var gS = new THREE.Group(), gB = new THREE.Group(); s.scene.add(gS); s.scene.add(gB);
    var S = 8, beads = [], noz = P.nozzleUnit(C.BRASS); gS.add(noz);
    for (var i = -2; i <= 2; i++) { var b = sh(new THREE.Mesh(cyl(0.5, 9, 40), mat(i % 2 ? C.AMBER_DEEP : C.AMBER, { roughness: 0.5 }))); b.rotation.x = PI / 2; b.position.x = i * 0.45 * S; gS.add(b); beads.push(b); }
    var pillar = sh(new THREE.Mesh(rb(3, 9, 3, 0.5), mat(C.AMBER, { roughness: 0.5 }))); pillar.position.y = 4.5; gB.add(pillar);
    var brim = null, view = "squish";
    function paint() {
      gS.visible = view === "squish"; gB.visible = view === "brim";
      $("fieldGap").hidden = view !== "squish"; $("fieldBrim").hidden = view !== "brim";
      if (view === "squish") {
        var g = +$("gap").value, w = Math.min(0.09 / g, 0.72);
        beads.forEach(function (b) { b.scale.set(w * S, 1, g * S); b.position.y = g * S / 2; });
        noz.position.set(0, g * S, 3.6);
        $("gapOut").textContent = g.toFixed(2) + " mm";
        if (g > 0.26) setNote($("firstNote"), "bad", "太高了。", "线没被压扁，还是圆的，和板子只有一条细缝接触，线和线之间也没连上。这样的第一层一碰就掉。");
        else if (g < 0.14) setNote($("firstNote"), "warn", "太低了。", "料被压得又宽又薄，挤不出去的料会堆成棱，表面发毛，严重时喷嘴会刮到板子。");
        else setNote($("firstNote"), "good", "正好。", "线被轻轻压扁，贴牢板子，相邻的线刚好连成一片。好的第一层摸上去是平的，看不到缝。");
      } else {
        var bw = +$("brim").value;
        if (brim) { gB.remove(brim); brim.geometry.dispose(); brim = null; }
        if (bw > 0) { brim = sh(new THREE.Mesh(rb(3 + bw * 0.7, 0.16, 3 + bw * 0.7, 0.5 + bw * 0.3, 0.03), mat(C.AMBER_LIGHT, { roughness: 0.6 }))); brim.position.y = 0.08; gB.add(brim); }
        $("brimOut").textContent = bw + " mm";
        var k = Math.pow((3 + bw * 0.7) / 3, 2);
        if (bw === 0) setNote($("firstNote"), "warn", "没有裙边。", "这根又高又细的柱子只有底面那一小块粘着板，打到上面时容易被喷嘴带倒。");
        else setNote($("firstNote"), "good", "加了裙边。", "底部多出一圈薄边，和板子的接触面积是原来的 " + k.toFixed(1) + " 倍，站得稳多了。打完把这圈薄边撕掉就行。");
        if (P.m.m7) { P.m.m7.set("brimW", String(bw || 5)); P.m.m7.set("brimType", bw > 0 ? "外侧" : "自动"); }
      }
      s.dirty = true;
    }
    each($("viewBtns7").children, function (b) { b.addEventListener("click", function () { view = b.dataset.v; press($("viewBtns7"), b); paint(); }); });
    ["gap", "brim"].forEach(function (id) { $(id).addEventListener("input", paint); });
    paint();
  });

  /* ---------- 第 9 章：多色和双喷嘴 ---------- */
  guard("ch9", function () {
    var s = P.makeStage("st9", [19, 13, 26], [0.5, 3.4, 0], 14);
    P.plate(s.scene, 18);
    var g = new THREE.Group(); s.scene.add(g);
    var NS = 16, T = 0.45, mode = "single";
    var mA = mat(C.AMBER, { roughness: 0.5 }), mB = mat(C.BLUE, { roughness: 0.5 }), mT = mat(C.GREY), mW = mat(0x9B6FB0, { roughness: 0.7 });
    function build() {
      P.clear(g);
      var n = +$("swaps").value, dual = mode === "dual";
      for (var i = 0; i < NS; i++) { var band = Math.floor(i * (n + 1) / NS), m = sh(new THREE.Mesh(rb(6, T * 0.92, 6, 0.6, 0.04), band % 2 ? mB : mA)); m.position.set(-3, i * T + T / 2, 0); g.add(m); }
      if (n > 0) { var tw = dual ? 0.9 : 1.8, t = sh(new THREE.Mesh(rb(tw, NS * T, 4, 0.3, 0.05), mT)); t.position.set(4.5, NS * T / 2, -3.5); g.add(t); }
      if (!dual) for (var k = 0; k < n; k++) {
        var a = k * 2.4, r = 0.5 + 0.28 * Math.sqrt(k), blob = sh(new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 10), mW));
        blob.scale.set(1, 0.7, 1); blob.position.set(4.6 + Math.cos(a) * r, 0.3 + (k > 7 ? 0.45 : 0), 4 + Math.sin(a) * r); g.add(blob);
      }
      var n1 = P.nozzleUnit(C.BRASS); n1.position.set(dual ? -3.9 : -3, NS * T, 0); g.add(n1);
      if (dual) { var n2 = P.nozzleUnit(C.STEEL); n2.position.set(-2.1, NS * T, 0); g.add(n2); }
      $("swapsOut").textContent = n + " 次";
      var waste = n * (dual ? 0.03 : 0.5), mins = n * (dual ? 0.2 : 1.3);
      $("wasteOut").textContent = n === 0 ? "0" : "约 " + (waste < 1 ? waste.toFixed(2) : waste.toFixed(1)) + " g";
      $("timeOut9").textContent = n === 0 ? "0" : "约 " + (mins < 1 ? Math.round(mins * 60) + " 秒" : mins.toFixed(0) + " 分钟");
      if (n === 0) setNote($("colorNote"), "", "单色。", "不换颜色就没有任何额外的浪费。");
      else if (dual) setNote($("colorNote"), "good", "两个喷嘴轮流上。", "每个喷嘴里一直是同一种颜色，不需要冲刷，只在小塔上擦一下就继续。两种颜色的东西尽量这样打。");
      else setNote($("colorNote"), "warn", "每换一次都要冲刷。", "紫色的小团就是冲掉的废料。换色发生在很多层的话，废料可能比模型本身还重。");
      if (P.m.m9) P.m.m9.set("group", dual ? "主、辅喷嘴各一种" : "只用主喷嘴");
      s.dirty = true;
    }
    each($("modeBtns9").children, function (b) { b.addEventListener("click", function () { mode = b.dataset.m; press($("modeBtns9"), b); build(); }); });
    $("swaps").addEventListener("input", build);
    build();
  });

  /* ---------- 第 10 章：为打印而设计 ---------- */
  guard("ch10", function () {
    var s = P.makeStage("st10", [15, 9, 22], [0, 2.4, 0], 11);
    P.plate(s.scene, 15);
    var g = new THREE.Group(); s.scene.add(g);
    var rule = "wall", edge = "fillet", vals = { wall: 1.2, gap: 0.3 };
    var CFG = { wall: ["壁的厚度", 0.2, 3, 0.1], gap: ["两个零件之间的缝", 0, 1, 0.05] };
    function profile(pts, color, depth) {
      var sp = new THREE.Shape(); pts.forEach(function (p, i) { if (i) sp.lineTo(p[0], p[1]); else sp.moveTo(p[0], p[1]); });
      var geo = new THREE.ExtrudeGeometry(sp, { depth: depth, bevelEnabled: false }); geo.rotateY(-PI / 2); geo.translate(depth / 2, 0, 0);
      var m = sh(new THREE.Mesh(geo, mat(color, { roughness: 0.5 }))); g.add(m); return m;
    }
    function build() {
      P.clear(g);
      $("ruleField").hidden = rule === "edge"; $("edgeBtns").hidden = rule !== "edge";
      if (rule === "wall") {
        var t = vals.wall, n = t < 0.4 ? 0 : Math.max(1, Math.round(t / 0.42)), W = t * 4;
        if (!n) { var ghost = new THREE.Mesh(new THREE.BoxGeometry(10, 5, Math.max(W, 0.3)), mat(C.RED, { transparent: true, opacity: 0.35 })); ghost.position.y = 2.5; g.add(ghost); }
        for (var i = 0; i < n; i++) { var line = sh(new THREE.Mesh(rb(10, 5, W / n * 0.9, 0.05, 0.03), mat(i % 2 ? C.AMBER_LIGHT : C.AMBER, { roughness: 0.5 }))); line.position.set(0, 2.5, -W / 2 + (i + 0.5) * W / n); g.add(line); }
        $("ruleOut").textContent = t.toFixed(1) + " mm";
        if (!n) setNote($("ruleNote"), "bad", "打不出来。", "比喷嘴挤出的一条线还窄。切片时这面壁会直接消失，预览里看不到它。");
        else if (n === 1) setNote($("ruleNote"), "warn", "只有一条线。", "能打出来，但薄得像纸，一捏就坏。只适合纯装饰的细节。");
        else if (t < 1.2) setNote($("ruleNote"), "", n + " 条线。", "能用。不受力的外壳、盖子这样就行。");
        else setNote($("ruleNote"), "good", n + " 条线。", "够结实。一般的零件，壁厚做到 1.2 毫米以上比较稳妥。");
      } else if (rule === "gap") {
        var gp = vals.gap, G = gp * 6;
        [-1, 1].forEach(function (sg) { var b = sh(new THREE.Mesh(rb(5, 4.5, 5, 0.4), mat(sg < 0 ? C.AMBER : C.AMBER_LIGHT, { roughness: 0.5 }))); b.position.set(sg * (2.5 + G / 2), 2.25, 0); g.add(b); });
        if (gp < 0.15) { var weld = new THREE.Mesh(new THREE.BoxGeometry(Math.max(G, 0.12) + 0.1, 4.3, 4.8), mat(C.RED)); weld.position.y = 2.2; g.add(weld); }
        $("ruleOut").textContent = gp.toFixed(2) + " mm";
        if (gp < 0.15) setNote($("ruleNote"), "bad", "会粘成一块。", "缝太小，两边挤出来的料碰在一起，打完就分不开了。");
        else if (gp < 0.3) setNote($("ruleNote"), "warn", "很紧。", "能分开，但要用力，适合压进去就不再拆的配合。");
        else if (gp <= 0.5) setNote($("ruleNote"), "good", "活动自如。", "要能转、能滑动的零件，缝留 0.3 到 0.5 毫米。");
        else setNote($("ruleNote"), "", "比较松。", "能动，但会有明显的晃动。");
      } else {
        var z0 = -2.5, z1 = 2.5, H = 4.5, r = 1.8, pts = [[z0, 0]], i2;
        if (edge === "sharp") pts.push([z1, 0]);
        else if (edge === "chamfer") { pts.push([z1 - 1.4, 0]); pts.push([z1, 1.4]); }
        else for (i2 = 0; i2 <= 12; i2++) { var a = -PI / 2 + i2 / 12 * PI / 2; pts.push([z1 - r + r * Math.cos(a), r + r * Math.sin(a)]); }
        pts.push([z1, H]); pts.push([z0, H]);
        profile(pts, C.AMBER, 9);
        if (edge === "fillet") {
          var red = [], k;
          for (k = 0; k <= 6; k++) { var a1 = -PI / 2 + k / 6 * PI / 4; red.push([z1 - r + (r + 0.02) * Math.cos(a1), r + (r + 0.02) * Math.sin(a1)]); }
          for (k = 6; k >= 0; k--) { var a2 = -PI / 2 + k / 6 * PI / 4; red.push([z1 - r + (r + 0.16) * Math.cos(a2), r + (r + 0.16) * Math.sin(a2)]); }
          profile(red, C.RED, 9.04);
        }
        each($("edgeBtns").children, function (b) { b.setAttribute("aria-pressed", b.dataset.e === edge ? "true" : "false"); });
        if (edge === "sharp") setNote($("ruleNote"), "good", "直角。", "最好打，每一层都稳稳压在下面一层上。缺点只是边缘有点硬。");
        else if (edge === "fillet") setNote($("ruleNote"), "bad", "贴板的圆角会塌。", "圆角最下面那一段（红色）几乎是平着往外伸的，下面没有东西托。打出来这条边会下垂、发毛。");
        else setNote($("ruleNote"), "good", "倒角。", "45 度的斜面，每一层只比下面一层多探出一点点，不需要支撑，边缘也不硌手。贴着板的边用倒角，朝上的边才用圆角。");
      }
      s.dirty = true;
    }
    function setRule(r) {
      rule = r;
      if (CFG[r]) { var c = CFG[r], inp = $("ruleVal"); $("ruleLab").textContent = c[0]; inp.min = c[1]; inp.max = c[2]; inp.step = c[3]; inp.value = vals[r]; }
      build();
    }
    each($("ruleBtns").children, function (b) { b.addEventListener("click", function () { press($("ruleBtns"), b); setRule(b.dataset.r); }); });
    each($("edgeBtns").children, function (b) { b.addEventListener("click", function () { edge = b.dataset.e; build(); }); });
    $("ruleVal").addEventListener("input", function () { if (CFG[rule]) { vals[rule] = +this.value; build(); } });
    setRule("wall");
  });

  /* ---------- 第 11 章：故障图鉴 ---------- */
  guard("ch11", function () {
    var s = P.makeStage("st11", [19, 11, 27], [0, 2.4, 0], 13);
    P.plate(s.scene, 16);
    var g = new THREE.Group(); s.scene.add(g);
    var A = function () { return mat(C.AMBER, { roughness: 0.5 }); };
    function add(m, x, y, z) { m.position.set(x || 0, y || 0, z || 0); g.add(sh(m)); return m; }
    function rnd(i) { var v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); }
    var SYM = {
      first: { name: "第一层粘不住", ch: 7, what: "线没贴在板上，被喷嘴拖着走，最后变成一团乱糟糟的“面条”。",
        why: ["打印板上有手印或油污", "板子没放平，或者板上有上次的残渣", "模型和板子接触的面积太小"], fix: ["用热水和洗洁精把打印板洗一遍，擦干后只捏边缘", "检查板子有没有对准卡口、放平", "加裙边，或者换一个接触面更大的摆法"],
        build: function () {
          add(new THREE.Mesh(rb(7, 0.16, 5, 0.5, 0.03), A()), -2.5, 0.08, 1.5);
          var pts = []; for (var i = 0; i < 46; i++) pts.push(new THREE.Vector3(1.5 + (rnd(i) - 0.5) * 6, 0.4 + rnd(i + 50) * 3.6, (rnd(i + 99) - 0.5) * 5));
          add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 0.11, 6, false), A()));
        } },
      warp: { name: "翘边", ch: 7, what: "打到一半，底面的角从板上翘起来，整个东西底部变成弧形。",
        why: ["塑料冷却时会收缩，把边角往上拉", "大而平的底面最容易翘", "ABS、ASA 这类材料收缩大；开着门吹到冷风也会加重"], fix: ["洗板，保证第一层粘得牢", "加裙边，把角压住", "容易翘的材料关好门和上盖再打"],
        build: function () {
          var geo = new THREE.BoxGeometry(10, 1.4, 7, 30, 1, 20), p = geo.attributes.position;
          for (var i = 0; i < p.count; i++) { var lift = 0.9 * Math.pow(Math.abs(p.getX(i)) / 5, 3) * Math.pow(Math.abs(p.getZ(i)) / 3.5, 2); p.setY(i, p.getY(i) + lift); }
          geo.computeVertexNormals(); add(new THREE.Mesh(geo, A()), 0, 0.7, 0);
        } },
      string: { name: "拉丝", ch: 8, what: "两个分开的部分之间挂着很多蜘蛛丝一样的细线。",
        why: ["喷嘴从一处空着移到另一处时，嘴里的料渗了出来", "耗材受潮了，这是最常见的原因", "喷嘴温度偏高，料太稀"], fix: ["把耗材烘干，平时放在 AMS 里盖好盖子", "少量细丝是正常的，打完用镊子或热风清掉", "还是很多的话，把喷嘴温度调低 5 到 10 度"],
        build: function () {
          [-3.5, 3.5].forEach(function (x) { add(new THREE.Mesh(P.disc(1.1, 6.2, 40), A()), x, 0, 0); });
          for (var i = 0; i < 11; i++) {
            var y = 0.7 + i * 0.5, z = (rnd(i) - 0.5) * 1.2, c = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-2.5, y, z), new THREE.Vector3(0, y - 0.25 - rnd(i + 7) * 0.3, z), new THREE.Vector3(2.5, y + (rnd(i + 3) - 0.5) * 0.3, z));
            add(new THREE.Mesh(new THREE.TubeGeometry(c, 16, 0.03, 5, false), mat(C.AMBER_LIGHT)));
          }
        } },
      shift: { name: "层错位", ch: 12, what: "从某一层开始，上面的部分整体往旁边偏了一截，像被推了一把。",
        why: ["打印头在移动时撞到了翘起来的地方或者料渣，丢了位置", "皮带松了，或者导轨发涩", "机器被碰到、桌子晃动"], fix: ["先解决翘边和料渣，这是最常见的起因", "按提醒润滑导轨和丝杆", "把机器放在结实、不晃的台面上"],
        build: function () { for (var i = 0; i < 14; i++) add(new THREE.Mesh(rb(5, 0.4, 5, 0.5, 0.04), mat(i % 2 ? C.AMBER_DEEP : C.AMBER, { roughness: 0.5 })), i >= 8 ? 1.2 : 0, i * 0.44 + 0.2, 0); } },
      under: { name: "缺料、断层", ch: 12, what: "有几层明显变细、有缺口，甚至整圈没打出来，墙上能看到横着的缝。",
        why: ["喷嘴部分堵住了，料出不来", "料盘缠线或者卡住，线送不过去", "耗材受潮，挤出时断断续续"], fix: ["看料盘上的线有没有压住、打结", "烘干耗材", "反复出现的话清理或更换喷嘴"],
        build: function () {
          for (var i = 0; i < 14; i++) {
            var bad = i === 5 || i === 6 || i === 10;
            if (!bad) { add(new THREE.Mesh(P.disc(2.6, 0.4, 48), mat(i % 2 ? C.AMBER_DEEP : C.AMBER, { roughness: 0.5 })), 0, i * 0.44, 0); continue; }
            for (var k = 0; k < 5; k++) { var seg = new THREE.Mesh(new THREE.CylinderGeometry(2.45, 2.45, 0.3, 16, 1, false, k * 1.26 + i, 0.75), mat(C.AMBER_LIGHT, { roughness: 0.6 })); add(seg, 0, i * 0.44 + 0.2, 0); }
          }
        } },
      top: { name: "顶面有洞", ch: 5, what: "顶面不平整，能看到下面的填充格子，甚至有一个个小洞。",
        why: ["顶面的实心层太少", "填充太稀，顶面的线搭在上面时下垂"], fix: ["把“顶部壳体层数”加 1 到 2 层", "把填充密度加到 15% 以上"],
        build: function () {
          add(new THREE.Mesh(rb(8, 3, 8, 0.8), A()), 0, 1.5, 0);
          for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) { if ((i + j) % 2) continue; var h = new THREE.Mesh(cyl(0.42, 0.06, 20), mat(0x3B2A10, { roughness: 0.9 })); h.position.set(-2.4 + i * 1.6, 3.01, -2.4 + j * 1.6); h.receiveShadow = true; g.add(h); }
          for (var k = -3; k <= 3; k++) { var gr = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.04, 0.07), mat(C.AMBER_DEEP)); gr.position.set(0, 3.01, k * 1.05); g.add(gr); }
        } }
    };
    function show(k) {
      var d = SYM[k]; P.clear(g); d.build();
      var box = $("symBox"); box.textContent = "";
      box.appendChild(el("p", "note", d.what)).style.color = "inherit";
      box.appendChild(el("h4", "", "通常为什么")); var ul = el("ul"); d.why.forEach(function (t) { ul.appendChild(el("li", "", t)); }); box.appendChild(ul);
      box.appendChild(el("h4", "", "先试什么")); var ol = el("ol"); d.fix.forEach(function (t) { ol.appendChild(el("li", "", t)); }); box.appendChild(ol);
      var a = el("a", "", "相关内容在第 " + d.ch + " 章"); a.href = "#ch" + d.ch; a.style.fontSize = "14px"; box.appendChild(a);
      each($("symBtns").children, function (b) { b.setAttribute("aria-pressed", b.dataset.k === k ? "true" : "false"); });
      s.dirty = true;
    }
    Object.keys(SYM).forEach(function (k) { var b = el("button", "", SYM[k].name); b.type = "button"; b.dataset.k = k; b.addEventListener("click", function () { show(k); }); $("symBtns").appendChild(b); });
    show("first");
  });
})();
