/** A DOM id for a field key such as "svc.character-design.eyes". */
export const fieldId = (key: string) => `fs-${key.replace(/[^a-zA-Z0-9_-]/g, '-')}`
