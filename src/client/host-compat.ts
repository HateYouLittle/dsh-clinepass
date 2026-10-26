import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import { PROFILE_ENTRY_ID, SETTINGS_NAMESPACE, type ClinePassSettings } from '../config-contract.ts'
import type { SettingsScope } from './settings.ts'
import type { ExecuteAccountCommand } from './accounts-controller.ts'

/** Only the boundary knows whether the host exposes profile forms or legacy scopes. */
export function mountSettingsScopes(ctx: Context, mount: (ctx: Context, scope: SettingsScope<ClinePassSettings>) => void): void {
  ctx.inject(['configForms', 'remote.clinePassModels'], child => {
    const forms = child.get('configForms') as { get<T>(id: string): SettingsScope<T> }
    mount(child, forms.get<ClinePassSettings>(PROFILE_ENTRY_ID))
  })
  ctx.inject(['settingsScope', 'remote.clinePassModels'], child => {
    mount(child, child.settingsScope.bind({ namespace: SETTINGS_NAMESPACE,
      decode: (section): ClinePassSettings | undefined =>
        typeof section === 'object' && section !== null ? section as ClinePassSettings : undefined,
    }))
  })
}

export function accountCommands(ctx: Context): ExecuteAccountCommand {
  const unavailable: ExecuteAccountCommand = async () => 'unknown'
  let execute = unavailable
  ctx.inject(['remote.clinePassAccounts'], ready => {
    ready.effect(() => {
      const connected: ExecuteAccountCommand = async command => {
        const result = await ready.remote.clinePassAccounts.execute(command)
        return result.ok ? result.value : 'unknown'
      }
      execute = connected
      return () => { if (execute === connected) execute = unavailable }
    })
  })
  return command => execute(command)
}
