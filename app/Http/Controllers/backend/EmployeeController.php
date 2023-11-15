<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Jobs\CreateEmployee;
use App\Jobs\EditEmployee;
use App\Models\Employee;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {

        try {
            if ($request->ajax()) {
                $data = Employee::all();
                return DataTables::of($data)
                    ->addIndexColumn()
                    ->addColumn('action', function ($employee) {
                        return '<a href="employees/view/' . $employee->id . '" class="btn btn-primary">View</a> ' .
                            '<a href="' . route('employees.edit', $employee->id) . '" class="edit btn btn-success">Edit</a> ' .
                            '<a href="' . route('employees.delete', $employee->id) . '" class="delete btn btn-danger">Delete</a>';
                    })
                    ->rawColumns(['action'])
                    ->make(true);
            }

            return view("backend.employee.index");
        } catch (\Exception $e) {
            dd($e->getMessage());
        }
    }
    public function show($id)
    {
        $employee = Employee::findOrFail($id);

        return view('backend.employee.view', compact('employee'));
    }

    public function create()
    {
        return view('backend.employee.add');
    }

    public function store(Request $request)
    {

        try {

            $employeeData = $request->only(['name', 'email', 'phone', 'salary', 'hire_date']);

            $validationErrors = \Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:employees,email',
                'phone' => 'required|string|max:15',
                'salary' => 'required|numeric',
                'hire_date' => 'required|date',
            ])->errors();

            if (count($validationErrors)) {
                return redirect()->back()->withErrors(array("msg"=>implode("\n", $validationErrors->all())));
            }
            $employee = new Employee;
            $employee->name = $request->name;
            $employee->email = $request->email;
            $employee->phone = $request->phone;
            $employee->salary = $request->salary;
            $employee->hire_date = $request->hire_date;

            $employee->save();

            CreateEmployee::dispatch($employeeData);

            return redirect('employees')->with('success', 'Employee added successfully');
        } catch (\Exception $e) {
            dd($e->getMessage());
        }
    }
    public function edit($id)
    {
        $employee = Employee::findOrFail($id);
        return view('backend.employee.edit', compact('employee'));
    }
    public function update(Request $request, $id)
    {
        try {
            $employee = Employee::findOrFail($id);

            $employeeData = $request->only(['name', 'email', 'phone', 'salary', 'hire_date']);

            $validation = \Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'phone' => 'required|string|max:15',
                'salary' => 'required|numeric',
                'hire_date' => 'required|date',
            ]);

            if (count($validation->errors())) {
                return redirect()->back()->withErrors(array("msg"=>implode("\n", $validation->errors()->all())));
            }

            $employee->update($validation->validated());

            EditEmployee::dispatch($employeeData);

            return redirect()->route('employees.index');
        } catch (\Exception $e) {
            dd($e->getMessage());
        }
    }
    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return redirect()->route('employees.index');
    }

}
