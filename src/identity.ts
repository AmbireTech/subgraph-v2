import { LogPrivilegeChanged, LogRoutineAuth } from "../generated/templates/Identity/Identity"
import { IdentityPrivilege, IdentityRoutine } from '../generated/schema'

export function handleLogPrivilegeChanged(event: LogPrivilegeChanged): void {
  let id = event.address.toHexString() + ":" + event.params.addr.toHexString()
  let identity = IdentityPrivilege.load(id)
  if(!identity) {
    identity = new IdentityPrivilege(id)
    identity.timestamp = event.block.timestamp.toI32()
    identity.lastUpdateTimestamp = event.block.timestamp.toI32()
  } else {
    identity.lastUpdateTimestamp = event.block.timestamp.toI32()
  }

  identity.identity = event.address
  identity.address = event.params.addr
  identity.level = event.params.privLevel
  identity.timestamp = event.block.timestamp.toI32()
  identity.save()
}

export function handleLogRoutineAuth(event: LogRoutineAuth): void {
    let id = event.address.toHexString() + ":" + event.params.hash.toHexString();
    let identity = IdentityRoutine.load(id)

    if(!identity) {
        identity = new IdentityRoutine(id)
        identity.timestamp = event.block.timestamp.toI32()
        identity.lastUpdateTimestamp = event.block.timestamp.toI32()
    } else {
        identity.lastUpdateTimestamp = event.block.timestamp.toI32()
    }

    identity.identity = event.address
    identity.hash = event.params.hash
    identity.authorized = event.params.authorized
    identity.save()
}