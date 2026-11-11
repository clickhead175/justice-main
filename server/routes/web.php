<?php

use App\Http\Controllers\Api\AdminLeadController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\IntakeController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function (): void {
    Route::get('/csrf', [AuthController::class, 'csrf']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');

    Route::post('/intakes', [IntakeController::class, 'store'])->middleware('throttle:10,15');
    Route::post('/track', [IntakeController::class, 'track'])->middleware('throttle:30,1');
    Route::get('/intakes/{lead}/pdf', [IntakeController::class, 'pdf'])
        ->where('lead', 'TCJ-[0-9]{8}-[A-Z0-9]{8,32}')
        ->name('intakes.pdf');
    Route::get('/admin/leads/{lead}/pdf', [IntakeController::class, 'adminPdf'])
        ->middleware(['auth', 'admin'])
        ->where('lead', 'TCJ-[0-9]{8}-[A-Z0-9]{8,32}')
        ->name('admin.leads.pdf');

    Route::middleware(['auth', 'admin'])->prefix('admin')->group(function (): void {
        Route::get('/leads', [AdminLeadController::class, 'index']);
        Route::get('/leads/{lead}', [AdminLeadController::class, 'show'])->where('lead', 'TCJ-[0-9]{8}-[A-Z0-9]{8,32}');
        Route::patch('/leads/{lead}', [AdminLeadController::class, 'update'])->where('lead', 'TCJ-[0-9]{8}-[A-Z0-9]{8,32}');
        Route::get('/export', [AdminLeadController::class, 'export']);
    });
});
