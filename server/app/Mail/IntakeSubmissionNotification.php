<?php

namespace App\Mail;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class IntakeSubmissionNotification extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(public Lead $lead)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Collision Justice intake received',
        );
    }

    public function content(): Content
    {
        return new Content(
            text: 'mail.intake-submission-notification',
            with: ['lead' => $this->lead],
        );
    }
}
