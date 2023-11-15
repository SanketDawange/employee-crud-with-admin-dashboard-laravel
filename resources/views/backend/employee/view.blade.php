@extends('backend.layouts.app')
@section('content')
    <div class="wrapper">
        <div class="main-panel">
            <div class="main-content">
                <div class="content-wrapper">
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-content">
                                    <div class="card-header">
                                        <div class="row">
                                            <div class="col-12 col-sm-7">
                                                <h5 class="pt-2">View Employee</h5>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-bordered table-striped">
                                                <tr>
                                                    <td><strong>Name</strong></td>
                                                    <td>{{$employee->name ?? ''}}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Email</strong></td>
                                                    <td>{{$employee->email ?? ''}}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Phone</strong></td>
                                                    <td>{{$employee->phone ?? ''}}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Salary</strong></td>
                                                    <td>{{$employee->salary}}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Hire Date</strong></td>
                                                    <td>{{$employee->hire_date}}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection
