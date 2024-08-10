import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
export default function setup () {
    axios.interceptors.request.use(function (config) {
        const token = localStorage.getItem("token")
        const AuthUser = localStorage.getItem("useraddress")
        if (token !== '' && AuthUser) {
            config.headers.Authorization = token
            config.headers.useraddress = AuthUser
            config.data.username = localStorage.getItem('emailaddress')
        }
        return config
    }, function (err) {
        return Promise.reject(err)
    })
    axios.interceptors.response.use(function (response) {
        if (parseInt(response.data.status_code) === 401) {
            alert("Your current session has been expired, please login again to continue.")
            window.localStorage.clear()
            window.location.href = "/handbookweb";
            return false
                }/* else if (parseInt(response.data.status_code) === 605) {
                    alert('Getting Exception')
                    return false
                } */else {
            return response
        }
    }, function (err) {
        return Promise.reject(err)
    })
}
