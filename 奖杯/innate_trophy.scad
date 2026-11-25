// INNATE 奖杯（方案 A）—— 参数化模型（单位：毫米）
// 正面朝 -Y 方向，Z 为高度。
// 上半部分镂空：边框和字母是整深度的筋条，后面只留一块背板。
// 字形来自 innate_glyphs.scad（自绘：小写、等粗笔画、圆拱）。

use <innate_glyphs.scad>
use </System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf>

/* [文字] */
word      = "INNATE";   // 上半部分的字（字形库有大写 I N A T E 和小写 i n a t e）
base_text = "2026";     // 底座小字，留空 "" 则不刻

/* [整体尺寸] */
width   = 60;   // 宽
depth   = 40;   // 厚
base_h  = 32;   // 底座高
top_h   = 88;   // 上半部分高（总高 = base_h + top_h）
corner  = 4;    // 正面两条竖边的圆角半径
back_corner = 0.8;  // 背面两条竖边的圆角（躺着打印时贴着打印板，圆角大了底部会塌，所以做小）
print_orientation = false;  // true = 按打印姿态输出（背面朝下躺平）

/* [上半部分] */
frame      = 4;     // 外边框宽度
stroke     = 2.6;   // 字母笔画粗细
margin     = 2.0;   // 字母与边框的间隙
gap_letter = 1.7;   // 字母之间的间隙
back_t     = 2.4;   // 背板厚度

/* [底座] */
base_size  = 6;     // 底座小字字号
engrave    = 1.2;   // 刻入深度
seam_h     = 1.2;   // 上下两段之间的分缝高度
seam_d     = 1.0;   // 分缝深度

$fn = 96;
eps = 0.01;

module rounded_block(w, d, h, r, rb = -1) {
    r2 = rb < 0 ? back_corner : rb;
    hull() {
        for (x = [r, w - r]) translate([x, r, 0]) cylinder(r = r, h = h);
        for (x = [r2, w - r2]) translate([x, d - r2, 0]) cylinder(r = r2, h = h);
    }
}

// 上半部分正面图案（2D，x 向右，y 向上）
module top_pattern() {
    iw = width - 2 * frame;
    ih = top_h - 2 * frame;
    difference() {
        square([width, top_h]);
        translate([frame, frame]) square([iw, ih]);
    }
    translate([frame + margin, frame + margin])
        line_innate(word, iw - 2 * margin, ih - 2 * margin, stroke, gap_letter);
}

module top_block() {
    intersection() {
        rounded_block(width, depth, top_h, corner);
        union() {
            translate([0, depth, 0]) rotate([90, 0, 0])
                linear_extrude(depth) top_pattern();
            translate([0, depth - back_t, 0]) cube([width, back_t, top_h]);
        }
    }
}

module base_block() {
    difference() {
        rounded_block(width, depth, base_h, corner);
        if (base_text != "")
            translate([width / 2, engrave, (base_h - seam_h) * 0.47])
                rotate([90, 0, 0]) linear_extrude(engrave + eps)
                    text(base_text, font = "DIN Condensed:style=Bold", size = base_size,
                         spacing = 1.5, halign = "center", valign = "center");
        translate([0, 0, base_h - seam_h])
            difference() {
                translate([-eps, -eps, 0]) cube([width + 2 * eps, depth + 2 * eps, seam_h + eps]);
                translate([seam_d, seam_d, -eps])
                    rounded_block(width - 2 * seam_d, depth - 2 * seam_d, seam_h + 3 * eps, max(corner - seam_d, 0.5));
            }
    }
}

module trophy() {
    base_block();
    translate([0, 0, base_h]) top_block();
}

if (print_orientation)
    translate([0, 0, depth]) rotate([-90, 0, 0]) trophy();
else
    trophy();
