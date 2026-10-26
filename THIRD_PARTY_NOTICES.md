# Third-party notices

`dsh-clinepass` is derived from [`dsh-opencode-go`](https://github.com/Duskriver/dsh-opencode-go).
That project's initial adapter, settings UI, and `src/conversion/{context,stream,replay}.ts` were in
turn derived from DeepSeek Harness, copyright (c) 2026 DeepSeek, under the MIT license included in
LICENSE. The original DeepSeek and dsh-opencode-go copyright notices are retained for these derived
portions. The conversion modules are maintained in this package because the published DSH pi-ai
package does not export its conversion helpers.

Original additions and subsequent modifications made in this project — the ClinePass model catalog,
the plan and usage integration, the Cline request identity, and the rebranded settings surface — are
copyright (c) 2026 dsh-clinepass contributors and are also licensed under MIT. LICENSE records the
upstream attributions and this project's contributor attribution.

The host bundle includes the required portions of `@earendil-works/pi-ai@1.2.0` (installed under the
local alias `clinepass-pi-ai`), `@google/genai@2.21.0` and their bundled dependencies; SDK
declarations include pi-ai, pi-telemetry and TypeBox types. Their original licenses are reproduced in
`lib/vendor-licenses.txt`, including the Google SDK's Apache-2.0 license and data-uri-to-buffer's MIT
license from its published README. The pi packages' license comes from the
[upstream v1.2.0 license](https://github.com/earendil-works/pi/blob/v1.2.0/LICENSE), which their npm
distributions omit. OpenAI and Anthropic transport SDKs remain separate runtime dependencies.

The bundled Google SDK's HTTP fetch call is modified at build time to use the plugin's request-scoped
fetch binding. Its message serialization and stream parser remain upstream implementations.

The ClinePass model reference rates and capability table in `src/clinepass-models.ts` are compiled
from Cline's published ClinePass documentation (https://docs.cline.bot/getting-started/clinepass)
and independently measured billing data. The Cline name and ClinePass are trademarks of their owner;
this package is an independent client and is not affiliated with or endorsed by Cline.
