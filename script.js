$(document).ready(function() {
    $('#addBillBtn').click(function() {
        $('#addBillForm').show();
        $('#billList').hide();
    });

    $('#billListBtn').click(function() {
        $('#addBillForm').hide();
        $('#billList').show();
        loadBills();
    });

    $(document).on('click', '.add-payment', function() {
        var caid = $(this).data('caid');
        var name = $(this).data('name');
        $('#paymentCaid').val(caid);
        $('#paymentName').val(name);
        $('#addPaymentForm').show();
        $('#billList').hide();
    });

    // $(document).on('click', '.toggle-payments', function() {
    //     $(this).closest('tr').next('.payments-row').toggle();
    // });

    $(document).on('click', '.toggle-payments', function() {
        var paymentsRow = $(this).closest('tr').next('.payments-row');
        paymentsRow.toggle();
    
        var isSortingByDueDate = $('#startDate').val() !== '' && $('#endDate').val() !== '';
    
        if (paymentsRow.is(':visible') && isSortingByDueDate) {
            var startDate = new Date($('#startDate').val());
            var endDate = new Date($('#endDate').val());
    
            paymentsRow.find('tbody tr').each(function() {
                var dueDate = new Date($(this).find('td:eq(1)').text());
                var isWithinRange = dueDate >= startDate && dueDate <= endDate;
                $(this).toggle(isWithinRange);
            });
        } else {
            paymentsRow.find('tbody tr').show();
        }
    });


    $('#cancelPaymentBtn').click(function() {
        $('#addPaymentForm').hide();
        $('#billList').show();
    });

    $('#paymentForm').submit(function(event) {
        event.preventDefault();
        var caid = $('#paymentCaid').val();
        var name = $('#paymentName').val();
        var payDate = $('#paymentDate').val();
        var nextDueDate = $('#paymentNextDueDate').val();
        var price = $('#paymentPrice').val();

        if (payDate === '' || nextDueDate === '' || price === '') {
            $('input').each(function() {
                if ($(this).val() === '') {
                    $(this).addClass('is-invalid');
                } else {
                    $(this).removeClass('is-invalid');
                }
            });
            return;
        }

        $.ajax({
            type: 'POST',
            url: 'save_bill.php',
            data: {
                caid: caid,
                name: name,
                payDate: payDate,
                nextDueDate: nextDueDate,
                price: price
            },
            success: function(response) {
                if (response === 'success') {
                    alert('Payment added successfully!');
                    $('#paymentForm')[0].reset();
                    $('#addPaymentForm').hide();
                    $('#billList').show();
                    loadBills();
                } else {
                    alert('Error adding payment. Please try again.');
                }
            }
        });
    });

    $('form').submit(function(event) {
        event.preventDefault();
        var name = $('#name').val();
        var caid = $('#caid').val();
        var opDbm = $('#opDbm').val();
        var payDate = $('#payDate').val();
        var nextDueDate = $('#nextDueDate').val();
        var price = $('#price').val();

        if (name === '' || caid === '' || opDbm === '' || payDate === '' || nextDueDate === '' || price === '') {
            $('input').each(function() {
                if ($(this).val() === '') {
                    $(this).addClass('is-invalid');
                } else {
                    $(this).removeClass('is-invalid');
                }
            });
            return;
        }

        $.ajax({
            type: 'POST',
            url: 'save_bill.php',
            data: {
                name: name,
                caid: caid,
                opDbm: opDbm,
                payDate: payDate,
                nextDueDate: nextDueDate,
                price: price
            },
            success: function(response) {
                if (response === 'success') {
                    alert('Bill added successfully!');
                    $('form')[0].reset();
                    loadBills();
                } else if (response === 'duplicate') {
                    alert('CAID already exists with a different name!');
                } else {
                    alert('Error adding bill. Please try again.');
                }
            }
        });
    });

    $('#payDate').on('change', function() {
        var payDate = new Date($(this).val());
        var nextDueDate = new Date(payDate);
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        $('#nextDueDate').val(nextDueDate.toISOString().slice(0, 10));
    });

    $('#filterBills').on('change', function() {
        var filterBy = $(this).val();
        var filterValue = $('#filterValue').val().toLowerCase();
    
        $('#billTableBody tr').each(function() {
            var mainRow = $(this);
            var paymentsRow = mainRow.next('.payments-row');
    
            var value = mainRow.find('td:eq(' + (filterBy === 'name' ? 1 : 2) + ')').text().toLowerCase();
            var isMatch = value.indexOf(filterValue) !== -1;
    
            mainRow.toggle(isMatch);
            paymentsRow.hide();
        });
    });

    $('#filterValue').on('keyup', function() {
        $('#filterBills').trigger('change');
    });

    $('#sortByDueDate').on('click', function() {
        var startDate = new Date($('#startDate').val());
        var endDate = new Date($('#endDate').val());
    
        $('#billTableBody tr').each(function() {
            var mainRow = $(this);
            var paymentsRow = mainRow.next('.payments-row');
    
            var shouldShowMainRow = false;
    
            paymentsRow.find('tbody tr').each(function() {
                var dueDate = new Date($(this).find('td:eq(1)').text());
                var isWithinRange = dueDate >= startDate && dueDate <= endDate;
    
                $(this).toggle(isWithinRange);
    
                if (isWithinRange) {
                    shouldShowMainRow = true;
                }
            });
    
            mainRow.toggle(shouldShowMainRow);
            paymentsRow.hide();
        });
    });
    
    // $(document).on('click', '.toggle-payments', function() {
    //     var paymentsRow = $(this).closest('tr').next('.payments-row');
    //     paymentsRow.toggle();
    
    //     if (paymentsRow.is(':visible')) {
    //         var startDate = new Date($('#startDate').val());
    //         var endDate = new Date($('#endDate').val());
    
    //         paymentsRow.find('tbody tr').each(function() {
    //             var dueDate = new Date($(this).find('td:eq(1)').text());
    //             var isWithinRange = dueDate >= startDate && dueDate <= endDate;
    
    //             $(this).toggle(isWithinRange);
    //         });
    //     }
    // });

    $(document).on('click', '.edit-bill', function() {
        var row = $(this).closest('tr');
        var payDate = row.find('td:eq(0)').text();
        var nextDueDate = row.find('td:eq(1)').text();
        var price = row.find('td:eq(2)').text();

        row.html(`
            <td>${payDate}</td>
            <td><input type="date" class="form-control" value="${nextDueDate}"></td>
            <td><input type="number" class="form-control" value="${price}"></td>
            <td>
                <button class="btn btn-primary btn-sm save-bill">Save</button>
                <button class="btn btn-secondary btn-sm cancel-edit">Cancel</button>
            </td>
        `);
    });

    $(document).on('click', '.save-bill', function() {
        var row = $(this).closest('tr');
        var caid = row.closest('.payments-row').prev().find('td:eq(2)').text();
        var payDate = row.find('td:eq(0)').text();
        var nextDueDate = row.find('td:eq(1) input').val();
        var price = row.find('td:eq(2) input').val();

        $.ajax({
            type: 'POST',
            url: 'update_bill.php',
            data: {
                caid: caid,
                payDate: payDate,
                nextDueDate: nextDueDate,
                price: price
            },
            success: function(response) {
                loadBills();
            }
        });
    });

    $(document).on('click', '.cancel-edit', function() {
        loadBills();
    });

    $(document).on('click', '.delete-bill', function() {
        var row = $(this).closest('tr');
        var caid = row.closest('.payments-row').prev().find('td:eq(2)').text();
        var payDate = row.find('td:eq(0)').text();

        if (confirm('Are you sure you want to delete this payment?')) {
            $.ajax({
                type: 'POST',
                url: 'delete_bill.php',
                data: {
                    caid: caid,
                    payDate: payDate
                },
                success: function(response) {
                    loadBills();
                }
            });
        }
    });

    $('#exportBtn').click(function() {
        $.ajax({
            type: 'GET',
            url: 'get_bills.php',
            dataType: 'json',
            success: function(bills) {
                var worksheet = XLSX.utils.json_to_sheet(bills);
                var workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Bills');
                XLSX.writeFile(workbook, 'bills.xlsx');

                var doc = new jsPDF();
                doc.autoTable({
                    head: [['S.No', 'Name', 'CAID', 'OP DBM', 'Pay Date', 'Next Due Date', 'Price']],
                    body: bills.map(function(bill, index) {
                        return [
                            index + 1,
                            bill.name,
                            bill.caid,
                            bill.opDbm,
                            bill.payDate,
                            bill.nextDueDate,
                            bill.price
                        ];
                    })
                });
                doc.save('bills.pdf');
            }
        });
    });

    // User role-based access control
    if (userRole === 'customer') {
        $('#addBillBtn').hide();
        $('#exportBtn').hide();
    } else if (userRole === 'billingmanager') {
        $('#addBillBtn').show();
        $('#exportBtn').show();
    }
});

function loadBills() {
    $.ajax({
        type: 'GET',
        url: 'get_bills.php',
        dataType: 'json',
        success: function(bills) {
            var tableBody = '';
            var prevCaid = '';
            $.each(bills, function(index, bill) {
                if (bill.caid !== prevCaid) {
                    tableBody += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${bill.name}</td>
                            <td>${bill.caid}</td>
                            <td>${bill.opDbm}</td>
                            <td>
                                <button class="btn btn-primary btn-sm toggle-payments">View Payments</button>
                                ${userRole !== 'customer' ? `<button class="btn btn-success btn-sm add-payment" data-caid="${bill.caid}" data-name="${bill.name}">Add Payment</button>` : ''}
                            </td>
                        </tr>
                        <tr class="payments-row" style="display: none;">
                            <td colspan="5">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th><input type="checkbox" class="select-all-payments"></th>
                                            <th>Pay Date</th>
                                            <th>Next Due Date</th>
                                            <th>Price</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                    `;
                }
                tableBody += `
                    <tr>
                        <td><input type="checkbox" class="payment-checkbox" data-payment='${JSON.stringify(bill)}'></td>
                        <td>${bill.payDate}</td>
                        <td>${bill.nextDueDate}</td>
                        <td>${bill.price}</td>
                        <td>
                            ${userRole !== 'customer' ? `
                                <button class="btn btn-primary btn-sm edit-bill"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-danger btn-sm delete-bill"><i class="fas fa-trash-alt"></i></button>
                            ` : ''}
                        </td>
                    </tr>
                `;
                if (index === bills.length - 1 || bills[index + 1].caid !== bill.caid) {
                    tableBody += `
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    `;
                }
                prevCaid = bill.caid;
            });
            $('#billTableBody').html(tableBody);
        }
    });
}
// function loadBills() {
//     $.ajax({
//         type: 'GET',
//         url: 'get_bills.php',
//         dataType: 'json',
//         success: function(bills) {
//             var tableBody = '';
//             var prevCaid = '';
//             $.each(bills, function(index, bill) {
//                 if (bill.caid !== prevCaid) {
//                     tableBody += `
//                         <tr>
//                             <td>${index + 1}</td>
//                             <td>${bill.name}</td>
//                             <td>${bill.caid}</td>
//                             <td>${bill.opDbm}</td>
//                             <td>
//                                 <button class="btn btn-primary btn-sm toggle-payments">View Payments</button>
//                                 ${userRole !== 'customer' ? `<button class="btn btn-success btn-sm add-payment" data-caid="${bill.caid}" data-name="${bill.name}">Add Payment</button>` : ''}
//                             </td>
//                         </tr>
//                         <tr class="payments-row" style="display: none;">
//                             <td colspan="5">
//                                 <table class="table table-bordered">
//                                     <thead>
//                                         <tr>
//                                             <th>Pay Date</th>
//                                             <th>Next Due Date</th>
//                                             <th>Price</th>
//                                             <th>Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                     `;
//                 }
//                 tableBody += `
//                     <tr>
//                         <td>${bill.payDate}</td>
//                         <td>${bill.nextDueDate}</td>
//                         <td>${bill.price}</td>
//                         <td>
//                             ${userRole !== 'customer' ? `
//                                 <button class="btn btn-primary btn-sm edit-bill"><i class="fas fa-edit"></i></button>
//                                 <button class="btn btn-danger btn-sm delete-bill"><i class="fas fa-trash-alt"></i></button>
//                             ` : ''}
//                         </td>
//                     </tr>
//                 `;
//                 if (index === bills.length - 1 || bills[index + 1].caid !== bill.caid) {
//                     tableBody += `
//                                     </tbody>
//                                 </table>
//                             </td>
//                         </tr>
//                     `;
//                 }
//                 prevCaid = bill.caid;
//             });
//             $('#billTableBody').html(tableBody);
//         }
//     });
// }
function loadOverduePayments() {
    $.ajax({
        type: 'GET',
        url: 'get_overdue_payments.php',
        dataType: 'json',
        success: function(payments) {
            var notificationList = '';
            $.each(payments, function(index, payment) {
                notificationList += `
                    <a class="dropdown-item" href="#">
                        ${payment.name} - CAID: ${payment.caid} - Price: ${payment.price}
                    </a>
                `;
            });
            $('#notificationList').html(notificationList);
            $('#notificationCount').text(payments.length);
        }
    });
}

$(document).ready(function() {
    // ...
    loadOverduePayments();
    // ...
});

$('#generateInvoiceBtn').on('click', function() {
    var selectedPayments = [];
    $('.payment-checkbox:checked').each(function() {
        var paymentData = $(this).data('payment');
        selectedPayments.push(paymentData);
    });

    if (selectedPayments.length > 0) {
        $.ajax({
            type: 'POST',
            url: 'generate_invoice.php',
            data: { payments: JSON.stringify(selectedPayments) },
            success: function(response) {
                var downloadLink = document.createElement('a');
                downloadLink.href = 'data:application/pdf;base64,' + response;
                downloadLink.download = 'invoice.pdf';
                downloadLink.click();
            }
        });
    } else {
        alert('Please select at least one payment to generate an invoice,');
    }
});

$(document).on('change', '.select-all-payments', function() {
    var paymentsRow = $(this).closest('.payments-row');
    var isChecked = $(this).is(':checked');
    paymentsRow.find('.payment-checkbox').prop('checked', isChecked);
});

// $('#generateInvoiceBtn').on('click', function() {
//     var selectedPayments = [];
//     $('.payment-checkbox:checked').each(function() {
//         var paymentData = $(this).data('payment');
//         selectedPayments.push(paymentData);
//     });

//     if (selectedPayments.length > 0) {
//         $.ajax({
//             type: 'POST',
//             url: 'generate_invoice.php',
//             data: { payments: JSON.stringify(selectedPayments) },
//             success: function(response) {
//                 var downloadLink = document.createElement('a');
//                 downloadLink.href = 'data:application/pdf;base64,' + response;
//                 downloadLink.download = 'invoice.pdf';
//                 downloadLink.click();
//             }
//         });
//     } else {
//         alert('Please select at least one payment to generate an invoice.');
//     }
// });

// function loadBills() {
//     $.ajax({
//         type: 'GET',
//         url: 'get_bills.php',
//         dataType: 'json',
//         success: function(bills) {
//             var tableBody = '';
//             var prevCaid = '';
//             $.each(bills, function(index, bill) {
//                 if (bill.caid !== prevCaid) {
//                     tableBody += `
//                         <tr>
//                             <td>${index + 1}</td>
//                             <td>${bill.name}</td>
//                             <td>${bill.caid}</td>
//                             <td>${bill.opDbm}</td>
//                             <td>
//                                 <button class="btn btn-primary btn-sm toggle-payments">View Payments</button>
//                                 <button class="btn btn-success btn-sm add-payment" data-caid="${bill.caid}" data-name="${bill.name}">Add Payment</button>
//                             </td>
//                         </tr>
//                         <tr class="payments-row" style="display: none;">
//                             <td colspan="5">
//                                 <table class="table table-bordered">
//                                     <thead>
//                                         <tr>
//                                             <th>Pay Date</th>
//                                             <th>Next Due Date</th>
//                                             <th>Price</th>
//                                             <th>Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                     `;
//                 }
//                 tableBody += `
//                     <tr>
//                         <td>${bill.payDate}</td>
//                         <td>${bill.nextDueDate}</td>
//                         <td>${bill.price}</td>
//                         <td>
//                             <button class="btn btn-primary btn-sm edit-bill"><i class="fas fa-edit"></i></button>
//                             <button class="btn btn-danger btn-sm delete-bill"><i class="fas fa-trash-alt"></i></button>
//                         </td>
//                     </tr>
//                 `;
//                 if (index === bills.length - 1 || bills[index + 1].caid !== bill.caid) {
//                     tableBody += `
//                                     </tbody>
//                                 </table>
//                             </td>
//                         </tr>
//                     `;
//                 }
//                 prevCaid = bill.caid;
//             });
//             $('#billTableBody').html(tableBody);
//         }
//     });
// }