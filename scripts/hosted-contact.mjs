export function contactLinks(html) {
  const anchors = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>/gi)].map(
    (match) => match[1].replaceAll("&amp;", "&"),
  );
  const calendar = anchors.filter((href) =>
    /^https:\/\/(?:calendar\.app\.google\/[a-zA-Z0-9_-]+|calendar\.google\.com\/(?:calendar\/)?appointments\/schedules\/[a-zA-Z0-9_-]+)\/?$/.test(
      href,
    ),
  );
  const whatsapp = anchors
    .map((href) => href.match(/^https:\/\/wa\.me\/([1-9][0-9]{7,14})\?text=.+$/)?.[1])
    .filter(Boolean);
  return { calendar: [...new Set(calendar)], whatsapp: [...new Set(whatsapp)] };
}

export function contactStatus(spanish, english) {
  const es = contactLinks(spanish);
  const en = contactLinks(english);
  const state = (left, right) => {
    if (!left.length && !right.length) return "disabled";
    if (left.length === 1 && right.length === 1 && left[0] === right[0]) return "configured";
    return "inconsistent";
  };
  return {
    calendar: state(es.calendar, en.calendar),
    whatsapp: state(es.whatsapp, en.whatsapp),
  };
}
