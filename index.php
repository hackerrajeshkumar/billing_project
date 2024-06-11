<?php
session_start();

if (!isset($_SESSION['username'])) {
    header('Location: login.php');
    exit();
}

$username = $_SESSION['username'];
$role = $_SESSION['role'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kumar Cables Service & Fibre Internet</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <a class="navbar-brand" href="#">Kumar Cables Service & Fibre Internet</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <span class="navbar-text">Welcome, <?php echo $username; ?></span>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="notificationDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-bell"></i> <span class="badge badge-danger" id="notificationCount"></span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="notificationDropdown" id="notificationList">
                        <!-- Notification items will be dynamically populated here -->
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="logout.php">Logout</a>
                </li>
            </ul>
        </div>
    </nav>

    <div class="container my-4">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5 class="card-title mb-0">Bills</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <button class="btn btn-primary" id="addBillBtn">Add Bill</button>
                            <button class="btn btn-secondary ml-2" id="billListBtn">Bill List</button>
                            <button class="btn btn-info float-right" id="exportBtn">Export</button>
                        </div>
                        <div id="addBillForm" style="display: none;">
                            <h4>Add Bill</h4>
                            <form>
                                <div class="form-group">
                                    <label for="name">Name:</label>
                                    <input type="text" class="form-control" id="name" required>
                                    <div class="invalid-feedback">Please enter a name.</div>
                                </div>
                                <div class="form-group">
                                    <label for="caid">CAID:</label>
                                    <input type="text" class="form-control" id="caid" required>
                                    <div class="invalid-feedback">Please enter a CAID.</div>
                                </div>
                                <div class="form-group">
                                    <label for="opDbm">OP DBM:</label>
                                    <input type="text" class="form-control" id="opDbm" required>
                                    <div class="invalid-feedback">Please enter an OP DBM.</div>
                                </div>
                                <div class="form-group">
                                    <label for="payDate">Pay Date:</label>
                                    <input type="date" class="form-control" id="payDate" required>
                                    <div class="invalid-feedback">Please select a pay date.</div>
                                </div>
                                <div class="form-group">
                                    <label for="nextDueDate">Next Due Date:</label>
                                    <input type="date" class="form-control" id="nextDueDate" required>
                                    <div class="invalid-feedback">Please select a next due date.</div>
                                </div>
                                <div class="form-group">
                                    <label for="price">Price:</label>
                                    <input type="number" class="form-control" id="price" required>
                                    <div class="invalid-feedback">Please enter a price.</div>
                                </div>
                                <button type="submit" class="btn btn-primary">Save Bill</button>
                            </form>
                        </div>
                        <div id="billList" style="display: none;">
                            <h4>Bill List</h4>
                            <div class="filter-container">
                                <div class="form-group">
                                    <label for="filterBills">Filter by:</label>
                                    <select class="form-control" id="filterBills">
                                        <option value="name">Name</option>
                                        <option value="caid">CAID</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="filterValue">Filter Value:</label>
                                    <input type="text" class="form-control" id="filterValue">
                                </div>
                                <div class="form-group">
                                    <label for="startDate">Start Date:</label>
                                    <input type="date" class="form-control" id="startDate">
                                </div>
                                <div class="form-group">
                                    <label for="endDate">End Date:</label>
                                    <input type="date" class="form-control" id="endDate">
                                </div>
                                <button class="btn btn-primary" id="sortByDueDate">Sort by Due Date</button>
                            </div>
                            <button class="btn btn-secondary" id="generateInvoiceBtn">Generate Invoice</button>
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Name</th>
                                        <th>CAID</th>
                                        <th>OP DBM</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody id="billTableBody">
                            </table>
                        </div>
                        <div id="addPaymentForm" style="display: none;">
                            <h4>Add Payment</h4>
                            <form id="paymentForm">
                                <input type="hidden" id="paymentCaid">
                                <input type="hidden" id="paymentName">
                                <div class="form-group">
                                    <label for="paymentDate">Payment Date:</label>
                                    <input type="date" class="form-control" id="paymentDate" required>
                                    <div class="invalid-feedback">Please select a payment date.</div>
                                </div>
                                <div class="form-group">
                                    <label for="paymentNextDueDate">Next Due Date:</label>
                                    <input type="date" class="form-control" id="paymentNextDueDate" required>
                                    <div class="invalid-feedback">Please select a next due date.</div>
                                </div>
                                <div class="form-group">
                                    <label for="paymentPrice">Price:</label>
                                    <input type="number" class="form-control" id="paymentPrice" required>
                                    <div class="invalid-feedback">Please enter a price.</div>
                                </div>
                                <button type="submit" class="btn btn-primary">Save Payment</button>
                                <button type="button" class="btn btn-secondary" id="cancelPaymentBtn">Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="script.js"></script>
    <script>
        var userRole = '<?php echo $role; ?>';
    </script>
</body>

</html>