import axios from 'axios';

export const LabPackageBookingDetails = async (id) => {
    //const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL+"labPackageBooking/"+id;
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL+"lab/labBookingDetails/"+id;

    let data = JSON.stringify({});

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: apiURL,
        data: data
    };

    try {
        const { data } = await axios.request(config);
        return data;
    }
    catch (err) {
        console.log(err);
        return err;
    }
}
