import React from 'react';
import {getCustomerById} from "@/service/customer/customer_service";

export default async function CustomerDetailsPage({ params }) {
    const { customerId } = await params;

    // get customer by id
    const customerData = await getCustomerById(customerId);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <div style={{ border: '2px solid #0070f3', padding: '3rem', borderRadius: '20px', textAlign: 'center' }}>
                <h1>Customer Details</h1>
                <p style={{ fontSize: '1.2rem' }}>
                    Successfully caught ID: <span style={{ fontWeight: 'bold', color: '#0070f3' }}>{customerData?.data.data?.customerId}</span>
                </p>
                <p style={{ fontSize: '1.2rem' }}>
                    Successfully caught Name: <span style={{ fontWeight: 'bold', color: '#0070f3' }}>{customerData?.data.data?.username}</span>
                </p>
                <p style={{ fontSize: '1.2rem' }}>
                    Successfully caught Type: <span style={{ fontWeight: 'bold', color: '#0070f3' }}>{customerData?.data.data?.types}</span>
                </p>
                <p style={{ fontSize: '1.2rem' }}>
                    Successfully caught Email: <span style={{ fontWeight: 'bold', color: '#0070f3' }}>{customerData?.data.data?.email}</span>
                </p>
                <p style={{ fontSize: '1.2rem' }}>
                    Successfully caught Phone: <span style={{ fontWeight: 'bold', color: '#0070f3' }}>{customerData?.data.data?.phone}</span>
                </p>
                <p style={{ fontSize: '1.2rem' }}>
                    Successfully caught Status: <span style={{ fontWeight: 'bold', color: '#0070f3' }}>{customerData?.data.data?.status}</span>
                </p>
                <a href="/customer" style={{ marginTop: '20px', display: 'inline-block', color: '#888' }}>← Back to List</a>
            </div>
        </div>
    );
}