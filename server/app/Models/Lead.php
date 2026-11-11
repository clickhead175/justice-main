<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    public $timestamps = false;

    protected $fillable = ['lead_id', 'data', 'status', 'submitted_at', 'pdf_token_hash'];

    protected function casts(): array
    {
        return [
            'data' => 'encrypted:array',
            'submitted_at' => 'immutable_datetime',
        ];
    }
}
