/* 3D 打印入门课 —— 基础：目录高亮、3D 舞台、常用形状、软件界面示意组件 */
(function () {
  "use strict";
  var P = window.P3D = { hooks: {}, m: {}, stages: [], errors: [] };
  window.addEventListener("error", function (e) { P.errors.push(String(e.message)); });
  var $ = P.$ = function (id) { return document.getElementById(id); };
  var each = P.each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  P.press = function (container, btn) { each(container.querySelectorAll("button"), function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); }); };
  P.setInfo = function (el, title, text) { el.textContent = ""; var b = document.createElement("b"); b.textContent = title; el.appendChild(b); el.appendChild(document.createTextNode(text)); };
  P.setNote = function (el, kind, title, text) { el.className = "note" + (kind ? " " + kind : ""); P.setInfo(el, title, text); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
  P.el = el;

  /* 目录跟随滚动高亮 */
  var links = {};
  each(document.querySelectorAll("#tocList a"), function (a) { links[a.getAttribute("href").slice(1)] = a; });
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { for (var k in links) links[k].setAttribute("aria-current", k === e.target.id ? "true" : "false"); } });
  }, { rootMargin: "-25% 0px -65% 0px" });
  each(document.querySelectorAll(".ch"), function (s) { spy.observe(s); });

  /* ---------- 软件界面示意 ---------- */
  P.mock = function (id, spec) {
    var root = $(id), info = $(id + "Info"), keyEls = {}, valEls = {}, tabBtns = {}, body = el("div"), page = spec.tab;
    function show(k) {
      for (var x in keyEls) keyEls[x].setAttribute("aria-pressed", x === k ? "true" : "false");
      var d = spec.info[k]; if (!d || !info) return;
      info.textContent = "";
      info.appendChild(el("span", "tag " + d[1], d[2])); info.appendChild(el("h4", "", d[0])); info.appendChild(el("p", "", d[3]));
      var dl = el("dl"); [["默认值", d[4]], ["什么时候改", d[5]]].forEach(function (p) { if (!p[1]) return; dl.appendChild(el("dt", "", p[0])); dl.appendChild(el("dd", "", p[1])); });
      if (dl.children.length) info.appendChild(dl);
      if (d[6]) { var a = el("a", "", d[7] || "去看这一章"); a.href = d[6]; info.appendChild(a); }
    }
    function change(k, v) { if (spec.onChange) spec.onChange(k, v); }
    function drawRows(rows) {
      body.textContent = ""; for (var x in keyEls) if (keyEls[x].parentNode === body) { delete keyEls[x]; delete valEls[x]; }
      rows.forEach(function (r) {
        if (r[0] === "g") { body.appendChild(el("p", "mock-group", r[1])); return; }
        var k = r[0], type = r[2], row = el(type === "select" || type === "toggle" ? "div" : "button", "mock-row");
        if (row.tagName === "BUTTON") row.type = "button"; else { row.tabIndex = 0; row.setAttribute("role", "button"); }
        row.appendChild(el("span", "", r[1]));
        if (type === "num" || type === "sel") { var v = el("span", "v"); var t = el("span", "", r[3]); v.appendChild(t); if (r[4]) v.appendChild(el("small", "", r[4])); row.appendChild(v); valEls[k] = t; }
        else if (type === "btn") { var b = el("span", "btnlook", r[3]); row.appendChild(b); valEls[k] = b; }
        else if (type === "box") { var w = el("span", "boxwrap"), bx = el("span", "box" + (r[3] ? " on" : "")); w.appendChild(bx); row.appendChild(w); valEls[k] = bx; }
        else if (type === "select") {
          var s = el("select"); s.setAttribute("aria-label", r[1]);
          r[3].forEach(function (o) { var op = el("option", "", o[1]); op.value = o[0]; s.appendChild(op); }); s.value = r[4];
          s.addEventListener("change", function () { change(k, s.value); show(k); }); row.appendChild(s); valEls[k] = s;
        } else if (type === "toggle") {
          var w2 = el("span", "boxwrap"), c = el("input"); c.type = "checkbox"; c.checked = !!r[3]; c.setAttribute("aria-label", r[1]);
          c.addEventListener("change", function () { change(k, c.checked); show(k); }); w2.appendChild(c); row.appendChild(w2); valEls[k] = c;
        }
        row.addEventListener("click", function () { show(k); if (spec.onShow) spec.onShow(k); });
        keyEls[k] = row; body.appendChild(row);
      });
    }
    root.textContent = "";
    if (spec.top) {
      var top = el("div", "mock-top");
      spec.top.tabs.forEach(function (t) { var b = el("button", "", t[1]); b.type = "button"; b.dataset.k = t[0]; b.addEventListener("click", function () { show(t[0]); change(t[0], true); }); top.appendChild(b); keyEls[t[0]] = b; tabBtns[t[0]] = b; });
      top.appendChild(el("span", "gap"));
      spec.top.actions.forEach(function (t) { var b = el("button", "act", t[1]); b.type = "button"; b.addEventListener("click", function () { show(t[0]); change(t[0], true); }); top.appendChild(b); keyEls[t[0]] = b; });
      root.appendChild(top);
      if (spec.canvas) { var cv = el("div", "mock-canvas", spec.canvas); root.appendChild(cv); valEls.canvas = cv; }
    }
    if (spec.bar) {
      var bar = el("div", "mock-bar"); bar.appendChild(el("span", "", spec.bar));
      if (spec.pill) { var p = el("span", "mock-pill"); p.appendChild(el("i", "", "全局")); p.appendChild(el("i", "", "对象")); bar.appendChild(p); }
      if (spec.adv) { var a = el("span", "mock-adv", "高级"); a.appendChild(el("i")); bar.appendChild(a); }
      root.appendChild(bar);
    }
    if (spec.preset) {
      var pw = el("div", "mock-preset"), ps = el("select"); ps.setAttribute("aria-label", "预设");
      spec.preset.options.forEach(function (o) { var op = el("option", "", o[1]); op.value = o[0]; ps.appendChild(op); }); ps.value = spec.preset.value;
      ps.addEventListener("change", function () { change(spec.preset.k, ps.value); show(spec.preset.k); });
      pw.addEventListener("click", function () { show(spec.preset.k); });
      pw.appendChild(ps); root.appendChild(pw); keyEls[spec.preset.k] = pw; valEls[spec.preset.k] = ps;
    }
    if (spec.tabs) {
      var tabs = el("div", "mock-tabs");
      spec.tabs.forEach(function (name) {
        var b = el("button", "", name); b.type = "button"; b.setAttribute("aria-current", name === page ? "true" : "false");
        if (spec.pages) b.addEventListener("click", function () { page = name; each(tabs.children, function (x) { x.setAttribute("aria-current", x === b ? "true" : "false"); }); drawRows(spec.pages[name]); var f = spec.pages[name].filter(function (r) { return r[0] !== "g"; })[0]; if (f) show(f[0]); });
        else b.disabled = true;
        tabs.appendChild(b);
      });
      root.appendChild(tabs);
    }
    root.appendChild(body);
    drawRows(spec.pages ? spec.pages[page] : (spec.rows || []));
    if (spec.first) show(spec.first);
    return {
      show: show,
      set: function (k, text) { var e = valEls[k]; if (!e) return; if (e.tagName === "SELECT") e.value = text; else if (e.type === "checkbox") e.checked = !!text; else if (e.classList.contains("box")) e.classList.toggle("on", !!text); else e.textContent = text; },
      setTop: function (k) { for (var x in tabBtns) tabBtns[x].setAttribute("aria-current", x === k ? "true" : "false"); }
    };
  };

  /* ---------- 3D 基础 ---------- */
  P.ok = !!(window.THREE && THREE.OrbitControls);
  if (!P.ok) {
    each(document.querySelectorAll(".stage"), function (e) { e.appendChild(el("div", "fail", "3D 演示没能加载。请检查网络后刷新页面。")); });
    return;
  }
  var PI = P.PI = Math.PI;
  P.C = { AMBER: 0xD9912B, AMBER_LIGHT: 0xEDC27A, AMBER_DEEP: 0xC47E1E, GOLD: 0xA08A4C, BODY: 0x4A4E55, BODY_DARK: 0x33363B,
          STEEL: 0xB4BAC3, BRASS: 0xC9A23A, BLUE: 0x5B8DB8, RED: 0xD8432E, GREY: 0x8A94A1, WHITE: 0xE9EAEE, GREEN: 0x3E9B6A, INK: 0x2A2C30 };
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var s = e.target._stage; if (s) { s.visible = e.isIntersecting; s.dirty = true; } }); }, { rootMargin: "120px" });
  var mat = P.mat = function (color, extra) { var o = { color: color, roughness: 0.62, metalness: 0.04 }; if (extra) for (var k in extra) o[k] = extra[k]; return new THREE.MeshStandardMaterial(o); };
  var metal = P.metal = function (color) { return mat(color, { metalness: 0.75, roughness: 0.32 }); };
  P.glass = function (op) { return mat(0x9FB2C6, { transparent: true, opacity: op, depthWrite: false, roughness: 0.15 }); };
  var sh = P.sh = function (m) { m.castShadow = true; m.receiveShadow = true; return m; };
  // 圆角盒：w(x) × h(y) × d(z)，四条竖边圆角 r，上下边带小倒角 b
  var rb = P.rb = function (w, h, d, r, b) {
    b = b === undefined ? 0.12 : b; r = Math.max(0.02, Math.min(r, w / 2 - b - 0.01, d / 2 - b - 0.01));
    var x = w / 2 - r - b, z = d / 2 - r - b, s = new THREE.Shape();
    s.absarc(x, z, r, 0, PI / 2, false); s.absarc(-x, z, r, PI / 2, PI, false); s.absarc(-x, -z, r, PI, PI * 1.5, false); s.absarc(x, -z, r, PI * 1.5, PI * 2, false);
    var g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.01, h - 2 * b), bevelEnabled: b > 0, bevelThickness: b, bevelSize: b, bevelSegments: 2, curveSegments: 6 });
    g.rotateX(-PI / 2); g.center(); return g;
  };
  P.cyl = function (r, len, seg) { return new THREE.CylinderGeometry(r, r, len, seg || 32); };
  // 一层挤出的圆环（实心圆饼，边缘带小圆角），高 t、半径 r
  P.disc = function (r, t, seg) {
    var e = Math.min(0.08, t * 0.25);
    return new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(r - e, 0), new THREE.Vector2(r, e), new THREE.Vector2(r, t - e), new THREE.Vector2(r - e, t), new THREE.Vector2(0, t)], seg || 56);
  };
  P.makeStage = function (id, cam, target, ext) {
    var box = $(id), r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    box.insertBefore(r.domElement, box.firstChild);
    var scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(32, 4 / 3, 0.5, 800);
    camera.position.set(cam[0], cam[1], cam[2]);
    var ctl = new THREE.OrbitControls(camera, r.domElement);
    ctl.target.set(target[0], target[1], target[2]); ctl.enableZoom = false; ctl.enablePan = false; ctl.maxPolarAngle = PI * 0.56; ctl.update();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x80868f, 0.72));
    var key = new THREE.DirectionalLight(0xffffff, 0.62); key.position.set(ext * 0.9, ext * 1.9, ext * 1.2); key.castShadow = true;
    key.shadow.mapSize.set(1536, 1536); key.shadow.bias = -0.0006; key.shadow.radius = 4;
    var c = key.shadow.camera; c.left = -ext; c.right = ext; c.top = ext; c.bottom = -ext; c.near = 1; c.far = ext * 6; scene.add(key);
    var fill = new THREE.DirectionalLight(0xdfe8ff, 0.22); fill.position.set(-ext, ext * 0.6, -ext * 0.5); scene.add(fill);
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(ext * 8, ext * 8), new THREE.ShadowMaterial({ opacity: 0.16 }));
    floor.rotation.x = -PI / 2; floor.position.y = -0.84; floor.receiveShadow = true; scene.add(floor);
    var s = { el: box, r: r, scene: scene, camera: camera, ctl: ctl, floor: floor, dirty: true, visible: false, tick: null };
    ctl.addEventListener("change", function () { s.dirty = true; });
    new ResizeObserver(function () {
      var w = box.clientWidth, h = box.clientHeight; if (!w || !h) return;
      r.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); s.dirty = true;
    }).observe(box);
    box._stage = s; io.observe(box); P.stages.push(s); return s;
  };
  // 打印板：金色纹理板 + 深色热床 + 前沿的小把手
  P.plate = function (scene, size) {
    var g = new THREE.Group(), gold = mat(P.C.GOLD, { roughness: 0.92 });
    var top = sh(new THREE.Mesh(rb(size, 0.22, size, 0.9, 0.05), gold)); top.position.y = -0.11; g.add(top);
    var tab = sh(new THREE.Mesh(rb(size * 0.22, 0.22, 1.2, 0.3, 0.05), gold)); tab.position.set(0, -0.11, size / 2 + 0.3); g.add(tab);
    var bed = sh(new THREE.Mesh(rb(size + 0.5, 0.6, size + 0.5, 1, 0.08), mat(P.C.BODY_DARK))); bed.position.y = -0.52; g.add(bed);
    scene.add(g); return g;
  };
  // 喷嘴组件：硅胶套 + 喉管 + 喷嘴尖，尖端在局部原点
  P.nozzleUnit = function (tip) {
    var g = new THREE.Group();
    var sock = sh(new THREE.Mesh(rb(1.25, 1.25, 1.25, 0.25, 0.08), mat(0x2C2E33, { roughness: 0.85 }))); sock.position.y = 1.3; g.add(sock);
    var neck = sh(new THREE.Mesh(P.cyl(0.3, 0.4, 16), metal(tip))); neck.position.y = 0.55; g.add(neck);
    var cone = sh(new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.5, 20), metal(tip))); cone.rotation.x = PI; cone.position.y = 0.25; g.add(cone);
    return g;
  };
  P.clear = function (group) { while (group.children.length) { var c = group.children.pop(); if (c.geometry) c.geometry.dispose(); } };

  /* 渲染循环：只画看得见、且有变化的演示台 */
  function loop(now) {
    for (var i = 0; i < P.stages.length; i++) {
      var s = P.stages[i]; if (!s.visible) continue;
      if (s.tick && s.tick(now)) s.dirty = true;
      if (s.dirty) { s.r.render(s.scene, s.camera); s.dirty = false; }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
