export interface IRhpState {
  expand?: boolean
  locked?: boolean
}

// Filters rhp set state payloads to abstract expand locking
export const filterRhpPayload = (
  stateRhpLocked: boolean | undefined,
  payload: IRhpState
) => {
  if ((!stateRhpLocked && !payload.locked) || payload.locked) {
    // lock either not set or being set, apply state
    return payload
  } else {
    // lock in effect, return existing expand/lock
    const { expand, locked, ...rest } = payload
    return {
      ...rest,
    }
  }
}
