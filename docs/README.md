# PlantSim 文档中心

本目录按阅读目的划分为产品、技术、验收和设计四层。首次了解作品建议依次阅读根目录 README、产品需求、技术开发文档和使用验收说明。

## 1 产品层

用于理解 PlantSim 为什么存在、服务谁、解决什么问题，以及页面如何形成完整业务闭环。

- [`PlantSim 产品需求文档 PRD V1.0`](product/PlantSim_产品需求文档_PRD_V1.0.docx)：产品定位、用户场景、核心流程、功能模块、AI 产品规则、Demo 边界与验收原则。
- [`PlantSim 前端页面规划 V1.0`](product/PlantSim_前端页面规划_V1.0.md)：页面架构、闭环导航、数据传递、组件层级、Clay Token 与响应式策略。

## 2 技术层

用于理解确定性 Workflow、受控 Agent、状态结算、恢复机制和未来生产化方向。

- [`PlantSim 技术开发文档 V1.0`](technical/PlantSim_技术开发文档_V1.0.docx)：总体架构、Agent Registry、Effect Package、State Resolver、Gate、Context、Checkpoint、异步执行、数据模型与 API 草案。

## 3 验收层

用于运行作品、复核业务口径，并追踪多轮界面和业务修改的结果。

- [`PlantSim 使用与验收`](acceptance/PlantSim_使用与验收.md)：离线打开、完整演示路径、数据口径、功能边界和总体测试结果。
- [`业务展示与项目完成闭环`](acceptance/PlantSim_本轮业务验收.md)：归档、价值统计、成本图表、V2/V3 修改和业务测试。
- [`登录与工作台批注验收`](acceptance/PlantSim_登录与工作台批注验收.md)：企业/个人入口、组织看板、侧栏和隐私口径。
- [`比较页批注续跑`](acceptance/PlantSim_批注续跑验收.md)：五维比较、共享地图视窗、成本核算、评审决策与回归结果。

## 4 设计层

只保留本作品实际采用的 Clay 设计参考，不包含完整设计库的其他品牌条目。

- [`Clay DESIGN`](design/clay/DESIGN.md)：颜色、排版、圆角、间距、卡片和响应式规则。
- [`Clay 来源说明`](design/clay/SOURCE.md)：上游设计条目的说明与链接。
- [`第三方 MIT License`](design/clay/LICENSE)：设计参考材料对应的许可文本。

## 文档与实现的关系

- PRD 和技术文档定义目标架构与生产化方向。
- 前端页面规划定义页面与交互结构。
- `plantsim-demo.html` 是当前可运行实现。
- 验收文档记录实现口径与已完成检查。
- 若规划文档与当前界面存在差异，以最新可运行实现和验收记录为准，并在后续版本中同步更新文档。
