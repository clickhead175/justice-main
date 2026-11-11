A new customer intake has been submitted.

Lead ID: {{ $lead->lead_id }}
Submitted: {{ $lead->submitted_at->toDateTimeString() }}

Customer details
First name: {{ $lead->data['first_name'] ?? '' }}
Last name: {{ $lead->data['last_name'] ?? '' }}
Date of birth: {{ $lead->data['dob'] ?? '' }}
Email: {{ $lead->data['email'] ?? '' }}
Phone: {{ $lead->data['phone'] ?? '' }}
Street: {{ $lead->data['street'] ?? '' }}
City: {{ $lead->data['city'] ?? '' }}
State: {{ $lead->data['state'] ?? '' }}
ZIP: {{ $lead->data['zip'] ?? '' }}

Accident details
At fault: {{ $lead->data['at_fault'] ?? '' }}
Has attorney: {{ $lead->data['has_attorney'] ?? '' }}
Insured: {{ $lead->data['insured'] ?? '' }}
Injuries: {{ $lead->data['injuries'] ?? '' }}
Medical care: {{ $lead->data['medical_care'] ?? 'Not provided' }}
Timeframe: {{ $lead->data['timeframe'] ?? '' }}
Accident date: {{ $lead->data['accident_date'] ?? '' }}

Consent accepted: {{ ! empty($lead->data['consent_accepted']) ? 'Yes' : 'No' }}
Consent timestamp: {{ $lead->data['consent_timestamp'] ?? '' }}
Consent text: {{ $lead->data['consent_text'] ?? '' }}
Disclosure: {{ $lead->data['disclosure'] ?? '' }}
