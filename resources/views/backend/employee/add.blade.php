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
                                                <h5 class="pt-2">Add Employee</h5>

                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <form method="POST" action="/employees/save">
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <div class="pull-right" id="error-msg">
                                                        @error('msg')
                                                            <div class="text-danger">{{ $message }}</div>
                                                        @enderror
                                                    </div>
                                                </div>
                                            </div>
                                            @csrf
                                            <div class="form-group">
                                                <label for="name">Name</label>
                                                <input type="text" name="name" id="name" class="form-control"
                                                    placeholder="Enter name" required>
                                            </div>

                                            <div class="form-group">
                                                <label for="email">Email</label>
                                                <input type="email" name="email" id="email" class="form-control"
                                                    placeholder="Enter email" required>
                                            </div>

                                            <div class="form-group">
                                                <label for="phone">Phone</label>
                                                <input type="text" name="phone" id="phone" class="form-control"
                                                    placeholder="Enter phone" required>
                                            </div>

                                            <div class="form-group">
                                                <label for="salary">Salary</label>
                                                <input type="number" name="salary" id="salary" class="form-control"
                                                    placeholder="Enter salary" required>
                                            </div>

                                            <div class="form-group">
                                                <label for="hire_date">Hire Date</label>
                                                <input type="date" name="hire_date" id="hire_date" class="form-control"
                                                    required>
                                            </div>

                                            <button type="submit" class="btn btn-primary">Submit</button>
                                        </form>
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
