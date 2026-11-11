<?php

namespace Tests\Feature;

use App\Mail\IntakeSubmissionNotification;
use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class IntakeTest extends TestCase
{
    use RefreshDatabase;

    public function test_invalid_public_intake_is_rejected(): void
    {
        $this->postJson('/api/intakes', [])->assertUnprocessable();
        $this->assertDatabaseCount('leads', 0);
    }

    public function test_public_tracking_returns_only_status_metadata(): void
    {
        Lead::create([
            'lead_id' => 'TCJ-20261111-0123456789ABCDEF1234',
            'data' => ['first_name' => 'Private Name', 'email' => 'private@example.test'],
            'status' => 'In Review',
            'submitted_at' => now(),
        ]);

        $this->postJson('/api/track', ['lead_id' => 'TCJ-20261111-0123456789ABCDEF1234'])
            ->assertOk()
            ->assertJsonStructure(['lead_id', 'status', 'submitted_at'])
            ->assertDontSee('Private Name')
            ->assertDontSee('private@example.test');
    }

    public function test_private_lead_data_is_encrypted_in_the_database(): void
    {
        $lead = Lead::create([
            'lead_id' => 'TCJ-20261111-0123456789ABCDEF5678',
            'data' => ['first_name' => 'Private Name'],
            'status' => 'New',
            'submitted_at' => now(),
        ]);

        $this->assertSame(['first_name' => 'Private Name'], $lead->fresh()->data);
        $this->assertStringNotContainsString('Private Name', $lead->getRawOriginal('data'));
    }

    public function test_valid_intake_is_saved_and_returns_a_private_pdf_link(): void
    {
        Mail::fake();
        config(['mail.admin_address' => 'Info@thecollisionjustice.com']);

        $response = $this->postJson('/api/intakes', [
            'first_name' => 'Jordan',
            'last_name' => 'Example',
            'dob' => '1990-04-12',
            'email' => 'jordan@example.test',
            'phone' => '(555) 555-0100',
            'street' => '100 Main Street',
            'city' => 'Springfield',
            'state' => 'IL',
            'zip' => '62701',
            'at_fault' => 'No',
            'has_attorney' => 'No',
            'insured' => 'Yes',
            'injuries' => 'Yes',
            'medical_care' => 'No',
            'timeframe' => 'Within last 30 days',
            'accident_year' => '2025',
            'accident_month' => '4',
            'accident_day' => '12',
            'consent' => '1',
            'company_website' => '',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['lead_id', 'pdf_url', 'notification_sent'])
            ->assertJsonPath('notification_sent', true);
        $this->assertDatabaseCount('leads', 1);
        $this->assertMatchesRegularExpression('/^TCJ-\d{8}-[A-F0-9]{20}$/', $response->json('lead_id'));
        Mail::assertSent(IntakeSubmissionNotification::class, function (IntakeSubmissionNotification $mail): bool {
            $content = $mail->render();

            return $mail->hasTo('Info@thecollisionjustice.com')
                && str_contains($content, '100 Main Street')
                && str_contains($content, 'jordan@example.test')
                && str_contains($content, '1990-04-12')
                && str_contains($content, '2025-04-12')
                && str_contains($content, 'Consent accepted: Yes');
        });
    }

    public function test_intake_receipt_reports_when_company_email_is_not_configured(): void
    {
        config(['mail.admin_address' => '']);

        $response = $this->postJson('/api/intakes', [
            'first_name' => 'Jordan',
            'last_name' => 'Example',
            'dob' => '1990-04-12',
            'email' => 'jordan@example.test',
            'phone' => '(555) 555-0100',
            'street' => '100 Main Street',
            'city' => 'Springfield',
            'state' => 'IL',
            'zip' => '62701',
            'at_fault' => 'No',
            'has_attorney' => 'No',
            'insured' => 'Yes',
            'injuries' => 'Yes',
            'medical_care' => 'No',
            'timeframe' => 'Within last 30 days',
            'accident_year' => '2025',
            'accident_month' => '4',
            'accident_day' => '12',
            'consent' => '1',
            'company_website' => '',
        ]);

        $response->assertCreated()->assertJsonPath('notification_sent', false);
        $this->assertDatabaseCount('leads', 1);
    }

    public function test_admin_lead_api_requires_authentication(): void
    {
        $this->getJson('/api/admin/leads')->assertUnauthorized();
    }
}
