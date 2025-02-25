import React, { useRef } from 'react';

const OrderReceipt = () => {

  const printRef = useRef();
  const handlePrint = () => {
    const content = printRef.current;
    let printWindow = window.open("", "", "width=500,height=600");
    printWindow?.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              width: 80mm;
              margin: 0;
              padding: 0;
            }
            .invoice {
              padding: 10px;
              line-height: 1.2;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
            }
            .header h1 {
              margin: 0;
              font-size: 16px;
              font-weight: bold;
            }
            .header p {
              margin: 2px 0;
              font-size: 12px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .section {
              font-size: 12px;
            }
            .section p {
              margin: 2px 0;
            }
            .table {
              width: 100%;
              margin-left:0.5em;
              border-collapse: collapse;
              font-size: 12px;
            }
            .table th, .table td {
              text-align: left;
              padding: 4px 0;
            }
            .table th {
              font-weight: bold;
            }
            .totals {
              margin-top: 10px;
              font-size: 12px;
              text-align: right;
            }
               .text-center {
              text-align: center;
            }
               .text-right {
              text-align: right;
            }
            .tax-summary {
              margin-top: 10px;
              font-size: 12px;
            }
            .footer {
              text-align: center;
              margin-top: 10px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>${content != undefined ? content : ""}</body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="page">
      <div className="invoice">
        <div className=" text-center header">
          <h1>VW-Mart</h1>
          <p>Shop No-160B, Khariya Pokhra, Near Little Flower</p>
          <p>Chauk, Medical College Road, Basaratpur Gorakhpur</p>
          <p>273004</p>
          <p>GSTIN NO: 09AAHCV3382L1ZQ</p>
          <p>Phone No: +91-7015231330</p>
        </div>

        <div className="divider"></div>

        <div className="section">
          <table className='table'>
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>Arora ji</td>
              <td><strong>Date:</strong></td>
              <td>27/02/2025</td>
            </tr>
            <tr>
              <td><strong>Mobile:</strong></td>
              <td>+91-9690054694</td>
              <td><strong>Time:</strong></td>
              <td>11:47 AM</td>
            </tr>
            </tbody>
          </table>
         
          <table className='table'>
          <tr>
              <td style={{width:'8em'}}><strong>Invoice No.:</strong></td>
              <td>ORD12345678</td>
             
            </tr>
          </table>
        </div>

        <div className="divider"></div>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Qty</th>
              <th>MRP</th>
              <th>Disc</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Soya Chunks 200g</td>
              <td>1</td>
              <td>63.00</td>
              <td>5.70</td>
              <td>57.00</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Mithila Naturals Premium Makhana 200g</td>
              <td>1</td>
              <td>375.00</td>
              <td>93.75</td>
              <td>281.25</td>
            </tr>
          </tbody>
        </table>
        <div className="divider"></div>

        <table className="table">
        <tbody>
          <tr>
            <td colSpan={3} className='text-center'><strong>Total:</strong></td>
            <td colSpan={3} className='text-right'>338.25</td>
          </tr>
          <tr>
            <td colSpan={3} className='text-center'><strong>Round Off:</strong></td>
            <td colSpan={3} className='text-right'> -0.25</td>
          </tr>
          <tr>
            <td colSpan={3} className='text-center'><strong>By UPI:</strong></td>
            <td colSpan={3} className='text-right'> 338.00</td>
          </tr>
        </tbody>
        </table>

       
        <div className="divider"></div>
         <div className="text-center">
           <p className="text-center"><strong>No of Qty:</strong> 2.00</p>
         </div>

        <div className="divider"></div>

        <div className="footer">
          <p><strong>You Saved Rs.: 96.75</strong></p>
          <p>Rupees Three Hundred and Thirty Eight Only</p>
          <p>Prices are inclusive of all taxes - Place of Supply: Uttar Pradesh</p>
        </div>

        <div className="tax-summary">
          <table className="table">
            <thead>
              <tr>
                <th>Taxable Value</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Cess</th>
                <th>IGST</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>267.86</td>
                <td>6.70</td>
                <td>6.70</td>
                <td>0.00</td>
                <td>0.00</td>
              </tr>
              <tr>
                <td>50.89</td>
                <td>3.05</td>
                <td>3.05</td>
                <td>0.00</td>
                <td>0.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="footer">
          <p>Customer Details</p>
        </div>
      </div>

      <button onClick={handlePrint} className="print-button">
        Print Invoice
      </button>

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        .print-button {
          margin-top: 20px;
          padding: 10px 20px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .print-button:hover {
          background: #005bb5;
        }
      `}</style>
    </div>
  );
};
export default OrderReceipt;
