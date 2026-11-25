// 三种排法的正面平面图对比（只用于出图挑选，不是打印文件）
use <innate_glyphs.scad>
use </System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf>

$fn = 96;
W = 60; TH = 88; BH = 32; F = 4;       // 宽、上半高、底座高、边框
IW = W - 2 * F; IH = TH - 2 * F;       // 面板内尺寸

module shell() {
    // 底座
    difference() {
        square([W, BH - 1.2]);
        translate([W / 2, BH * 0.45])
            text("2026", font = "DIN Condensed:style=Bold", size = 6, spacing = 1.5,
                 halign = "center", valign = "center");
    }
    // 上半部分边框
    translate([0, BH]) difference() {
        square([W, TH]);
        translate([F, F]) square([IW, IH]);
    }
}

// 方案 A：横排一行，字母极高极窄
module plan_a() {
    s = 2.6; m = 2.0;
    shell();
    translate([F + m, BH + F + m])
        line_innate("innate", IW - 2 * m, IH - 2 * m, s, 1.7);
}

// 方案 B：横排两行 inn / ate，字母更宽更粗
module plan_b() {
    s = 4.0; m = 2.0; g = 2.4;
    lh = (IH - s - 4 * m) / 2;
    shell();
    translate([F, BH + F + lh + 2 * m]) square([IW, s]);                      // 中间横梁
    translate([F + m, BH + F + m])
        line_innate("ate", IW - 2 * m, lh, s, g);
    translate([F + m, BH + F + lh + 2 * m + s + m])
        line_innate("inn", IW - 2 * m, lh, s, g);
}

// 方案 C：竖排（从下往上读），和参考图同一种排法
module plan_c() {
    s = 3.8; m = 2.0; g = 2.4;
    shell();
    translate([F + m + (IW - 2 * m), BH + F + m]) rotate(90)
        line_innate("innate", IH - 2 * m, IW - 2 * m, s, g);
}

module label(t) {
    translate([W / 2, -9]) text(t, font = "DIN Condensed:style=Bold", size = 7, halign = "center");
}

color("#1c1c1c") {
    plan_a();                         label("A");
    translate([80, 0])  { plan_b();   label("B"); }
    translate([160, 0]) { plan_c();   label("C"); }
}
