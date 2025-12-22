import axios from "axios";

const refreshAccessToken = async () => {

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refreshToken`
  )

  const storeToken = localStorage.getItem('accessToken')
  const localData = JSON.parse(storeToken as string)

  const newLocalData = {
    ...localData,
    state: {
      ...localData.state,
      accessToken: res.data.accessToken
    }
  }

  localStorage.setItem('accessToken', JSON.stringify(newLocalData))

  return res.data.accessToken
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true // มีส่วนนี้เพื่อให้มันส่งcookieข้ามกันได้
});

axiosInstance.interceptors.request.use((config) => {
  const storeToken = localStorage.getItem('accessToken');

  if(storeToken) {
    const { state } = JSON.parse(storeToken);
    const accessToken = state.accessToken;

    if(accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config
})

axiosInstance.interceptors.response.use(async (response) => response, async (error) => {
  try {
    const errorResponse = error.response
    if (errorResponse) {
      if (errorResponse.status === 403
        && !errorResponse.config.__isRetryRequest
      ) {
        const newAccessToken = await refreshAccessToken()

        errorResponse.config.headers.Authorization = 'Bearer ' + newAccessToken
        errorResponse.config.__isRetryRequest = true

        return axios(errorResponse.config)
      }
    } else {
      if (error?.code === 'ERR_CANCELED') {
        return Promise.resolve(error)
      }
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    localStorage.removeItem('accessToken')
  }
  return Promise.reject(error)
})

export {
  axiosInstance as axios
}
