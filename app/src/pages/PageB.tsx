import { Link } from "react-router-dom";

export default function PageB() {
  return (
    <>
      <h2>Protected Page B</h2>
      <p>this page is protected by auth</p>
      <Link to="/pageA">PageAへ</Link>
    </>
  )
}
