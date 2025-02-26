import { useAuth } from '@/app/context/AuthContext';
import { format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ToWords } from "to-words";

interface OrderReceiptModalProps {
  show: boolean;
  handleClose: () => void;
  orderDetail:any
}

const OrderReceipt : React.FC<OrderReceiptModalProps> = ({
  show,
  handleClose,
  orderDetail,
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, logout, warehouseId } = useAuth();
  const toWords = new ToWords();
  const [order, setOrder] = useState<any>({
          id: '',
          order_total: 0,
          order_status_id:'',
          payment_status_id:'',
          billing_first_name	:''
        });
        interface OrderItem {
          id: string | number; // Adjust type as necessary
          product_image: string;  
          price_incl_tax: number;
          price_excl_tax: number;
          unit_price_incl_tax:number,
          quantity: number;
          discount_amount_excl_tax: number;
          discount_amount_incl_tax:number;
          product_name:string;
        }
        
        const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
 
     
  
  const loadItems=()=>{
    handleClose();
    if(orderDetail != undefined && orderDetail.id != undefined)
      {
        const fetchOrder = async () => {      
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/Order/GetById/${orderDetail?.id}`, {
              method: 'GET',
              headers: {
                accept: 'application/json',
                Authorization:token ? `Bearer ${token}` : '', // Use your actual auth token
              },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            //console.log("Fetched order:", data);
            setOrder(data);
         } catch (error) {
            console.error("Failed to fetch order:", error);
          } finally {
            setIsLoading(false);
          }
        };
  
  
        const fetchOrderItems = async () => {      
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api-backend/OrderItem/GetOrderItems/${orderDetail?.id}?vendorId=0`, {
              method: 'GET',
              headers: {
                accept: 'application/json',
                Authorization:token ? `Bearer ${token}` : '', // Use your actual auth token
              },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log("Fetched order iitems:", JSON.stringify(data));
             
  
  
            setOrderItems(
              Array.isArray(data)
                ? data.map((orderItems: OrderItem) => ({
                  id: orderItems.id,
                  product_image: orderItems.product_image,
                  price_incl_tax:orderItems.price_incl_tax,
                  price_excl_tax:orderItems.price_excl_tax,
                  unit_price_incl_tax:orderItems.unit_price_incl_tax,
                  quantity:orderItems.quantity,
                  discount_amount_excl_tax:orderItems.discount_amount_excl_tax,
                  discount_amount_incl_tax:orderItems.discount_amount_incl_tax,
                  product_name:orderItems.product_name,
                  }))
                : []
            );
            
            console.log("Fetched order iitems sss:", JSON.stringify(orderItems));
           
            handlePrint();
            
         } catch (error) {
            console.error("Failed to fetch order:", error);
          } finally {
            //setIsLoading(false);
          }
        };
  
        fetchOrder();
        fetchOrderItems();
      } 
    
  }
   
  const handlePrint = () => {
    
    const content = printRef.current;
    let printWindow = window.open("", "", "width=800,height=800");
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
        <body>${content != undefined ? content.innerHTML : ""}</body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <Modal onShow={loadItems} className="" show={show}>
     
    <Modal.Header>
    <div className="col-12">
<h4 className="text-xl font-semibold text-black dark:text-white float-left">
Order Invoice
</h4>
<div  className="text-xl font-semibold text-black float-right">
<button onClick={()=> handleClose()}><i className="fa fa-close"></i></button>
</div>
</div>
        
    </Modal.Header>
        <Modal.Body>
        <div ref={printRef} className="page">
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
          <table className='table' role="presentation">
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{order.billing_first_name}</td>
              <td><strong>Date:</strong></td>
              <td>{`${orderDetail?.created_on_utc ? format(new Date(orderDetail?.created_on_utc), "dd/MM/yyyy") : ""}`}</td>
            </tr>
            <tr>
              <td><strong>Mobile:</strong></td>
              <td>{order.billing_phone_number	}</td>
              <td><strong>Time:</strong></td>
              <td>{`${orderDetail?.created_on_utc ? format(new Date(orderDetail?.created_on_utc), "hh:mm a") : ""}`}</td>
            </tr>
            </tbody>
          </table>
         
          <table className='table' role="presentation">
         <tbody>
         <tr>
              <td style={{width:'8em'}}><strong>Invoice No.:</strong></td>
              <td>{`ORD${orderDetail?.id}`}</td>
             
            </tr>
         </tbody>
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
          {orderItems.map((order,index)=>(
             <tr key={index}>
             <td>{index+1}</td>
             <td>{`${order.product_name}`}</td>
             <td>{`${order.quantity}`}</td>
             <td>{`${order.unit_price_incl_tax}`}</td>
             <td>{`${order.discount_amount_incl_tax}`}</td>
             <td>{`${order.price_incl_tax}`}</td>
           </tr>
          ))}
           
          </tbody>
        </table>
        <div className="divider"></div>

        <table className="table" role="presentation">
        <tbody>
          <tr>
            <td colSpan={3} className='text-center'><strong>Total:</strong></td>
            <td colSpan={3} className='text-right'>{order.order_total}</td>
          </tr>
          <tr>
            <td colSpan={3} className='text-center'><strong>Round Off:</strong></td>
            <td colSpan={3} className='text-right'> 0</td>
          </tr>
          <tr>
            <td colSpan={3} className='text-center'><strong>
              By UPI:
              </strong></td>
            <td colSpan={3} className='text-right'> {order.order_total}</td>
          </tr>
        </tbody>
        </table>

       
        <div className="divider"></div>
         <div className="text-center">
           <p className="text-center"><strong>No of Qty:</strong> {orderItems?.reduce((sum,item) => sum + item.quantity,0)}</p>
         </div>

        <div className="divider"></div>

        <div className="footer">
          <p><strong>You Saved Rs.: 96.75</strong></p>
          
          <p>{toWords.convert(order?.order_total, { currency: true })}</p>
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
        </Modal.Body>
    </Modal>


  );
};
export default OrderReceipt;
