import Request from "./request";

const request = new Request(
  {
    baseurl:
      process.env.NEXT_PUBLIC_API_ADDRESS ||
      "https://test.unicorn.org.cn/cephalon/user-center/v1",
  },
  {
    error: (msg) => console.error(msg),
  },
  (path) => {
    window.location.href = path;
  }
);

export default request;
