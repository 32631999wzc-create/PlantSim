# PlantSim

PlantSim 是一个面向景观植物配置方案的未来情景模拟与方案评测原型。它把场地、植物、气候、人流、养护与风险事件组织成可追踪的连续模拟，让设计师、植物专家、甲方和评审人员在方案落地前观察长期表现、定位风险，并比较修改前后的效果。

**在线体验：** [https://32631999wzc-create.github.io/PlantSim/](https://32631999wzc-create.github.io/PlantSim/)

这个仓库提供一套可离线运行的前端展示作品。打开一个 HTML 文件即可体验从项目资料导入到评审决策和项目归档的完整业务闭环，不需要安装依赖、启动后端或连接外部模型。

> PlantSim 展示的是多个有决策价值的未来情景，不是对真实天气、植物生长或工程成本的精确预测。仓库中的气候、物种、价格、风险和工时数据均为产品原型配置。

## 项目缘起与演进

PlantSim 起始于景观植物方案长期效果难以在设计阶段直观看见的问题。传统评审往往依赖经验、静态图纸和短期指标，而高温、少雨、病害、人流压力与养护资源会在多年尺度上共同改变植物状态。

项目由两条主线逐步形成：

1. **产品主线**：将自然语言目标转为多个未来蓝图和独立路径，连续模拟植物状态，并把风险定位到具体植物、区域、周期和原因。
2. **技术主线**：以确定性 Workflow 作为执行骨架，让 Agent 只输出 Effect Package，由 State Resolver 统一结算；通过 Schema、Gate、Checkpoint、Retry 和 Trace 保证状态隔离与过程可追溯。

演进过程：

- **2026-09-03**：形成 PRD、技术架构和前端页面规划，明确“确定性 Workflow + 受控 Agent 推理”的核心方向。
- **2026-09-04**：完成离线单文件交互原型，打通资料、目标、蓝图、运行、结果、比较和追溯流程。
- **2026-09-06**：根据多轮界面评审，补充登录与组织工作台、项目总览、项目完成归档、方案决策、成本图表和场地平面图。
- **当前版本**：提供企业/个人双入口、八个业务页面、六条未来路径、设计版本比较、局部恢复、专家 Trace 与自动讲解。

## 作品展示内容

| 页面 | 作用 | 关键交互 |
| --- | --- | --- |
| 项目工作台 | 管理项目与组织级成果 | 新建、继续、查看归档与趋势 |
| 项目方案 | 导入资料并形成设计基线 | 文件导入、冲突复核、植物清单、场地平面图 |
| 模拟目标 | 将业务目标结构化 | 多轮补充、编辑与保存目标版本 |
| 未来蓝图 | 把目标拆成可执行未来路径 | 编辑参数、校验、冻结任务卡 |
| 模拟运行 | 展示多 Agent 周期执行 | 进度、Gate、局部恢复、快进 |
| 结果与风险 | 定位植物和区域风险 | 地图、时间线、原因链、结果追问 |
| 方案比较 | 在相同条件下比较版本 | 五维指标、路径对照、费用与评审决策 |
| 运行记录 | 回看完整执行证据 | Path、Cycle、Agent、Tool、Effect、Checkpoint |
| 项目总览 | 汇总项目全过程成果 | 进度、版本、运行、风险和最终结论 |

主要演示能力：

- CAD、GIS、表格、文档和照片的导入流程演示，以及跨文件冲突确认。
- 20 条植物记录、4 个区域、3 类未来蓝图和 6 条独立路径。
- Plant、Stress、Human 并行产生 Effect，Maintenance 顺序决策，Resolver 统一更新状态。
- 资料 Gate、任务卡 Gate、Agent 输出 Gate 与状态 Gate 的阻断和局部恢复。
- 固定 Seed、规则版本和未来条件下的 V1/V2/V3 公平比较。
- 植物健康、风险、养护、建设费用、预计返工与评审工时统计。
- 普通模式与专家模式、Bad Case 标记、Checkpoint 派生回放。
- 企业与个人登录入口、组织趋势看板、项目完成归档和继续优化。
- Clay 风格视觉系统、建筑与道路场地平面图、响应式布局和可访问交互。

## 快速体验

### 在线访问

直接打开 [PlantSim GitHub Pages](https://32631999wzc-create.github.io/PlantSim/)，无需安装 Python、Node.js 或其他本地环境。

### 直接打开

双击 `plantsim-demo.html`。页面已内嵌全部样式、数据、业务逻辑和交互。

演示登录信息已预填：

- 企业代码：`PLANTSIM-DEMO`
- 企业账号：`reviewer@plantsim.cn`
- 个人账号：`designer@plantsim.cn`
- 演示密码：`demo-access`

登录只用于切换展示空间，不会连接真实账户系统。

### 使用本地 HTTP 服务

如果浏览器限制 `file://` 下的本地存储，可在仓库目录运行：

```bash
python -m http.server 8765
```

然后访问 `http://127.0.0.1:8765/plantsim-demo.html`。

### 推荐演示路径

1. 进入企业工作台并打开演示项目。
2. 在“项目方案”导入内置案例资料，处理数量冲突并确认基线。
3. 保存模拟目标，校验并冻结未来任务卡。
4. 创建模拟；出现业务约束时执行最小回退与恢复。
5. 在结果页查看 B1 / C20 / A01 的风险和原因链。
6. 创建新设计版本，在相同未来条件下重跑并进入方案比较。
7. 记录评审决策，在运行记录中查看 Trace 或从 Checkpoint 回放。
8. 完成项目并返回工作台查看归档成果。

也可以使用页面顶部的“自动讲解”，并切换 10 倍速度快速跑完整闭环。

## 技术设计

当前 Demo 使用原生 HTML、CSS 与 JavaScript，运行时不依赖网络资源。`plantsim-demo.html` 是唯一必须交付的运行文件；其余源码用于维护、测试和同步检查。

```text
项目资料 → Input Gate → 模拟目标 → 未来蓝图与路径
         → World Task Card Gate → 独立 Simulation Run
         → Plant / Stress / Human Effects（并行语义）
         → State Resolver → Maintenance → Final Resolver
         → Checkpoint / Trace → 结果、比较与评审决策
```

关键约束：

- Agent 不直接修改全局植物状态，只能产生结构化 Effect。
- 不同未来路径、设计版本、正式运行和回放使用独立状态副本。
- Gate 是确定性校验，不由 Agent 自行声明通过。
- 失败优先回退到最小节点，Retry 有上限，修复后从节点继续。
- 公平比较要求未来条件、规则、Seed、目标和评价标尺一致。
- 归档保存在浏览器 `localStorage`，不是远程数据库。

## 仓库结构

```text
PlantSim/
├─ plantsim-demo.html              # 可直接运行的完整单文件作品
├─ plantsim-domain.js              # 领域数据、任务卡和评价定义
├─ plantsim-engine.js              # 模拟、Gate、Resolver、恢复与 Trace
├─ plantsim-business.js            # 成本、决策、归档和业务统计
├─ plantsim-ui.js                  # 页面、交互和路由
├─ plantsim-upgrade.js             # 蓝图、图谱、地图与比较增强
├─ plantsim-presentation.js        # 登录、工作台、图表和项目总览
├─ plantsim-presentation.css       # 展示层样式
├─ plantsim-*.test.js              # Node.js 回归检查
└─ docs/
   ├─ README.md                    # 分级文档导航
   ├─ product/                     # 产品需求与页面规划
   ├─ technical/                   # 技术开发文档
   ├─ acceptance/                  # 使用说明与多轮验收记录
   └─ design/clay/                 # 本项目采用的 Clay 设计参考
```

## 测试

安装 Node.js 后可运行：

```bash
node plantsim-engine.test.js
node plantsim-business.test.js
node plantsim-review.test.js
node plantsim-shell.test.js
```

测试覆盖路径与版本隔离、Gate、Effect ID、局部恢复、有限 Retry、公平比较、Checkpoint 回放、成本对账、项目归档、决策校验、登录与源码嵌入同步。

## 文档

完整文档入口见 [`docs/README.md`](docs/README.md)，包括产品需求、前端规划、技术架构、使用与验收记录，以及 Clay 设计语言和第三方许可。

## Demo 边界

当前版本真实实现的是前端业务流程、状态隔离、确定性结算、Gate、恢复、Trace、版本比较、决策和归档。以下能力仍为 Mock、简化或规划内容：

- 完整 DWG/CAD、GIS、Word/PDF 和图像解析。
- 真实天气 API、长期气候模型和专业植物生长模型。
- 在线大模型推理、知识图谱平台和企业成本数据库。
- 服务端持久化、多租户 RBAC、消息队列和 WebSocket/SSE。
- 可用于施工、报价或专业种植决策的校准数据。

## 设计来源与许可

界面采用 Clay-inspired 的暖白画布、深青绿色、薰衣草紫、蜜桃橙与圆角卡片语言。设计参考来自 VoltAgent 的 `awesome-design-md` 项目；仓库仅保留本作品实际使用的 Clay 条目与对应 MIT License，详见 [`docs/design/clay`](docs/design/clay)。

PlantSim 项目本身尚未声明开源许可证。除 `docs/design/clay` 中明确标注的第三方材料外，其他内容的使用权以仓库所有者后续发布的许可证为准。
