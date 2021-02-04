import { LogDeployed } from "../generated/IdentityFactory/IdentityFactory"
import { Identity } from "../generated/templates"
import { Identity as IdentityFactory } from "../generated/schema"

export function handleLogDeployed(event: LogDeployed): void {
    let id = new IdentityFactory(event.params.addr.toHexString())
    id.timestamp = event.block.timestamp.toI32()
    id.save()

    Identity.create(event.params.addr)
}