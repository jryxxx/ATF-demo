# ATF Demo

三维重建与目标检测对抗攻击仿真平台 — 静态演示站点。

基于预生成的 9 组迷彩方案组合（丛林/沙漠/雪地 × 24/48/72 分辨率），无需后端推理即可体验 ATF 对抗迷彩效果。

## 本地运行

```bash
python -m http.server 8000
# 打开 http://localhost:8000
```

## 部署

通过 GitHub Pages 自动部署，详见 `.github/workflows/pages.yml`。
