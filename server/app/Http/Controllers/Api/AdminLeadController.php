<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminLeadController extends Controller
{
    private const STATUSES = ['New', 'In Review', 'Contacted', 'Qualified', 'Closed'];

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:40'],
            'status' => ['nullable', Rule::in(self::STATUSES)],
        ]);
        $query = Lead::query()->select(['id', 'lead_id', 'status', 'submitted_at'])->latest('submitted_at');
        if (! empty($filters['search'])) {
            $query->where('lead_id', 'like', '%'.addcslashes($filters['search'], '%_\\').'%');
        }
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return response()->json($query->paginate(25)->through(fn (Lead $lead): array => [
            'lead_id' => $lead->lead_id,
            'status' => $lead->status,
            'submitted_at' => $lead->submitted_at->format('M j, Y H:i'),
        ]));
    }

    public function show(string $lead): JsonResponse
    {
        $record = Lead::query()->where('lead_id', $lead)->firstOrFail();

        return response()->json([
            'lead_id' => $record->lead_id,
            'status' => $record->status,
            'submitted_at' => $record->submitted_at->format('M j, Y H:i'),
            'data' => $record->data,
            'pdf_url' => route('admin.leads.pdf', ['lead' => $record->lead_id]),
        ]);
    }

    public function update(Request $request, string $lead): JsonResponse
    {
        $validated = $request->validate(['status' => ['required', Rule::in(self::STATUSES)]]);
        $record = Lead::query()->where('lead_id', $lead)->firstOrFail();
        $record->status = $validated['status'];
        $record->save();

        return response()->json(['status' => $record->status]);
    }

    public function export(): StreamedResponse
    {
        $headers = ['Lead ID', 'First Name', 'Last Name', 'DOB', 'Email', 'Phone', 'Street', 'City', 'State', 'ZIP', 'At Fault', 'Has Attorney', 'Insured', 'Injuries', 'Medical Care', 'Timeframe', 'Accident Date', 'Consent Text', 'Consent Accepted', 'Consent Timestamp', 'Disclosure', 'Submitted', 'Status'];
        $response = Response::streamDownload(function () use ($headers): void {
            $output = fopen('php://output', 'w');
            fputcsv($output, $headers);
            Lead::query()->chunkById(100, function ($leads) use ($output): void {
                foreach ($leads as $lead) {
                    $data = $lead->data;
                    $values = [
                        $lead->lead_id, $data['first_name'] ?? '', $data['last_name'] ?? '',
                        $data['dob'] ?? '', $data['email'] ?? '', $data['phone'] ?? '',
                        $data['street'] ?? '', $data['city'] ?? '', $data['state'] ?? '',
                        $data['zip'] ?? '', $data['at_fault'] ?? '', $data['has_attorney'] ?? '',
                        $data['insured'] ?? '', $data['injuries'] ?? '', $data['medical_care'] ?? '',
                        $data['timeframe'] ?? '', $data['accident_date'] ?? '',
                        $data['consent_text'] ?? '', $data['consent_accepted'] ?? '',
                        $data['consent_timestamp'] ?? '', $data['disclosure'] ?? '',
                        $lead->submitted_at->toDateTimeString(), $lead->status,
                    ];
                    fputcsv($output, array_map($this->safeCsvValue(...), $values));
                }
            });
            fclose($output);
        }, 'collision-justice-leads.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Cache-Control' => 'private, no-store, max-age=0',
            'X-Content-Type-Options' => 'nosniff',
        ]);

        return $response;
    }

    private function safeCsvValue(mixed $value): string
    {
        $value = (string) $value;

        return preg_match('/^[\x00-\x20]*[=+\-@]/', $value) ? "'".$value : $value;
    }
}
