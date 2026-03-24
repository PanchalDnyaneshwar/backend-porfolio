const BLOCKED_TAGS = [
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'option',
  'meta',
  'link',
  'base',
];

const BLOCKED_TAGS_PATTERN = new RegExp(
  `<(?:${BLOCKED_TAGS.join('|')})\\b[^>]*>[\\s\\S]*?<\\/(?:${BLOCKED_TAGS.join('|')})>|<(?:${BLOCKED_TAGS.join('|')})\\b[^>]*\\/?>`,
  'gi',
);

const EVENT_HANDLER_PATTERN =
  /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const STYLE_ATTR_PATTERN = /\s+style\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_URL_PATTERN =
  /\s(href|src|action|formaction|poster|xlink:href)\s*=\s*(['"])\s*(javascript:|vbscript:|data:text\/html)[\s\S]*?\2/gi;
const SRCDOC_PATTERN = /\s+srcdoc\s*=\s*("[^"]*"|'[^']*')/gi;
const COMMENT_PATTERN = /<!--[\s\S]*?-->/g;

export function sanitizeHtml(html?: string): string | undefined {
  if (!html) {
    return html;
  }

  return html
    .replace(COMMENT_PATTERN, '')
    .replace(BLOCKED_TAGS_PATTERN, '')
    .replace(EVENT_HANDLER_PATTERN, '')
    .replace(STYLE_ATTR_PATTERN, '')
    .replace(JAVASCRIPT_URL_PATTERN, ' $1=$2#$2')
    .replace(SRCDOC_PATTERN, '');
}
