<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
use App\Http\Controllers\backend\EmployeeController;

Route::group(['middleware' => ['guest']], function () {

    Route::get('/', function() {
        return view('backend.dashboard.dashboard');
    });

    Route::get('employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::get('employees/add', [EmployeeController::class, 'create'])->name('employees.add');
    Route::post('employees/save', [EmployeeController::class, 'store'])->name('employees.store');
    Route::get('employees/view/{id}', [EmployeeController::class, 'show'])->name('employees.view');
    Route::get('employees/edit/{id}', [EmployeeController::class, 'edit'])->name('employees.edit');
    Route::post('employees/update/{id}', [EmployeeController::class, 'update'])->name('employees.update');
    Route::get('employees/delete/{id}', [EmployeeController::class, 'destroy'])->name('employees.delete');

});
