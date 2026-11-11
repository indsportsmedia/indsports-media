/**
 * Sends site forms to Netlify Forms so submissions show up in
 * Netlify → Forms (and can be emailed to you under Forms → Notifications).
 *
 * Netlify only accepts form names and fields it found in index.html at deploy
 * time, so every form posts the same three fields: name, email and details.
 * `details` is a readable summary of everything the visitor filled in.
 */

export type SiteFormName = 'partner-inquiry' | 'contact' | 'advertise' | 'media-credentials';

export async function sendSiteForm(
  formName: SiteFormName,
  fields: Record<string, string | undefined>
): Promise<void> {
  const name = fields.name || fields.Name || '';
  const email = fields.email || fields.Email || '';
  const details = Object.entries(fields)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const body = new URLSearchParams({ 'form-name': formName, name, email, details });
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Form not sent (${res.status})`);
}

/**
 * For older forms that keep their values in React state without `name`
 * attributes: reads every filled field in the <form> and labels it by its
 * name, aria-label, placeholder or nearby <label> text.
 */
export function readFormFields(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {};
  const els = Array.from(form.elements) as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[];
  els.forEach((el, i) => {
    if (!('value' in el) || el.type === 'submit' || el.type === 'button' || el.type === 'hidden') return;
    if ((el.type === 'checkbox' || el.type === 'radio') && !(el as HTMLInputElement).checked) return;
    const value = String(el.value || '').trim();
    if (!value) return;
    const labelText =
      el.getAttribute('name') ||
      el.getAttribute('aria-label') ||
      (el.id && form.querySelector(`label[for="${el.id}"]`)?.textContent) ||
      el.closest('div')?.querySelector('label')?.textContent ||
      el.getAttribute('placeholder') ||
      `Field ${i + 1}`;
    let key = labelText.replace(/\s+/g, ' ').replace(/[*:]/g, '').trim();
    if (/e-?mail/i.test(key) || el.type === 'email') key = out.email ? key : 'email';
    else if (/^(full )?name|your name|contact name/i.test(key) && !out.name) key = 'name';
    out[key in out ? `${key} (${i + 1})` : key] = value;
  });
  return out;
}
