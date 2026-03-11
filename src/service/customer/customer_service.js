import {baseUrl} from "@/service/constants";
import headerToken from "@/app/api/headerToken";

// get all
export const getAllCustomers = async ({search = "", types = "", status ="", page = 1, size = 10} ={}) => {
    try {
        const header = await headerToken();
        const res = await fetch(`${baseUrl}/customers?search=${search}&types=${types}&status=${status}&page=${page}&size=${size}`,{
            headers: header,
        });
        const data = await res.json();
        return {
            status: res.status,
            data,
        };
    }catch (error) {
        console.log("Error is: ", error);
    }
}

// get by id
export const getCustomerById = async (customerId) => {
    try {
        const header = await headerToken();
        const res = await fetch(`${baseUrl}/customers/${customerId}`,{
            headers: header,
        });
        const data = await res.json();
        return {
            status: res.status,
            data,
        }
    }catch (error) {
        console.log("Error is: ", error);
    }
}

// create customer
export const createCustomer = async (customerData) => {
    try {
        const header = await headerToken();
        const res = await fetch(`${baseUrl}/customers`,{
            method: 'POST',
            headers: header,
            body: JSON.stringify(customerData),
        });
        const data = await res.json();
        return {
            status: res.status,
            data,
        }
    }catch (error) {
        console.log("Error is: ", error);
    }
}

// update customer
export const updateCustomer = async (customerId, customerData) => {
    try {
        const header = await headerToken();
        const res = await fetch(`${baseUrl}/customers/${customerId}`,{
            method: 'PUT',
            headers: header,
            body: JSON.stringify(customerData),
        });
        const data = await res.json();
        console.log("update full call hz");
        return {
            status: res.status,
            data,
        }
    }catch (error) {
        console.log("Error is: ", error);
    }
}

// update phone and status customer
export const updateCustomerPhoneAndStatus = async (customerId, customerData) => {
    try {
        const header = await headerToken();
        const res = await fetch(`${baseUrl}/customers/${customerId}`,{
            method: 'PATCH',
            headers: header,
            body: JSON.stringify(customerData),
        });
        const data = await res.json();
        console.log("patch call hz");
        return {
            status: res.status,
            data,
        }
    }catch (error) {
        console.log("Error is: ", error);
    }
}

// delete customer
export const deleteCustomer = async (customerId) => {
    try {
        const header = await headerToken();
        const res = await fetch(`${baseUrl}/customers/${customerId}`,{
            method: 'DELETE',
            headers: header,
        })
        const data = await res.json();
        return {
            status: res.status,
            data,
        }
    }catch (error) {
        console.log("Error is: ", error);
    }
}