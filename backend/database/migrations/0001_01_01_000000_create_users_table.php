<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Note: Migration not used with MongoDB, schema is flexible
        // This file is kept for reference only
        // Users collection structure:
        // {
        //   _id: ObjectId,
        //   nama: String (required, 3-100 chars),
        //   no_hp: String (required, unique, 10-20 chars),
        //   pin: String (required, hashed, 6 digits),
        //   email: String (optional),
        //   role: String (owner|tenant|admin, default: owner),
        //   created_at: DateTime,
        //   updated_at: DateTime
        // }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // MongoDB: Collections are dropped manually if needed
    }
};
