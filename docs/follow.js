function voiceCharacters(text) {
  const units = [];
  let offset = 0;
  for (const character of text) {
    const end = offset + character.length;
    for (const unit of character.normalize('NFKC').toLowerCase()) {
      if (/[\p{L}\p{N}]/u.test(unit)) units.push({ unit, offset, end });
    }
    offset = end;
  }
  return units;
}

function matchVoice(letters, transcript, anchor, current) {
  const heard = voiceCharacters(transcript.slice(-240)).map(item => item.unit);
  const minimum = heard.some(unit => /\p{Script=Han}/u.test(unit)) ? 3 : 5;
  if (heard.length < minimum) {
    // The first one or two characters can advance only at the exact phrase start.
    const atAnchor = heard.length > 0 && heard.every((unit, index) => unit === letters[anchor + index]);
    return atAnchor ? Math.max(current, anchor + heard.length) : current;
  }
  const earliest = Math.max(0, current - 28, anchor - 6);
  let nearest = current;
  let best = -Infinity;

  for (let length = Math.min(24, heard.length); length >= minimum; length--) {
    const fragment = heard.slice(-length);
    const limit = Math.min(letters.length, current + (length >= 9 ? 96 : length >= 5 ? 27 : 10));
    for (let end = Math.max(current - 2, earliest + length); end <= limit; end++) {
      if (!fragment.every((unit, i) => unit === letters[end - length + i])) continue;
      // Nearby matches win over repeated phrases much further down the script.
      const score = length * 3 - Math.abs(end - current) * 0.18;
      if (score > best) {
        nearest = end;
        best = score;
      }
    }
  }

  if (heard.length < 7 || best >= 22) return Math.max(current, nearest);
  const tail = heard.slice(-18);
  const limit = Math.min(letters.length, current + 27);
  const window = letters.slice(earliest, limit);
  // Align the latest words against the nearby script. A firm ending prevents
  // substitutions or filler at the tail from moving the reading position.
  let row = new Uint16Array(window.length + 1);
  for (const [i, unit] of tail.slice(0, -2).entries()) {
    const next = new Uint16Array(row.length);
    next[0] = i + 1;
    for (let column = 1; column < row.length; column++) {
      next[column] = Math.min(next[column - 1] + 1, row[column] + 1,
        row[column - 1] + Number(unit !== window[column - 1]));
    }
    row = next;
  }
  const errorsAllowed = Math.min(3, Math.floor(tail.length / 5));
  for (let end = current + 1; end <= limit; end++) {
    const column = end - earliest - 2;
    if (column < 0 || tail.at(-2) !== window[column] || tail.at(-1) !== window[column + 1]) continue;
    const errors = row[column];
    if (errors > errorsAllowed) continue;
    const score = tail.length * 3 - errors * 6 - (end - current) * 0.36;
    if (score > best) {
      nearest = end;
      best = score;
    }
  }
  return Math.max(current, nearest);
}
