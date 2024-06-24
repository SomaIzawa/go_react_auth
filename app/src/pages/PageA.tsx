import { Link } from "react-router-dom";

export default function PageA() {
  return (
    <>
      <h2>Protected Page A</h2>
      <p>this page is protected by auth</p>
      <Link to="/pageB">PageBへ</Link>
    </>
  )
}
