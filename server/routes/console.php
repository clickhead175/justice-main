<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('app:status', function (): void {
    $this->info('Collision Justice Intake Review is ready.');
})->purpose('Check that the application console is available');
