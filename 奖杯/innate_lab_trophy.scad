// INNATE LAB 奖杯 v2 —— 参数化模型（单位：毫米）
// 正面朝 -Y 方向，Z 为高度。改下面的参数即可调整。
// 上半部分：镂空，边框和字母是整深度的筋条；字母为自绘的等粗线条字形。
// 目前支持的字母：A B E I L N T（够拼 INNATE / LAB）。

use </System/Library/Fonts/Supplemental/Impact.ttf>
use </System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf>

/* [文字] */
lines = ["INN", "ATE", "LAB"];   // 上半部分的字，从上到下逐行；每行字母数相同时最整齐
base_word = "PIONEER";  // 底座主词
base_year = "2026";     // 底座小字

/* [整体尺寸] */
width   = 60;   // 宽
depth   = 40;   // 厚
base_h  = 32;   // 底座高
top_h   = 88;   // 上半部分高（总高 = base_h + top_h）
corner  = 4;    // 竖边圆角半径

/* [上半部分] */
frame      = 4;     // 外边框宽度
stroke     = 3.0;   // 字母笔画粗细（两行之间的横梁也用这个粗细）
gap_side   = 2.0;   // 字母与左右边框的间隙
gap_rail   = 1.8;   // 字母与上下边框/横梁的间隙
gap_letter = 2.0;   // 字母之间的间隙
back_style = "solid";  // 背面："solid" 实心背板；"slats" 横条格栅（可透光）
back_t     = 2.4;   // 背板/格栅厚度
slat_w     = 1.6;   // 格栅条宽
slat_pitch = 5.2;   // 格栅条间距

/* [底座] */
word_size  = 9.5;   // 主词字号
year_size  = 5.2;   // 年份字号
engrave    = 1.2;   // 刻入深度
seam_h     = 1.2;   // 上下两段之间的分缝高度
seam_d     = 1.0;   // 分缝深度

$fn = 64;
eps = 0.01;

// ---------- 基础形状 ----------
module rounded_block(w, d, h, r) {
    hull() for (x = [r, w - r], y = [r, d - r])
        translate([x, y, 0]) cylinder(r = r, h = h);
}

// 一段等粗笔画（方头）
module seg(p1, p2, s) {
    hull() {
        translate(p1) square(s, center = true);
        translate(p2) square(s, center = true);
    }
}

// 右侧圆角的矩形（给 B 的两个肚子用）
module bowl_shape(x0, y0, x1, y1, r) {
    hull() {
        translate([x0, y0]) square([eps, y1 - y0]);
        translate([x1 - r, y0 + r]) circle(r);
        translate([x1 - r, y1 - r]) circle(r);
    }
}

// ---------- 字母（占据 w x h 的盒子，笔画粗 s）----------
module glyph(c, w, h, s) {
    a = s / 2;
    if (c == "I") {
        seg([w / 2, a], [w / 2, h - a], s);
        seg([a, a], [w - a, a], s);
        seg([a, h - a], [w - a, h - a], s);
    } else if (c == "N") {
        seg([a, a], [a, h - a], s);
        seg([w - a, a], [w - a, h - a], s);
        seg([a, h - a], [w - a, a], s);
    } else if (c == "A") {
        seg([a, a], [w / 2, h - a], s);
        seg([w - a, a], [w / 2, h - a], s);
        yb = h * 0.30;
        k = (yb - a) / (h - 2 * a);
        seg([a + (w / 2 - a) * k, yb], [w - a - (w / 2 - a) * k, yb], s);
    } else if (c == "T") {
        seg([a, h - a], [w - a, h - a], s);
        seg([w / 2, a], [w / 2, h - a], s);
    } else if (c == "E") {
        seg([a, a], [a, h - a], s);
        seg([a, a], [w - a, a], s);
        seg([a, h / 2], [w - a - w * 0.12, h / 2], s);
        seg([a, h - a], [w - a, h - a], s);
    } else if (c == "L") {
        seg([a, a], [a, h - a], s);
        seg([a, a], [w - a, a], s);
    } else if (c == "B") {
        seg([a, a], [a, h - a], s);
        r = min(w * 0.42, h * 0.22);
        for (y = [[0, h / 2 + a], [h / 2 - a, h]])
            difference() {
                bowl_shape(0, y[0], w, y[1], r);
                offset(delta = -s) bowl_shape(0, y[0], w, y[1], r);
            }
    }
}

// 一行字：每个字母等宽，铺满 total_w
module text_line(t, total_w, h, s, g) {
    n = len(t);
    lw = (total_w - (n - 1) * g) / n;
    for (i = [0 : n - 1])
        translate([i * (lw + g), 0]) glyph(t[i], lw, h, s);
}

// ---------- 上半部分正面图案（2D，x 向右，y 向上）----------
module top_pattern() {
    iw = width - 2 * frame;
    ih = top_h - 2 * frame;
    n = len(lines);
    line_h = (ih - (n - 1) * stroke) / n;   // 每行占的高度
    lh = line_h - 2 * gap_rail;             // 字母高度
    tw = iw - 2 * gap_side;                 // 一行字的总宽
    // 外边框
    difference() {
        square([width, top_h]);
        translate([frame, frame]) square([iw, ih]);
    }
    for (r = [0 : n - 1]) {
        y0 = frame + (n - 1 - r) * (line_h + stroke);   // 第 r 行（从上往下数）的底边
        // 行与行之间的横梁
        if (r < n - 1) translate([frame, y0 - stroke]) square([iw, stroke]);
        translate([frame + gap_side, y0 + gap_rail])
            text_line(lines[r], tw, lh, stroke, gap_letter);
    }
}

module top_block() {
    intersection() {
        rounded_block(width, depth, top_h, corner);
        union() {
            // 边框 + 字母：整深度的筋条
            translate([0, depth, 0]) rotate([90, 0, 0])
                linear_extrude(depth) top_pattern();
            // 背面
            if (back_style == "solid") {
                translate([0, depth - back_t, 0]) cube([width, back_t, top_h]);
            } else {
                for (z = [frame : slat_pitch : top_h - frame])
                    translate([0, depth - back_t, z]) cube([width, back_t, slat_w]);
            }
        }
    }
}

module base_block() {
    difference() {
        rounded_block(width, depth, base_h, corner);
        // 主词
        translate([width / 2, engrave, base_h * 0.58])
            rotate([90, 0, 0]) linear_extrude(engrave + eps)
                text(base_word, font = "Impact", size = word_size,
                     halign = "center", valign = "center");
        // 年份
        translate([width / 2, engrave, base_h * 0.24])
            rotate([90, 0, 0]) linear_extrude(engrave + eps)
                text(base_year, font = "DIN Condensed:style=Bold", size = year_size,
                     spacing = 1.5, halign = "center", valign = "center");
        // 上下两段之间的分缝
        translate([0, 0, base_h - seam_h])
            difference() {
                translate([-eps, -eps, 0]) cube([width + 2 * eps, depth + 2 * eps, seam_h + eps]);
                translate([seam_d, seam_d, -eps])
                    rounded_block(width - 2 * seam_d, depth - 2 * seam_d, seam_h + 3 * eps, max(corner - seam_d, 0.5));
            }
    }
}

base_block();
translate([0, 0, base_h]) top_block();
