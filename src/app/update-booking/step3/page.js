"use client";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";
import Form from "react-bootstrap/Form";
import { Modal, Button } from 'react-bootstrap';
import { MdQrCodeScanner } from "react-icons/md";
import "/public/css/update-booking.css";
import PageHeader from "../../component/page-header";
import BarcodeReader from '@/components/BarcodeReader';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LabPackageBookingDetails } from '@/api_calls/LabPackageBookingDetails';
import { UpdateBookingMemberDetails } from '@/api_calls/UpdateBookingMemberDetails';
import { LabPackages } from '@/api_calls/LabPackages';
import { useSearchParams } from 'next/navigation';
import Snackbar from '@mui/material/Snackbar';
import SignaturePad from '@/components/SignaturePad';

export default function step2() {

  const searchParams = useSearchParams();
  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [signatureData, setSignatureData] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [userPackageBooking, setUserPackageBooking] = useState({});

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const router = useRouter();

     
  const [snack, setSnack] = useState({
    open: false,
      message: ''
  });
  const snackClose = () => {
      setSnack({
          open: false,
          message: ''
      });
  };


  const handleBarcodeScanned = (barcode) => {
    console.log('Barcode scanned:', barcode);
    setScannedBarcode(barcode);   
    setUserPackageBooking(prev => {
      return { ...prev, customer_signature: data}
    }); 
  };


  const handleSignatureChange = (data) => {
    setSignatureData(data);
    setUserPackageBooking(prev => {
      return { ...prev, customer_signature: data}
    });
  };

  const handleSelectChange = (value) => {
    setSelectedOption(value);
    setUserPackageBooking(prev => {
      return { ...prev, booking_status: value}
    });
  };

  const handleTextAreaChange = (value) => {
    // Handle the change in the text area value if needed
    setUserPackageBooking(prev => {
      return { ...prev, reamark: value}
    });
  };

  useEffect(() => {
    const id = searchParams.get('id');
    async function fetchData() {
      try {
        const res = await LabPackageBookingDetails(id);
        setUserPackageBooking(res);          
      } catch (error) {
        console.error(error);
      }

      
    }

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const otpAPI = await UpdateBookingMemberDetails(userPackageBooking.id,userPackageBooking); 
    if(otpAPI.status == 200){
      console.log(otpAPI.status);    
      if(userPackageBooking.booking_status == "onHold"){
        router.push('/hold-booking');
      }else if(userPackageBooking.booking_status == "canceled"){
        router.push('/cancelled-booking');
      }
      else{
        router.push('/confirmed-booking');
      }  
      setSnack({
          open: true,
          message: 'Successfully Update Final Details.'
      });
    }else{
      setSnack({
          open: true,
          message: 'Something Wrong.'
      });
    }
  };

  return (
    <>
      <PageHeader heading="Update Booking" />
      <section className="update-booking section-padding">
        <Container>
          <Row>
            <Col>
            <Form onSubmit={handleSubmit}>
              {/* <div className="text-center mb-3">
                <Link href={"#"}>Take Customer Signature</Link>
              </div> */}
             
              <div className="web-box">
                <div className="box-left">
                  <h2 className="box-heading">Customer Signature</h2>
                  <SignaturePad onSignatureChange={handleSignatureChange} />
                </div>
                <div className="box-right">
                  {signatureData && (
                    <div>
                      <h2>Signature Preview</h2>
                      <img src={signatureData} alt="Customer Signature" />
                    </div>
                  )}
                </div>
                <h2 className="box-heading">Master Barcode Value</h2>
                <div className="box-body">
                  <div className="d-flex align-items-center justify-content-between gap-3">
                    <Form.Control
                      type="text"
                      placeholder=" "
                      className="page-form-control"
                    />
                    <Link href={"#"} className="scan text-center">
                      <MdQrCodeScanner />
                      <br />
                      Scan
                    </Link>                   
                  </div>
                   <div>
                      <h2 className="box-heading">Next.js Barcode Reader</h2>
                      {scannedBarcode ? (
                        <p>Scanned Barcode: {scannedBarcode}</p>
                      ) : (
                        <BarcodeReader onBarcodeScanned={handleBarcodeScanned} />
                      )}
                    </div>
                </div>
              </div>
              <div className="web-box">
                <h2 className="box-heading">Pickup Status*</h2>
                <div className="box-body">
                  <Form.Select 
                  className="page-form-control"
                  onChange={(e) => handleSelectChange(e.target.value)}
                  >
                    <option value="confirmed">Picked</option>
                    <option value="canceled">Not Picked</option>
                    <option value="pending">Pending</option>
                    <option value="onHold">Hold</option>
                  </Form.Select>
                </div>
                {selectedOption === 'canceled' || selectedOption === 'onHold' ? (
                <div className="box-body">
                  <Form.Select 
                  className="page-form-control"
                  value={userPackageBooking.reason}
                  onChange={(e) => setUserPackageBooking({ ...userPackageBooking, reason: e.target.value })}
                  >
                    <option value="outOfStation">Customer out of station</option>
                    <option value="notReal">Booking not confirmed, customer not real</option>
                    <option value="notFasting">Customer not in fasting</option>
                    <option value="phleboLate">Phlebotomist late</option>
                    <option value="holdDueToPayment">Hold due to payment</option>
                    <option value="cancelRequest">Customer wants to cancel</option>
                    <option value="addressNotFound">Address not found</option>
                    <option value="rescheduleRequest">Customer wants to reschedule</option>
                    <option value="notResponding">Customer not responding to call</option>
                    <option value="outOfCity">Out of city</option>
                  </Form.Select>
                  <Form.Group controlId="additionalInfo">
                    <Form.Label>Additional Information:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder="Provide additional information..."
                      onChange={(e) => handleTextAreaChange(e.target.value)}
                    />
                  </Form.Group>
                </div>
              ) : null}
              </div>
              <div className="web-box">
                <h2 className="box-heading">Payment Details</h2>
                <div className="box-body">
                <Form.Select 
                  className="page-form-control"
                  value={userPackageBooking.payment_mode}
                  onChange={(e) => setUserPackageBooking({ ...userPackageBooking, payment_mode: e.target.value })}
                  >
                    <option >select</option>
                    <option value="admin_pay">Admin paid</option>
                    <option value="cash">Cash</option>
                    <option value="link">Link Payment</option>
                  </Form.Select>
                  <Form.Group className="mb-3">
                    <Form.Label>Receivable Amount*</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={userPackageBooking.cash_payment}
                      onChange={(e) => setUserPackageBooking({ ...userPackageBooking, cash_payment: e.target.value })}
                      className="page-form-control"
                    />
                  </Form.Group>
                  <div className="text-center mb-3">
                    <Link href={"#"} onClick={handleShow}>Get Payment Info</Link>
                  </div>
                  <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Payment Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {/* Add your content for the payment information here */}
                      <img src="https://www.lyra.com/in/wp-content/uploads/sites/8/2020/05/OQ-Code-Payments.png" alt="Payment Info" />
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  {/* <Form.Group className="mb-3">
                    <Form.Label>Happy Code*</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      className="page-form-control"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Customer Feedback*</Form.Label>
                    <Form.Select className="page-form-control">
                      <option>Choose Customer Feedback</option>
                    </Form.Select>
                  </Form.Group> */}
                </div>
              </div>

              <Link href={"#"} className="btn web-btn w-100"  onClick={handleSubmit}>
                Update Booking Details
              </Link>
              </Form>
            </Col>
          </Row>
          <Snackbar
              open={snack.open}
              autoHideDuration={6000}
              onClose={snackClose}
              message={snack.message}
          />
        </Container>
      </section>
    </>
  );
}
