// INNATE 定制字形库 —— 等粗线条、圆拱、小写
// 每个字母画在 w x h 的盒子里（左下角为原点），笔画粗细 s。
// 目前有：小写 i n a t e，大写 I N A T E

geps = 0.01;

// 圆角矩形，r 自动不超过宽高的一半
module g_rrect(w, h, r) {
    rr = min(r, w / 2 - geps, h / 2 - geps);
    hull() for (x = [rr, w - rr], y = [rr, h - rr]) translate([x, y]) circle(rr);
}

// 圆角矩形环
module g_ring(w, h, r, s) {
    difference() {
        g_rrect(w, h, r);
        translate([s, s]) g_rrect(w - 2 * s, h - 2 * s, max(r - s, 0.3));
    }
}

// 拱门：顶部圆、底部开口（n 的主体）
module g_arch(w, h, r, s) {
    rr = min(r, w / 2 - geps);
    ri = max(rr - s, 0.3);
    difference() {
        hull() {
            for (x = [rr, w - rr]) translate([x, h - rr]) circle(rr);
            square([w, geps]);
        }
        hull() {
            for (x = [s + ri, w - s - ri]) translate([x, h - s - ri]) circle(ri);
            translate([s, -1]) square([w - 2 * s, geps]);
        }
    }
}

module glyph_innate(c, w, h, s, round = 1) {
    r = (w / 2) * round;
    if (c == "i") {
        // 竖 + 方点
        dg = s * 0.75;
        square([s, h - s - dg]);
        translate([0, h - s]) square([s, s]);
    } else if (c == "n") {
        g_arch(w, h, r, s);
    } else if (c == "a") {
        // 双层 a：右竖通顶，上方一段拱收在左侧，下方一个闭合的肚子
        hb = h * 0.52;                       // 肚子高度
        hook_y = max(h * 0.74, h - w * 1.25); // 上钩收尾的高度：刚转过圆拱就收，不拖长
        intersection() {
            g_arch(w, h, r, s);
            union() {
                translate([w - s, 0]) square([s, h]);
                translate([0, hook_y]) square([w, h]);
            }
        }
        g_ring(w, hb, r, s);
        translate([w / 2, 0]) square([w / 2, s]);   // 肚子底部平接到右竖，不留缺口
    } else if (c == "t") {
        // 竖 + 横 + 底部向右的圆钩
        x0 = w * 0.20;
        R = w - x0;
        translate([x0, R]) square([s, h - R]);
        translate([0, max(h * 0.70, h - w * 2.2)]) square([w, s]);
        intersection() {
            difference() {
                translate([x0 + R, R]) circle(R);
                translate([x0 + R, R]) circle(max(R - s, 0.3));
            }
            translate([x0, 0]) square([R, R]);
        }
    } else if (c == "I") {
        // 大写 I：一根竖条
        square([s, h]);
    } else if (c == "N") {
        // 大写 N：拱门（字太窄放不下斜线，用圆拱代替）
        g_arch(w, h, r, s);
    } else if (c == "A") {
        // 大写 A：拱门 + 一横
        g_arch(w, h, r, s);
        translate([s / 2, h * 0.36]) square([w - s, s]);
    } else if (c == "T") {
        // 大写 T：顶横 + 中竖
        translate([0, h - s]) square([w, s]);
        translate([(w - s) / 2, 0]) square([s, h]);
    } else if (c == "E") {
        // 大写 E：左侧上下两个圆角，三道横向右伸出
        rr = min(r, w - s);
        difference() {
            hull() {
                translate([rr, rr]) circle(rr);
                translate([rr, h - rr]) circle(rr);
                translate([w - geps, 0]) square([geps, h]);
            }
            hull() {
                ri = max(rr - s, 0.3);
                translate([s + ri, s + ri]) circle(ri);
                translate([s + ri, h - s - ri]) circle(ri);
                translate([w, s]) square([geps, h - 2 * s]);
            }
        }
        translate([s / 2, h / 2 - s / 2]) square([w * 0.86 - s / 2, s]);
    } else if (c == "e") {
        // 长圆环 + 中横，右侧在横杠下方开口
        ap = s * 0.95;
        difference() {
            union() {
                g_ring(w, h, r, s);
                translate([s / 2, h / 2 - s / 2]) square([w - s, s]);
            }
            translate([w / 2, h / 2 - s / 2 - ap]) square([w, ap]);
        }
    }
}

function g_narrow(c) = (c == "i" || c == "I");

// 一行字铺满 total_w：i 只占一个笔画宽，其余字母等宽
module line_innate(t, total_w, h, s, g, round = 1) {
    n = len(t);
    nn = len([for (i = [0 : n - 1]) if (g_narrow(t[i])) 1]);
    lw = (total_w - nn * s - (n - 1) * g) / (n - nn);
    function gw(i) = g_narrow(t[i]) ? s : lw;
    function gx(i) = i == 0 ? 0 : gx(i - 1) + gw(i - 1) + g;
    for (i = [0 : n - 1])
        translate([gx(i), 0]) glyph_innate(t[i], gw(i), h, s, round);
}
