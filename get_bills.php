<?php
$bills = json_decode(file_get_contents('bills.json'), true);

$flattenedBills = array();
foreach ($bills as $bill) {
    foreach ($bill['payments'] as $payment) {
        $flattenedBill = array(
            'name' => $bill['name'],
            'caid' => $bill['caid'],
            'opDbm' => $bill['opDbm'],
            'payDate' => $payment['payDate'],
            'nextDueDate' => $payment['nextDueDate'],
            'price' => $payment['price']
        );
        $flattenedBills[] = $flattenedBill;
    }
}
echo json_encode($flattenedBills);
?>