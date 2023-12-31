import axios from 'axios';

export const PhelboDetails = async () => {
    var userId = 0;
    if (JSON.parse(localStorage.getItem("app_user_temp")).temp_user_id) {
        var userId = JSON.parse(localStorage.getItem("app_user_temp")).temp_user_id;
    } else {
        var userId = 0;
    }
    //const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL+"labPackageBooking/"+id;
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL+"userDetails/"+userId;

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
