export const BRAND = Object.freeze({
  name: import.meta.env.VITE_BRAND_NAME || 'Collision Justice',
  logo: import.meta.env.VITE_BRAND_LOGO_URL || '/brand-logo.png',
  disclosure:
    'Advertising by a legal marketing service. No attorney-client relationship is formed.',
  consent:
    'I provide express written consent for the Collision Justice and independently retained attorneys to contact me at the number and email provided, including via automated technology, text, and prerecorded messages regarding my legal inquiry. I understand consent is not required to use this marketing service. Message and data rates may apply. No attorney-client relationship is formed.',
});

export const STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'],
  ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'],
  ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'],
  ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'],
  ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'],
  ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'],
  ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
];

export const TIMEFRAMES = [
  'Within last 30 days',
  '1–3 months',
  '3–6 months',
  '6–12 months',
  'More than 1 year',
  'Unsure',
];
