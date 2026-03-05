'use server'

import {
    createCustomer,
    deleteCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer, updateCustomerPhoneAndStatus
} from "@/service/customer/customer_service";

export async function actionGetAllCustomers(params) {
    return await getAllCustomers(params);
}

export async function actionGetCustomerById(customerId) {
    return await getCustomerById(customerId);
}

export async function actionCreateCustomer(customerData) {
    return await createCustomer(customerData);
}

export async function actionUpdateCustomer(customerId, customerData) {
    return await updateCustomer(customerId, customerData);
}

export async function actionDeleteCustomer(customerId) {
    return await deleteCustomer(customerId);
}

export async function actionPatchCustomer(customerId, customerData) {
    return await updateCustomerPhoneAndStatus(customerId, customerData);
}