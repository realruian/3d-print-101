/* 3D 打印入门课 —— 第 1 到 6 章的 3D 演示 */
(function () {
  "use strict";
  var P = window.P3D; if (!P || !P.ok) return;
  var $ = P.$, each = P.each, press = P.press, setInfo = P.setInfo, setNote = P.setNote, mat = P.mat, metal = P.metal, glass = P.glass, sh = P.sh, rb = P.rb, cyl = P.cyl, C = P.C, PI = P.PI;
  function guard(name, fn) { try { fn(); } catch (e) { P.errors.push(name + ": " + e.message); if (window.console) console.error(name, e); } }

  /* ---------- 第 1 章：机器 ---------- */
  guard("ch1", function () {
    var s = P.makeStage("st1", [62, 40, 80], [1.5, 18.5, 0], 34);
    s.floor.position.y = -0.02;
    var g = new THREE.Group(); s.scene.add(g);
    var parts = {};
    var INFO = {
      bed: ["热床和打印板", "底部那块会发热、会升降的平板。金色的那层是可以取下来的打印板，东西就长在它上面。打 PLA 时加热到 55 ℃ 左右，让第一层粘得住。"],
      head: ["打印头", "装着喷嘴、风扇和挤料电机的那个方盒子，沿着上方的导轨左右、前后移动。"],
      nozzleA: ["主喷嘴（左）", "把塑料线加热到两百多度再挤出来的小孔，直径 0.4 毫米。它接着顶上的 AMS，大多数打印都用它。"],
      nozzleB: ["辅助喷嘴（右）", "第二个喷嘴，接着侧面的外挂料盘。常用来打第二种颜色或者专门的支撑材料。"],
      screw: ["丝杆", "三根带螺纹的金属杆，转动时带着热床上下移动。需要定期抹润滑脂，机器会提醒。"],
      ams: ["AMS 料盒", "顶上的透明盒子，四个槽位，自动把耗材送到主喷嘴，也负责多色打印时换料。盖着盖子能防潮，还能烘干耗材。"],
      spool: ["外挂料盘", "挂在机器侧面的料架，通过另一根管子把耗材送到辅助喷嘴。"],
      tube: ["送料管", "两根白色的软管。耗材在管子里被推着走，从料盘一路送到打印头。"],
      screen: ["屏幕", "触摸屏。选文件、进退料、看报错都在这里，这些操作在电脑和手机上也能做。"],
      chamber: ["腔体", "整台机器是封闭的。关着门打印更稳定，里面的滤芯会过滤颗粒和气味。"]
    };
    function reg(key, mesh, parent) { mesh.userData.part = key; (parts[key] = parts[key] || []).push(mesh); (parent || g).add(mesh); return mesh; }
    function solid(key, geo, color, pos, parent) { var m = reg(key, sh(new THREE.Mesh(geo, mat(color))), parent); m.position.set(pos[0], pos[1], pos[2]); return m; }

    // 机身：底座、四根立柱、顶部框、后墙、玻璃门和侧窗、玻璃上盖
    solid("chamber", rb(28.5, 3, 28.5, 2.2), C.BODY, [0, 1.5, 0]);
    [[-13, -13], [13, -13], [-13, 13], [13, 13]].forEach(function (p) { solid("chamber", rb(2.5, 26, 2.5, 0.8), C.BODY, [p[0], 16, p[1]]); });
    solid("chamber", rb(28.5, 4.6, 2.5, 0.8), C.BODY, [0, 28.7, 13]);
    solid("chamber", rb(28.5, 2.4, 2.5, 0.8), C.BODY, [0, 29.8, -13]);
    [-13, 13].forEach(function (x) { solid("chamber", rb(2.5, 2.4, 24, 0.8), C.BODY, [x, 29.8, 0]); });
    solid("chamber", rb(24, 26, 0.6, 0.2), C.BODY_DARK, [0, 16, -13.6]);
    [[24, 23.4, 0.25, 0, 14.7, 13.9], [0.25, 26, 24, -13.9, 16, 0], [0.25, 26, 24, 13.9, 16, 0], [24.5, 0.25, 24.5, 0, 31.05, 0]].forEach(function (p) {
      var m = reg("chamber", new THREE.Mesh(new THREE.BoxGeometry(p[0], p[1], p[2]), glass(0.1))); m.position.set(p[3], p[4], p[5]); m.userData.glass = 0.1;
    });
    [[-11, -11], [11, -11], [-11, 11], [11, 11]].forEach(function (p) { var f = sh(new THREE.Mesh(cyl(1.1, 0.5, 20), mat(C.INK))); f.position.set(p[0], -0.2, p[1]); g.add(f); });

    // 屏幕
    var scr = new THREE.Group(); scr.position.set(-7.6, 29.2, 14.6); scr.rotation.x = -0.22; g.add(scr);
    reg("screen", sh(new THREE.Mesh(rb(8.4, 0.7, 5, 0.6), mat(0x202227))), scr).rotation.x = PI / 2;
    var disp = reg("screen", new THREE.Mesh(new THREE.PlaneGeometry(7.2, 3.9), mat(0x18222E, { emissive: 0x2C5F8A, emissiveIntensity: 0.55, roughness: 0.3 })), scr); disp.position.z = 0.37; disp.userData.keep = true;

    // 热床组件
    var bed = new THREE.Group(); g.add(bed);
    reg("bed", sh(new THREE.Mesh(rb(21.6, 0.22, 21.6, 0.9, 0.05), mat(C.GOLD, { roughness: 0.92 }))), bed).position.y = -0.11;
    reg("bed", sh(new THREE.Mesh(rb(5, 0.22, 1.2, 0.3, 0.05), mat(C.GOLD, { roughness: 0.92 }))), bed).position.set(0, -0.11, 11.1);
    reg("bed", sh(new THREE.Mesh(rb(22.2, 0.7, 22.2, 1, 0.08), mat(C.BODY_DARK))), bed).position.y = -0.58;
    reg("bed", sh(new THREE.Mesh(rb(25.6, 0.9, 2.4, 0.4), mat(0x5B6068))), bed).position.set(0, -1.4, 6);
    reg("bed", sh(new THREE.Mesh(rb(2.4, 0.9, 19, 0.4), mat(0x5B6068))), bed).position.set(0, -1.4, -3.5);

    // 丝杆：光杆 + 螺纹
    [[-12.2, 6], [12.2, 6], [0, -12.2]].forEach(function (p) {
      var rod = reg("screw", sh(new THREE.Mesh(cyl(0.34, 24.5, 16), metal(C.STEEL)))); rod.position.set(p[0], 15.2, p[1]);
      var pts = [], turns = 34;
      for (var i = 0; i <= turns * 10; i++) { var a = i / 10 * PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * 0.4, -12 + 24 * i / (turns * 10), Math.sin(a) * 0.4)); }
      var th = reg("screw", new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), turns * 10, 0.09, 5, false), metal(0x8E959F))); th.position.copy(rod.position);
      reg("screw", sh(new THREE.Mesh(cyl(0.9, 1.2, 20), mat(C.INK))), bed).position.set(p[0], -1.4, p[1]);
    });

    // 龙门：两侧 Y 导轨、X 横梁（随打印头前后移动）
    [-11.2, 11.2].forEach(function (x) { var r = sh(new THREE.Mesh(cyl(0.3, 23, 16), metal(C.STEEL))); r.rotation.x = PI / 2; r.position.set(x, 26.6, 0); g.add(r); });
    var gantry = new THREE.Group(); g.add(gantry);
    [26.9, 25.3].forEach(function (y) { var r = sh(new THREE.Mesh(cyl(0.28, 22.4, 16), metal(C.STEEL))); r.rotation.z = PI / 2; r.position.set(0, y, 0); gantry.add(r); });
    [-11.2, 11.2].forEach(function (x) { var b = sh(new THREE.Mesh(rb(1.6, 2.8, 2.4, 0.4), mat(C.BODY_DARK))); b.position.set(x, 26.2, 0); gantry.add(b); });

    // 打印头
    var head = new THREE.Group(); gantry.add(head);
    reg("head", sh(new THREE.Mesh(rb(5.2, 5.6, 4.2, 0.9), mat(0x55595F))), head).position.set(0, 24.2, 0.6);
    var fan = reg("head", new THREE.Mesh(cyl(1.55, 0.24, 36), mat(C.INK)), head); fan.rotation.x = PI / 2; fan.position.set(0, 24.4, 2.76);
    var hub = reg("head", new THREE.Mesh(cyl(0.6, 0.3, 24), mat(0x6A6F77)), head); hub.rotation.x = PI / 2; hub.position.set(0, 24.4, 2.8);
    var lamp = reg("head", new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.42, 0.12), mat(0xE8ECF2, { emissive: 0xffffff, emissiveIntensity: 0.6 })), head); lamp.position.set(0, 26.5, 2.72); lamp.userData.keep = true;
    function addNozzle(key, x, tip) {
      var n = P.nozzleUnit(tip); n.position.set(x, 19.2, 0.6); head.add(n); parts[key] = [];
      n.children.forEach(function (m) { m.userData.part = key; parts[key].push(m); });
    }
    addNozzle("nozzleA", -1.2, C.BRASS); addNozzle("nozzleB", 1.2, C.STEEL);

    // AMS：底座、透明罩、进料器、一卷黑色耗材
    solid("ams", rb(24.5, 3.4, 17.5, 1.8), 0x3E4248, [0, 32.9, -1]);
    var cover = reg("ams", new THREE.Mesh(rb(24.5, 6.6, 17.5, 1.8), glass(0.16))); cover.position.set(0, 37.9, -1); cover.userData.glass = 0.16;
    for (var i = 0; i < 4; i++) {
      var x = -8.1 + i * 5.4;
      solid("ams", rb(2.4, 2.6, 2.4, 0.5), 0x6A6F77, [x, 35.2, 5.6]);
      solid("ams", cyl(0.42, 0.5, 16), C.WHITE, [x, 36.7, 5.6]);
      solid("ams", cyl(0.35, 4.2, 12), 0x55595F, [x, 34.9, -4.4]).rotation.z = PI / 2;
    }
    function spool(key, x, y, z, fil) {
      var grp = new THREE.Group(); grp.position.set(x, y, z); grp.rotation.z = PI / 2; g.add(grp);
      function add(m) { m.userData.part = key; parts[key].push(m); grp.add(m); }
      [-1.75, 1.75].forEach(function (o) { var f = sh(new THREE.Mesh(cyl(3.7, 0.22, 44), mat(C.WHITE))); f.position.y = o; add(f); });
      add(sh(new THREE.Mesh(cyl(3.25, 3.3, 44), mat(fil, { roughness: 0.5 })))); add(new THREE.Mesh(cyl(1.3, 3.8, 24), mat(0x9AA1AB)));
    }
    spool("ams", -8.1, 37.6, -1.2, 0x26282C);

    // 外挂料盘
    parts.spool = [];
    solid("spool", cyl(0.5, 5, 16), 0x3E4248, [16.4, 21, 0]).rotation.z = PI / 2;
    spool("spool", 17.4, 21, 0, 0xE3E5E9);

    // 送料管（随打印头移动重画）
    var tubeMat = mat(0xF2F3F5, { transparent: true, opacity: 0.82, roughness: 0.4 }), tubes = [];
    function drawTubes(hx, hz) {
      tubes.forEach(function (t) { g.remove(t); t.geometry.dispose(); }); tubes = [];
      [[[-2, 33.2, -9.6], [-3, 31.4, -11.4], [-2.5, 29.6, -9], [hx - 0.9, 28.6, hz - 1], [hx - 0.9, 27, hz + 0.4]],
       [[17.4, 24.8, 0], [16.5, 29, -2], [13, 30.4, -6], [hx + 3, 29.2, hz - 2], [hx + 0.9, 27, hz + 0.4]]].forEach(function (p) {
        var curve = new THREE.CatmullRomCurve3(p.map(function (v) { return new THREE.Vector3(v[0], v[1], v[2]); }));
        var t = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.2, 8, false), tubeMat); t.userData.part = "tube"; g.add(t); tubes.push(t);
      });
      parts.tube = tubes;
    }

    var bedY = 19.25, headX = 0, headZ = 0, selected = null;
    function place() { bed.position.y = bedY; gantry.position.z = headZ; head.position.x = headX; drawTubes(headX, headZ); }
    function paintSel() {
      for (var k in parts) parts[k].forEach(function (m) {
        if (m.userData.glass) { m.material.opacity = k === selected ? 0.3 : m.userData.glass; return; }
        if (m.userData.keep || !m.material.emissive || m.material === tubeMat) return;
        m.material.emissive.setHex(k === selected ? 0x0B5CAD : 0x000000);
      });
      tubeMat.emissive.setHex(selected === "tube" ? 0x0B5CAD : 0x000000);
    }
    function select(key) {
      if (!INFO[key]) return;
      selected = key; paintSel(); setInfo($("partInfo"), INFO[key][0], INFO[key][1]);
      each($("partBtns").children, function (b) { b.setAttribute("aria-pressed", b.dataset.part === key ? "true" : "false"); });
      s.dirty = true;
    }
    P.hooks.selectPart = select;
    place();
    ["bed", "head", "nozzleA", "nozzleB", "screw", "ams", "spool", "tube", "screen", "chamber"].forEach(function (k) {
      var b = P.el("button", "", INFO[k][0]); b.type = "button"; b.dataset.part = k; b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () { select(k); }); $("partBtns").appendChild(b);
    });
    var ray = new THREE.Raycaster(), down = null;
    s.r.domElement.addEventListener("pointerdown", function (e) { down = [e.clientX, e.clientY]; });
    s.r.domElement.addEventListener("pointerup", function (e) {
      if (!down || Math.abs(e.clientX - down[0]) + Math.abs(e.clientY - down[1]) > 6) return;
      var rc = s.r.domElement.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2((e.clientX - rc.left) / rc.width * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1), s.camera);
      var hits = ray.intersectObjects(g.children, true).filter(function (h) { return h.object.userData.part; });
      if (!hits.length) return;
      var inner = hits.filter(function (h) { return !h.object.userData.glass; })[0];
      select((inner || hits[0]).object.userData.part);
    });
    var t0 = null;
    $("playMachine").addEventListener("click", function () {
      if (t0 !== null) { t0 = null; s.tick = null; this.textContent = "演示打印时的动作"; bedY = 19.25; headX = 0; headZ = 0; place(); s.dirty = true; return; }
      t0 = performance.now(); this.textContent = "停止演示";
      s.tick = function (now) {
        var t = (now - t0) / 1000;
        headX = 7 * Math.cos(t * 1.9); headZ = 6 * Math.sin(t * 1.9); bedY = 19.25 - Math.min(10, t * 0.6); place(); return true;
      };
    });
  });

  /* ---------- 第 2 章：模型 → 切片 → 打印 ---------- */
  guard("ch2", function () {
    var s = P.makeStage("st2", [25, 16, 33], [0, 5.4, 0], 16);
    P.plate(s.scene, 17);
    var H = 12, N = 30, h = H / N;
    function rad(y) { return 3.3 + 1.35 * Math.sin(y * 0.55 + 0.4) + 0.45 * Math.sin(y * 1.3); }
    var pts = [new THREE.Vector2(0, 0)];
    for (var i = 0; i <= 80; i++) { var y = H * i / 80; pts.push(new THREE.Vector2(rad(y), y)); }
    pts.push(new THREE.Vector2(0, H));
    var smooth = sh(new THREE.Mesh(new THREE.LatheGeometry(pts, 72), mat(C.AMBER, { side: THREE.DoubleSide, roughness: 0.45 }))); s.scene.add(smooth);
    var layers = [], group = new THREE.Group(); s.scene.add(group);
    for (var k = 0; k < N; k++) { var m = sh(new THREE.Mesh(P.disc(rad((k + 0.5) * h), h * 0.86), mat(C.AMBER, { roughness: 0.5 }))); m.position.y = k * h + h * 0.07; group.add(m); layers.push(m); }
    var noz = P.nozzleUnit(C.BRASS); s.scene.add(noz);
    var mode = "model", cur = 15, playing = null;
    var TEXT = {
      model: ["模型", "你从网上下载的、或者自己设计的东西。常见的文件格式是 STL 和 3MF。", "prep", "“准备”页面：模型摆在一块虚拟的打印板上，左边是打印机、耗材、工艺三组设置。"],
      slice: ["切片", "软件把模型横着切成一层层薄片，并算好每一层喷嘴怎么走。拖动滑块挑一层看看。", "preview", "“预览”页面：模型变成了一层一层的线，右上角显示预计时间和用料，右侧有一根竖着的层滑块。"],
      print: ["打印", "打印机从最底下一层开始，一层压一层地往上堆。拖动滑块，或者点按钮从头播放。", "device", "“设备”页面：摄像头画面、喷嘴和热床的温度、打印进度，还有暂停和停止按钮。"]
    };
    function paint() {
      smooth.visible = mode === "model"; group.visible = mode !== "model"; noz.visible = mode === "print";
      layers.forEach(function (m, i) {
        var on = i === cur - 1;
        if (mode === "slice") { m.visible = true; m.material.color.setHex(on ? C.RED : C.AMBER); m.material.transparent = !on; m.material.opacity = on ? 1 : 0.5; m.castShadow = on; }
        else { m.visible = i < cur; m.material.color.setHex(on ? C.AMBER_LIGHT : C.AMBER); m.material.transparent = false; m.material.opacity = 1; m.castShadow = true; }
        m.material.needsUpdate = true;
      });
      if (mode === "print") noz.position.set(rad((cur - 0.5) * h) - 0.1, cur * h, 0);
      $("layerPick").disabled = mode === "model"; $("playPrint").disabled = mode !== "print";
      $("layerPickOut").textContent = mode === "model" ? "—" : "第 " + cur + " / " + N + " 层";
      setInfo($("modeInfo"), TEXT[mode][0], TEXT[mode][1]);
      if (P.m.m2) { P.m.m2.setTop(TEXT[mode][2]); P.m.m2.set("canvas", TEXT[mode][3]); }
      s.dirty = true;
    }
    function stop() { playing = null; s.tick = null; $("playPrint").textContent = "从第一层开始打"; }
    each($("modeBtns").children, function (b) {
      b.addEventListener("click", function () { stop(); mode = b.dataset.mode; press($("modeBtns"), b); if (mode === "print") cur = N; $("layerPick").value = cur; paint(); });
    });
    $("layerPick").addEventListener("input", function () { stop(); cur = +this.value; paint(); });
    $("playPrint").addEventListener("click", function () {
      if (playing !== null) { stop(); return; }
      playing = performance.now(); this.textContent = "暂停";
      s.tick = function (now) {
        var n = Math.min(N, 1 + Math.floor((now - playing) / 220));
        if (n !== cur) { cur = n; $("layerPick").value = cur; paint(); }
        if (n >= N) stop();
        return true;
      };
    });
    paint();
  });

  /* ---------- 第 3 章：层高 ---------- */
  guard("ch3", function () {
    var s = P.makeStage("st3", [0, 7, 28], [0, 3, 0], 14);
    P.plate(s.scene, 19);
    var R = 7, H = 6.6, g = new THREE.Group(); s.scene.add(g);
    var mats = [mat(C.AMBER, { roughness: 0.5 }), mat(C.AMBER_DEEP, { roughness: 0.5 })];
    function build(lh) {
      P.clear(g);
      var n = Math.ceil(H / lh - 1e-9);
      for (var i = 0; i < n; i++) {
        var y0 = i * lh, y1 = Math.min(H, y0 + lh), r = Math.sqrt(Math.max(0.01, R * R - Math.pow((y0 + y1) / 2, 2)));
        var m = sh(new THREE.Mesh(P.disc(r, y1 - y0, 72), mats[i % 2])); m.position.y = y0; g.add(m);
      }
      $("lhOut").textContent = lh.toFixed(2) + " mm"; $("lhLayers").textContent = n + " 层";
      var k = 0.2 / lh; $("lhTime").textContent = "约 " + k.toFixed(1) + " 倍";
      var mins = Math.round(167 * k); $("lhTrophy").textContent = Math.round(40 / lh) + " 层，约 " + Math.floor(mins / 60) + " 小时 " + (mins % 60) + " 分";
      if (P.m.m3) { P.m.m3.set("preset", lh.toFixed(2)); P.m.m3.set("lh", String(+lh.toFixed(2))); }
      s.dirty = true;
    }
    $("lh").addEventListener("input", function () { build(+this.value); });
    build(0.2);
  });

  /* ---------- 第 4 章：一层怎么画，接缝 ---------- */
  guard("ch4", function () {
    var s = P.makeStage("st4", [17, 15, 24], [0, 3.4, 0], 13);
    P.plate(s.scene, 16);
    var R = 5, LH = 0.42, NL = 14, y0 = NL * LH, mode = "aligned", segs = [], shown = 0, playing = null;
    for (var i = 0; i < NL; i++) { var d = sh(new THREE.Mesh(P.disc(R, LH * 0.9, 64), mat(C.AMBER, { roughness: 0.5 }))); d.position.y = i * LH + LH * 0.05; s.scene.add(d); }
    var dots = new THREE.Group(), path = new THREE.Group(); s.scene.add(dots); s.scene.add(path);
    var noz = P.nozzleUnit(C.BRASS); s.scene.add(noz);
    var dotGeo = new THREE.SphereGeometry(0.17, 14, 10), dotMat = mat(C.RED, { roughness: 0.4 }), segGeo = new THREE.BoxGeometry(1, LH * 0.8, 0.36), inst = null;
    var COL = [new THREE.Color(C.AMBER), new THREE.Color(C.AMBER_LIGHT), new THREE.Color(C.BLUE)], NAME = ["外墙", "内墙", "填充"];
    var NOTE = {
      aligned: ["", "对齐：", "每层的接缝叠在同一条竖线上。痕迹集中成一条线，但其余地方干干净净。这是默认值。"],
      nearest: ["", "最近：", "每层从离上一层终点最近的地方开始。大体也排成一条线，走的空行程最少。"],
      back: ["good", "背面：", "接缝全部放到模型背后。从正面看不到，适合有明确正面的东西。"],
      random: ["warn", "随机：", "每层换一个位置。没有明显的线了，但整个表面会散着小点。"]
    };
    function angle(i) {
      if (mode === "back") return -PI / 2;
      if (mode === "random") { var v = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return (v - Math.floor(v)) * PI * 2; }
      return 0.9 + (mode === "nearest" ? 0.09 * Math.sin(i * 1.7) : 0);
    }
    function ring(r, a0, n, type) { for (var i = 0; i < n; i++) { var a = a0 + i / n * PI * 2, b = a0 + (i + 1) / n * PI * 2; segs.push([r * Math.cos(a), r * Math.sin(a), r * Math.cos(b), r * Math.sin(b), type]); } }
    function build() {
      P.clear(dots); P.clear(path); segs = [];
      for (var i = 0; i <= NL; i++) { var a = angle(i), m = new THREE.Mesh(dotGeo.clone(), dotMat); m.position.set((R + 0.02) * Math.cos(a), (i + 0.5) * LH, (R + 0.02) * Math.sin(a)); dots.add(m); }
      var a0 = angle(NL); ring(R - 0.21, a0, 72, 0); ring(R - 0.63, a0, 64, 1);
      var rf = R - 0.98, dx = Math.SQRT1_2, dz = Math.SQRT1_2, flip = false;
      for (var c = -rf + 0.35; c < rf; c += 0.8) {
        var half = Math.sqrt(rf * rf - c * c), px = -dz * c, pz = dx * c, e1 = [px - dx * half, pz - dz * half], e2 = [px + dx * half, pz + dz * half];
        if (flip) segs.push([e2[0], e2[1], e1[0], e1[1], 2]); else segs.push([e1[0], e1[1], e2[0], e2[1], 2]); flip = !flip;
      }
      inst = new THREE.InstancedMesh(segGeo.clone(), mat(0xffffff, { roughness: 0.5 }), segs.length); inst.castShadow = true;
      var o = new THREE.Object3D();
      segs.forEach(function (g, i) {
        var lx = g[2] - g[0], lz = g[3] - g[1], len = Math.sqrt(lx * lx + lz * lz);
        o.position.set((g[0] + g[2]) / 2, y0 + LH * 0.45, (g[1] + g[3]) / 2); o.rotation.set(0, -Math.atan2(lz, lx), 0); o.scale.set(len + 0.06, 1, 1); o.updateMatrix();
        inst.setMatrixAt(i, o.matrix); inst.setColorAt(i, COL[g[4]]);
      });
      inst.instanceMatrix.needsUpdate = true; if (inst.instanceColor) inst.instanceColor.needsUpdate = true; path.add(inst);
      setNote($("seamNote"), NOTE[mode][0], NOTE[mode][1], NOTE[mode][2]);
      if (P.m.m4) P.m.m4.set("seam", mode);
      draw(+$("pathPos").value);
    }
    function draw(pct) {
      shown = Math.round(pct / 100 * segs.length); inst.count = shown;
      var last = segs[Math.max(0, shown - 1)];
      noz.position.set(shown ? last[2] : segs[0][0], y0 + LH * 0.9, shown ? last[3] : segs[0][1]);
      $("pathOut").textContent = shown === 0 ? "还没开始" : shown === segs.length ? "画完了" : NAME[last[4]];
      s.dirty = true;
    }
    function stop() { playing = null; s.tick = null; $("playPath").textContent = "从头画一遍"; }
    $("pathPos").addEventListener("input", function () { stop(); draw(+this.value); });
    $("playPath").addEventListener("click", function () {
      if (playing !== null) { stop(); return; }
      playing = performance.now(); this.textContent = "暂停";
      s.tick = function (now) { var p = Math.min(100, (now - playing) / 70); $("pathPos").value = p; draw(p); if (p >= 100) stop(); return true; };
    });
    each($("seamBtns").children, function (b) { b.addEventListener("click", function () { mode = b.dataset.seam; press($("seamBtns"), b); build(); }); });
    build();
  });

  /* ---------- 第 5 章：墙和填充 ---------- */
  guard("ch5", function () {
    var s = P.makeStage("st5", [46, 44, 58], [0, 3, 0], 30);
    s.floor.position.y = -0.02;
    var g = new THREE.Group(); s.scene.add(g);
    var A = 15, LW = 0.75, HC = 7.5, CR = 1.6, pat = "grid";
    var mOuter = mat(C.AMBER, { roughness: 0.5 }), mInner = mat(C.AMBER_LIGHT, { roughness: 0.5 }), mFill = mat(C.BLUE, { roughness: 0.55 });
    var fillGeo = new THREE.BoxGeometry(1, HC - 0.3, LW * 0.6);
    var bottom = sh(new THREE.Mesh(rb(2 * A, 1, 2 * A, CR, 0.05), mat(C.AMBER_DEEP, { roughness: 0.55 }))); bottom.position.y = 0.5; s.scene.add(bottom);
    var lid = sh(new THREE.Mesh(rb(2 * A, 1, 2 * A, CR, 0.05), mat(C.AMBER, { transparent: true, opacity: 0.86, roughness: 0.5 }))); lid.position.y = 1 + HC + 0.5; lid.visible = false; s.scene.add(lid);
    function loopWall(half, r, w, m) {
      var o = new THREE.Shape(), i = new THREE.Path();
      function rr(p, a, rad) { var c = a - rad; p.absarc(c, c, rad, 0, PI / 2, false); p.absarc(-c, c, rad, PI / 2, PI, false); p.absarc(-c, -c, rad, PI, PI * 1.5, false); p.absarc(c, -c, rad, PI * 1.5, PI * 2, false); }
      rr(o, half, r); rr(i, half - w, Math.max(0.05, r - w)); o.holes.push(i);
      var geo = new THREE.ExtrudeGeometry(o, { depth: HC, bevelEnabled: false, curveSegments: 8 }); geo.rotateX(-PI / 2);
      var mesh = sh(new THREE.Mesh(geo, m)); mesh.position.y = 1; g.add(mesh);
    }
    function build() {
      P.clear(g);
      var n = +$("walls").value, d = +$("dens").value / 100;
      for (var k = 0; k < n; k++) loopWall(A - k * LW, Math.max(0.1, CR - k * LW), LW * 0.88, k === 0 ? mOuter : mInner);
      var a = A - n * LW;
      if (d >= 0.99) { var solid = sh(new THREE.Mesh(new THREE.BoxGeometry(2 * a, HC - 0.3, 2 * a), mFill)); solid.position.y = 1 + (HC - 0.3) / 2; g.add(solid); }
      else if (d > 0) {
        var dirs = pat === "lines" ? [45] : pat === "grid" ? [45, 135] : [0, 60, 120], sp = dirs.length * LW * 0.6 / d, list = [];
        dirs.forEach(function (deg) {
          var th = deg * PI / 180, dx = Math.cos(th), dz = Math.sin(th), nx = -dz, nz = dx, Rm = a * 1.5;
          for (var c = -Math.floor(Rm / sp) * sp; c <= Rm; c += sp) {
            var px = nx * c, pz = nz * c, t0 = -1e9, t1 = 1e9, ok = true;
            [[px, dx], [pz, dz]].forEach(function (ax) {
              if (Math.abs(ax[1]) < 1e-9) { if (Math.abs(ax[0]) > a) ok = false; }
              else { var u = (-a - ax[0]) / ax[1], v = (a - ax[0]) / ax[1]; t0 = Math.max(t0, Math.min(u, v)); t1 = Math.min(t1, Math.max(u, v)); }
            });
            if (ok && t1 - t0 > 0.3) list.push([px + dx * (t0 + t1) / 2, pz + dz * (t0 + t1) / 2, t1 - t0, th]);
          }
        });
        var inst = sh(new THREE.InstancedMesh(fillGeo.clone(), mFill, list.length)), o = new THREE.Object3D();
        list.forEach(function (L, i) { o.position.set(L[0], 1 + (HC - 0.3) / 2, L[1]); o.rotation.set(0, -L[3], 0); o.scale.set(L[2], 1, 1); o.updateMatrix(); inst.setMatrixAt(i, o.matrix); });
        inst.instanceMatrix.needsUpdate = true; g.add(inst);
      }
      lid.visible = $("lid").checked;
      // 用料估算：真实尺寸 40×40×20 mm，线宽 0.45 mm，上下壳共 1.6 mm，PLA 1.24 g/cm³
      var wallT = Math.min(n * 0.45, 19), inner = 40 - 2 * wallT;
      var grams = ((1600 - inner * inner) * 20 + inner * inner * 1.6 + inner * inner * 18.4 * d) * 1.24 / 1000;
      $("wallsOut").textContent = n + " 圈"; $("densOut").textContent = Math.round(d * 100) + "%";
      $("gramsOut").textContent = "约 " + grams.toFixed(1) + " g"; $("solidOut").textContent = Math.round(grams / 39.68 * 100) + "%";
      var t;
      if (d === 0) t = ["warn", "空心。", "最省料，但顶面没有东西托着，大面积的顶会塌。只适合花瓶这类不封顶的东西。"];
      else if (d <= 0.2 && n <= 2) t = ["", "默认水平。", "摆件、外壳、绝大多数日常物品够用。"];
      else if (n >= 4) t = ["good", "结实。", "墙厚了，抗弯抗摔明显变好。挂钩、支架这类受力件适合这样设。"];
      else if (d >= 0.6) t = ["warn", "很密。", "用料和时间涨得快，强度的提升却不如多加两圈墙划算。"];
      else t = ["", "中等。", "比默认结实一些。想再加强，优先加墙层数。"];
      setNote($("strengthNote"), t[0], t[1], t[2]);
      if (P.m.m5) { P.m.m5.set("walls", String(n)); P.m.m5.set("dens", String(Math.round(d * 100))); P.m.m5.set("pat", pat); }
      s.dirty = true;
    }
    ["walls", "dens", "lid"].forEach(function (id) { $(id).addEventListener("input", build); });
    each($("patBtns").children, function (b) { b.addEventListener("click", function () { pat = b.dataset.pat; press($("patBtns"), b); build(); }); });
    build();
  });

  /* ---------- 第 6 章：摆放和支撑 ---------- */
  guard("ch6", function () {
    var s = P.makeStage("st6", [22, 2.6, 30], [0, 4.2, 0], 14);
    P.plate(s.scene, 17);
    var shape = new THREE.Shape();
    [[-1, 0], [1, 0], [1, 6], [4, 6], [4, 8], [-4, 8], [-4, 6], [-1, 6]].forEach(function (p, i) { if (i) shape.lineTo(p[0], p[1]); else shape.moveTo(p[0], p[1]); });
    var baseGeo = new THREE.ExtrudeGeometry(shape, { depth: 3, bevelEnabled: false }).toNonIndexed(); baseGeo.translate(0, -4, -1.5);
    var src = baseGeo.attributes.position.array.slice(), count = src.length / 3;
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(src.length), 3));
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(src.length), 3));
    var mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, flatShading: true })); mesh.castShadow = true; s.scene.add(mesh);
    var outline = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x7A4E10, transparent: true, opacity: 0.55 })); s.scene.add(outline);
    var supGeo = new THREE.CylinderGeometry(0.09, 0.09, 1, 6), supMat = mat(C.GREY), sup = null;
    var cA = new THREE.Color(C.AMBER), cR = new THREE.Color(C.RED);
    function build() {
      var rx = +$("rx").value, rz = +$("rz").value;
      $("rxOut").textContent = rx + "°"; $("rzOut").textContent = rz + "°";
      each($("poseBtns").children, function (b) { b.setAttribute("aria-pressed", (+b.dataset.rx === rx && +b.dataset.rz === rz) ? "true" : "false"); });
      var m4 = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx * PI / 180, 0, rz * PI / 180, "ZXY"));
      var pos = geo.attributes.position.array, col = geo.attributes.color.array, v = new THREE.Vector3(), minY = 1e9, i;
      for (i = 0; i < count; i++) { v.set(src[i * 3], src[i * 3 + 1], src[i * 3 + 2]).applyMatrix4(m4); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z; if (v.y < minY) minY = v.y; }
      for (i = 0; i < count; i++) pos[i * 3 + 1] -= minY;
      var a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), e1 = new THREE.Vector3(), nrm = new THREE.Vector3(), area = 0, cols = [], supVol = 0;
      for (i = 0; i < count; i += 3) {
        a.fromArray(pos, i * 3); b.fromArray(pos, i * 3 + 3); c.fromArray(pos, i * 3 + 6);
        nrm.copy(b).sub(a).cross(e1.copy(c).sub(a)); var ar = nrm.length() / 2; nrm.normalize();
        var onBed = a.y < 0.02 && b.y < 0.02 && c.y < 0.02, over = !onBed && nrm.y < -0.7, cc = over ? cR : cA;
        for (var j = 0; j < 3; j++) { col[(i + j) * 3] = cc.r; col[(i + j) * 3 + 1] = cc.g; col[(i + j) * 3 + 2] = cc.b; }
        if (over) {
          area += ar; supVol += ar * ((a.y + b.y + c.y) / 3);
          for (var p = 0, K = 7; p < K; p++) for (var q = 0; q < K - p; q++) {
            var u = (p + 0.33) / K, w = (q + 0.33) / K, t = 1 - u - w; if (t < 0) continue;
            var y = a.y * u + b.y * w + c.y * t; if (y > 0.1) cols.push([a.x * u + b.x * w + c.x * t, y, a.z * u + b.z * w + c.z * t]);
          }
        }
      }
      geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere();
      outline.geometry.dispose(); outline.geometry = new THREE.EdgesGeometry(geo, 20);
      if (sup) { s.scene.remove(sup); sup.geometry.dispose(); sup = null; }
      if ($("sup").checked && cols.length) {
        sup = new THREE.InstancedMesh(supGeo.clone(), supMat, cols.length); sup.castShadow = true; var o = new THREE.Object3D();
        cols.forEach(function (p, k) { o.position.set(p[0], p[1] / 2, p[2]); o.scale.set(1, p[1], 1); o.updateMatrix(); sup.setMatrixAt(k, o.matrix); });
        sup.instanceMatrix.needsUpdate = true; s.scene.add(sup);
      }
      // 把示意单位当作厘米；支撑按 12% 疏密估算
      var none = area < 0.05;
      $("ovOut").textContent = none ? "0" : area.toFixed(1) + " cm²";
      $("supOut").textContent = none ? "不需要" : "约 " + (supVol * 0.12 * 1.24).toFixed(1) + " g";
      var t2 = none ? ["good", "这样摆不需要任何支撑。", "每一层下面都有东西托着，省料、省时间，表面也最干净。"]
        : area < 14 ? ["warn", "有一部分悬空。", "要么开支撑，要么换个方向。支撑接触的那一面打完会比较粗糙。"]
        : ["bad", "大面积悬空。", "这样摆要打很多支撑，换个方向通常是更好的选择。"];
      setNote($("poseNote"), t2[0], t2[1], t2[2]);
      if (P.m.m6) P.m.m6.set("supOn", $("sup").checked);
      s.dirty = true;
    }
    ["rx", "rz", "sup"].forEach(function (id) { $(id).addEventListener("input", build); });
    each($("poseBtns").children, function (b) { b.addEventListener("click", function () { $("rx").value = b.dataset.rx; $("rz").value = b.dataset.rz; build(); }); });
    build();
  });
})();
