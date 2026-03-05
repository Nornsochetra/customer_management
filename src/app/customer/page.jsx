import {getAllCustomers} from "@/service/customer/customer_service";
import CustomerClient from "@/app/customer/component/CustomerClientComponent";


const CustomerPage = async () => {
    // get all customer
    const res = await getAllCustomers();
    const customers = res?.data?.data?.items ?? [];


    return <CustomerClient customers={customers}/>;
};

export default CustomerPage;