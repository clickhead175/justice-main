<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\IntakeSubmissionNotification;
use App\Models\Lead;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\HttpFoundation\Response;

class IntakeController extends Controller
{
    private const STATUSES = ['New', 'In Review', 'Contacted', 'Qualified', 'Closed'];

    private const TIMEFRAMES = [
        'Within last 30 days', '1–3 months', '3–6 months',
        '6–12 months', 'More than 1 year', 'Unsure',
    ];

    private const STATES = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
        'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
        'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
        'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
        'WI', 'WY',
    ];

    public function store(Request $request): JsonResponse
    {
        $honeypot = $request->input('company_website', '');
        if (! is_string($honeypot) || trim($honeypot) !== '') {
            abort(422, 'Invalid submission.');
        }
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'dob' => ['required', 'date_format:Y-m-d', 'before_or_equal:today'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['required', 'string', 'max:40', 'regex:/^[0-9\s()+.\-]{10,40}$/'],
            'street' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:120'],
            'state' => ['required', Rule::in(self::STATES)],
            'zip' => ['required', 'regex:/^\d{5}(?:-\d{4})?$/'],
            'at_fault' => ['required', Rule::in(['Yes', 'No'])],
            'has_attorney' => ['required', Rule::in(['Yes', 'No'])],
            'insured' => ['required', Rule::in(['Yes', 'No'])],
            'injuries' => ['required', Rule::in(['Yes', 'No'])],
            'medical_care' => ['nullable', Rule::in(['Yes', 'No'])],
            'timeframe' => ['required', Rule::in(self::TIMEFRAMES)],
            'accident_year' => ['required', 'integer', 'between:2019,'.now()->year],
            'accident_month' => ['required', 'integer', 'between:1,12'],
            'accident_day' => ['required', 'integer', 'between:1,31'],
            'consent' => ['required', Rule::in(['1'])],
        ]);

        if (! checkdate((int) $validated['accident_month'], (int) $validated['accident_day'], (int) $validated['accident_year'])) {
            abort(422, 'Enter a valid accident date.');
        }

        $leadId = 'TCJ-'.now()->format('Ymd').'-'.strtoupper(bin2hex(random_bytes(10)));
        $pdfToken = Str::random(64);
        $data = collect($validated)->except(['consent', 'company_website'])->all();
        $data['accident_date'] = sprintf('%04d-%02d-%02d', $validated['accident_year'], $validated['accident_month'], $validated['accident_day']);
        $data['consent_text'] = 'I provide express written consent for the Collision Justice and independently retained attorneys to contact me at the number and email provided, including via automated technology, text, and prerecorded messages regarding my legal inquiry. I understand consent is not required to use this marketing service. Message and data rates may apply. No attorney-client relationship is formed.';
        $data['consent_accepted'] = true;
        $data['consent_timestamp'] = now()->toDateTimeString();
        $data['disclosure'] = 'Advertising by a legal marketing service. No attorney-client relationship is formed.';

        $lead = Lead::create([
            'lead_id' => $leadId,
            'data' => $data,
            'status' => 'New',
            'submitted_at' => now(),
            'pdf_token_hash' => hash('sha256', $pdfToken),
        ]);
        $notificationSent = $this->notifyAdministrator($lead);

        return response()->json([
            'lead_id' => $lead->lead_id,
            'pdf_url' => route('intakes.pdf', ['lead' => $lead->lead_id, 'token' => $pdfToken]),
            'notification_sent' => $notificationSent,
        ], 201);
    }

    public function track(Request $request): JsonResponse
    {
        $input = $request->validate(['lead_id' => ['required', 'regex:/^TCJ-\d{8}-[A-Z0-9]{8,32}$/']]);
        $lead = Lead::query()->where('lead_id', strtoupper($input['lead_id']))->first();
        abort_unless($lead, 404, 'No request was found for that Lead ID. Check the ID and try again.');

        return response()->json([
            'lead_id' => $lead->lead_id,
            'status' => $lead->status,
            'submitted_at' => $lead->submitted_at->format('M j, Y'),
        ]);
    }

    public function pdf(Request $request, string $lead): Response
    {
        $record = Lead::query()->where('lead_id', $lead)->firstOrFail();
        $token = $request->query('token', '');
        $tokenAccess = is_string($token)
            && strlen($token) === 64
            && $record->pdf_token_hash
            && hash_equals($record->pdf_token_hash, hash('sha256', $token));
        abort_unless($tokenAccess, 403, 'This PDF link is invalid or expired.');

        return $this->renderPdf($record);
    }

    public function adminPdf(string $lead): Response
    {
        return $this->renderPdf(Lead::query()->where('lead_id', $lead)->firstOrFail());
    }

    private function renderPdf(Lead $record): Response
    {
        return Pdf::loadView('pdf.intake', ['lead' => $record, 'data' => $record->data])
            ->download('Collision-Justice-'.$record->lead_id.'.pdf')
            ->header('Cache-Control', 'private, no-store, max-age=0')
            ->header('Referrer-Policy', 'no-referrer');
    }

    private function notifyAdministrator(Lead $lead): bool
    {
        $recipient = config('mail.admin_address');
        if (! is_string($recipient) || ! filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            Log::warning('Collision Justice intake notification has no valid company recipient address.');

            return false;
        }

        try {
            Mail::to($recipient)->send(new IntakeSubmissionNotification($lead));

            return true;
        } catch (TransportExceptionInterface) {
            Log::warning('Collision Justice intake notification could not be sent.');

            return false;
        }
    }
}
