<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 32px 38px; }
        body { color: #333; font-family: DejaVu Sans, sans-serif; font-size: 10px; line-height: 1.5; }
        .top { margin-bottom: 18px; padding-bottom: 14px; border-bottom: 3px solid #D71920; text-align: center; }
        h1 { margin: 8px 0; font-size: 20px; }
        h2 { color: #D71920; }
        h3 { margin: 18px 0 6px; padding: 7px; background: #333; color: #fff; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        td, th { padding: 7px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
        th { width: 34%; background: #f5f5f5; }
        .consent { padding: 10px; border-left: 3px solid #D71920; background: #f5f5f5; }
        .foot { margin-top: 18px; color: #666; font-size: 9px; }
    </style>
</head>
<body>
    <div class="top">
        @if (is_file(public_path('brand-logo.png')))
            <img src="{{ public_path('brand-logo.png') }}" alt="Collision Justice" style="max-width: 210px; max-height: 90px;">
        @else
            <h2>{{ config('app.brand_name', 'Collision Justice') }}</h2>
        @endif
        <h1>Intake Submission Receipt</h1>
    </div>
    <p><strong>Lead ID:</strong> {{ $lead->lead_id }}<br><strong>Submission date/time:</strong> {{ $lead->submitted_at->format('Y-m-d H:i:s') }}</p>
    <h3>Contact &amp; Accident Details</h3>
    <table>
        @foreach (['First Name' => 'first_name', 'Last Name' => 'last_name', 'Date of Birth' => 'dob', 'Email Address' => 'email', 'Phone Number' => 'phone', 'Street Address' => 'street', 'City' => 'city', 'State' => 'state', 'ZIP Code' => 'zip', 'Were you at fault?' => 'at_fault', 'Do you currently have an attorney?' => 'has_attorney', 'Was either party insured?' => 'insured', 'Did you suffer physical injuries?' => 'injuries', 'Have you received medical care?' => 'medical_care', 'Accident timeframe' => 'timeframe', 'Accident date' => 'accident_date'] as $label => $key)
            <tr><th>{{ $label }}</th><td>{{ $data[$key] ?? '' }}</td></tr>
        @endforeach
    </table>
    <h3>TCPA Consent</h3>
    <div class="consent">{{ $data['consent_text'] ?? '' }}<br><br><strong>Accepted:</strong> {{ !empty($data['consent_accepted']) ? 'Yes' : 'No' }}<br><strong>Consent timestamp:</strong> {{ $data['consent_timestamp'] ?? '' }}</div>
    <p class="foot">Advertising by a legal marketing service. No attorney-client relationship is formed.</p>
</body>
</html>
