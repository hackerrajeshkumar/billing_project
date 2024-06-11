<?php
require_once './dompdf/autoload.inc.php';

use Dompdf\Dompdf;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $payments = json_decode($_POST['payments'], true);

    $html = '<h2>Invoice</h2>';
    $html .= '<table>';
    $html .= '<tr><th>Name</th><th>CAID</th><th>Price</th></tr>';
    foreach ($payments as $payment) {
        $html .= '<tr>';
        $html .= '<td>' . $payment['name'] . '</td>';
        $html .= '<td>' . $payment['caid'] . '</td>';
        $html .= '<td>' . $payment['price'] . '</td>';
        $html .= '</tr>';
    }
    $html .= '</table>';

    $dompdf = new Dompdf();
    $dompdf->loadHtml($html);
    $dompdf->render();
    $pdfOutput = $dompdf->output();

    echo base64_encode($pdfOutput);
}
?>