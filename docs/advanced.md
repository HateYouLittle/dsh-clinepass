# ClinePass 高级使用指南

[返回 README](../README.md) · [English](advanced.en.md)

本页内容都是可选的：日常使用看设置页即可。这里说明 Headless 与补丁文件配置、插件使用的唯一线上协议、网络代理、错误诊断，以及“全部恢复默认”到底清除了什么。

本插件是独立客户端，与 Cline 无隶属或背书关系。

## Headless 模式

把插件装进 headless profile：

```sh
dsh plugin --profile headless add /path/to/dsh-clinepass
```

该 profile 没有设置页，因此在补丁文件里指定提供方（`examples/headless.patch.yml` 内容相同）：

```yaml
- id: agent-default-model
  config:
    provider: dsh-clinepass
    model: cline-pass/deepseek-v4.1-flash
```

`model` 必须是插件目录随附的模型 ID：订阅模型用 `cline-pass/*`，免费额度用 `cline-free/*`，完整清单见 [README](../README.md#模型)。本版本未收录的模型无法这样配置。

通过环境变量提供 Key，然后运行任务：

```sh
read -s CLINE_API_KEY
export CLINE_API_KEY
dsh --profile headless --patch ./headless.patch.yml "你好"
```

PowerShell：

```powershell
$env:CLINE_API_KEY = "your-key"
dsh --profile headless --patch .\headless.patch.yml "你好"
```

Key 优先通过 DSH 凭据服务解析，取不到时回退到启动环境；没有已保存凭据时，环境变量就是全部凭据来源。额外账号同样在补丁文件里声明，各自的引用按同样方式解析。

## 手动配置

补丁文件可以带上本插件的配置项，ID 为 `clinepass`，也可以与上面的默认模型项并列：

```yaml
- id: clinepass
  config:
    enabled: true
    apiKeyEnv: CLINE_API_KEY
    accounts:
      - id: primary
        name: 主账号
        apiKeyEnv: CLINE_API_KEY
      - id: backup
        name: 备用账号
        apiKeyEnv: DSH_CLINEPASS_ACCOUNT_BACKUP
    autoSwitch: true
    proxyURL: http://127.0.0.1:7890
    refreshMinutes: 60
    modelVisibility:
      cline-pass/qwen3.7-max: false
    modelLimits:
      cline-pass/deepseek-v4.1-flash:
        maxTokens: 8192
      cline-pass/qwen3.7-plus:
        thinkingBudgets: [4096, 6000]
    maxImages: 30
```

请通过 DSH 凭据服务保存或导出每个被引用的 Key。`accounts` 的第一项是当前账号，其余按顺序作为备用；旧的 `apiKeyEnv` 必须指向第一项。手动切换与自动切换都会把目标账号移到首位，同时保持其他账号的相对顺序。

| 配置项 | 说明 |
| --- | --- |
| `enabled` | 默认 `true`。设为 `false` 会把 `dsh-clinepass` 路由及其模型从所有选择器撤下，但不卸载插件，设置页仍可访问 |
| `usageDisplay` | 用量胶囊模式：`auto`、`always` 或 `off`，默认 `auto` |
| `apiKeyEnv` | 当前账号的凭据引用，默认 `CLINE_API_KEY`；必须是裸环境变量名 |
| `accounts` | 最多 20 项 `{id, name, apiKeyEnv}`；第一项为当前账号，其余为备用顺序 |
| `autoSwitch` | 默认 `false`；额度或凭据失败时，在开始输出前尝试其他账号 |
| `baseURL` | 网关地址，默认 `https://api.cline.bot/api/v1`；只填 `https://api.cline.bot` 会折叠到 `/api/v1`。仅支持 `http`/`https`，且不能带查询参数或片段 |
| `proxyURL` | 默认留空；支持 `http://`、`https://`、`socks5://`，需含主机与可选端口，不能带路径、查询参数或片段 |
| `refreshMinutes` | 目录缓存时长，1–10080，默认 `60`。打开设置页或点击刷新会立即重新核对 |
| `streamIdleTimeoutMs` | 流事件之间的最大静默间隔，超出则请求失败，默认 `300000` |
| `requestPreparationTimeoutMs` | 发现过程与每次尝试的凭据/图片准备时限，默认 `60000`。仅配置文件可用，设置页没有对应控件 |
| `requestTimeoutMs` | 整个请求的时限，含发现、账号回退与流式输出，默认 `1800000`。仅配置文件可用 |
| `maxImages` | 单个请求保留的图片数量；默认不设，即继承基础配置（基础未设上限时才不限制张数）。超限时最旧的图片会被替换为文字占位 |
| `maxRequestImageBytes` | 单个请求累计 base64 图片载荷上限，默认 `20971520`（20 MiB） |
| `requestImagePixelBudget` | 单张图片转换后的总像素预算，默认 `4194304`（2048×2048） |
| `requestImageMaxBytes` | 单张图片 base64 扩展前的编码字节目标，默认 `1048576`（1 MiB） |
| `modelVisibility` | 按模型 ID 控制会话选择器可见性；未列出的模型默认开启（目录标记为已弃用的除外） |
| `modelLimits` | 按模型覆盖 `contextWindow`、`maxTokens` 与额外 `thinkingBudgets`；`null` 表示使用目录值 |

设置文档里还有 `accountOperations`，它是插件为“账号增删被中断”保存的恢复状态，页面上不可见、由插件自行管理，请勿手动修改。

## 线上协议

ClinePass 只提供一种 OpenAI 兼容协议，因此本插件没有协议切换：

- 推理请求为 `POST {base}/chat/completions`，以 SSE 流式返回，思考内容位于 `delta.reasoning`；
- `GET {base}/models` 仅作为诊断读取：Cline 的列表只包含通用路由目录，从不包含 `cline-pass/*` ID，因此它既不能新增也不能删除模型；
- 每个请求都带宿主归属 User-Agent（`deepseek-harness/<version>`）与 `Authorization: Bearer <key>`；
- 每次逻辑调用都带 `X-Task-ID`，由请求的会话 ID 推导：可打印 ASCII ID 原样发送；其他 ID，以及已落在保留命名空间内的 ID，会变成 `dsh-cline-task-v1-` 加上该 ID 的 base64url SHA-256。没有会话 ID 的调用会得到一个新的随机值，并在该调用的每次账号尝试间共享；
- 从不发送 `developer` 角色；缓存标记使用 Anthropic 风格的 `{type:"ephemeral"}`。也从不发送 `ttl` 字段：Cline 收到它会返回 HTTP 500。

默认网关的模型列表位于 `https://api.cline.bot/api/v1/models`；自定义网关原样使用填写的请求前缀。

## 网络代理

打开 **设置 → ClinePass → 高级设置 → 连接 → 代理地址**，填写并保存：

```text
http://127.0.0.1:7890
socks5://127.0.0.1:1080
```

支持 HTTP、HTTPS 和 SOCKS5，地址可以带用户名和密码。代理用于后续对话、目录刷新与用量查询。连接从运行 DSH 的机器发出，因此在远程部署中 `127.0.0.1` 指那台服务器，而不是你的本机。

## 图片处理

只有模型目录声明了图像模态的模型接受图片附件，其余模型会在发出请求前拒绝图片内容。图片相关设置约束的是单个请求：数量上限会把最旧的图片替换为文字占位，字节与像素上限约束离开本机的载荷。调高上限不会恢复此前已被替换的图片。

## 导出错误诊断

要保留失败请求的 HTTP 证据，请在启动 DSH 前指定目录：

```sh
export DSH_CLINEPASS_DEBUG_DIR=/tmp/dsh-clinepass-debug
dsh web
```

Windows PowerShell：

```powershell
$env:DSH_CLINEPASS_DEBUG_DIR = "$env:TEMP\dsh-clinepass-debug"
dsh web
```

复现失败。文件写入成功时，错误信息会给出路径；文件名为 `http-error-<uuid>.json`，以 `0600` 权限写入 `0700` 目录，内容包括：

- 时间、提供方、模型、调用 ID 与尝试序号；
- 请求摘要：方法、来源与路径（不含查询参数或片段）、会话哈希、User-Agent、请求体字节数、消息与工具数量、输出预算、思考强度或思考类型；
- 响应状态、一组固定的诊断响应头，以及有长度上限的响应体预览。

API Key 与代理凭据都会被脱敏，包括上游回显的凭据；提示词、消息内容与未知响应头从不记录。清除该环境变量并重启 DSH 即可停止写文件。

## 错误语义

用量读取按 HTTP 状态分类：

| 状态 | 含义 | 可重试 |
| --- | --- | --- |
| 401 / 403 | Key 或 ClinePass 权益被拒绝 | 否 |
| 429 | ClinePass 正在限流当前窗口，会随窗口自行恢复 | 是 |
| 408 / 5xx | 上游故障 | 是 |

用量读取失败时，只有在该失败可重试、且来自同一账号与同一端点的情况下，面板才保留上次数据并标注“上次数据”。**立即重试** 与账号卡片里的 **刷新额度** 都会重新读取。

请求失败会根据状态与错误体分类：

| 代码 | 含义 |
| --- | --- |
| `QUOTA` | 该窗口额度已耗尽 |
| `MISSING_CREDENTIAL` / `INVALID_CREDENTIAL` | 没有可用 Key，或网关拒绝了 Key |
| `RATE_LIMIT` | 被限流 |
| `UNKNOWN_MODEL` | 网关不提供该模型 |
| `CONTEXT_WINDOW_EXCEEDED` | 请求超出上下文窗口 |
| `INVALID_REQUEST` | 其他 400/413/422 拒绝 |
| `TIMEOUT` / `SERVER` | 408/504，或 5xx |

自动回退只在 `QUOTA`、`MISSING_CREDENTIAL`、`INVALID_CREDENTIAL` 时切换到下一个账号，且必须在请求尚未输出内容、未产生 token 用量、未被取消的前提下。被网关拒绝的 Key 会按网关记住五分钟并在该窗口内跳过；为同一引用保存新值会立即清除该记录，下一次请求即重新校验。

## 账号操作与保存

Key 通过 DSH 凭据服务保存，设置页不会回显已保存的密钥。

如果添加或删除账号被中断（关闭页面或连接断开），宿主会在启动时、或在下次设置/凭据更新后完成该意图。Key 始终未能写入的待处理账号会继续显示，方便替换 Key 或删除；期间做出的当前账号选择会被保留。

高级卡片里的 **全部恢复默认** 只重置该卡片自己的字段：额度显示、网关地址、代理、目录刷新、流空闲超时，以及三项图片上限。它不会删除账号或 Key，也不会清除模型显示开关或模型容量覆盖。
