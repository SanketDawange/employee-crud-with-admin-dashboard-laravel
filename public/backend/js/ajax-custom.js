/*Copyright (c) 2022, Mypcot Infotech (https://www.mypcot.com/) */
// window.location.reload();
$('#dropdownBasic3').on('click', function () {
    if ($('.dropdownBasic3Content').hasClass('show')) {
        $('.dropdownBasic3Content').removeClass('show');
    } else {
        $('.dropdownBasic3Content').addClass('show');
    }
});
if(localStorage.getItem("dataurl") == window.location.href) {
    data = JSON.parse(localStorage.getItem("indesign_ids"));
    if(data != undefined) {
        for(i=0; i<data.length; i++) {
            $('#'+data[i][0]).val(data[i][1]);
        }
    }
    localStorage.removeItem("indesign_ids");
    localStorage.removeItem("dataurl");
}
if(localStorage.getItem("dataurl") != undefined) {
    localStorage.removeItem("indesign_ids");
    localStorage.removeItem("dataurl");
}
$(document).ready(function () {
    $('.loader-overlay').hide();
    $('.select2').select2();
    $('#listing-filter-toggle').on('click', function () {
        $('#listing-filter-data').toggle();
    });
    $('#clear-form-data').on('click', function () {
        $('#listing-filter-data .form-control').val('');
        $('#listing-filter-data .select2').val('').trigger('change');
    });

    // remove alert messages for empty input fields
    $(document).on('keyup',  '.required,.numeric-validation,.integer-validation,.youtube-url-validation,.positive-integer-validation,.positive-numeric-validation', function (event) {
        $(this).removeClass('border-danger');
    });

    $(document).on('change',  '.required,.numeric-validation,.integer-validation,.youtube-url-validation,.positive-integer-validation,.positive-numeric-validation', function (event) {
        $(this).removeClass('border-danger');
        $(this).closest('.input-file').removeAttr('style');
        $(this).siblings('.select2-container').find('.selection').find('.select2-selection').removeClass('border-danger');
    });
    $(document).on('change',  'input[type="file"]', function (event) {
        $(this).closest('.input-file').removeAttr('style');
    });
    $(document).on('click',  '.file-delete', function (event) {
        $(this).closest('div').find('.input-file').removeAttr('style');
    });

    $(document).on('change', '#approval_status', function () {
        var status = document.getElementById("approval_status").value;
        if (this.value == 'rejected') {
            $("#remark").show();
        }
        else {
            $("#remark").hide();
        }
    });
    setTimeout(function () {
        $('.successAlert').fadeOut('slow');
    }, 1000); // <-- time in milliseconds

    var items = [];
    var html_table_data = "";
    var data_orderable = "";
    var data_searchable = "";
    var bRowStarted = true;
    $('#dataTable thead>tr').each(function () {
        $('th', this).each(function () {
            html_table_data = $(this).attr('id');
            data_orderable = $(this).attr('data-orderable');
            data_searchable = $(this).attr('data-searchable');
            if (html_table_data == 'id') {
                items.push({ data: 'DT_RowIndex', orderable: false, searchable: false });
            }
            else {
                if (data_orderable == 'true') {
                    if (data_searchable == 'true') {
                        items.push({ 'data': html_table_data, orderable: true, searchable: true });
                    } else {
                        items.push({ 'data': html_table_data, orderable: true, searchable: false });
                    }
                }
                else {
                    if (data_searchable == 'true') {
                        items.push({ 'data': html_table_data, orderable: false, searchable: true });
                    } else {
                        items.push({ 'data': html_table_data, orderable: false, searchable: false });
                    }
                }
            }

        });
    });
    coldata = JSON.stringify(items);
    $(function () {
        var dataTable = $('#dataTable').DataTable({
            processing: true,
            serverSide: true,
            scrollX: false,
            autoWidth: true,
            scrollCollapse: true,
            searching: false,
            ajax: {
                url: $('#dataTable').attr('data-url'),
                type: 'POST',
                data: function (d) {
                    d._token = $('meta[name=csrf-token]').attr('content');
                    $("#listing-filter-data .form-control").each(function () {
                        d.search[$(this).attr('id')] = $(this).val();
                    });
                }
            },
            columns: items,
            "drawCallback": function (settings) {
                $('#dataTable_filter').addClass('pull-right');
                $('#dataTable_filter input').attr('name', 'search_field');
                var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
                elems.forEach(function (html) {
                    var switchery = new Switchery(html, { color: '#11c15b', jackColor: '#fff', size: 'small', secondaryColor: '#ff5251' });
                });
            }
        });

        $('#listing-filter-data .form-control').keyup(function () {
            dataTable.draw();
        });

        $('#listing-filter-data select').change(function () {
            dataTable.draw();
        });

        $('#clear-form-data').click(function () {
            dataTable.draw();
        });

    });

    $(document).on('click', '.src_data', function (event) {
        event.preventDefault();
        var page = $(this).attr('href');
        loadViewPage(page);
    });

    $(document).on('click', '.modal_src_data', function (event) {
        event.preventDefault();
        var page = $(this).attr('href');
        var dataSize = $(this).attr('data-size');
        var dataTitle = $(this).attr('data-title');
        loadViewPageInModal(page, dataSize, dataTitle);

    });
});

function loadViewPageInModal(page_url, dataSize, dataTitle) {
    $.ajax({
        url: page_url,
        async: true,
        success: function (data) {
            bootbox.dialog({
                message: data,
                title: dataTitle,
                size: dataSize,
                buttons: false
            });

            if (page_url.includes('map_vendor_form')) {
                $('#vendor').select2();

            }
        }
    });
}

function loadViewPage(page_url) {
    ids = [];
    i = 0;
    $("#listing-filter-data :input").each(function(){
        if($(this).attr('id') != 'clear-form-data') {
            ids[i] = [$(this).attr('id'), $(this).val()];
            i++;
        }
    });
    if(ids.length != 0) {
        localStorage.setItem("dataurl", window.location.href);
        localStorage.setItem("indesign_ids", JSON.stringify(ids));
    }
    $.ajax({
        url: page_url,
        datatype: "application/json",
        contentTypech: "application/json",
        async: true,
        success: function (data) {
            var viewData = data;
            try {
                if (JSON.parse(data)['success']) {
                    $.activeitNoty({
                        type: 'danger',
                        icon: 'fa fa-minus',
                        message: JSON.parse(data)['message'],
                        container: 'floating',
                        timer: 3000
                    });
                }
            } catch (e) {
                $('.content-wrapper').html(data);
                //to make generic function: future implementation
                if (document.getElementById("approval_status")) {
                    var status = document.getElementById("approval_status").value;
                    (status == 'rejected') ? $("#remark").show() : $("#remark").hide();
                    // (status == 'accepted') ? $("#gstin_div").show() : $("#gstin_div").hide();
                    // (status == 'accepted') ? $("#gst_certificate_div").show() : $("#gst_certificate_div").hide();
                }
            }
        }
    });
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

function submitForm(form_id, form_method, errorOverlay = '') {
    $('.loader-overlay').show();
    var form = $('#' + form_id);
    var formdata = false;
    if (window.FormData) {
        formdata = new FormData(form[0]);
    }
    var can = 0;
    $('#' + form_id).find(".required").each(function(){
        var here = $(this);
        if (here.val() === '' || here.val().length === 0) {
            if (here.attr('type') === 'file' && here.closest('.input-file').length !== 0 ) {
                here.addClass('border-danger');
                here.closest('.input-file').css('border', '1px solid red');
            } else {
                here.addClass('border-danger');
                here.siblings('.select2-container').find('.selection .select2-selection').addClass('border-danger');
                // multiple select2 filed required
                here.next('.select2-container').
                    find('.selection .select2-selection--multiple').
                    addClass('border-danger');
            }
            can++;
        }
    });
    $('#' + form_id).find(".integer-validation").each(function() {
        var here = $(this);
        var value = here.val();
        // Regular expression pattern for integers
        var integerPattern = /^-?\d+$/;
        // Check if the parsed value is an integer
        if (value !='' && (isNaN(value) || !integerPattern.test(value))) {
            here.addClass('border-danger');
            can++;
        }
    });
    $('#' + form_id).find(".positive-integer-validation").each(function() {
        var here = $(this);
        var value = here.val();
        // Regular expression pattern for integers
        var integerPattern = /^-?\d+$/;
        // Check if the parsed value is an integer
        if (value !='' && (isNaN(value) || !integerPattern.test(value) || value < 0)) {
            here.addClass('border-danger');
            can++;
        }
    });
    $('#' + form_id).find(".numeric-validation").each(function() {
        var here = $(this);
        var value = here.val();
        if (value !='' && isNaN(value)) {
            here.addClass('border-danger');
            can++;
        }
    });
    $('#' + form_id).find(".positive-numeric-validation").each(function() {
        var here = $(this);
        var value = here.val();
        if (value !='' && (isNaN(value) || value < 0)) {
            here.addClass('border-danger');
            can++;
        }
    });
    $('#' + form_id).find(".youtube-url-validation").each(function() {
        var here = $(this);
        var urlPattern = /^https:\/\/www\.youtube\.com\/watch\?v=/;
        if (here.val() && !urlPattern.test(here.val())) {
            here.addClass('border-danger');
            can++;
        }
    });
    $('#' + form_id).find("input[type='email']").each(function() {
        var here = $(this);
        var emailPattern = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        if (here.val() && !emailPattern.test(here.val())) {
            here.addClass('border-danger');
            can++;
        }
    });
    $('#' + form_id).find('input[type="file"]').each(function(){
        var here = $(this);
        if (here.attr('type') === 'file' && here.closest('.input-file').length !== 0 ) {
            var files = here[0].files;
            if (files.length > 0) {
                var fileSizeInBytes = files[0].size;
                var fileSizeInKB = fileSizeInBytes / 1024;
                if (!isNaN(fileSizeInKB)) {
                    var fileSize =  fileSizeInKB.toFixed(2)
                    if (fileSize > 10240){
                        $.activeitNoty({
                            type: 'danger',
                            icon: 'fa fa-minus',
                            message: "The File must not be greater than 10 mb.",
                            container: 'floating',
                            timer: 3000
                        });
                        here.addClass('border-danger');
                        here.closest('.input-file').css('border', '1px solid red');
                        can++;
                    }
                }
            }

        }
    });
    if(can > 0) {
        $('.loader-overlay').hide();
    }
    if(can == 0) {
        if($('.translation_block').length > 0) {
            translation_block_key = [];
            translation_block_lang = [];
            trans = {};
            var i=0;
            arr = [];
            $('.translation_block').each(function() {
                arr = (($(this).prop('id')).split('_'));
                translation_block_key[i] = ($(this).prop('id')).replace("_"+arr[arr.length-1], "");;
                translation_block_lang[i] = arr[arr.length-1];
                i++;
            });
            keys = translation_block_key.filter(onlyUnique);
            lang = translation_block_lang.filter(onlyUnique);
            translated_data = [];

            for(i=0; i < keys.length; i++) {
                test = {};
                for(j=0; j < lang.length; j++) {
                    test[lang[j]] = nl2br($('#'+keys[i]+'_'+lang[j]).val());
                }
                trans[keys[i]] = test;
                formdata.append(keys[i], JSON.stringify(test));
            }
        }
        formdata.append("key", JSON.stringify(["a","b","c"]));
        $.ajax({
            url: form.attr('action'),
            type: form_method,
            dataType: 'html',
            data: formdata,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                var response = JSON.parse(data);
                $('.loader-overlay').hide();
                if (response['success'] == 0) {
                    if (errorOverlay) {
                        $(form).find('.form-error').html('<span class="text-danger">*' + response['message'] + '</span>');
                        setTimeout(function () {
                            $(form).find('.form-error').empty();
                        }, 3000);
                    } else {
                        $.activeitNoty({
                            type: 'danger',
                            icon: 'fa fa-minus',
                            message: response['message'],
                            container: 'floating',
                            timer: 3000
                        });
                    }
                } else {
                    if (errorOverlay) {
                        $(form).find('.form-error').html('<span class="text-success">' + response['message'] + '</span>');
                    } else {
                        $.activeitNoty({
                            type: 'success',
                            icon: 'fa fa-check',
                            message: response['message'],
                            container: 'floating',
                            timer: 3000
                        });
                    }
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                }
            }
        });
    } else {
        var ih = $('.border-danger').last().closest('.tab-pane').attr('id');
        $('a[href="#'+ih+'"]').click();
    }
}

function nl2br (str, is_xhtml) {

    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br/>' : '<br>';

    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, breakTag);

}

function submitModalForm(form_id, form_method, errorOverlay = '') {
    var form = $('#' + form_id);
    var formdata = false;
    if (window.FormData) {
        formdata = new FormData(form[0]);
    }
    $.ajax({
        url: form.attr('action'),
        type: form_method,
        dataType: 'html',
        data: formdata ? formdata : form.serialize(),
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            var response = JSON.parse(data);
            if (response['success'] == 0) {
                if (errorOverlay) {
                    $(form).find('.form-error').html('<span class="text-danger">*' + response['message'] + '</span>');
                    setTimeout(function () {
                        $(form).find('.form-error').empty();
                    }, 3000);
                } else {
                    $.activeitNoty({
                        type: 'danger',
                        icon: 'fa fa-minus',
                        message: response['message'],
                        container: 'floating',
                        timer: 3000
                    });
                }
            } else {
                if (errorOverlay) {
                    $(form).find('.form-error').html('<span class="text-success">' + response['message'] + '</span>');
                } else {
                    $.activeitNoty({
                        type: 'success',
                        icon: 'fa fa-check',
                        message: response['message'],
                        container: 'floating',
                        timer: 3000
                    });
                }
                setTimeout(function () {
                    location.reload();
                }, 2000);
            }
        }
    });
}

//FOR CkEditor data pass to server - added by sagar - START
function submitEditor(form_id) {
    //var content = theEditor[1].getData();
    var form = $('#' + form_id);
    var formdata = false;
    if (window.FormData) {
        formdata = new FormData(form[0]);
    }
    if($('.translation_block').length > 0) {
        translation_block_key = [];
        translation_block_lang = [];
        trans = {};
        var i=0;
        arr = [];
        $('.translation_block').each(function() {
            arr = (($(this).prop('id')).split('_'));
            translation_block_key[i] = ($(this).prop('id')).replace("_"+arr[arr.length-1], "");;
            translation_block_lang[i] = arr[arr.length-1];
            i++;
        });
        keys = translation_block_key.filter(onlyUnique);
        lang = translation_block_lang.filter(onlyUnique);
        translated_data = [];
        k=0;
        for(i=0; i < keys.length; i++) {
            test = {};
            for(j=0; j < lang.length; j++) {
                test[lang[j]] = theEditor[k].getData();
                k++;
            }
            trans[keys[i]] = test;
            formdata.append(keys[i], JSON.stringify(test));
        }
        console.log(trans);
    }
    $.ajax({
        url: form.attr('action'),
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        url: form.attr('action'),
        type: 'POST',
        dataType: 'html',
        data: formdata ? formdata : form.serialize(),
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            var response = JSON.parse(data);
            if (response['success'] == 0) {
                $.activeitNoty({
                    type: 'danger',
                    icon: 'fa fa-minus',
                    message: response['message'],
                    container: 'floating',
                    timer: 3000
                });
            } else {
                $.activeitNoty({
                    type: 'success',
                    icon: 'fa fa-check',
                    message: response['message'],
                    container: 'floating',
                    timer: 3000
                });
                setTimeout(function () {
                    location.reload();
                }, 2000);
            }
        }
    });
}

//FOR CkEditor data pass to server - added by sagar - END
$(document).on('click', '#addStock', function (event) {
    var trlen = $('#batchTbl tbody tr').length;
    if (trlen == 0) {
        var i = trlen;
    }
    else {
        var i = parseInt($('#batchTbl tbody tr:last-child').attr('id').substr(10)) + 1;
    }
    $('#batchTbl').append('<tr id="batchTblTr' + i + '">' +
        '<td><input class="form-control" id="batch_code' + i + '" name="batch_code[]"></td>' +
        '<td><input class="form-control" id="stock' + i + '" name="stock[]"></td>' +
        '<td><button type="button" class="btn btn-danger btn-sm" id="removeStock' + i + '" onclick="remove_batch_tbl_row(' + i + ')"><i class="fa fa-minus"></i></button></td>' +
        '</tr>');
});
function remove_batch_tbl_row(i) {
    $('#batchTblTr' + i).remove();
}
$(document).on('click', '.delimg', function (event) {
    var ib = $(this).attr('data-id');
    var url = $(this).attr('data-url');
    var main_id = $(this).attr('id');
    bootbox.confirm({
        message: "Are you sure you want to delete this image?",
        buttons: {
            confirm: {
                label: 'Yes, I confirm',
                className: 'btn-primary'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    type: 'post',
                    url: url,
                    data: {
                        'ib': ib,
                        '_token': $('meta[name="csrf-token"]').attr('content'),
                    },
                    success: function (data) {
                        var response = JSON.parse(data);
                        if (response['success'] == 0) {
                            $.activeitNoty({
                                type: 'danger',
                                icon: 'fa fa-minus',
                                message: response['message'],
                                container: 'floating',
                                timer: 3000
                            });
                        } else {
                            $.activeitNoty({
                                type: 'success',
                                icon: 'fa fa-check',
                                message: response['message'],
                                container: 'floating',
                                timer: 1000
                            });
                            $('#' + main_id).closest('.main-del-section').remove();
                        }
                    }
                });
            }
        }
    });
});

$(document).on('click', '.delete-data', function (event) {
    var ib = $(this).attr('data-id');
    var url = $(this).attr('data-url');
    var main_id = $(this).attr('id');
    var optional_alert_value = $(this).attr('data-option');
    var message = "Are you sure you want to delete ?";

    if(optional_alert_value !== undefined){
        message= "Are you sure you want to delete <b>"+optional_alert_value+"</b> ?";
    }
    bootbox.confirm({
        message: message,
        buttons: {
            confirm: {
                label: 'Yes, I confirm',
                className: 'btn-primary'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    type: 'get',
                    url: url,
                    data: {
                        'ib': ib,
                        '_token': $('meta[name="csrf-token"]').attr('content'),
                    },
                    success: function (data) {
                        var response = JSON.parse(data);
                        if (response['success'] == 0) {
                            $.activeitNoty({
                                type: 'danger',
                                icon: 'fa fa-minus',
                                message: response['message'],
                                container: 'floating',
                                timer: 3000
                            });
                        } else {
                            $.activeitNoty({
                                type: 'success',
                                icon: 'fa fa-check',
                                message: response['message'],
                                container: 'floating',
                                timer: 3000
                            });
                            $('#' + main_id).closest('.map_vendor_section').remove();
                            location.reload();
                        }
                    }
                });
            }
        }
    });
});
//for is verify
$(document).on('click', '.verify-data', function (event) {
    var ib = $(this).attr('data-id');
    var url = $(this).attr('data-url');
    var main_id = $(this).attr('id');
    var message = "Are you sure you want to Verify ?";

    bootbox.confirm({
        message: message,
        buttons: {
            confirm: {
                label: 'Yes, I confirm',
                className: 'btn-primary'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    type: 'get',
                    url: url,
                    data: {
                        'ib': ib,
                        '_token': $('meta[name="csrf-token"]').attr('content'),
                    },
                    success: function (data) {
                        var response = JSON.parse(data);
                        if (response['success'] == 0) {
                            $.activeitNoty({
                                type: 'danger',
                                icon: 'fa fa-minus',
                                message: response['message'],
                                container: 'floating',
                                timer: 3000
                            });
                        } else {
                            $.activeitNoty({
                                type: 'success',
                                icon: 'fa fa-check',
                                message: response['message'],
                                container: 'floating',
                                timer: 3000
                            });
                            $('#' + main_id).closest('.map_vendor_section').remove();
                            setTimeout(function () {
                                location.reload();
                            }, 2000);
                        }
                    }
                });
            }
        }
    });
});

/**
 * -- CKEditor Textarea box
*/
let theEditor = [];
function loadCKEditor(id) {
    $('.ck-editor').remove();
    ClassicEditor.create(document.querySelector('#' + id), {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
            ]
        }
    })
        .then(editor => {
            theEditor.push(editor);
        })
        .catch(error => {
            console.log(error);
        });
}

function getDataFromTheEditor() {
    return theEditor.getData();
}

//getProductDetails function with Ajax to get product details drop down of selected product in recommendation engine add|edit
function getProductDetails(product) {
    $.ajax({
        url: "getProductDetailsDropdown",
        type: "POST",
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        data: {
            product_id: product
        },
        success: function (result) {
            response = JSON.parse(result);
            var category_id = response['data']['category']['id'];
            var category_name = response['data']['category']['category_name'];
            var product_form_id = response['data']['product_form']['id'];
            var product_form_name = response['data']['product_form']['product_form_name'];
            var packaging_treatment_id = response['data']['packaging_treatment']['id'];
            var packaging_treatment_name = response['data']['packaging_treatment']['packaging_treatment_name'];

            $("#product_category").html('<option value="' + category_id + '"">' + category_name + '</option>');
            $("#product_form").html('<option value="' + product_form_id + '"">' + product_form_name + '</option>');
            $("#packaging_treatment").html('<option value="' + packaging_treatment_id + '"">' + packaging_treatment_name + '</option>');
        },
    });
}

$(window).keydown(function(event){
    if(event.keyCode == 13 && !event.target.matches("textarea")) {
      event.preventDefault();
      $('#'+event.target.id).closest('form').find('button').click();
    }
});


// For validate number  input
function validateNumberInput(input) {
    const value = parseInt(input.value);
    console.log(isNaN(value));
    // Check if the value is a positive integer and does not contain a decimal point
    if (isNaN(value) || value <= 0 || value !== parseInt(input.value)) {
        // Clear the input value if it's invalid
        input.value = '';
    }
}


function validateNameInput(input) {
    var regex = /^[A-Za-z\s]+$/;
    var inputValue = input.value.trim();

    if (!regex.test(inputValue)) {
        input.value = inputValue.replace(/[^A-Za-z\s]/g, '');
    }
}

function handleFileInputChange(id, type = null) {
    var fileInput = document.getElementById(id);
    var file = fileInput.files[0];

    if (file) {
        var allowedExtensions = [".jpg", ".jpeg", ".png"];
        var fileType = 'JPG or PNG';
        if(type == 'pdf') {
            fileType = 'PDF';
            allowedExtensions = [".pdf"];
        }
        if(type == 'epub') {
            fileType = 'EPUB';
            allowedExtensions = [".epub"];
        }
        var fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            $.activeitNoty({
                type: 'danger',
                icon: 'fa fa-minus',
                message: 'Please select a '+fileType+' file.' ,
                container: 'floating',
                timer: 3000
            });
            fileInput.value = "";
        }
    }
}


function deleteDocuments (mediaId, removeClassName) {
    bootbox.confirm({
        message: 'Are you sure you want to delete this Document?',
        buttons: {
            confirm: {
                label: 'Yes, I confirm',
                className: 'btn-primary',
            },
            cancel: {
                label: 'Cancel',
                className: 'btn-danger',
            },
        },
        callback: function (result) {
            if (result) {

                $.ajax({
                    type: 'POST',
                    url: "delete_documents",
                    data: { id :mediaId ,_token : $('meta[name=csrf-token]').attr('content')},
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    },
                    success: function (result) {
                        if (result) {
                            $(removeClassName + mediaId).remove();
                        }
                    },
                });
            }
        },
    });
}

async function lineChartDashboard() {
    var $primary = "#F77E17";
    var $secondary = "#414091";
    var userCount, Monthdata;

    await $.ajax({
        url: "admin_dashboard_chart",
        type: "POST",
        data: {
            _token: $('meta[name="csrf-token"]').attr("content"),
        },
        dataType: "json",
        success: function (result) {
            Monthdata = result.map(a => a.month);
            userCount = result.map(a => a.count);
        },
        failure: function () {
            console.log("Inside failure");
        },
    });

    var themeColors = [$primary, $secondary];
    var lineChartOptions = {
        chart: {
            height: 350,
            width: "98%",
            type: "bar",
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        colors: themeColors,
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "straight",
        },
        series: [
            {
                name: "User Added",
                data: userCount,
            },
        ],
        grid: {
            row: {
                colors: ["#F5F5F5", "transparent"],
                opacity: 0.5,
            },
        },
        xaxis: {
            categories: Monthdata,
            title: {
                text: 'Users Registered in Last 6 Months',
                style: {
                    fontSize: '15px',
                }
            },
        },
        yaxis: {
            tickAmount: 4,
            title: {
                text: 'Number of Users',
                style: {
                    fontSize: '15px',
                }
            },
        },
    };

    var lineChart = new ApexCharts(
        document.querySelector("#line-chart2"),
        lineChartOptions
    );
    lineChart.render();
}

function toggleEditView() {
    var updateButtonDiv = document.getElementById('updateButtonDiv');
    var editProfileBtn = document.getElementById('editProfileBtn');
    var attr = $('#updateButtonDiv').attr('disabled');
    if (typeof attr !== 'undefined' && attr !== false) {
        $('#updateButtonDiv').removeAttr('disabled');
        editProfileBtn.innerHTML = '<i class="fa fa-edit"></i> Edit Profile';
    } else {
        $('#updateButtonDiv').attr('disabled', 'disabled');
        editProfileBtn.innerHTML = '<i class="fa fa-eye"></i> View Profile';
    }
}
