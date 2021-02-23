
import {
  LogBond,
  LogSlash,
  LogUnbondRequested,
  LogUnbonded,
} from "../generated/Staking/Staking"
import {crypto, Bytes, log } from '@graphprotocol/graph-ts'
import { Bond, Slash, UnbondRequest, Unbond} from "../generated/schema"

function encode(hexString: string): string {
  // assumes 0x prefixed string
  let encoded = hexString.slice(2);
  for (let i = encoded.length + 1; i <= 64; i++ ) {
    encoded = '0' + encoded
  }
  return encoded;
}

export function handleLogBond(event: LogBond): void {
  let contractAddressEncoded = encode(event.address.toHexString());
  let senderEncoded = encode(event.params.owner.toHexString());
  let amountEncoded = encode(event.params.amount.toHexString());
  let poolIdEncoded = encode(event.params.poolId.toHexString());
  let nonceEncoded = encode(event.params.nonce.toHexString());

  let bondId = crypto.keccak256(Bytes.fromHexString(contractAddressEncoded + senderEncoded + amountEncoded + poolIdEncoded + nonceEncoded))

  let entity = new Bond(event.transaction.hash.toHexString())
  entity.bondId = bondId as Bytes
  entity.owner = event.params.owner
  entity.amount = event.params.amount
  entity.poolId = event.params.poolId
  entity.nonce = event.params.nonce
  entity.slashedAtStart = event.params.slashedAtStart
  entity.timestamp = event.block.timestamp.toI32()
  entity.save()
}

export function handleLogSlash(event: LogSlash): void {
  let slash = new Slash(event.transaction.hash.toHexString())
  slash.poolId = event.params.poolId
  slash.newSlashPts = event.params.newSlashPts
  slash.timestamp = event.block.timestamp.toI32()
  slash.save()
}

export function handleLogUnbondRequested(event: LogUnbondRequested): void {
  let unbond = new UnbondRequest(event.transaction.hash.toHexString() + ':' + event.transaction.from.toHexString())
  unbond.owner = event.params.owner
  unbond.bondId = event.params.bondId
  unbond.willUnlock = event.params.willUnlock
  unbond.timestamp = event.block.timestamp.toI32()
  unbond.save()
}

export function handleLogUnbonded(event: LogUnbonded): void {
  let unbond = new Unbond(event.transaction.hash.toHexString() + ':' + event.transaction.from.toHexString())
  unbond.owner = event.params.owner
  unbond.bondId = event.params.bondId
  unbond.timestamp = event.block.timestamp.toI32()
  unbond.save()
}