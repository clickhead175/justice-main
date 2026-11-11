<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function csrf(): JsonResponse
    {
        return response()->json(['csrf_token' => csrf_token()]);
    }

    public function me(Request $request): JsonResponse
    {
        abort_unless($request->user()?->is_admin, 401);

        return response()->json(['user' => $request->user()->only(['id', 'name', 'email'])]);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email', 'max:190'],
            'password' => ['required', 'string', 'max:72'],
        ]);
        if (strlen($credentials['password']) > 72) {
            throw ValidationException::withMessages([
                'email' => 'Unable to sign in. Check your credentials and try again.',
            ]);
        }
        $credentials['email'] = strtolower($credentials['email']);
        $key = 'login:'.hash_hmac('sha256', $credentials['email'].'|'.$request->ip(), (string) config('app.key'));
        if (RateLimiter::tooManyAttempts($key, 5)) {
            throw ValidationException::withMessages([
                'email' => 'Too many sign-in attempts. Please wait before trying again.',
            ])->status(429);
        }
        if (! Auth::attempt($credentials, false) || ! $request->user()?->is_admin) {
            Auth::logout();
            RateLimiter::hit($key, 60);
            throw ValidationException::withMessages([
                'email' => 'Unable to sign in. Check your credentials and try again.',
            ])->status(422);
        }

        RateLimiter::clear($key);
        $request->session()->regenerate();

        return response()->json(['user' => $request->user()->only(['id', 'name', 'email'])]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Signed out.']);
    }
}
