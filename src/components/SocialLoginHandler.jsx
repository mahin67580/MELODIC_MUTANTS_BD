// components/SocialLoginHandler.jsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

export default function SocialLoginHandler() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    const socialLoginSuccess = searchParams.get('socialLoginSuccess');
    
    if (socialLoginSuccess === 'true' && status === 'authenticated') {
      const timer = setTimeout(() => {
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully logged in.',
          icon: 'success',
          confirmButtonText: 'Continue',
          confirmButtonColor: '#000000',
          background: '#ffffff',
          color: '#000000',
          timer: 1500,
          timerProgressBar: true,
          customClass: {
            popup: 'rounded-xl shadow-lg',
          },
        }).then(() => {
          // Remove the query parameter
          const url = new URL(window.location.href);
          url.searchParams.delete('socialLoginSuccess');
          window.history.replaceState({}, '', url.toString());
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [status, searchParams]);

  return null; // This component doesn't render anything
}