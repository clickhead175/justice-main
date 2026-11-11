<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table): void {
            $table->id();
            $table->string('lead_id', 40)->unique();
            $table->longText('data');
            $table->string('status', 20)->default('New')->index();
            $table->string('pdf_token_hash', 64)->nullable();
            $table->timestampTz('submitted_at')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
