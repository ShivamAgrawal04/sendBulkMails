// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// export default function ProtectedRoute({ children, authentication = true }) {
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth); // Redux se user nikalo

//   // Check user status whenever 'user' or 'navigate' changes
//   useEffect(() => {
//     // SCENARIO 1: Page Protected hai (authentication=true) lekin User Login nahi hai
//     // Action: Login pe bhejo
//     if (authentication && !user) {
//       navigate("/login");
//     }

//     // SCENARIO 2: Page Public hai (authentication=false, jaise Login/Signup) lekin User Logged In hai
//     // Action: Wapas Dashboard bhejo (Login page dikhana ka fayda nahi)
//     else if (!authentication && user) {
//       navigate("/");
//     }
//   }, [user, navigate, authentication]);

//   // Jab tak check chal raha hai, agar tum chaho to Loader dikha sakte ho
//   // Par abhi ke liye seedha content return karte hain
//   return <>{children}</>;
// }

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ authentication = true }) {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    // Agar authentication zaroori hai (Protected Pages) aur User nahi hai -> Login bhejo
    if (authentication && user === null) {
      navigate("/login");
    }
    // Agar authentication nahi chahiye (Login/Register) aur User hai -> Dashboard bhejo
    else if (!authentication && user !== null) {
      navigate("/");
    }

    setLoader(false);
  }, [user, navigate, authentication]);

  // Jab tak check chal raha hai, tab tak kuch mat dikhao (ya spinner dikhao)
  // Taaki flicker na ho
  if (loader) return <h1>Loading...</h1>;

  // Agar sab sahi hai, toh andar ke components (Outlet) dikhao
  return <Outlet />;
}
