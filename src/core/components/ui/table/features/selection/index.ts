export function toggleSelection(current: Set<string>, id: string) {
  const next = new Set(current);

  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }

  return next;
}

export function selectMany(current: Set<string>, ids: string[]) {
  const next = new Set(current);
  ids.forEach((id) => next.add(id));
  return next;
}

export function clearSelection() {
  return new Set<string>();
}
